/**
 * Google Analytics 4 (GA4) Global Site Tag
 * Brand: Finejust.vip
 * Placeholder Measurement ID: G-XXXXXXXXXX
 */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Configuration with performance and privacy optimizations
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure'
});
