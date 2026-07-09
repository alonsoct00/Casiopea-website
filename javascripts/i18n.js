/*

Casiopea i18n
Vanilla JS, no dependencies. Spanish is the default/fallback language and is
already hardcoded in every page's markup — this script only overwrites text
when the active language is not Spanish, or when fetched locale data differs
from the hardcoded default. See docs/12-architecture-design.md.

*/

(function () {
  "use strict";

  var STORAGE_KEY = "casiopea-lang";
  var DEFAULT_LANG = "es";

  function getBase() {
    var scriptEl =
      document.currentScript ||
      document.querySelector('script[src*="i18n.js"]');
    var src = scriptEl ? scriptEl.getAttribute("src") : "javascripts/i18n.js";
    return src.replace(/javascripts\/i18n\.js.*$/, "");
  }

  var BASE = getBase();

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // localStorage unavailable (private mode, etc.) — language just won't persist
    }
  }

  function getValue(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && typeof acc === "object" ? acc[key] : undefined;
    }, obj);
  }

  var interpolateVars = { year: new Date().getFullYear() };

  function interpolate(str) {
    if (typeof str !== "string") return str;
    return str.replace(/\{\{\s*(\w+)\s*\}\}/g, function (_, key) {
      return key in interpolateVars ? interpolateVars[key] : "";
    });
  }

  var activeLocale = null;
  var activeLang = DEFAULT_LANG;

  var localeCache = {};
  function loadLocale(lang) {
    if (localeCache[lang]) return Promise.resolve(localeCache[lang]);
    return fetch(BASE + "locales/" + lang + ".json")
      .then(function (res) {
        if (!res.ok) throw new Error("locale fetch failed: " + res.status);
        return res.json();
      })
      .then(function (data) {
        localeCache[lang] = data;
        return data;
      });
  }

  var projectsContentCache = null;
  function loadProjectsContent() {
    if (projectsContentCache) return Promise.resolve(projectsContentCache);
    return fetch(BASE + "content/projects.json")
      .then(function (res) {
        if (!res.ok) throw new Error("content fetch failed: " + res.status);
        return res.json();
      })
      .then(function (data) {
        projectsContentCache = data;
        return data;
      });
  }

  var ATTR_MAP = {
    "data-i18n-placeholder": "placeholder",
    "data-i18n-alt": "alt",
    "data-i18n-title": "title",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-value": "value"
  };

  // Runs once, before the first translation pass. The hardcoded HTML text is
  // the Spanish value for data-i18n-en(-html) elements, but once we overwrite
  // it (switching to English) it's gone unless we stash it first — so capture
  // it into data-i18n-es(-html) up front, if the page didn't already set one.
  var originalSpanishCaptured = false;
  function captureOriginalSpanish() {
    if (originalSpanishCaptured) return;
    originalSpanishCaptured = true;
    document.querySelectorAll("[data-i18n-en]:not([data-i18n-es])").forEach(function (el) {
      el.setAttribute("data-i18n-es", el.textContent);
    });
    document.querySelectorAll("[data-i18n-en-html]:not([data-i18n-es-html])").forEach(function (el) {
      el.setAttribute("data-i18n-es-html", el.innerHTML);
    });
  }

  function applyTranslations(locale, lang) {
    captureOriginalSpanish();
    activeLocale = locale;
    activeLang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = getValue(locale, el.getAttribute("data-i18n"));
      if (val !== undefined) el.textContent = interpolate(val);
    });

    Object.keys(ATTR_MAP).forEach(function (dataAttr) {
      var attr = ATTR_MAP[dataAttr];
      document.querySelectorAll("[" + dataAttr + "]").forEach(function (el) {
        var val = getValue(locale, el.getAttribute(dataAttr));
        if (val !== undefined) el.setAttribute(attr, interpolate(val));
      });
    });

    // Inline dual-attribute translations: project credit labels, FAQ, and other
    // one-off strings that don't warrant a shared locale key (see
    // docs/content-inventory.md section B). The hardcoded text in the HTML is
    // the Spanish value; data-i18n-en supplies the English swap.
    document.querySelectorAll("[data-i18n-en]").forEach(function (el) {
      if (lang === "en") {
        el.textContent = el.getAttribute("data-i18n-en");
      } else if (el.hasAttribute("data-i18n-es")) {
        el.textContent = el.getAttribute("data-i18n-es");
      }
    });

    // Same idea, but for text runs that contain inline markup (e.g. links)
    // that a plain textContent swap would destroy. The attribute value is
    // trusted HTML written by hand in this codebase, not user input.
    document.querySelectorAll("[data-i18n-en-html]").forEach(function (el) {
      if (lang === "en") {
        el.innerHTML = el.getAttribute("data-i18n-en-html");
      } else if (el.hasAttribute("data-i18n-es-html")) {
        el.innerHTML = el.getAttribute("data-i18n-es-html");
      }
    });

    var pageKey = document.documentElement.getAttribute("data-seo-key");
    if (pageKey) {
      var seo = getValue(locale, "seo." + pageKey);
      if (seo) {
        if (seo.title) document.title = seo.title;
        if (seo.description) {
          var metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute("content", seo.description);
        }
      }
    }
  }

  function applyProjectTechnique(lang) {
    var slug = document.body.getAttribute("data-project-slug");
    if (!slug) return Promise.resolve();
    return loadProjectsContent().then(function (data) {
      var entry = data[slug];
      if (!entry || !entry.technique) return;
      var el = document.querySelector("[data-technique-value]");
      if (el) el.textContent = entry.technique[lang] || entry.technique.es || "";
    });
  }

  function revealPage() {
    document.documentElement.classList.remove("i18n-pending");
  }

  function updateSwitcherUI(lang) {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      btn.classList.toggle("active", isActive);
    });
  }

  function announceLangChange(locale, lang) {
    var announcer = document.getElementById("i18n-announcer");
    if (!announcer) return;
    var key = "langSwitch." + (lang === "es" ? "announceEs" : "announceEn");
    var msg = getValue(locale, key);
    if (msg) announcer.textContent = msg;
  }

  function applyLang(lang, opts) {
    opts = opts || {};
    document.documentElement.setAttribute("lang", lang);
    updateSwitcherUI(lang);

    var work = loadLocale(lang)
      .then(function (locale) {
        applyTranslations(locale, lang);
        if (opts.persist) announceLangChange(locale, lang);
        return applyProjectTechnique(lang);
      })
      .catch(function () {
        // Fetch failed: never leave the page untranslated/blank — fall back to
        // the Spanish text already hardcoded in the HTML.
        document.documentElement.setAttribute("lang", DEFAULT_LANG);
        updateSwitcherUI(DEFAULT_LANG);
      })
      .then(revealPage);

    if (opts.persist) setStoredLang(lang);
    return work;
  }

  function wireSwitcher() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".lang-btn");
      if (!btn) return;
      var lang = btn.getAttribute("data-lang");
      if (!lang || lang === getLang()) return;
      applyLang(lang, { persist: true });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireSwitcher();
    var lang = getLang();

    if (lang === DEFAULT_LANG) {
      // Spanish is already painted in the HTML (nothing was hidden by the
      // FOUC-prevention script for this path) — just sync JSON as the source
      // of truth and update the switcher UI, no reveal needed.
      updateSwitcherUI(lang);
      loadLocale(lang)
        .then(function (locale) {
          applyTranslations(locale, lang);
        })
        .catch(function () {});
    } else {
      applyLang(lang, { persist: false });
    }
  });

  // Small public API for other scripts (e.g. validation.js) that need a
  // translated string outside the declarative data-i18n bindings above.
  window.CasiopeaI18n = {
    t: function (key, fallback) {
      var val = activeLocale ? getValue(activeLocale, key) : undefined;
      return val !== undefined ? interpolate(val) : fallback;
    },
    getLang: getLang
  };
})();
