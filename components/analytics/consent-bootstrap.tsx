import Script from "next/script";

export function ConsentBootstrap() {
  return (
    <Script id="google-consent-bootstrap" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          wait_for_update: 500
        });
        window.__javUpdateConsent = function(payload) {
          gtag('consent', 'update', {
            analytics_storage: payload.analytics ? 'granted' : 'denied',
            ad_storage: payload.advertising ? 'granted' : 'denied',
            ad_user_data: payload.advertising ? 'granted' : 'denied',
            ad_personalization: payload.advertising ? 'granted' : 'denied'
          });
        };
      `}
    </Script>
  );
}

