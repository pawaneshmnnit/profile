/**
 * conferences-loader.js
 *
 * Fetches conferences.json and renders the list into an element on your main page.
 *
 * USAGE on your main page (e.g. index.html):
 *
 *   1. Find your existing "Conferences" section. Wherever the list of papers
 *      currently appears, put an empty container with this id:
 *
 *        <div id="conferences-list"></div>
 *
 *   2. Before </body> on that page, add:
 *
 *        <script src="conferences-loader.js"></script>
 *
 *   3. Done — the script will fetch conferences.json from the same directory
 *      and render an entry per paper.
 *
 * You can change the container id or the data URL by editing the config below.
 */
(function () {
  'use strict';

  var CONFIG = {
    containerId: 'conferences-list',
    dataUrl: 'conferences.json'
  };

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(papers, container) {
    if (!papers || papers.length === 0) {
      container.innerHTML = '<p><em>No conference papers listed yet.</em></p>';
      return;
    }

    // Sort by year desc
    var sorted = papers.slice().sort(function (a, b) {
      return (b.year || 0) - (a.year || 0);
    });

    var html = '<ol class="conference-papers">';
    sorted.forEach(function (p) {
      html += '<li class="conf-paper">';
      html += '<div class="conf-title"><strong>' + escapeHtml(p.title) + '</strong></div>';
      html += '<div class="conf-authors">' + escapeHtml(p.authors) + '</div>';
      html += '<div class="conf-venue"><em>' + escapeHtml(p.venue) + '</em>';
      if (p.year) html += ', ' + escapeHtml(p.year);
      if (p.location) html += ' &middot; ' + escapeHtml(p.location);
      html += '</div>';
      if (p.description) {
        html += '<div class="conf-desc">' + escapeHtml(p.description) + '</div>';
      }
      var links = [];
      if (p.link) links.push('<a href="' + escapeHtml(p.link) + '" target="_blank" rel="noopener">Paper</a>');
      if (p.doi)  links.push('<a href="https://doi.org/' + escapeHtml(p.doi) + '" target="_blank" rel="noopener">DOI</a>');
      if (links.length) html += '<div class="conf-links">' + links.join(' &middot; ') + '</div>';
      html += '</li>';
    });
    html += '</ol>';
    container.innerHTML = html;
  }

  function init() {
    var container = document.getElementById(CONFIG.containerId);
    if (!container) return;

    // Cache-bust so fresh commits show immediately
    var url = CONFIG.dataUrl + '?t=' + Date.now();

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) { render(data.papers || [], container); })
      .catch(function (err) {
        container.innerHTML = '<p><em>Could not load conferences list.</em></p>';
        console.error('conferences-loader:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
