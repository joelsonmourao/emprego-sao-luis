#!/usr/bin/env node

import { readFileSync } from "node:fs";

const EXPECTED_IDENTITY = Object.freeze({
  application_uuid: "s5dowl45t5bgfduiy1b5f3d8",
  domain: "empregossaoluis.com.br",
  repository: "joelsonmourao/emprego-sao-luis",
  branch: "codex/admin-negocio-completo",
});

const FORBIDDEN_APP_UUID = "ir0ej2xf4a6c2pptnqzcv0ob";

function get(value, path) {
  return path.split(".").reduce((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return current[key];
  }, value);
}

function isDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function findSecretMaterial(value, path = "$", errors = []) {
  if (Array.isArray(value)) {
    value.forEach((child, index) =>
      findSecretMaterial(child, `${path}[${index}]`, errors),
    );
    return errors;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const childPath = `${path}.${key}`;
      if (
        /password|passwd|secret|token|database_url|dsn|connection_string|access_key/i.test(
          key,
        )
      ) {
        errors.push(`${childPath}: chave sensível proibida`);
      }
      findSecretMaterial(child, childPath, errors);
    }
    return errors;
  }
  if (
    typeof value === "string" &&
    (/postgres(?:ql)?:\/\//i.test(value) ||
      value.includes("-----BEGIN PRIVATE KEY-----") ||
      /gh[pousr]_[A-Za-z0-9_]{20,}/.test(value) ||
      /AKIA[0-9A-Z]{16}/.test(value))
  ) {
    errors.push(`${path}: possível segredo proibido`);
  }
  return errors;
}

export function validateRecoveryEvidence(data) {
  const errors = findSecretMaterial(data);
  const require = (condition, message) => {
    if (!condition) errors.push(message);
  };

  require(get(data, "schema_version") === 1, "schema_version deve ser 1");
  for (const [key, expected] of Object.entries(EXPECTED_IDENTITY)) {
    require(
      get(data, `identity.${key}`) === expected,
      `identity.${key} inválido`,
    );
  }
  require(
    JSON.stringify(data).includes(FORBIDDEN_APP_UUID) === false,
    "manifesto não pode referenciar o UUID do webhook",
  );

  require(
    /^esl-\d{8}T\d{6}Z$/.test(get(data, "backup.backup_id") ?? ""),
    "backup.backup_id inválido",
  );
  require(isDate(get(data, "backup.captured_at")), "backup.captured_at inválido");
  require(
    typeof get(data, "backup.operator") === "string" &&
      get(data, "backup.operator").trim() !== "",
    "backup.operator obrigatório",
  );
  require(
    typeof get(data, "backup.authorization_ref") === "string" &&
      get(data, "backup.authorization_ref").trim() !== "",
    "backup.authorization_ref obrigatório",
  );
  require(
    /^[a-f0-9]{40}$/.test(get(data, "backup.deployed_commit") ?? ""),
    "backup.deployed_commit deve ser SHA completo",
  );
  require(
    /^\d+\.\d+(?:\.\d+)?$/.test(get(data, "backup.postgres_version") ?? ""),
    "backup.postgres_version inválido",
  );

  for (const artifact of ["database", "storage"]) {
    require(
      /^[a-f0-9]{64}$/.test(
        get(data, `artifacts.${artifact}_sha256`) ?? "",
      ),
      `artifacts.${artifact}_sha256 inválido`,
    );
    require(
      Number.isInteger(get(data, `artifacts.${artifact}_bytes`)) &&
        get(data, `artifacts.${artifact}_bytes`) > 0,
      `artifacts.${artifact}_bytes deve ser inteiro positivo`,
    );
  }
  require(
    ["local", "s3", "r2"].includes(get(data, "artifacts.storage_provider")),
    "artifacts.storage_provider inválido",
  );
  require(
    typeof get(data, "artifacts.independent_destination") === "string" &&
      get(data, "artifacts.independent_destination").trim() !== "",
    "artifacts.independent_destination obrigatório",
  );
  require(
    get(data, "artifacts.destination_checksums_verified") === true,
    "checksums devem ser recalculados no destino independente",
  );

  for (const path of [
    "write_pause.web_paused",
    "write_pause.worker_paused",
    "restore.isolated",
    "restore.database_restored",
    "restore.storage_restored",
    "restore.external_integrations_disabled",
    "restore.health_passed",
    "restore.readiness_passed",
    "restore.media_sample_passed",
    "rollback.code_tested",
    "rollback.database_tested",
    "rollback.storage_tested",
    "rollback.passed",
    "scope.out_of_scope_apps_untouched",
    "scope.webhook_untouched",
  ]) {
    require(get(data, path) === true, `${path} deve ser true`);
  }

  require(
    isDate(get(data, "write_pause.started_at")),
    "write_pause.started_at inválido",
  );
  require(
    isDate(get(data, "write_pause.finished_at")),
    "write_pause.finished_at inválido",
  );
  if (
    isDate(get(data, "write_pause.started_at")) &&
    isDate(get(data, "write_pause.finished_at"))
  ) {
    require(
      Date.parse(get(data, "write_pause.finished_at")) >=
        Date.parse(get(data, "write_pause.started_at")),
      "write_pause tem ordem inválida",
    );
  }

  require(isDate(get(data, "restore.completed_at")), "restore.completed_at inválido");
  require(
    isDate(get(data, "rollback.completed_at")),
    "rollback.completed_at inválido",
  );
  require(
    /^[a-f0-9]{40}$/.test(get(data, "rollback.previous_commit") ?? ""),
    "rollback.previous_commit deve ser SHA completo",
  );

  require(
    isDate(get(data, "retention.expires_at")),
    "retention.expires_at inválido",
  );
  if (
    isDate(get(data, "backup.captured_at")) &&
    isDate(get(data, "retention.expires_at"))
  ) {
    require(
      Date.parse(get(data, "retention.expires_at")) >
        Date.parse(get(data, "backup.captured_at")),
      "retention.expires_at deve ser posterior ao backup",
    );
  }

  require(
    ["blocked", "open"].includes(get(data, "gate.decision")),
    "gate.decision deve ser blocked ou open",
  );
  if (get(data, "gate.decision") === "open") {
    require(
      typeof get(data, "gate.approved_by") === "string" &&
        get(data, "gate.approved_by").trim() !== "",
      "gate.approved_by obrigatório para open",
    );
    require(
      isDate(get(data, "gate.approved_at")),
      "gate.approved_at obrigatório para open",
    );
  }

  return [...new Set(errors)];
}

