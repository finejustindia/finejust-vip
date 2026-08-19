/* ==========================================================================
   Finejust.vip - Production Live Search Engine (Central Data Layer)
   Brand: Finejust.vip
   Features:
   - Fetches /assets/data/tools.json & /assets/data/blogs.json
   - Instant search across all 30 tools and 20 articles
   - Global Ctrl+K & / keyboard hotkeys
   - Arrow navigation & Enter to launch
   ========================================================================== */

(function() {
  'use strict';

  let searchableDatabase = [];
  let isModalOpen = false;
  let selectedIndex = 0;

  const isSubdir = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/tools/') || window.location.pathname.includes('/author/');
  const rootPrefix = isSubdir ? '../' : '';

  // DOM Elements
  let modalBackdrop = null;
  let searchInput = null;
  let resultsContainer = null;

  async function loadSearchData() {
    if (searchableDatabase.length > 0) return;

    try {
      const [toolsRes, blogsRes] = await Promise.all([
        fetch(`${rootPrefix}assets/data/tools.json`),
        fetch(`${rootPrefix}assets/data/blogs.json`)
      ]);
      
      let allItems = [];
      if (toolsRes.ok) {
        const toolsData = await toolsRes.json();
        allItems = allItems.concat(toolsData.map(t => ({ ...t, itemType: 'Tool' })));
      }
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        allItems = allItems.concat(blogsData.map(b => ({ ...b, itemType: 'Guide', description: b.summary || b.description })));
      }

      searchableDatabase = allItems;
    } catch (e) {
      console.error('[FineJust Search] Failed to fetch search database from data layer:', e);
    }
  }

  function createSearchModal() {
    if (document.getElementById('search-modal-backdrop')) return;

    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'search-modal-backdrop';
    modalBackdrop.className = 'search-modal-backdrop';

    modalBackdrop.innerHTML = `
      <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search Tools and Guides">
        <div class="search-input-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="global-search-input" class="search-input" placeholder="Search 50+ tools & guides (e.g. SIP, BMI, Percentage, QR)..." autocomplete="off" spellcheck="false">
          <kbd class="kbd-shortcut" style="cursor:pointer;" id="close-search-btn">ESC</kbd>
        </div>
        <div class="search-results" id="search-results-list">
          <!-- Live injected search items -->
        </div>
        <div style="padding:0.75rem 1.25rem; border-top:1px solid var(--border-light); background:var(--bg-alt); display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
          <span><kbd class="kbd-shortcut">&uarr;</kbd> <kbd class="kbd-shortcut">&darr;</kbd> Navigate</span>
          <span><kbd class="kbd-shortcut">&#9166; Enter</kbd> Open Result</span>
          <span><kbd class="kbd-shortcut">ESC</kbd> Close</span>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    searchInput = document.getElementById('global-search-input');
    resultsContainer = document.getElementById('search-results-list');

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeSearch();
      }
    });

    document.getElementById('close-search-btn').addEventListener('click', closeSearch);

    searchInput.addEventListener('input', (e) => {
      renderResults(e.target.value.trim());
    });

    searchInput.addEventListener('keydown', handleKeyNavigation);
  }

  function openSearch(initialQuery = '') {
    if (!modalBackdrop) createSearchModal();
    modalBackdrop.classList.add('active');
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
    searchInput.value = initialQuery;
    renderResults(initialQuery);
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeSearch() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    isModalOpen = false;
    document.body.style.overflow = '';
  }

  function renderResults(query) {
    if (!resultsContainer) return;
    selectedIndex = 0;

    let filtered = searchableDatabase;
    if (query) {
      const q = query.toLowerCase();
      filtered = searchableDatabase.map(item => {
        let score = 0;
        const title = (item.title || item.name || '').toLowerCase();
        const desc = (item.description || item.summary || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        const keywords = item.keywords || [];

        if (title === q) score += 100;
        else if (title.startsWith(q)) score += 50;
        else if (title.includes(q)) score += 30;

        if (keywords.some(k => k.toLowerCase() === q)) score += 40;
        else if (keywords.some(k => k.toLowerCase().includes(q))) score += 20;

        if (cat.includes(q)) score += 15;
        if (desc.includes(q)) score += 10;

        return { item, score };
      }).filter(res => res.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(res => res.item);
    }

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted);">
          <p style="font-weight:600;">No matching results found for "${query}"</p>
          <p style="font-size:0.85rem; margin-top:0.35rem;">Try searching for SIP, ROI, Percentage, BMI, Calorie, or QR.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.slice(0, 10).forEach((item, index) => {
      const isSelected = index === 0;
      const title = item.title || item.name || '';
      let url = item.url || '';
      if (url.startsWith('/')) url = url.substring(1);
      const targetUrl = `${rootPrefix}${url}`;

      html += `
        <a href="${targetUrl}" class="search-item ${isSelected ? 'selected' : ''}" data-index="${index}" style="${isSelected ? 'background:var(--bg-alt);' : ''}">
          <div class="search-item-info">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="search-item-title">${title}</span>
              <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; padding:0.15rem 0.4rem; border-radius:4px; background:var(--primary-light); color:var(--primary);">${item.itemType}</span>
            </div>
            <span class="search-item-desc">${item.description || item.summary || ''}</span>
          </div>
          <span class="search-item-category">${item.category || ''}</span>
        </a>
      `;
    });

    resultsContainer.innerHTML = html;
  }

  function handleKeyNavigation(e) {
    const items = resultsContainer.querySelectorAll('.search-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeItem = items[selectedIndex] || items[0];
      if (activeItem) {
        window.location.href = activeItem.getAttribute('href');
      }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  }

  function updateSelection(items) {
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.style.background = 'var(--bg-alt)';
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.style.background = 'transparent';
      }
    });
  }

  // Global Key Listener for Ctrl+K and /
  document.addEventListener('keydown', (e) => {
    const pageToolsSearch = document.getElementById('tools-search-input');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (pageToolsSearch) {
        pageToolsSearch.focus();
        pageToolsSearch.select();
      } else {
        if (isModalOpen) closeSearch();
        else openSearch();
      }
    } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      if (pageToolsSearch) {
        pageToolsSearch.focus();
        pageToolsSearch.select();
      } else {
        openSearch();
      }
    }
  });

  // Attach search triggers across page
  document.addEventListener('DOMContentLoaded', () => {
    loadSearchData();

    document.querySelectorAll('[data-action="open-search"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    });

    // Hero search input integration
    const heroSearch = document.getElementById('hero-search-input');
    if (heroSearch) {
      heroSearch.addEventListener('click', () => {
        openSearch(heroSearch.value);
      });
      heroSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          openSearch(heroSearch.value);
        }
      });
    }
  });

  window.openGlobalSearch = openSearch;
  window.openSearchModal = openSearch;
  window.closeGlobalSearch = closeSearch;
})();
