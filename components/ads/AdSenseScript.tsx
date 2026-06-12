import Script from "next/script";

export function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();

  if (!clientId) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
