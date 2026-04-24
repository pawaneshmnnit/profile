// site-loader.js (FIXED VERSION)

(function () {
  'use strict';

  var CONFIG = { dataUrl: 'site-data.json' };
  var data = {};
  var currentLang = 'en';

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- SAFE GET ----------
  function safe(val, fallback = '') {
    return val != null ? val : fallback;
  }

  // ---------- ABOUT ----------
  function renderAbout() {
    var el = document.getElementById('about-text');
    if (!el) return;

    var text = safe(data?.about?.[currentLang], safe(data?.about?.en, ''));
    el.textContent = text || 'No information available.';
  }

  // ---------- EXPERIENCE ----------
  function renderExperience() {
    var el = document.getElementById('experience-items');
    if (!el) return;

    var items = data?.experience || [];

    if (!items.length) {
      el.innerHTML = '<p class="text-gray-500 italic">No experience entries.</p>';
      return;
    }

    el.innerHTML = items.map(function (it, idx) {
      return `
        <div class="timeline-item ${idx < items.length - 1 ? 'mb-10' : ''}">
          <p class="text-sm text-gray-500 dark:text-gray-400">${escapeHtml(safe(it.period))}</p>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${escapeHtml(safe(it.title))}</h3>
          ${it.organization ? `<p class="text-md text-gray-600 dark:text-gray-300">${escapeHtml(it.organization)}</p>` : ''}
        </div>
      `;
    }).join('');
  }

  // ---------- EDUCATION ----------
  function renderEducation() {
    var el = document.getElementById('education-items');
    if (!el) return;

    var items = data?.education || [];

    if (!items.length) {
      el.innerHTML = '<p class="text-gray-500 italic">No education entries.</p>';
      return;
    }

    el.innerHTML = items.map(function (it, idx) {
      return `
        <div class="timeline-item ${idx < items.length - 1 ? 'mb-10' : ''}">
          <p class="text-sm text-gray-500 dark:text-gray-400">${escapeHtml(safe(it.period))}</p>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${escapeHtml(safe(it.degree))}</h3>
          ${it.institution ? `<p class="text-md text-gray-600 dark:text-gray-300">${escapeHtml(it.institution)}</p>` : ''}
        </div>
      `;
    }).join('');
  }

  // ---------- SKILLS ----------
  var VALID_COLORS = ['blue','green','yellow','purple','red','pink','indigo','teal'];

  function renderSkills() {
    var el = document.getElementById('skills-groups');
    if (!el) return;

    var groups = data?.skills || [];

    if (!groups.length) {
      el.innerHTML = '<p class="text-gray-500 italic text-center">No skills.</p>';
      return;
    }

    el.innerHTML = groups.map(function (g) {
      var color = VALID_COLORS.includes(g.color) ? g.color : 'blue';

      var tags = (g.tags || []).map(t => `
        <span class="bg-${color}-100 text-${color}-800 px-2 py-1 rounded text-sm dark:bg-${color}-900 dark:text-${color}-300">
          ${escapeHtml(t)}
        </span>
      `).join('');

      return `
        <div>
          <h3 class="text-xl font-semibold mb-3">${escapeHtml(safe(g.label))}</h3>
          <div class="flex flex-wrap gap-2">${tags}</div>
        </div>
      `;
    }).join('');
  }

  // ---------- AWARDS / CERT ----------
  function renderList(id, items) {
    var el = document.getElementById(id);
    if (!el) return;

    if (!items?.length) {
      el.innerHTML = '<li class="text-gray-500 italic">No entries.</li>';
      return;
    }

    el.innerHTML = items.map(function (it) {
      return `
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <li><strong>${escapeHtml(safe(it.title))}:</strong> ${escapeHtml(safe(it.description))}</li>
          ${it.link ? `<a href="${escapeHtml(it.link)}" target="_blank" class="text-blue-500">Link</a>` : ''}
        </div>
      `;
    }).join('');
  }

  function renderAwards() {
    renderList('awards-items', data?.awards);
  }

  function renderCertifications() {
    renderList('certifications-items', data?.certifications);
  }

  // ---------- PUBLICATIONS ----------
  function renderPublications() {
    var pubs = data?.publications || [];

    var groups = { journal: [], conference: [], poster: [] };

    pubs.forEach(p => {
      if (groups[p.type]) groups[p.type].push(p);
    });

    var targets = {
      journal: 'journal-items',
      conference: 'conference-items',
      poster: 'poster-items'
    };

    Object.keys(targets).forEach(type => {
      var el = document.getElementById(targets[type]);
      if (!el) return;

      var list = groups[type];

      if (!list.length) {
        el.innerHTML = '<p class="text-gray-500">No entries.</p>';
        return;
      }

      el.innerHTML = list.map(it => `
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p>${escapeHtml(safe(it.citation))}</p>
          ${it.link ? `<a href="${escapeHtml(it.link)}" target="_blank">Link</a>` : ''}
        </div>
      `).join('');
    });
  }

  // ---------- MAIN ----------
  function renderAll() {
    renderAbout();
    renderExperience();
    renderEducation();
    renderSkills();
    renderAwards();
    renderCertifications();
    renderPublications();
  }

  function fetchData() {
    currentLang = localStorage.getItem('language') || 'en';

    fetch(CONFIG.dataUrl + '?t=' + Date.now())
      .then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(json => {
        data = json || {};
        renderAll();
      })
      .catch(err => {
        console.error('Loader error:', err);

        document.querySelectorAll('#content-area *').forEach(el => {
          if (el.innerText === 'Loading…') {
            el.innerText = 'Failed to load data';
          }
        });
      });
  }

  window.SiteLoader = {
    setLanguage: function (lang) {
      currentLang = lang || 'en';
      renderAbout();
    },
    reload: fetchData
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchData);
  } else {
    fetchData();
  }

})();
