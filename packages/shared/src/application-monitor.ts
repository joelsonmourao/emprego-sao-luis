export type ApplicationHealth = "AVAILABLE" | "CLOSED" | "INCONCLUSIVE" | "INVALID";

const CLOSED_PHRASES = [
  "candidaturas encerradas",
  "inscrições encerradas",
  "inscricoes encerradas",
  "vaga encerrada",
  "vaga está encerrada",
  "vaga fechada",
  "não está mais aceitando candidaturas",
  "nao esta mais aceitando candidaturas",
  "job is no longer available",
  "position has been filled"
];

export function classifyApplicationResponse(input: { status: number; body?: string | null }) {
  if ([403, 408, 425, 429].includes(input.status) || input.status >= 500)
    return { health: "INCONCLUSIVE" as ApplicationHealth, reason: `Resposta HTTP ${input.status}; requer revisão.` };
  if ([404, 410].includes(input.status))
    return { health: "CLOSED" as ApplicationHealth, reason: `Página removida (HTTP ${input.status}).` };
  const normalized = (input.body ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const phrase = CLOSED_PHRASES.find((item) => normalized.includes(item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
  if (phrase) return { health: "CLOSED" as ApplicationHealth, reason: `A página informa encerramento: “${phrase}”.` };
  if (input.status >= 200 && input.status < 400)
    return { health: "AVAILABLE" as ApplicationHealth, reason: `Página acessível (HTTP ${input.status}).` };
  return { health: "INCONCLUSIVE" as ApplicationHealth, reason: `Resposta HTTP ${input.status}; requer revisão.` };
}
