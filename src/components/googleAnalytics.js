import Script from 'next/script';

function GoogleAnalytics({ trackingId }) {
  return (
    <>
      {trackingId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${trackingId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}

export default GoogleAnalytics;
