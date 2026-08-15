/**
 * Finejust.vip - Dynamic Accessible Breadcrumb & Schema Generator
 */
(function() {
  'use strict';

  function initBreadcrumbs() {
    const container = document.getElementById('site-breadcrumb');
    if (!container) return;

    const path = window.location.pathname;
    const isRoot = !path.includes('/tools/') && !path.includes('/blog/');
    const isTools = path.includes('/tools/');
    const isBlog = path.includes('/blog/');
    const rootPrefix = (isTools || isBlog) ? '../' : '';

    const pageTitle = container.getAttribute('data-title') || document.title.split(' - ')[0] || 'Tool';
    const categoryName = container.getAttribute('data-category') || (isTools ? 'Tools' : (isBlog ? 'Guides' : ''));
    const categoryUrl = isTools ? `${rootPrefix}index.html#tools` : (isBlog ? `${rootPrefix}index.html#blog` : '');

    let html = `
      <div class="breadcrumb-item">
        <a href="${rootPrefix}index.html">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>Home</span>
        </a>
      </div>
    `;

    const breadcrumbList = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finejust.vip/" }
    ];

    if (categoryName) {
      html += `
        <span class="breadcrumb-separator">/</span>
        <div class="breadcrumb-item">
          <a href="${categoryUrl}">${categoryName}</a>
        </div>
      `;
      breadcrumbList.push({
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `https://finejust.vip/${isTools ? '#tools' : '#blog'}`
      });
    }

    html += `
      <span class="breadcrumb-separator">/</span>
      <div class="breadcrumb-item">
        <span class="breadcrumb-active" aria-current="page">${pageTitle}</span>
      </div>
    `;
    breadcrumbList.push({
      "@type": "ListItem",
      "position": breadcrumbList.length + 1,
      "name": pageTitle,
      "item": window.location.href
    });

    container.innerHTML = html;

    // Inject BreadcrumbList JSON-LD Schema
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbList
    });
    document.head.appendChild(schemaScript);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBreadcrumbs);
  } else {
    initBreadcrumbs();
  }
})();
