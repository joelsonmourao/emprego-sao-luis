import { z } from "zod";

/** Campos Zod compatíveis com a versão instalada no runtime (Zod 3). */
export const zEmail = () => z.string().trim().email();
export const zUuid = () => z.string().uuid();
export const zUrl = () => z.string().url();
export const zOptionalEmail = () => z.string().trim().email().optional();
export const zOptionalUuid = () => z.string().uuid().optional();
export const zOptionalUrl = () =>
  z.union([z.string().url(), z.literal("")]).transform((value) => value || null);
