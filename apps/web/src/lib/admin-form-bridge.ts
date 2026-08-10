/** Script injetado no AdminLayout para executar ações administrativas sem navegar para APIs. */
export const ADMIN_FORM_BRIDGE_SCRIPT = `
(function () {
  const showBanner = (message, tone) => {
    let banner = document.getElementById("admin-form-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "admin-form-banner";
      banner.setAttribute("role", "alert");
      banner.className = "fixed bottom-4 right-4 z-50 max-w-md rounded-xl border px-4 py-3 text-sm shadow-lg";
      document.body.appendChild(banner);
    }
    banner.textContent = message;
    banner.className =
      "fixed bottom-4 right-4 z-50 max-w-md rounded-xl border px-4 py-3 text-sm shadow-lg " +
      (tone === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-emerald-200 bg-emerald-50 text-emerald-900");
    banner.classList.remove("hidden");
    window.setTimeout(() => banner.classList.add("hidden"), 10000);
  };

  const followRedirect = (response) => {
    const location = response.headers.get("Location");
    if (location) {
      window.location.assign(location);
      return true;
    }
    return false;
  };

  document.addEventListener(
    "submit",
    async (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const submitter = event.submitter;
      const isSubmitControl = submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement;
      const action = (isSubmitControl ? submitter.getAttribute("formaction") : null) ?? form.getAttribute("action") ?? "";
      if (!action.startsWith("/api/")) return;
      event.preventDefault();

      if (isSubmitControl) submitter.disabled = true;

      try {
        const method = ((isSubmitControl ? submitter.getAttribute("formmethod") : null) ?? form.method) || "POST";
        const body = isSubmitControl ? new FormData(form, submitter) : new FormData(form);
        const response = await fetch(action, {
          method,
          body,
          credentials: "same-origin",
          redirect: "manual"
        });

        if (response.status >= 300 && response.status < 400 && followRedirect(response)) return;

        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const payload = await response.json().catch(() => null);
          if (payload && payload.ok === true && typeof payload.redirect === "string") {
            window.location.assign(payload.redirect);
            return;
          }
          if (payload && payload.ok === true) {
            const message =
              typeof payload.message === "string"
                ? payload.message
                : payload.data && typeof payload.data.message === "string"
                  ? payload.data.message
                  : "Operação concluída.";
            showBanner(message, "success");
            document.dispatchEvent(new CustomEvent("admin:operation-success", { detail: payload }));
            return;
          }
          const message =
            payload && typeof payload.error === "string" && payload.error.trim()
              ? payload.error
              : "Não foi possível concluir a operação.";
          const reference = payload && typeof payload.requestId === "string" ? " Referência: " + payload.requestId : "";
          showBanner(message + reference, "error");
          return;
        }

        if (!response.ok) {
          const text = (await response.text()).trim();
          const requestId = response.headers.get("x-request-id");
          showBanner(
            (text || "Não foi possível concluir a operação.") + (requestId ? " Referência: " + requestId : ""),
            "error"
          );
          return;
        }

        showBanner("Operação concluída.", "success");
      } catch {
        showBanner("Falha de conexão. Tente novamente.", "error");
      } finally {
        if (isSubmitControl) submitter.disabled = false;
      }
    },
    true
  );

  document.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("[data-admin-download]");
    if (!(link instanceof HTMLAnchorElement)) return;
    const href = link.getAttribute("href") ?? "";
    if (!href.startsWith("/api/")) return;
    event.preventDefault();
    try {
      const response = await fetch(href, { credentials: "same-origin" });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload && typeof payload.error === "string" ? payload.error : "Não foi possível baixar o arquivo.";
        const reference = payload && typeof payload.requestId === "string" ? " Referência: " + payload.requestId : "";
        showBanner(message + reference, "error");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = link.getAttribute("data-filename") ?? "download";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      showBanner("Falha ao baixar o arquivo.", "error");
    }
  });
})();
`;
