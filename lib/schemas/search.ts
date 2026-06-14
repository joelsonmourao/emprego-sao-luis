import { LocationType } from "@prisma/client";
import { z } from "zod";

function emptyStringToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export const jobSearchParamsSchema = z.object({
  q: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  estado: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  cidade: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  categoria: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  empresa: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  order: z.enum(["relevance", "date"]).default("relevance"),
  page: z.coerce.number().int().min(1).default(1),
  modalidade: z.preprocess((value) => {
    if (typeof value !== "string") return undefined;
    const v = value.trim();
    return Object.values(LocationType).includes(v as LocationType) ? (v as LocationType) : undefined;
  }, z.nativeEnum(LocationType).optional())
});

export type JobSearchParams = z.infer<typeof jobSearchParamsSchema>;
