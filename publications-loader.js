/**
 * publications-loader.js
 *
 * Fetches publications.json and renders Journal / Conference / Poster
 * items into the three existing containers on index.html.
 *
 * Requires these empty containers in your HTML (see integration notes):
 *   <div id="journal-items"></div>
 *   <div id="conference-items"></div>
 *   <div id="poster-items"></div>
 */
(function () {
  'use strict';

  var CONFIG = {
    dataUrl: 'publications.json',
    containers: {
      journal: 'journal-items',
      conference: 'conference-items',
      poster: 'poster-items'
    }
  };

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderItem(item) {
    var html = '<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">';
    html += '<p class="mt-2">' + escapeHtml(item.citation) + '</p>';

    var hasLinks = (item.link && item.link.trim()) || (item.github && item.github.trim());
    if (hasLinks) {
      html += '<span class="mt-2 flex space-x-4 text-lg">';
      if (item.link && item.link.trim()) {
        html += '<a href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener"' +
                ' class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"' +
                ' title="Link"><i class="fas fa-link"></i></a>';
      }
      if (item.github && item.github.trim()) {
        html += '<a href="' + escapeHtml(item.github) + '" target="_blank" rel="noopener"' +
                ' class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"' +
                ' title="GitHub Code"><i class="fab fa-github"></i></a>';
      }
      html += '</span>';
    }
    html += '</div>';
    return html;
  }

  function render(items) {
    var groups = { journal: [], conference: [], poster: [] };
    (items || []).forEach(function (it) {
      if (groups[it.type]) groups[it.type].push(it);
    });

    // Sort each group: newest first — extract 4-digit year from citation as best-effort.
    Object.keys(groups).forEach(function (type) {
      groups[type].sort(function (a, b) {
        var ya = (a.citation.match(/\b(19|20)\d{2}\b/) || [])[0] || '0';
        var yb = (b.citation.match(/\b(19|20)\d{2}\b/) || [])[0] || '0';
        return parseInt(yb, 10) - parseInt(ya, 10);
      });
    });

    Object.keys(CONFIG.containers).forEach(function (type) {
      var el = document.getElementById(CONFIG.containers[type]);
      if (!el) return;
      if (groups[type].length === 0) {
        el.innerHTML = '<div class="p-4 text-gray-500 dark:text-gray-400 italic">No entries yet.</div>';
      } else {
        el.innerHTML = groups[type].map(renderItem).join('');
      }
    });
  }

  function init() {
    // Only run on pages that actually have the containers
    var anyContainer = Object.values(CONFIG.containers).some(function (id) {
      return document.getElementById(id);
    });
    if (!anyContainer) return;

    var url = CONFIG.dataUrl + '?t=' + Date.now(); // cache-bust
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) { render(data.items || []); })
      .catch(function (err) {
        console.error('publications-loader:', err);
        Object.values(CONFIG.containers).forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.innerHTML = '<div class="p-4 text-red-600 italic">Could not load publications.</div>';
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
