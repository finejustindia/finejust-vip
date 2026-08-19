/**
 * FineJust.vip - Central Data Layer & Internal Link Automation Engine
 * Stack: Pure Vanilla JavaScript (ES6) | No Frameworks | Production Ready
 * Brand: Finejust.vip
 * 
 * Fetches central data layer:
 * - /assets/data/tools.json
 * - /assets/data/blogs.json
 */

(function () {
  'use strict';

  // Global Central Data Layer Cache
  window.__FINEJUST_DATA__ = window.__FINEJUST_DATA__ || {
    tools: null,
    blogs: null,
    fetchPromise: null
  };

  // Determine root path dynamically for fetch and navigation
  const path = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
  const isSubdir = path.includes('/tools/') || path.includes('/blog/') || path.includes('/author/');
  const rootPrefix = isSubdir ? '../' : '';

  // SVG Icon helper
  function getCategorySvg(iconName) {
    switch (iconName) {
      case 'percent':
      case 'calculators':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>';
      case 'calendar':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
      case 'credit-card':
      case 'finance':
      case 'dollar-sign':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>';
      case 'activity':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>';
      case 'receipt':
      case 'tag':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>';
      case 'bar-chart':
      case 'trending-up':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>';
      case 'globe':
      case 'converters':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
      case 'maximize-2':
      case 'package':
      case 'thermometer':
      case 'zap':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
      case 'grid':
      case 'image-tools':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';
      case 'lock':
      case 'web-tools':
      case 'code':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
      case 'file-text':
      case 'text-tools':
      case 'type':
      case 'edit-3':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
      default:
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>';
    }
  }

  // Format category slugs to readable strings
  function formatCategoryName(slug) {
    if (!slug) return 'General';
    const names = {
      'calculators': 'Calculators',
      'finance': 'Finance & Loans',
      'converters': 'Unit Converters',
      'text-tools': 'Text Tools',
      'web-tools': 'Dev & Web',
      'image-tools': 'Image Tools'
    };
    return names[slug.toLowerCase()] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Central fetcher for JSON Data Layer
  async function loadDatasets() {
    if (window.__FINEJUST_DATA__.tools && window.__FINEJUST_DATA__.blogs) {
      return { tools: window.__FINEJUST_DATA__.tools, blogs: window.__FINEJUST_DATA__.blogs };
    }

    if (window.__FINEJUST_DATA__.fetchPromise) {
      return window.__FINEJUST_DATA__.fetchPromise;
    }

    window.__FINEJUST_DATA__.fetchPromise = (async () => {
      let tools = [];
      let blogs = [];

      try {
        const [toolsRes, blogsRes] = await Promise.all([
          fetch(`${rootPrefix}assets/data/tools.json`),
          fetch(`${rootPrefix}assets/data/blogs.json`)
        ]);

        if (toolsRes.ok) tools = await toolsRes.json();
        if (blogsRes.ok) blogs = await blogsRes.json();
      } catch (err) {
        console.error('[FineJust Data Layer] Failed to fetch JSON data layer:', err);
      }

      window.__FINEJUST_DATA__.tools = tools || [];
      window.__FINEJUST_DATA__.blogs = blogs || [];
      return { tools: window.__FINEJUST_DATA__.tools, blogs: window.__FINEJUST_DATA__.blogs };
    })();

    return window.__FINEJUST_DATA__.fetchPromise;
  }

  // Calculate similarity between two items based on keywords and category
  function computeRelevance(current, candidate) {
    if (!current || !candidate || current.slug === candidate.slug) return -1;
    let score = 0;
    if (current.category && candidate.category && current.category.toLowerCase() === candidate.category.toLowerCase()) {
      score += 10;
    }
    if (current.keywords && candidate.keywords) {
      const curKeys = new Set(current.keywords.map(k => k.toLowerCase()));
      candidate.keywords.forEach(k => {
        if (curKeys.has(k.toLowerCase())) score += 3;
      });
    }
    return score;
  }

  // Helper to normalize URL for root relative resolution
  function resolveUrl(url) {
    if (!url) return '#';
    if (url.startsWith('/')) {
      return rootPrefix ? rootPrefix + url.substring(1) : url;
    }
    return rootPrefix + url;
  }

  // Card HTML Template generator
  function renderItemCard(item, type) {
    const isTool = type === 'tool';
    const targetUrl = resolveUrl(item.url);
    const catName = formatCategoryName(item.category);
    const iconSvg = getCategorySvg(item.icon || item.category);

    return `
      <article class="il-card ${isTool ? 'il-tool-card' : 'il-article-card'}">
        <a href="${targetUrl}" class="il-card-link" aria-label="Open ${item.title}">
          <div class="il-card-top">
            <div class="il-card-icon" aria-hidden="true">${iconSvg}</div>
            <span class="il-category-badge">${catName}</span>
          </div>
          <h3 class="il-card-title">${item.title}</h3>
          <p class="il-card-desc">${item.description || item.summary || 'Fast, reliable, and 100% free online utility on Finejust.vip.'}</p>
          <div class="il-card-footer">
            <span class="il-card-action">${isTool ? 'Use Tool' : 'Read Guide'}</span>
            <span class="il-card-arrow" aria-hidden="true">&rarr;</span>
          </div>
        </a>
      </article>
    `;
  }

  // Main Orchestrator
  async function initInternalLinking() {
    const body = document.body;
    if (!body) return;

    // Detect Page Context
    let pageSlug = body.getAttribute('data-slug') || '';
    let pageType = body.getAttribute('data-type') || '';
    let pageCategory = body.getAttribute('data-category') || '';

    // URL Fallback Detection if body attributes are not explicitly present
    const currentPath = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    if (!pageSlug) {
      const match = currentPath.match(/\/([^\/]+)\.html$/);
      if (match) pageSlug = match[1];
    }
    if (!pageType) {
      if (currentPath.includes('/tools/')) pageType = 'tool';
      else if (currentPath.includes('/blog/')) pageType = 'blog';
      else pageType = 'page';
    }

    const { tools, blogs } = await loadDatasets();
    if (!tools.length && !blogs.length) return;

    // Find current object from data layer
    const currentItem = (pageType === 'tool' ? tools : blogs).find(i => i.slug === pageSlug) || 
                        tools.find(i => i.slug === pageSlug) || 
                        blogs.find(i => i.slug === pageSlug) || 
                        { slug: pageSlug, title: document.title.split('—')[0].split('-')[0].trim(), category: pageCategory || 'tools' };

    if (!pageCategory && currentItem.category) {
      pageCategory = currentItem.category;
    }

    // 1. Breadcrumb Component (#breadcrumb)
    const breadcrumbEl = document.getElementById('breadcrumb');
    if (breadcrumbEl) {
      const catLabel = formatCategoryName(pageCategory);
      const catUrl = resolveUrl(pageType === 'blog' ? 'blog.html' : `tools.html?category=${pageCategory}`);
      const homeUrl = resolveUrl('');

      breadcrumbEl.innerHTML = `
        <ol class="il-breadcrumb-list" itemscope itemtype="https://schema.org/BreadcrumbList">
          <li class="il-breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a href="${homeUrl || '/'}" itemprop="item" class="il-breadcrumb-link"><span itemprop="name">Home</span></a>
            <meta itemprop="position" content="1" />
          </li>
          <li class="il-breadcrumb-separator" aria-hidden="true">/</li>
          <li class="il-breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a href="${catUrl}" itemprop="item" class="il-breadcrumb-link"><span itemprop="name">${catLabel}</span></a>
            <meta itemprop="position" content="2" />
          </li>
          <li class="il-breadcrumb-separator" aria-hidden="true">/</li>
          <li class="il-breadcrumb-item il-breadcrumb-current" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" aria-current="page">
            <span itemprop="name">${currentItem.title}</span>
            <meta itemprop="position" content="3" />
          </li>
        </ol>
      `;
    }

    // 2. Related Tools Component (#related-tools) - Max 6
    const relatedToolsEl = document.getElementById('related-tools');
    if (relatedToolsEl && tools.length > 0) {
      const candidates = tools
        .filter(t => t.slug !== pageSlug)
        .map(t => ({ item: t, score: computeRelevance(currentItem, t) }))
        .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
        .slice(0, 6)
        .map(c => c.item);

      if (candidates.length > 0) {
        relatedToolsEl.innerHTML = `
          <div class="il-section-header">
            <div class="il-section-title-wrap">
              <span class="il-section-badge">Recommended Utilities</span>
              <h2 class="il-section-title">Related Free Online Tools</h2>
            </div>
            <a href="${resolveUrl('tools.html')}" class="il-view-all-link">Browse All Tools &rarr;</a>
          </div>
          <div class="il-grid il-grid-3">
            ${candidates.map(tool => renderItemCard(tool, 'tool')).join('')}
          </div>
        `;
      }
    }

    // 3. Related Articles Component (#related-articles) - Max 4
    const relatedArticlesEl = document.getElementById('related-articles');
    if (relatedArticlesEl && blogs.length > 0) {
      const candidates = blogs
        .filter(b => b.slug !== pageSlug)
        .map(b => ({ item: b, score: computeRelevance(currentItem, b) }))
        .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
        .slice(0, 4)
        .map(c => c.item);

      if (candidates.length > 0) {
        relatedArticlesEl.innerHTML = `
          <div class="il-section-header">
            <div class="il-section-title-wrap">
              <span class="il-section-badge">Learning Hub</span>
              <h2 class="il-section-title">Related Educational Guides &amp; Formulas</h2>
            </div>
            <a href="${resolveUrl('blog.html')}" class="il-view-all-link">Explore Blog &rarr;</a>
          </div>
          <div class="il-grid il-grid-2">
            ${candidates.map(art => renderItemCard(art, 'blog')).join('')}
          </div>
        `;
      }
    }

    // 4. Previous / Next Component (#prev-next) - Sequential ID Order
    const prevNextEl = document.getElementById('prev-next');
    if (prevNextEl) {
      const dataset = pageType === 'blog' ? blogs : tools;
      if (dataset.length > 1) {
        const sorted = [...dataset].sort((a, b) => (a.id || 0) - (b.id || 0));
        const currentIndex = sorted.findIndex(i => i.slug === pageSlug);

        const prevItem = currentIndex > 0 ? sorted[currentIndex - 1] : sorted[sorted.length - 1];
        const nextItem = currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : sorted[0];

        if (prevItem && nextItem && prevItem.slug !== pageSlug) {
          prevNextEl.innerHTML = `
            <nav class="il-prev-next-nav" aria-label="Adjacent Articles Navigation">
              <a href="${resolveUrl(prevItem.url)}" class="il-nav-btn il-prev-btn" aria-label="Previous: ${prevItem.title}">
                <span class="il-nav-label">&larr; Previous ${pageType === 'blog' ? 'Article' : 'Tool'}</span>
                <span class="il-nav-title">${prevItem.title}</span>
              </a>
              <a href="${resolveUrl(nextItem.url)}" class="il-nav-btn il-next-btn" aria-label="Next: ${nextItem.title}">
                <span class="il-nav-label">Next ${pageType === 'blog' ? 'Article' : 'Tool'} &rarr;</span>
                <span class="il-nav-title">${nextItem.title}</span>
              </a>
            </nav>
          `;
        }
      }
    }

    // 5. Category Navigation Component (#category-tools)
    const categoryToolsEl = document.getElementById('category-tools');
    if (categoryToolsEl && tools.length > 0 && pageCategory) {
      const catTools = tools.filter(t => t.category && t.category.toLowerCase() === pageCategory.toLowerCase() && t.slug !== pageSlug);
      if (catTools.length > 0) {
        categoryToolsEl.innerHTML = `
          <div class="il-section-header">
            <div class="il-section-title-wrap">
              <span class="il-section-badge">${formatCategoryName(pageCategory)} Category</span>
              <h2 class="il-section-title">More ${formatCategoryName(pageCategory)} Tools</h2>
            </div>
            <a href="${resolveUrl(`tools.html?category=${pageCategory}`)}" class="il-view-all-link">View Category &rarr;</a>
          </div>
          <div class="il-grid il-grid-3">
            ${catTools.map(tool => renderItemCard(tool, 'tool')).join('')}
          </div>
        `;
      }
    }

    // 6. Popular Tools Component (#popular-tools) - 8 Alphabetical
    const popularToolsEl = document.getElementById('popular-tools');
    if (popularToolsEl && tools.length > 0) {
      const popular = [...tools]
        .filter(t => t.slug !== pageSlug)
        .sort((a, b) => a.title.localeCompare(b.title))
        .slice(0, 8);

      popularToolsEl.innerHTML = `
        <div class="il-section-header">
          <div class="il-section-title-wrap">
            <span class="il-section-badge">Community Favorites</span>
            <h2 class="il-section-title">Popular Tools on Finejust.vip</h2>
          </div>
          <a href="${resolveUrl('tools.html')}" class="il-view-all-link">All Tools &rarr;</a>
        </div>
        <div class="il-grid il-grid-4">
          ${popular.map(tool => renderItemCard(tool, 'tool')).join('')}
        </div>
      `;
    }

    // 7. Recently Updated Component (#recently-updated or #recent-tools)
    const recentEl = document.getElementById('recently-updated') || document.getElementById('recent-tools');
    if (recentEl) {
      const combined = [...tools, ...blogs]
        .filter(item => item.slug !== pageSlug)
        .sort((a, b) => new Date(b.updated || 0) - new Date(a.updated || 0))
        .slice(0, 6);

      recentEl.innerHTML = `
        <div class="il-section-header">
          <div class="il-section-title-wrap">
            <span class="il-section-badge">Latest Updates</span>
            <h2 class="il-section-title">Recently Enhanced Utilities &amp; Guides</h2>
          </div>
        </div>
        <div class="il-grid il-grid-3">
          ${combined.map(item => renderItemCard(item, item.url.includes('/tools/') ? 'tool' : 'blog')).join('')}
        </div>
      `;
    }
  }

  // Initialize once DOM is ready with zero render blocking
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInternalLinking);
  } else {
    initInternalLinking();
  }

  // Expose engine to global window
  window.initFinejustInternalLinks = initInternalLinking;
})();
