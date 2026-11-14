import { z } from "zod";
import { importModeSchema } from "./import-row.js";

export const importExecuteModeSchema = z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISH_BY_DATE"]);
export type ImportExecuteMode = z.infer<typeof importExecuteModeSchema>;

export type ImportPublicationPlan = {
  publicationStatus: "DRAFT" | "PENDING_REVIEW" | "SCHEDULED" | "PUBLISHED";
  publishedAt: Date | null;
  scheduledAt: Date | null;
  verificationStatus: "NEEDS_REVIEW" | "SOURCE_CONFIRMED";
  warning?: string;
};

/** Decide publicação a partir do modo de importação e de dataPublicacao. */
export function resolveImportPublication(input: {
  mode: z.infer<typeof importModeSchema> | ImportExecuteMode;
  publishedAt?: Date | null;
  expiresAt?: Date | null;
  now?: Date;
}): ImportPublicationPlan {
  const now = input.now ?? new Date();

  if (input.mode === "DRY_RUN") {
    return {
      publicationStatus: "PENDING_REVIEW",
      publishedAt: null,
      scheduledAt: null,
      verificationStatus: "NEEDS_REVIEW"
    };
  }

  if (input.mode === "DRAFT" || input.mode === "PENDING_REVIEW") {
    return {
      publicationStatus: input.mode,
      publishedAt: null,
      scheduledAt: null,
      verificationStatus: "NEEDS_REVIEW"
    };
  }

  // PUBLISH_BY_DATE
  if (!input.publishedAt) {
    return {
      publicationStatus: "DRAFT",
      publishedAt: null,
      scheduledAt: null,
      verificationStatus: "NEEDS_REVIEW",
      warning: "dataPublicacao vazia: importada como rascunho."
    };
  }

  if (!input.expiresAt || input.expiresAt <= now) {
    return {
      publicationStatus: "PENDING_REVIEW",
      publishedAt: null,
      scheduledAt: null,
      verificationStatus: "NEEDS_REVIEW",
      warning: "dataEncerramento ausente ou já vencida: não foi possível publicar/agendar automaticamente."
    };
  }

  if (input.publishedAt.getTime() <= now.getTime()) {
    return {
      publicationStatus: "PUBLISHED",
      publishedAt: input.publishedAt,
      scheduledAt: null,
      verificationStatus: "SOURCE_CONFIRMED"
    };
  }

  return {
    publicationStatus: "SCHEDULED",
    publishedAt: null,
    scheduledAt: input.publishedAt,
    verificationStatus: "SOURCE_CONFIRMED"
  };
}

/** Mapeamento mínimo do modelo SLZ para pular revisão manual. */
export function isOfficialImportMappingReady(mapping: Record<string, string | undefined>): boolean {
  const required = ["title", "company", "description", "sourceName"] as const;
  if (!required.every((field) => Boolean(mapping[field]?.trim()))) return false;
  const hasLocation = Boolean(mapping.locality?.trim()) || (Boolean(mapping.city?.trim()) && Boolean(mapping.state?.trim()));
  const hasChannel =
    Boolean(mapping.applicationUrl?.trim()) ||
    Boolean(mapping.applicationEmail?.trim()) ||
    Boolean(mapping.applicationWhatsapp?.trim());
  return hasLocation && hasChannel && Boolean(mapping.publishedAt?.trim());
}
