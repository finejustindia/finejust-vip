/**
 * Finejust.vip - Master Client Engine & Component Loader
 * Brand: Finejust.vip
 * Domain: https://finejust.vip
 * 
 * Features:
 * - Unified Component Loader (assets/components/header.html & footer.html)
 * - Automatic Active Navigation Highlighting
 * - Dark / Light Theme engine persisted via localStorage
 * - Current Year Dynamic Injection
 * - Global Search Trigger Binding (Ctrl + K)
 * - Dynamic 6-Tool Related Recommender from tools.json
 * - FAQ Accordion Engine
 * - Global Toast Notification & Clipboard Copy Helper
 */

(function() {
  'use strict';

  // Instant Canonical Redirect: If URL ends with /index.html, immediately replace with clean root /
  if (window.location.pathname.endsWith('/index.html')) {
    window.location.replace('/');
  }

  // Determine Relative Root Path based on URL location
  const path = window.location.pathname.toLowerCase();
  const isSubdir = path.includes('/blog/') || path.includes('/tools/') || path.includes('/author/') ||
                   path.includes('\\blog\\') || path.includes('\\tools\\') || path.includes('\\author\\');
  const rootPrefix = isSubdir ? '../' : '';

  // Embedded Tools Database Fallback for 100% Offline / file:// Support
  window.FINEJUST_TOOLS = window.FINEJUST_TOOLS || [
    { id: "percentage-calculator", title: "Percentage Calculator", description: "Calculate percentages, percentage increase/decrease, retail markdowns, and fractions instantly.", category: "Calculators", categorySlug: "calculators", url: "tools/percentage-calculator.html", icon: "percent", keywords: ["percentage", "math", "discount", "increase", "decrease", "fraction", "ratio"], featured: true, trending: true },
    { id: "age-calculator", title: "Age Calculator", description: "Calculate exact chronological age in years, months, days, hours, and countdown to your next birthday.", category: "Calculators", categorySlug: "calculators", url: "tools/age-calculator.html", icon: "calendar", keywords: ["age", "birthday", "date of birth", "dob", "chronological age"], featured: false, trending: true },
    { id: "emi-calculator", title: "EMI Calculator", description: "Calculate monthly loan installments (EMI), total interest payable, and comprehensive amortization schedules.", category: "Finance", categorySlug: "finance", url: "tools/emi-calculator.html", icon: "credit-card", keywords: ["emi", "loan", "mortgage", "interest", "finance", "bank", "installment"], featured: true, trending: true },
    { id: "bmi-calculator", title: "BMI Calculator", description: "Evaluate Body Mass Index using Metric or Imperial units and check WHO healthy weight categories.", category: "Calculators", categorySlug: "calculators", url: "tools/bmi-calculator.html", icon: "activity", keywords: ["bmi", "body mass index", "fitness", "health", "weight", "obesity", "diet"], featured: true, trending: true },
    { id: "gst-calculator", title: "GST Calculator", description: "Compute inclusive and exclusive Goods and Services Tax with accurate CGST/SGST/IGST breakdowns.", category: "Finance", categorySlug: "finance", url: "tools/gst-calculator.html", icon: "receipt", keywords: ["gst", "tax", "vat", "sales tax", "cgst", "sgst", "invoice"], featured: true, trending: true },
    { id: "discount-calculator", title: "Discount Calculator", description: "Calculate retail sales savings, secondary stacked discounts, sales tax, and final checkout totals.", category: "Finance", categorySlug: "finance", url: "tools/discount-calculator.html", icon: "tag", keywords: ["discount", "sale", "markdown", "coupon", "savings"], featured: false, trending: false },
    { id: "loan-calculator", title: "Loan Calculator", description: "Estimate personal, auto, and mortgage amortizations with weekly, bi-weekly, or monthly frequencies.", category: "Finance", categorySlug: "finance", url: "tools/loan-calculator.html", icon: "dollar-sign", keywords: ["loan", "mortgage", "interest", "principal", "amortization"], featured: false, trending: false },
    { id: "simple-interest-calculator", title: "Simple Interest Calculator", description: "Calculate fixed interest returns and maturity balance across days, months, or years.", category: "Finance", categorySlug: "finance", url: "tools/simple-interest-calculator.html", icon: "bar-chart", keywords: ["simple interest", "principal", "rate", "time", "yield"], featured: false, trending: false },
    { id: "compound-interest-calculator", title: "Compound Interest Calculator", description: "Project long-term compound growth, annual percentage yield (APY), and recurring investment contributions.", category: "Finance", categorySlug: "finance", url: "tools/compound-interest-calculator.html", icon: "trending-up", keywords: ["compound interest", "investment", "wealth", "apy", "growth", "savings"], featured: true, trending: true },
    { id: "currency-converter", title: "Currency Converter", description: "Convert across 25+ global currencies (USD, EUR, GBP, INR, JPY, CAD) with real-time reciprocal rates.", category: "Converters", categorySlug: "converters", url: "tools/currency-converter.html", icon: "globe", keywords: ["currency", "forex", "usd", "eur", "gbp", "inr", "exchange rate", "money"], featured: true, trending: true },
    { id: "length-converter", title: "Length Converter", description: "Convert meters, kilometers, miles, yards, feet, inches, centimeters, and nautical miles.", category: "Converters", categorySlug: "converters", url: "tools/length-converter.html", icon: "maximize-2", keywords: ["length", "distance", "meters", "feet", "inches", "miles"], featured: false, trending: false },
    { id: "weight-converter", title: "Weight Converter", description: "Convert between kilograms, grams, pounds, ounces, stones, metric tons, and carats.", category: "Converters", categorySlug: "converters", url: "tools/weight-converter.html", icon: "package", keywords: ["weight", "mass", "kg", "lbs", "grams", "ounces"], featured: false, trending: false },
    { id: "temperature-converter", title: "Temperature Converter", description: "Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine with instant formulas.", category: "Converters", categorySlug: "converters", url: "tools/temperature-converter.html", icon: "thermometer", keywords: ["temperature", "celsius", "fahrenheit", "kelvin"], featured: false, trending: false },
    { id: "speed-converter", title: "Speed Converter", description: "Convert velocity between km/h, mph, m/s, knots, feet per second, and Mach.", category: "Converters", categorySlug: "converters", url: "tools/speed-converter.html", icon: "zap", keywords: ["speed", "velocity", "kmh", "mph", "knots", "mach"], featured: false, trending: false },
    { id: "qr-code-generator", title: "QR Code Generator", description: "Generate high-resolution permanent QR codes for URLs, text, Wi-Fi networks, and contact cards with PNG download.", category: "Image Tools", categorySlug: "image-tools", url: "tools/qr-code-generator.html", icon: "grid", keywords: ["qr code", "qr generator", "barcode", "wifi qr", "png", "matrix"], featured: true, trending: true },
    { id: "password-generator", title: "Password Generator", description: "Create strong, uncrackable cryptographic random passwords with live entropy bits and strength scoring.", category: "Web Tools", categorySlug: "web-tools", url: "tools/password-generator.html", icon: "lock", keywords: ["password generator", "security", "random password", "entropy", "crypto"], featured: true, trending: true },
    { id: "word-counter", title: "Word Counter", description: "Count words, characters, sentences, paragraphs, reading/speaking time, and top keyword density in real time.", category: "Text Tools", categorySlug: "text-tools", url: "tools/word-counter.html", icon: "file-text", keywords: ["word count", "character count", "reading time", "essay", "seo", "density"], featured: true, trending: true },
    { id: "character-counter", title: "Character Counter", description: "Track character limits, letters, digits, spaces, SMS segments, and Twitter/X post lengths in real time.", category: "Text Tools", categorySlug: "text-tools", url: "tools/character-counter.html", icon: "type", keywords: ["character counter", "letter counter", "twitter", "sms"], featured: false, trending: false },
    { id: "case-converter", title: "Case Converter", description: "Transform text between UPPERCASE, lowercase, Title Case, camelCase, kebab-case, snake_case, and PascalCase.", category: "Text Tools", categorySlug: "text-tools", url: "tools/case-converter.html", icon: "edit-3", keywords: ["case converter", "uppercase", "camelcase", "snake_case"], featured: false, trending: false },
    { id: "base64-encoder", title: "Base64 Encoder & Decoder", description: "Encode and decode plain text or binary data strings to and from Base64 with full UTF-8 Unicode support.", category: "Web Tools", categorySlug: "web-tools", url: "tools/base64-encoder.html", icon: "code", keywords: ["base64", "base64 encode", "base64 decode", "utf8", "binary"], featured: false, trending: false }
  ];

  // SVG Icon Resolver
  window.getToolIconSvg = function(icon) {
    switch (icon) {
      case 'percent': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>';
      case 'calendar': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
      case 'credit-card': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>';
      case 'activity': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>';
      case 'receipt': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"></path><line x1="8" y1="8" x2="16" y2="8"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="16" x2="12" y2="16"></line></svg>';
      case 'tag': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>';
      case 'dollar-sign': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>';
      case 'trending-up': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>';
      case 'bar-chart': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>';
      case 'globe': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
      case 'maximize-2': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
      case 'package': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
      case 'thermometer': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>';
      case 'zap': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
      case 'grid': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';
      case 'lock': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
      case 'file-text': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
      case 'type': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>';
      case 'edit-3': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
      case 'code': return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>';
      default: return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    }
  };

  // Fallback Templates (Synchronous & Offline Safe)
  function getHeaderTemplate() {
    return `
      <header class="site-header" id="site-header">
        <div class="container header-inner">
          <a href="/" class="logo-link" aria-label="Finejust.vip Homepage">
            <div class="logo-badge">F</div>
            <span class="brand-text">Finejust<span>.vip</span></span>
          </a>

          <nav class="nav-desktop" aria-label="Primary Navigation">
            <a href="/" class="nav-link" data-nav="home">Home</a>
            <a href="${rootPrefix}tools.html" class="nav-link" data-nav="tools">Tools</a>
            <a href="/#categories" class="nav-link" data-nav="categories">Categories</a>
            <a href="${rootPrefix}blog.html" class="nav-link" data-nav="blog">Blog</a>
            <a href="${rootPrefix}about.html" class="nav-link" data-nav="about">About</a>
            <a href="${rootPrefix}contact.html" class="nav-link" data-nav="contact">Contact</a>
          </nav>

          <div class="header-actions">
            <button type="button" class="search-trigger" id="global-search-btn" data-action="open-search" aria-label="Search Tools (Ctrl+K)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Search...</span>
              <kbd class="kbd-shortcut">Ctrl+K</kbd>
            </button>

            <button type="button" class="icon-btn theme-toggle-btn" id="theme-toggle-btn" aria-label="Toggle Dark/Light Mode">
              <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>

            <a href="${rootPrefix}tools.html" class="btn-nav-cta">
              <span>Explore Tools</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>

            <button type="button" class="icon-btn mobile-menu-btn" id="mobile-menu-toggle" aria-label="Open Navigation Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>

        <div class="mobile-nav-drawer" id="mobile-nav-drawer">
          <a href="/" class="mobile-nav-link" data-nav="home">Home</a>
          <a href="${rootPrefix}tools.html" class="mobile-nav-link" data-nav="tools">All Tools (20+)</a>
          <a href="/#categories" class="mobile-nav-link" data-nav="categories">Categories</a>
          <a href="${rootPrefix}blog.html" class="mobile-nav-link" data-nav="blog">Blog &amp; Guides</a>
          <a href="${rootPrefix}about.html" class="mobile-nav-link" data-nav="about">About Us</a>
          <a href="${rootPrefix}contact.html" class="mobile-nav-link" data-nav="contact">Contact Support</a>
          <a href="${rootPrefix}privacy-policy.html" class="mobile-nav-link" data-nav="privacy">Privacy Policy</a>
        </div>
      </header>
    `;
  }

  function getFooterTemplate() {
    return `
      <footer class="site-footer" id="site-footer">
        <div class="container">
          <div class="footer-grid-5">
            <div class="footer-brand-col">
              <a href="/" class="logo-link" aria-label="Finejust.vip Homepage">
                <div class="logo-badge">F</div>
                <span class="brand-text">Finejust<span>.vip</span></span>
              </a>
              <p>Ultra-fast, 100% private online AI tools and smart utility calculators. Zero registration, zero server data logging, pure client-side performance.</p>
              <div class="social-links-row">
                <a href="https://twitter.com" class="social-icon-btn" aria-label="Twitter" target="_blank" rel="noopener">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="https://github.com" class="social-icon-btn" aria-label="GitHub" target="_blank" rel="noopener">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="https://linkedin.com" class="social-icon-btn" aria-label="LinkedIn" target="_blank" rel="noopener">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 class="footer-col-title">Popular Tools</h4>
              <ul class="footer-links">
                <li><a href="${rootPrefix}tools/percentage-calculator.html" class="footer-link">Percentage Calculator</a></li>
                <li><a href="${rootPrefix}tools/bmi-calculator.html" class="footer-link">BMI Calculator</a></li>
                <li><a href="${rootPrefix}tools/emi-calculator.html" class="footer-link">EMI Calculator</a></li>
                <li><a href="${rootPrefix}tools/gst-calculator.html" class="footer-link">GST Calculator</a></li>
                <li><a href="${rootPrefix}tools/password-generator.html" class="footer-link">Password Generator</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-col-title">Categories</h4>
              <ul class="footer-links">
                <li><a href="${rootPrefix}tools.html?category=calculators" class="footer-link">Calculators</a></li>
                <li><a href="${rootPrefix}tools.html?category=converters" class="footer-link">Unit Converters</a></li>
                <li><a href="${rootPrefix}tools.html?category=finance" class="footer-link">Finance Utilities</a></li>
                <li><a href="${rootPrefix}tools.html?category=developer" class="footer-link">Dev &amp; AI Utilities</a></li>
                <li><a href="${rootPrefix}tools.html" class="footer-link" style="color:var(--primary); font-weight:700;">All 20+ Free Tools &rarr;</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-col-title">About &amp; Team</h4>
              <ul class="footer-links">
                <li><a href="${rootPrefix}about.html" class="footer-link">About Us</a></li>
                <li><a href="${rootPrefix}author/finejust-editorial.html" class="footer-link">Editorial Team</a></li>
                <li><a href="${rootPrefix}editorial-policy.html" class="footer-link">Editorial Standards</a></li>
                <li><a href="${rootPrefix}contact.html" class="footer-link">Contact Support</a></li>
                <li><a href="${rootPrefix}blog.html" class="footer-link">Blog &amp; Guides</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-col-title">Legal &amp; Privacy</h4>
              <ul class="footer-links">
                <li><a href="${rootPrefix}privacy-policy.html" class="footer-link">Privacy Policy</a></li>
                <li><a href="${rootPrefix}terms.html" class="footer-link">Terms of Service</a></li>
                <li><a href="${rootPrefix}disclaimer.html" class="footer-link">Website Disclaimer</a></li>
                <li><a href="${rootPrefix}cookie-policy.html" class="footer-link">Cookie Policy</a></li>
                <li><a href="${rootPrefix}sitemap.xml" class="footer-link" target="_blank">XML Sitemap &rarr;</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div>&copy; <span id="current-year">2026</span> Finejust.vip. All Rights Reserved.</div>
            <div style="display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center;">
              <a href="${rootPrefix}privacy-policy.html" class="footer-link">Privacy</a>
              <a href="${rootPrefix}terms.html" class="footer-link">Terms</a>
              <a href="${rootPrefix}disclaimer.html" class="footer-link">Disclaimer</a>
              <a href="${rootPrefix}cookie-policy.html" class="footer-link">Cookie Policy</a>
              <a href="${rootPrefix}editorial-policy.html" class="footer-link">Editorial Policy</a>
              <a href="${rootPrefix}author/finejust-editorial.html" class="footer-link">Authors</a>
              <a href="${rootPrefix}sitemap.html" class="footer-link">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  // Unified Component Loader
  async function loadComponents() {
    const headerContainer = document.getElementById('site-header-container');
    const footerContainer = document.getElementById('site-footer-container');

    // Header Injection
    if (headerContainer) {
      try {
        const res = await fetch(`${rootPrefix}assets/components/header.html`);
        if (res.ok) {
          const raw = await res.text();
          headerContainer.innerHTML = raw.replace(/\{\{ROOT\}\}/g, homeUrl);
        } else {
          headerContainer.innerHTML = getHeaderTemplate();
        }
      } catch (e) {
        headerContainer.innerHTML = getHeaderTemplate();
      }
    }

    // Footer Injection
    if (footerContainer) {
      try {
        const res = await fetch(`${rootPrefix}assets/components/footer.html`);
        if (res.ok) {
          const raw = await res.text();
          footerContainer.innerHTML = raw.replace(/\{\{ROOT\}\}/g, homeUrl);
        } else {
          footerContainer.innerHTML = getFooterTemplate();
        }
      } catch (e) {
        footerContainer.innerHTML = getFooterTemplate();
      }
    }

    // Post-load initialization
    highlightActiveNav();
    updateCopyrightYear();
    bindHeaderActions();
  }

  // Highlight Active Link Automatically
  function highlightActiveNav() {
    const currentPath = window.location.pathname.toLowerCase();
    const currentHash = window.location.hash.toLowerCase();

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      link.classList.remove('active');
      const href = (link.getAttribute('href') || '').toLowerCase();
      const navType = (link.getAttribute('data-nav') || '').toLowerCase();

      if (currentPath.endsWith('blog.html') || currentPath.includes('/blog/') || currentPath.includes('\\blog\\')) {
        if (navType === 'blog' || href.includes('blog.html')) {
          link.classList.add('active');
        }
      } else if (currentPath.endsWith('tools.html') || currentPath.includes('/tools/') || currentPath.includes('\\tools\\')) {
        if (navType === 'tools' || href.includes('tools.html')) {
          link.classList.add('active');
        }
      } else if (currentPath.endsWith('about.html')) {
        if (navType === 'about' || href.includes('about.html')) {
          link.classList.add('active');
        }
      } else if (currentPath.endsWith('contact.html')) {
        if (navType === 'contact' || href.includes('contact.html')) {
          link.classList.add('active');
        }
      } else if (currentPath.endsWith('privacy-policy.html')) {
        if (navType === 'privacy' || href.includes('privacy-policy.html')) {
          link.classList.add('active');
        }
      } else if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('/finejust-vip/') || currentPath.endsWith('\\finejust-vip\\') || currentPath.endsWith('/finejust-vip') || currentPath.endsWith('\\finejust-vip')) {
        if (currentHash.includes('categories')) {
          if (navType === 'categories' || href.includes('#categories')) {
            link.classList.add('active');
          }
        } else if (!currentHash || currentHash === '#') {
          if (navType === 'home' || href === './' || href === '../' || href === '/' || (href.includes('index.html') && !href.includes('#'))) {
            link.classList.add('active');
          }
        }
      }
    });
  }

  window.addEventListener('hashchange', highlightActiveNav);

  // Update Dynamic Current Year
  function updateCopyrightYear() {
    const yearEls = document.querySelectorAll('#current-year');
    const now = new Date().getFullYear();
    yearEls.forEach(el => el.textContent = now);
  }

  // Bind Header Interactivity (Theme, Search, Mobile Drawer)
  // Bind Header Interactivity (Theme, Search, Mobile Drawer)
  function bindHeaderActions() {
    // Theme Toggle Handlers
    document.querySelectorAll('#theme-toggle-btn, .theme-toggle-inline').forEach(btn => {
      btn.onclick = function() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('finejust_theme', next);
        window.showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
      };
    });

    // Mobile Drawer Toggle & Overlay
    const mobileBtn = document.getElementById('mobile-menu-toggle') || document.getElementById('mobile-toggle');
    const drawer = document.getElementById('mobile-nav-drawer') || document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-nav-overlay');

    function closeDrawer() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.classList.remove('drawer-open');
    }

    function openDrawer() {
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.classList.add('drawer-open');
    }

    if (mobileBtn && drawer) {
      mobileBtn.onclick = function(e) {
        e.stopPropagation();
        if (drawer.classList.contains('open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      };

      if (overlay) {
        overlay.onclick = closeDrawer;
      }

      document.addEventListener('click', (e) => {
        if (!mobileBtn.contains(e.target) && !drawer.contains(e.target)) {
          closeDrawer();
        }
      });

      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeDrawer);
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          closeDrawer();
        }
      });
    }

    // Global Search Modal Trigger
    document.querySelectorAll('[data-action="open-search"], #global-search-btn').forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        if (window.openSearchModal) {
          window.openSearchModal();
        }
      };
    });
  }

  // Automatic Table Responsive Wrapper
  function initResponsiveTables() {
    document.querySelectorAll('table').forEach(tbl => {
      if (!tbl.parentElement.classList.contains('table-responsive')) {
        const wrap = document.createElement('div');
        wrap.className = 'table-responsive';
        tbl.parentNode.insertBefore(wrap, tbl);
        wrap.appendChild(tbl);
      }
    });
  }

  // FAQ Accordion Handler
  function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(button => {
      button.onclick = function() {
        const item = button.closest('.faq-item');
        if (!item) return;
        const isActive = item.classList.contains('active');
        
        const parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
        }

        if (!isActive) {
          item.classList.add('active');
        }
      };
    });
  }

  // Dynamic Related Tools Generator (Loads 6 Related Tools)
  function initDynamicRelatedTools() {
    const container = document.getElementById('dynamic-related-tools');
    if (!container) return;

    const currentCategory = container.getAttribute('data-category') || 'all';
    let related = window.FINEJUST_TOOLS;

    if (currentCategory !== 'all') {
      const matchCat = related.filter(t => t.categorySlug === currentCategory);
      if (matchCat.length >= 3) {
        related = matchCat;
      }
    }

    const selected = related.slice(0, 6);

    let html = `
      <div class="content-box" style="margin-top: 2.5rem;">
        <h2>Related Online Tools &amp; Utilities</h2>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-top:1.25rem;">
    `;

    selected.forEach(tool => {
      html += `
        <a href="${rootPrefix}${tool.url}" class="tool-card" style="padding:1.25rem; border-radius:var(--radius-md);">
          <div style="font-weight:700; color:var(--text); margin-bottom:0.35rem;">${tool.title}</div>
          <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">${tool.description}</div>
          <div style="font-size:0.8rem; font-weight:700; color:var(--primary); margin-top:0.75rem;">Open Tool &rarr;</div>
        </a>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  // Global Toast Notifications
  window.showToast = function(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#10b981;"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 250ms ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  };

  // Clipboard Helper
  window.copyToClipboard = function(text, successMsg = 'Copied to clipboard!') {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast(successMsg);
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  };

  function fallbackCopy(text, successMsg) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      window.showToast(successMsg);
    } catch (e) {
      window.showToast('Copy failed');
    }
    document.body.removeChild(el);
  }

  // Reading Progress Bar Initializer
  function initReadingProgressBar() {
    let bar = document.getElementById('reading-progress-bar');
    if (!bar) {
      const container = document.createElement('div');
      container.className = 'reading-progress-container';
      bar = document.createElement('div');
      bar.id = 'reading-progress-bar';
      bar.className = 'reading-progress-bar';
      container.appendChild(bar);
      document.body.prepend(container);
    }

    function updateProgress() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        bar.style.width = `${progress}%`;
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Social Share Buttons Initializer (with Web Share API support)
  function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = btn.getAttribute('data-platform');
        const rawUrl = window.location.href;
        const rawTitle = document.title || 'Finejust.vip Free Tools';
        const url = encodeURIComponent(rawUrl);
        const title = encodeURIComponent(rawTitle);

        if (platform === 'native' || (platform === 'share' && navigator.share)) {
          e.preventDefault();
          if (navigator.share) {
            navigator.share({ title: rawTitle, url: rawUrl }).catch(() => {});
            return;
          }
        }

        if (platform === 'copy') {
          e.preventDefault();
          window.copyToClipboard(rawUrl, 'Link copied to clipboard!');
          return;
        }

        let shareUrl = '';
        if (platform === 'twitter') {
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        } else if (platform === 'facebook') {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (platform === 'linkedin') {
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        } else if (platform === 'whatsapp') {
          shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        }

        if (shareUrl) {
          e.preventDefault();
          window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=450');
        }
      });
    });
  }

  // Floating Back to Top Button Initializer
  function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Scroll Back to Top');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Recently Viewed Tools (localStorage Engine)
  function initRecentlyViewedTools() {
    const path = window.location.pathname.toLowerCase();
    const allTools = window.FINEJUST_TOOLS || [];

    // Track current tool if on a tool page
    if (path.includes('/tools/') || path.includes('\\tools\\')) {
      const filename = path.split('/').pop().split('\\').pop();
      const currentTool = allTools.find(t => t.url.endsWith(filename) || filename.includes(t.id));
      
      if (currentTool) {
        try {
          let recent = JSON.parse(localStorage.getItem('finejust_recent_tools') || '[]');
          recent = recent.filter(item => item.id !== currentTool.id);
          recent.unshift({
            id: currentTool.id,
            title: currentTool.title,
            category: currentTool.category,
            url: currentTool.url,
            icon: currentTool.icon
          });
          if (recent.length > 6) recent = recent.slice(0, 6);
          localStorage.setItem('finejust_recent_tools', JSON.stringify(recent));
        } catch (e) {}
      }
    }

    // Render recently viewed tools widgets
    const containers = document.querySelectorAll('#recently-viewed-tools');
    if (!containers.length) return;

    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem('finejust_recent_tools') || '[]');
    } catch (e) {}

    const isSub = path.includes('/tools/') || path.includes('/blog/') || path.includes('/author/') || path.includes('\\tools\\') || path.includes('\\blog\\') || path.includes('\\author\\');
    const prefix = isSub ? '../' : '';

    containers.forEach(c => {
      if (!recent.length) {
        c.style.display = 'none';
        return;
      }
      c.style.display = 'block';
      c.innerHTML = `
        <div class="content-box" style="margin-top: 2.5rem; margin-bottom: 2.5rem;">
          <div class="section-tag" style="margin-bottom:0.5rem;">Jump Back In</div>
          <h2 style="font-size:1.5rem; font-weight:800; color:var(--text); margin-bottom:1.25rem;">Recently Used Tools</h2>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
            ${recent.map(item => `
              <a href="${prefix}${item.url}" class="content-box" style="margin:0; padding:1.15rem; display:flex; align-items:center; gap:0.85rem; border-color:var(--border);">
                <div style="width:2.5rem; height:2.5rem; border-radius:var(--radius-md); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  ${window.getToolIconSvg ? window.getToolIconSvg(item.icon) : '⚡'}
                </div>
                <div style="min-width:0;">
                  <div style="font-weight:700; font-size:0.925rem; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.title}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${item.category}</div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  // Popular Tools Auto-Renderer
  function initPopularTools() {
    const containers = document.querySelectorAll('#popular-tools-widget');
    if (!containers.length) return;
    const tools = (window.FINEJUST_TOOLS || []).slice(0, 8);
    const path = window.location.pathname.toLowerCase();
    const isSub = path.includes('/tools/') || path.includes('/blog/') || path.includes('/author/') || path.includes('\\tools\\') || path.includes('\\blog\\') || path.includes('\\author\\');
    const prefix = isSub ? '../' : '';

    containers.forEach(c => {
      c.innerHTML = `
        <div class="section-tag" style="margin-bottom:0.5rem;">Most Popular</div>
        <h2 style="font-size:1.5rem; font-weight:800; color:var(--text); margin-bottom:1.25rem;">Trending Online Utilities</h2>
        <div class="tools-grid">
          ${tools.map(t => `
            <a href="${prefix}${t.url}" class="tool-card">
              <div class="tool-card-header">
                <div class="tool-card-icon">${window.getToolIconSvg ? window.getToolIconSvg(t.icon) : '⚡'}</div>
                <span class="tool-card-tag">${t.category}</span>
              </div>
              <h3 class="tool-card-title">${t.title}</h3>
              <p class="tool-card-desc">${t.description}</p>
              <div class="tool-card-footer">
                <span>Open Tool</span>
                <span>&rarr;</span>
              </div>
            </a>
          `).join('')}
        </div>
      `;
    });
  }

  // Sticky Table of Contents Intersection Observer
  function initStickyTOC() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (!tocLinks.length) return;

    const headings = [];
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.getElementById(href.slice(1));
        if (target) headings.push({ target, link });
      }
    });

    if (!headings.length) return;

    function highlightTOC() {
      const scrollPos = window.scrollY + 120;
      let currentActive = null;

      for (let i = 0; i < headings.length; i++) {
        if (headings[i].target.offsetTop <= scrollPos) {
          currentActive = headings[i].link;
        }
      }

      tocLinks.forEach(l => l.classList.remove('active'));
      if (currentActive) {
        currentActive.classList.add('active');
      }
    }

    window.addEventListener('scroll', highlightTOC, { passive: true });
    highlightTOC();
  }

  // Initialize Core Services on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadComponents();
      initFaqAccordion();
      initDynamicRelatedTools();
      initReadingProgressBar();
      initShareButtons();
      initStickyTOC();
      initResponsiveTables();
      initBackToTop();
      initRecentlyViewedTools();
      initPopularTools();
    });
  } else {
    loadComponents();
    initFaqAccordion();
    initDynamicRelatedTools();
    initReadingProgressBar();
    initShareButtons();
    initStickyTOC();
    initResponsiveTables();
    initBackToTop();
    initRecentlyViewedTools();
    initPopularTools();
  }

})();

