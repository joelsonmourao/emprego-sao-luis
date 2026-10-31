import { describe, expect, it } from "vitest";
import { normalizeAdminApiResponse } from "./admin-api-response";

describe("normalizeAdminApiResponse", () => {
  const requestId = "request-test-1234";

  it("normaliza redirect de formulário como JSON", async () => {
    const response = await normalizeAdminApiResponse(
      new Response(null, { status: 303, headers: { location: "/admin/vagas" } }),
      requestId
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      data: {},
      redirect: "/admin/vagas",
      requestId
    });
  });

  it("normaliza erro textual com código e requestId", async () => {
    const response = await normalizeAdminApiResponse(
      new Response("Registro não encontrado", { status: 404 }),
      requestId
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Registro não encontrado",
      code: "NOT_FOUND",
      requestId
    });
  });

  it("preserva envelope padronizado", async () => {
    const response = await normalizeAdminApiResponse(
      Response.json({ ok: true, data: { id: "1" } }),
      requestId
    );

    expect(await response.json()).toEqual({ ok: true, data: { id: "1" }, requestId });
  });

  it("encapsula JSON legado e mantém compatibilidade de tela", async () => {
    const response = await normalizeAdminApiResponse(
      Response.json({ uri: "otpauth://example", enabled: true }),
      requestId
    );

    expect(await response.json()).toEqual({
      ok: true,
      data: { uri: "otpauth://example", enabled: true },
      uri: "otpauth://example",
      enabled: true,
      requestId
    });
  });

  it("não encapsula downloads CSV", async () => {
    const original = new Response("a,b", {
      headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=a.csv" }
    });
    const response = await normalizeAdminApiResponse(original, requestId);

    expect(await response.text()).toBe("a,b");
    expect(response.headers.get("x-request-id")).toBe(requestId);
  });
});
