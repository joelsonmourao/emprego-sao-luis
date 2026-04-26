type DebugLogInput = {
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
};

const DEBUG_ENDPOINT = "http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748";
const DEBUG_SESSION_ID = "bb2dcd";

export function sendDebugLog(input: DebugLogInput) {
  if (process.env.NODE_ENV === "production") return;
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": DEBUG_SESSION_ID },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      runId: input.runId,
      hypothesisId: input.hypothesisId,
      location: input.location,
      message: input.message,
      data: input.data ?? {},
      timestamp: Date.now()
    })
  }).catch(() => {});
}
