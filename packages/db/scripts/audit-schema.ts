import postgres from "postgres";
import { getTableConfig } from "drizzle-orm/pg-core";
import type { PgTable } from "drizzle-orm/pg-core";
import * as schema from "../src/schema.js";

type ActualColumn = {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: "YES" | "NO";
  column_default: string | null;
};
type NamedObject = { table_name: string; object_name: string };
type ActualConstraint = NamedObject & {
  constraint_type: "f" | "u" | "p";
  columns: string[];
  foreign_table: string | null;
  foreign_columns: string[] | null;
};
type ActualEnum = { enum_name: string; enum_value: string };

type Issue = {
  kind: "table" | "column" | "type" | "nullable" | "default" | "index" | "constraint" | "enum";
  object: string;
  expected?: unknown;
  actual?: unknown;
};

function normalizeType(type: string): string {
  const normalized = type.toLowerCase().replace(/\s+/g, " ").trim();
  if (normalized === "timestamp") return "timestamp without time zone";
  return normalized.replace(/^varchar(?=\(|$)/, "character varying");
}

function drizzleTables() {
  const byName = new Map<string, ReturnType<typeof getTableConfig>>();
  for (const candidate of Object.values(schema)) {
    try {
      const config = getTableConfig(candidate as PgTable);
      if (config.name.startsWith("es_")) byName.set(config.name, config);
    } catch {
      // Enums, relations and helper exports are not tables.
    }
  }
  return byName;
}

function drizzleEnums() {
  const enums = new Map<string, string[]>();
  for (const candidate of Object.values(schema)) {
    if (typeof candidate !== "function") continue;
    const value = candidate as typeof candidate & { enumName?: string; enumValues?: string[] };
    if (value.enumName?.startsWith("es_") && Array.isArray(value.enumValues)) {
      enums.set(value.enumName, [...value.enumValues]);
    }
  }
  return enums;
}

export async function auditSchema(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) throw new Error("DATABASE_URL não configurada para a auditoria somente leitura.");
  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  try {
    const [columns, indexes, constraints, enumRows] = await Promise.all([
      sql<ActualColumn[]>`
        select c.table_name, c.column_name, format_type(a.atttypid, a.atttypmod) as data_type,
               c.is_nullable, c.column_default
          from information_schema.columns c
          join pg_catalog.pg_class cl on cl.relname = c.table_name
          join pg_catalog.pg_namespace ns on ns.oid = cl.relnamespace and ns.nspname = c.table_schema
          join pg_catalog.pg_attribute a on a.attrelid = cl.oid and a.attname = c.column_name
         where c.table_schema = 'public' and c.table_name like 'es\_%' escape '\'
      `,
      sql<NamedObject[]>`
        select tablename as table_name, indexname as object_name
          from pg_indexes
         where schemaname = 'public' and tablename like 'es\_%' escape '\'
      `,
      sql<ActualConstraint[]>`
        select rel.relname as table_name, con.conname as object_name, con.contype as constraint_type,
               array(
                 select att.attname
                   from unnest(con.conkey) with ordinality key(attnum, position)
                   join pg_attribute att on att.attrelid = rel.oid and att.attnum = key.attnum
                  order by key.position
               ) as columns,
               foreign_rel.relname as foreign_table,
               case when con.confkey is null then null else array(
                 select att.attname
                   from unnest(con.confkey) with ordinality key(attnum, position)
                   join pg_attribute att on att.attrelid = foreign_rel.oid and att.attnum = key.attnum
                  order by key.position
               ) end as foreign_columns
          from pg_constraint con
          join pg_class rel on rel.oid = con.conrelid
          join pg_namespace ns on ns.oid = rel.relnamespace
          left join pg_class foreign_rel on foreign_rel.oid = con.confrelid
         where ns.nspname = 'public' and rel.relname like 'es\_%' escape '\'
           and con.contype in ('f', 'u', 'p')
      `,
      sql<ActualEnum[]>`
        select typ.typname as enum_name, enum.enumlabel as enum_value
          from pg_type typ
          join pg_enum enum on enum.enumtypid = typ.oid
          join pg_namespace ns on ns.oid = typ.typnamespace
         where ns.nspname = 'public' and typ.typname like 'es\_%' escape '\'
         order by typ.typname, enum.enumsortorder
      `
    ]);

    const expectedTables = drizzleTables();
    const actualTables = new Set(columns.map((column) => column.table_name));
    const actualColumns = new Map(columns.map((column) => [`${column.table_name}.${column.column_name}`, column]));
    const actualIndexes = new Set(indexes.map((index) => `${index.table_name}.${index.object_name}`));
    const actualConstraints = new Set(constraints.map((constraint) => {
      const columns = constraint.columns.join(",");
      if (constraint.constraint_type === "f") {
        return `${constraint.table_name}.f(${columns})->${constraint.foreign_table}(${(constraint.foreign_columns ?? []).join(",")})`;
      }
      return `${constraint.table_name}.${constraint.constraint_type}(${columns})`;
    }));
    const issues: Issue[] = [];

    for (const tableName of expectedTables.keys()) {
      if (!actualTables.has(tableName)) issues.push({ kind: "table", object: tableName, expected: "present", actual: "missing" });
    }
    for (const tableName of actualTables) {
      if (!expectedTables.has(tableName)) issues.push({ kind: "table", object: tableName, expected: "not declared", actual: "present" });
    }

    for (const [tableName, table] of expectedTables) {
      for (const column of table.columns) {
        const object = `${tableName}.${column.name}`;
        const actual = actualColumns.get(object);
        if (!actual) {
          issues.push({ kind: "column", object, expected: "present", actual: "missing" });
          continue;
        }
        const expectedType = normalizeType(column.getSQLType());
        const actualType = normalizeType(actual.data_type);
        if (expectedType !== actualType) issues.push({ kind: "type", object, expected: expectedType, actual: actualType });
        const expectedNullable = !column.notNull;
        const actualNullable = actual.is_nullable === "YES";
        if (expectedNullable !== actualNullable) issues.push({ kind: "nullable", object, expected: expectedNullable, actual: actualNullable });
        const expectedDefault = column.hasDefault;
        const actualDefault = actual.column_default !== null;
        if (expectedDefault !== actualDefault) issues.push({ kind: "default", object, expected: expectedDefault, actual: actualDefault });
      }
      for (const index of table.indexes) {
        if (index.config.name && !actualIndexes.has(`${tableName}.${index.config.name}`)) {
          issues.push({ kind: "index", object: `${tableName}.${index.config.name}`, expected: "present", actual: "missing" });
        }
      }
      for (const foreignKey of table.foreignKeys) {
        const reference = foreignKey.reference();
        const foreignTable = getTableConfig(reference.foreignTable).name;
        const signature = `${tableName}.f(${reference.columns.map((column) => column.name).join(",")})->${foreignTable}(${reference.foreignColumns.map((column) => column.name).join(",")})`;
        if (!actualConstraints.has(signature)) {
          issues.push({ kind: "constraint", object: signature, expected: "present", actual: "missing" });
        }
      }
      for (const unique of table.uniqueConstraints) {
        const signature = `${tableName}.u(${unique.columns.map((column) => column.name).join(",")})`;
        if (!actualConstraints.has(signature)) {
          issues.push({ kind: "constraint", object: signature, expected: "present", actual: "missing" });
        }
      }
    }

    const expectedEnums = drizzleEnums();
    const actualEnums = new Map<string, string[]>();
    for (const row of enumRows) actualEnums.set(row.enum_name, [...(actualEnums.get(row.enum_name) ?? []), row.enum_value]);
    for (const [name, values] of expectedEnums) {
      const actual = actualEnums.get(name);
      if (!actual || JSON.stringify(values) !== JSON.stringify(actual)) {
        issues.push({ kind: "enum", object: name, expected: values, actual: actual ?? "missing" });
      }
    }

    return {
      ok: issues.length === 0,
      checkedAt: new Date().toISOString(),
      summary: {
        expectedTables: expectedTables.size,
        actualTables: actualTables.size,
        actualColumns: columns.length,
        actualIndexes: indexes.length,
        actualConstraints: constraints.length,
        expectedEnums: expectedEnums.size
      },
      issues
    };
  } finally {
    await sql.end();
  }
}

if (process.argv[1]?.includes("audit-schema")) {
  auditSchema()
    .then((result) => {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      if (!result.ok) process.exitCode = 1;
    })
    .catch((error) => {
      process.stderr.write(`${error instanceof Error ? error.message : "Falha na auditoria do schema."}\n`);
      process.exitCode = 1;
    });
}
