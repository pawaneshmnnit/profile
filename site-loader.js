/**
 * site-loader.js — renders every dynamic section on the main page from site-data.json.
 *
 * Exposes: window.SiteLoader.setLanguage(lang) so the existing switchLanguage()
 * function can notify it to re-render the About text.
 *
 * Containers expected in index.html (all optional — loader only fills what it finds):
 *   #about-text
 *   #experience-items
 *   #education-items
 *   #skills-groups
 *   #awards-items
 *   #certifications-items
 *   #journal-items, #conference-items, #poster-items
 */
(function () {
  'use strict';

  var CONFIG = { dataUrl: 'site-data.json' };
  var data = null;
  var currentLang = 'en';

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- ABOUT ----------
  function renderAbout() {
    var el = document.getElementById('about-text');
    if (!el || !data || !data.about) return;
    var text = data.about[currentLang] || data.about.en || '';
    el.textContent = text;
  }

  // ---------- EXPERIENCE ----------
  function renderExperience() {
    var el = document.getElementById('experience-items');
    if (!el || !data) return;
    var items = data.experience || [];
    if (items.length === 0) {
      el.innerHTML = '<p class="text-gray-500 italic">No experience entries yet.</p>';
      return;
    }
    el.innerHTML = items.map(function (it, idx) {
      var mb = (idx < items.length - 1) ? 'mb-10' : '';
      return (
        '<div class="timeline-item ' + mb + '">' +
          '<p class="text-sm text-gray-500 dark:text-gray-400">' + escapeHtml(it.period) + '</p>' +
          '<h3 class="text-xl font-semibold text-gray-900 dark:text-white">' + escapeHtml(it.title) + '</h3>' +
          (it.organization ? '<p class="text-md text-gray-600 dark:text-gray-300">' + escapeHtml(it.organization) + '</p>' : '') +
        '</div>'
      );
    }).join('');
  }

  // ---------- EDUCATION ----------
  function renderEducation() {
    var el = document.getElementById('education-items');
    if (!el || !data) return;
    var items = data.education || [];
    if (items.length === 0) {
      el.innerHTML = '<p class="text-gray-500 italic">No education entries yet.</p>';
      return;
    }
    el.innerHTML = items.map(function (it, idx) {
      var mb = (idx < items.length - 1) ? 'mb-10' : '';
      return (
        '<div class="timeline-item ' + mb + '">' +
          '<p class="text-sm text-gray-500 dark:text-gray-400">' + escapeHtml(it.period) + '</p>' +
          '<h3 class="text-xl font-semibold text-gray-900 dark:text-white">' + escapeHtml(it.degree) + '</h3>' +
          (it.institution ? '<p class="text-md text-gray-600 dark:text-gray-300">' + escapeHtml(it.institution) + '</p>' : '') +
        '</div>'
      );
    }).join('');
  }

  // ---------- SKILLS ----------
  var VALID_COLORS = ['blue','green','yellow','purple','red','pink','indigo','teal'];
  function renderSkills() {
    var el = document.getElementById('skills-groups');
    if (!el || !data) return;
    var groups = data.skills || [];
    if (groups.length === 0) {
      el.innerHTML = '<p class="text-gray-500 italic col-span-full text-center">No skills yet.</p>';
      return;
    }
    el.innerHTML = groups.map(function (g) {
      var color = VALID_COLORS.indexOf(g.color) !== -1 ? g.color : 'blue';
      var tagsHtml = (g.tags || []).map(function (t) {
        return '<span class="bg-' + color + '-100 text-' + color + '-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-' + color + '-900 dark:text-' + color + '-300">' + escapeHtml(t) + '</span>';
      }).join('');
      return (
        '<div>' +
          '<h3 class="text-xl font-semibold mb-3">' + escapeHtml(g.label) + '</h3>' +
          '<div class="flex flex-wrap gap-2">' + tagsHtml + '</div>' +
        '</div>'
      );
    }).join('');
  }

  // ---------- AWARDS / CERTIFICATIONS ----------
  function renderAwardLike(containerId, items) {
    var el = document.getElementById(containerId);
    if (!el) return;
    if (!items || items.length === 0) {
      el.innerHTML = '<li class="text-gray-500 italic">No entries yet.</li>';
      return;
    }
    el.innerHTML = items.map(function (it) {
      var linkHtml = '';
      if (it.link && it.link.trim()) {
        linkHtml =
          '<span class="mt-2 flex space-x-4 text-lg">' +
            '<a href="' + escapeHtml(it.link) + '" target="_blank" rel="noopener"' +
              ' class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200" title="Link">' +
              '<i class="fas fa-link"></i>' +
            '</a>' +
          '</span>';
      }
      return (
        '<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">' +
          '<li><span class="font-semibold">' + escapeHtml(it.title) + ':</span> ' + escapeHtml(it.description) + '</li>' +
          linkHtml +
        '</div>'
      );
    }).join('');
  }

  function renderAwards() {
    renderAwardLike('awards-items', data && data.awards);
  }
  function renderCertifications() {
    renderAwardLike('certifications-items', data && data.certifications);
  }

  // ---------- PUBLICATIONS ----------
  function renderPublications() {
    if (!data || !data.publications) return;
    var groups = { journal: [], conference: [], poster: [] };
    data.publications.forEach(function (p) {
      if (groups[p.type]) groups[p.type].push(p);
    });
    // newest first by 4-digit year in citation
    var yearOf = function (p) {
      var m = p.citation && p.citation.match(/\b(19|20)\d{2}\b/);
      return m ? parseInt(m[0], 10) : 0;
    };
    Object.keys(groups).forEach(function (t) {
      groups[t].sort(function (a, b) { return yearOf(b) - yearOf(a); });
    });

    var targets = { journal: 'journal-items', conference: 'conference-items', poster: 'poster-items' };
    Object.keys(targets).forEach(function (type) {
      var el = document.getElementById(targets[type]);
      if (!el) return;
      var list = groups[type];
      if (list.length === 0) {
        el.innerHTML = '<div class="p-4 text-gray-500 dark:text-gray-400 italic">No entries yet.</div>';
        return;
      }
      el.innerHTML = list.map(function (it) {
        var links = [];
        if (it.link && it.link.trim()) {
          links.push(
            '<a href="' + escapeHtml(it.link) + '" target="_blank" rel="noopener"' +
            ' class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200" title="Link">' +
            '<i class="fas fa-link"></i></a>'
          );
        }
        if (it.github && it.github.trim()) {
          links.push(
            '<a href="' + escapeHtml(it.github) + '" target="_blank" rel="noopener"' +
            ' class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" title="GitHub Code">' +
            '<i class="fab fa-github"></i></a>'
          );
        }
        var linksHtml = links.length ?
          '<span class="mt-2 flex space-x-4 text-lg">' + links.join('') + '</span>' : '';
        return (
          '<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">' +
            '<p class="mt-2">' + escapeHtml(it.citation) + '</p>' +
            linksHtml +
          '</div>'
        );
      }).join('');
    });
  }

  // ---------- PUBLIC API ----------
  var SiteLoader = {
    setLanguage: function (lang) {
      currentLang = lang || 'en';
      renderAbout();
    },
    reload: function () { fetchAndRender(); }
  };
  window.SiteLoader = SiteLoader;

  // ---------- BOOT ----------
  function fetchAndRender() {
    currentLang = localStorage.getItem('language') || 'en';
    fetch(CONFIG.dataUrl + '?t=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
        data = json || {};
        renderAbout();
        renderExperience();
        renderEducation();
        renderSkills();
        renderAwards();
        renderCertifications();
        renderPublications();
      })
      .catch(function (err) {
        console.error('site-loader:', err);
        var box = document.getElementById('about-text');
        if (box) box.textContent = 'Could not load site content.';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchAndRender);
  } else {
    fetchAndRender();
  }
})();
