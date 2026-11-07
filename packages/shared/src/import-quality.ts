/** Erros de qualidade que realmente bloqueiam importação de planilha. */
const BLOCKING_IMPORT_QUALITY = [
  "A URL de candidatura foi identificada como encerrada.",
  "A data de encerramento já passou.",
  "Informe uma data de encerramento antes de aprovar ou publicar.",
  "Informe ao menos uma candidatura válida por site, WhatsApp ou e-mail.",
  "Fonte ausente ou incompatível.",
  "Cidade e UF precisam estar confirmadas."
];

export function splitImportQualityErrors(errors: string[]): {
  blocking: string[];
  soft: string[];
} {
  const blocking: string[] = [];
  const soft: string[] = [];
  for (const error of errors) {
    if (BLOCKING_IMPORT_QUALITY.some((item) => error.includes(item.slice(0, 24)) || error === item)) {
      blocking.push(error);
    } else {
      soft.push(error);
    }
  }
  return { blocking, soft };
}
