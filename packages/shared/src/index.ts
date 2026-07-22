import { z } from "zod";
import { validateApplicationChannels } from "./application-channels.js";
export * from "./publication-schedule.js";
export * from "./admin-password.js";
export * from "./zod-fields.js";
export * from "./import-row.js";
export * from "./import-publication.js";
export * from "./job-content.js";
export * from "./application-channels.js";
export * from "./application-monitor.js";
export * from "./job-classification.js";
export * from "./job-location.js";
export * from "./job-quality.js";
export * from "./import-template.js";
export * from "./post-magnetico.js";
export * from "./web-story.js";
export * from "./runtime-env.js";
export * from "./timezone.js";

export const publicCodeSchema = z.string().regex(/^ES-\d{6}$/);

const optionalText = (max: number) => z.string().trim().max(max).optional();
const optionalUrl = z
  .union([z.string().trim().url(), z.literal("")])
  .optional()
  .transform((value) => value || undefined);
const optionalDate = z.preprocess(
  (value) => (value === "" || value === undefined ? undefined : value),
  z.coerce.date().optional()
);
const checkbox = z
  .preprocess((value) => value === true || value === "true" || value === "on", z.boolean())
  .default(false);
export const jobDraftSchema = z
  .object({
    originalTitle: z.string().trim().min(3).max(160),
    normalizedTitle: z.string().trim().min(3).max(160),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(180),
    companyId: z.string().uuid(),
    cityId: z.string().uuid(),
    stateId: z.string().uuid(),
    categoryId: z.string().uuid().optional(),
    neighborhood: optionalText(160),
    employmentType: z.string().trim().min(2).max(50),
    workplaceType: z.enum(["presencial", "hibrido", "remoto"]),
    descriptionHtml: z.string().trim().min(80).max(100_000),
    schedule: optionalText(300),
    applicationUrl: optionalUrl,
    applicationEmail: optionalText(254),
    applicationWhatsapp: optionalText(40),
    applicationWhatsappMessage: optionalText(500),
    applicationEmailSubject: optionalText(300),
    applicationInstructions: optionalText(2_000),
    sourceName: z.string().trim().min(2).max(120),
    sourceUrl: optionalUrl,
    sourceEvidence: optionalText(2_000),
    expiresAt: z.coerce.date(),
    salaryMin: z.coerce.number().nonnegative().optional(),
    salaryMax: z.coerce.number().nonnegative().optional(),
    publicationStatus: z
      .enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED"])
      .default("DRAFT"),
    scheduledAt: optionalDate,
    featured: checkbox,
    confidentialCompany: checkbox,
    unidentifiedCompany: checkbox,
    seoTitle: optionalText(70),
    metaDescription: optionalText(170),
    canonicalUrl: optionalUrl
  })
  .superRefine((value, context) => {
    const channels = validateApplicationChannels(value);
    if (!channels.valid)
      context.addIssue({
        code: "custom",
        path: ["applicationUrl"],
        message: "Informe candidatura válida por site, WhatsApp ou e-mail."
      });
    if (value.salaryMin !== undefined && value.salaryMax !== undefined && value.salaryMax < value.salaryMin)
      context.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message: "Salário máximo menor que o mínimo."
      });
    if (value.expiresAt <= new Date())
      context.addIssue({ code: "custom", path: ["expiresAt"], message: "Validade deve estar no futuro." });
    if (value.publicationStatus === "SCHEDULED" && (!value.scheduledAt || value.scheduledAt <= new Date()))
      context.addIssue({
        code: "custom",
        path: ["scheduledAt"],
        message: "Agendamento deve estar no futuro."
      });
  });

export type JobDraftInput = z.infer<typeof jobDraftSchema>;
