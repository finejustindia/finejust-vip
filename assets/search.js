/* ==========================================================================
   Finejust.vip - Production Instant Live Search Engine
   Brand: Finejust.vip
   Features:
   - Ctrl+K and '/' global keyboard hotkeys
   - Instant fuzzy keyword & category filtering from tools.json
   - Keyboard arrow navigation (Up/Down) & Enter to open first result
   ========================================================================== */

(function() {
  'use strict';

  let toolsDatabase = [];
  let isModalOpen = false;
  let selectedIndex = 0;

  const isSubdir = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/tools/');
  const rootPrefix = isSubdir ? '../' : '';

  // DOM Elements
  let modalBackdrop = null;
  let searchInput = null;
  let resultsContainer = null;

  async function loadTools() {
    if (window.FINEJUST_TOOLS && window.FINEJUST_TOOLS.length > 0) {
      toolsDatabase = window.FINEJUST_TOOLS;
      return;
    }
    try {
      const response = await fetch(`${rootPrefix}assets/tools.json`);
      if (response.ok) {
        toolsDatabase = await response.json();
      }
    } catch (e) {
      if (window.FINEJUST_TOOLS) {
        toolsDatabase = window.FINEJUST_TOOLS;
      }
    }
  }

  function createSearchModal() {
    if (document.getElementById('search-modal-backdrop')) return;

    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'search-modal-backdrop';
    modalBackdrop.className = 'search-modal-backdrop';

    modalBackdrop.innerHTML = `
      <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search Tools">
        <div class="search-input-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="global-search-input" class="search-input" placeholder="Search 35+ tools (e.g. BMI, Percentage, QR, EMI)..." autocomplete="off" spellcheck="false">
          <kbd class="kbd-shortcut" style="cursor:pointer;" id="close-search-btn">ESC</kbd>
        </div>
        <div class="search-results" id="search-results-list">
          <!-- Live injected search items -->
        </div>
        <div style="padding:0.75rem 1.25rem; border-top:1px solid var(--border-light); background:var(--bg-alt); display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
          <span><kbd class="kbd-shortcut">&uarr;</kbd> <kbd class="kbd-shortcut">&darr;</kbd> Navigate</span>
          <span><kbd class="kbd-shortcut">&#9166; Enter</kbd> Open Tool</span>
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

    let filtered = toolsDatabase;
    if (query) {
      const q = query.toLowerCase();
      filtered = toolsDatabase.map(tool => {
        let score = 0;
        const title = (tool.title || tool.name || '').toLowerCase();
        const desc = (tool.description || '').toLowerCase();
        const cat = (tool.category || '').toLowerCase();
        const keywords = tool.keywords || [];

        if (title === q) score += 100;
        else if (title.startsWith(q)) score += 50;
        else if (title.includes(q)) score += 30;

        if (keywords.some(k => k.toLowerCase() === q)) score += 40;
        else if (keywords.some(k => k.toLowerCase().includes(q))) score += 20;

        if (cat.includes(q)) score += 15;
        if (desc.includes(q)) score += 10;
        if (tool.popular || tool.trending) score += 5;

        return { tool, score };
      }).filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.tool);
    }

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding:2rem 1rem; text-align:center; color:var(--text-muted);">
          <p style="font-weight:600;">No matching tools found for "${query}"</p>
          <p style="font-size:0.85rem; margin-top:0.35rem;">Try searching for Percentage, BMI, EMI, Speed, or QR.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.slice(0, 10).forEach((tool, index) => {
      const isSelected = index === 0;
      const title = tool.title || tool.name || '';
      const targetUrl = `${rootPrefix}${tool.url || `tools/${tool.id}.html`}`;

      html += `
        <a href="${targetUrl}" class="search-item ${isSelected ? 'selected' : ''}" data-index="${index}" style="${isSelected ? 'background:var(--bg-alt);' : ''}">
          <div class="search-item-info">
            <span class="search-item-title">${title}</span>
            <span class="search-item-desc">${tool.description}</span>
          </div>
          <span class="search-item-category">${tool.category}</span>
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
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isModalOpen) closeSearch();
      else openSearch();
    } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
  });

  // Attach search triggers across page
  document.addEventListener('DOMContentLoaded', () => {
    loadTools();

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
