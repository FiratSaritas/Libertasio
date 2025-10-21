/*! Cookie Banner v2 – fixed structure + proper init */

(function() {

  // === Translations ===
  const translations = {
    de: {
      text: "Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren, Funktionen für soziale Medien anzubieten und die Zugriffe auf unsere Website zu analysieren. Informationen zu Ihrer Nutzung unserer Website werden an unsere Partner für soziale Medien, Werbung und Analysen weitergegeben. <a href='/myself2/privacy' class='cookie-learn-link'>Mehr erfahren</a>.",
      accept: "Alle akzeptieren",
      customize: "Einstellungen",
      reject: "Nur notwendige Cookies verwenden",
      settingsText: "Hier können Sie Ihre Cookie-Einstellungen anpassen:",
      analyticsLabel: "Analytics-Cookies",
      analyticsDesc: "Sammeln technische Informationen über die Nutzung (z. B. Seitenaufrufe), um die Website zu verbessern.",
      marketingLabel: "Marketing-Cookies",
      marketingDesc: "Ermöglichen personalisierte Werbung und das Messen von Kampagnenleistung."
    },
    en: {
      text: "We use cookies to personalize content and ads, provide social media features, and analyze our traffic. Information about your use of our site is shared with our social media, advertising, and analytics partners. <a href='/myself2/privacy' class='cookie-learn-link'>Learn more</a>.",
      accept: "Accept all",
      customize: "Settings",
      reject: "Use necessary cookies only",
      settingsText: "Here you can adjust your cookie preferences:",
      analyticsLabel: "Analytics cookies",
      analyticsDesc: "Collect technical usage data (e.g. page views) to improve the site.",
      marketingLabel: "Marketing cookies",
      marketingDesc: "Enable personalized advertising and campaign measurement."
    }
  };

  // === Google Consent Mode ===
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied'
  });

  function loadGTM() {
    if (window.gtmDidLoad) return;
    window.gtmDidLoad = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TZ5G3ZTX';
    document.head.appendChild(s);
    s.onload = function() {
      gtag('js', new Date());
      gtag('config', 'G-EYH0GQ6ZCQ');
    };
  }

  function handleConsent(status) {
    const ad_storage = status === 'granted' ? 'granted' : 'denied';
    const analytics_storage = status === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage, analytics_storage });
    dataLayer.push({ event: 'consent_update', consent: { ad_storage, analytics_storage } });
    localStorage.setItem('cookie_consent', status);
    hideBanner();
    if (status === 'granted') loadGTM();
  }

  function hideBanner() {
    document.getElementById('cookie-banner').style.display = 'none';
    document.getElementById('cookie-button').style.display = 'block';
  }

  function showBanner() {
    document.getElementById('cookie-banner').style.display = 'block';
    document.getElementById('settings-panel').style.display = 'none';
    document.getElementById('cookie-button').style.display = 'none';
  }

  function openSettings() {
    document.getElementById('settings-panel').style.display = 'block';
  }

  function saveSettings() {
    const analytics = document.getElementById('cookie-analytics').checked;
    const marketing = document.getElementById('cookie-marketing').checked;
    const ad_storage = marketing ? 'granted' : 'denied';
    const analytics_storage = analytics ? 'granted' : 'denied';

    gtag('consent', 'update', { ad_storage, analytics_storage });
    dataLayer.push({
      event: 'consent_update',
      consent: { ad_storage, analytics_storage, categories: { necessary: true, analytics, marketing } }
    });

    localStorage.setItem('cookie_consent', (analytics || marketing) ? 'granted' : 'denied');
    hideBanner();
    if (ad_storage === 'granted' || analytics_storage === 'granted') loadGTM();
  }

  function switchLang(lang) {
    const t = translations[lang];
    if (!t) return;
    localStorage.setItem('lang', lang);
    document.getElementById('cookie-text').innerHTML = t.text;
    document.getElementById('accept-label').innerText = t.accept;
    document.getElementById('settings-btn').innerText = t.customize;
    document.getElementById('reject-btn').innerText = t.reject;
    document.getElementById('settings-text').innerText = t.settingsText;
    document.getElementById('analytics-label').innerText = t.analyticsLabel;
    document.getElementById('analytics-desc').innerText = t.analyticsDesc;
    document.getElementById('marketing-label').innerText = t.marketingLabel;
    document.getElementById('marketing-desc').innerText = t.marketingDesc;
  }

  function injectBanner() {
    const html = `
      <style>
        #cookie-banner{display:none;position:fixed;bottom:20px;left:20px;right:20px;max-width:1100px;margin:auto;background:#fff;padding:1rem 1.25rem;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.15);z-index:99999;font-family:sans-serif;font-size:0.95rem;line-height:1.4;}
        .cookie-learn-link{color:#1a73e8;text-decoration:underline;}
        .lang-btn{border:none;background:#f3f4f6;border-radius:6px;padding:4px 8px;margin:0 2px;cursor:pointer;}
        .cookie-btn{padding:0.5rem 0.9rem;border-radius:8px;border:1px solid #ccc;background:#f8f8f8;cursor:pointer;}
        .cookie-btn.primary{background:#007bff;color:#fff;border:none;}
        #settings-panel{display:none;margin-top:1rem;padding:0.9rem;border:1px solid #eee;border-radius:10px;background:#fafafa;}
        .cookie-row{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;padding:0.4rem 0;border-bottom:1px solid #eee;}
        .cookie-row:last-child{border-bottom:none;}
        #cookie-button{position:fixed;bottom:24px;left:24px;background:#007bff;color:#fff;border:none;border-radius:50%;width:54px;height:54px;font-size:22px;cursor:pointer;box-shadow:0 6px 15px rgba(0,0,0,0.3);display:none;}
      </style>

      <div id="cookie-banner">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
          <div style="flex:1;">
            <strong style="font-size:1.05rem;">Cookie-Einstellungen</strong>
            <p id="cookie-text" style="margin:0.5rem 0;">Wir verwenden Cookies ... <a href="/myself2/privacy" class="cookie-learn-link">Mehr erfahren</a>.</p>
          </div>
          <div style="text-align:right;">
            <div>
              <button class="lang-btn" onclick="switchLang('de')">DE</button>
              <button class="lang-btn" onclick="switchLang('en')">EN</button>
            </div>
            <div style="margin-top:0.5rem;">
              <button id="settings-btn" class="cookie-btn" onclick="openSettings()">Einstellungen</button>
              <button id="accept-btn" class="cookie-btn primary" onclick="handleConsent('granted')"><span id="accept-label">Alle akzeptieren</span></button>
            </div>
          </div>
        </div>

        <div id="settings-panel">
          <p id="settings-text" style="font-weight:600;">Hier können Sie Ihre Cookie-Einstellungen anpassen:</p>

          <div class="cookie-row">
            <div><strong>Notwendige Cookies</strong><br><small>Diese Cookies sind erforderlich und können nicht deaktiviert werden.</small></div>
            <input type="checkbox" checked disabled />
          </div>

          <div class="cookie-row">
            <div><strong id="analytics-label">Analytics-Cookies</strong><br><small id="analytics-desc">Sammeln technische Informationen zur Nutzung.</small></div>
            <input type="checkbox" id="cookie-analytics" />
          </div>

          <div class="cookie-row">
            <div><strong id="marketing-label">Marketing-Cookies</strong><br><small id="marketing-desc">Ermöglichen personalisierte Werbung.</small></div>
            <input type="checkbox" id="cookie-marketing" />
          </div>

          <div style="text-align:right;margin-top:0.8rem;">
            <button id="reject-btn" class="cookie-btn" onclick="handleConsent('denied')">Nur notwendige Cookies verwenden</button>
            <button class="cookie-btn primary" onclick="saveSettings()">Speichern</button>
          </div>
        </div>
      </div>

      <button id="cookie-button" onclick="showBanner()">🍪</button>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // === Init ===
  window.addEventListener('DOMContentLoaded', () => {
    injectBanner();
    const stored = localStorage.getItem('cookie_consent');
    if (!stored) {
      document.getElementById('cookie-banner').style.display = 'block';
      switchLang(localStorage.getItem('lang') || 'de');
    } else {
      document.getElementById('cookie-button').style.display = 'block';
      if (stored === 'granted') loadGTM();
    }
  });

  // Make functions global for button onclicks
  window.handleConsent = handleConsent;
  window.openSettings = openSettings;
  window.switchLang = switchLang;
  window.saveSettings = saveSettings;
  window.showBanner = showBanner;

})();
