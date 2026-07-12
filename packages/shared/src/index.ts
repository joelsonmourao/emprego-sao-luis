import { z } from "zod";

export const publicCodeSchema = z.string().regex(/^ES-\d{6}$/);