function validFixture() {
  return {
    schema_version: 1,
    identity: { ...EXPECTED_IDENTITY },
    backup: {
      backup_id: "esl-20261011T190000Z",
      captured_at: "2026-10-11T19:00:00Z",
      operator: "operador-autorizado",
      authorization_ref: "issue-2",
      deployed_commit: "a".repeat(40),
      postgres_version: "16.4",
    },
    artifacts: {
      database_sha256: "b".repeat(64),
      database_bytes: 4096,
      storage_sha256: "c".repeat(64),
      storage_bytes: 8192,
      storage_provider: "local",
      independent_destination: "cofre:empregos-sao-luis/esl-20261011T190000Z",
      destination_checksums_verified: true,
    },
    write_pause: {
      web_paused: true,
      worker_paused: true,
      started_at: "2026-10-11T19:00:00Z",
      finished_at: "2026-10-11T19:03:00Z",
    },
    restore: {
      isolated: true,
      completed_at: "2026-10-11T19:15:00Z",
      database_restored: true,
      storage_restored: true,
      external_integrations_disabled: true,
      health_passed: true,
      readiness_passed: true,
      media_sample_passed: true,
    },
    rollback: {
      completed_at: "2026-10-11T19:30:00Z",
      previous_commit: "d".repeat(40),
      code_tested: true,
      database_tested: true,
      storage_tested: true,
      passed: true,
    },
    scope: {
      out_of_scope_apps_untouched: true,
      webhook_untouched: true,
    },
    retention: { expires_at: "2026-11-10T19:00:00Z" },
    gate: { decision: "blocked" },
  };
}

function runSelfTest() {
  const validErrors = validateRecoveryEvidence(validFixture());
  const invalid = validFixture();
  invalid.identity.application_uuid = FORBIDDEN_APP_UUID;
  invalid.database_url = "postgresql://user:password@example.invalid/db";
  const invalidErrors = validateRecoveryEvidence(invalid);
  if (validErrors.length > 0 || invalidErrors.length < 3) {
    console.error("Self-test failed", { validErrors, invalidErrors });
    process.exit(1);
  }
  console.log("Recovery evidence validator: self-test passed");
}

if (process.argv[2] === "--self-test") {
  runSelfTest();
} else {
  const path = process.argv[2];
  if (!path) {
    console.error(
      "Uso: node scripts/validate-recovery-evidence.mjs <manifest.json>",
    );
    process.exit(2);
  }
  let decoded;
  try {
    decoded = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    console.error("Manifesto JSON inválido");
    process.exit(2);
  }
  const errors = validateRecoveryEvidence(decoded);
  if (errors.length > 0) {
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }
  console.log("Recovery evidence: VALID");
}
