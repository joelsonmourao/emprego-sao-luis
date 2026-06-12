const DEFAULT_SITE_URL = "https://empregossaoluis.com.br";

function normalizeSiteUrl(input) {
  const base = (input || DEFAULT_SITE_URL).trim();
  return base.replace(/\/+$/, "");
}

async function run() {
  const siteUrl = normalizeSiteUrl(process.env.SITE_URL);
  const cronSecret = process.env.CRON_SECRET ?? "";
  const endpoint = `${siteUrl}/api/cron/publish-scheduled-jobs`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-cron-secret": cronSecret
      }
    });

    const rawBody = await response.text();
    console.log(rawBody);

    let payload = null;
    try {
      payload = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      payload = null;
    }

    if (!response.ok || !payload || payload.ok !== true) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Falha ao chamar cron de publicacao agendada."
      })
    );
    process.exit(1);
  }
}

await run();
