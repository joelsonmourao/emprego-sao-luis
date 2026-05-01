type DebugLogInput = {
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
};

/** No-op: evita chamadas de rede em producao; use APM/logs estruturados se precisar. */
export function sendDebugLog(_input: DebugLogInput) {}
