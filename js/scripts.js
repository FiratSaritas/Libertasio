/*! 
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/

// ================= Cookie Banner + Consent ===================

// Translations for banner text
const translations = {
  de: {
    text: "Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren, Funktionen für soziale Medien anzubieten und die Zugriffe auf unsere Website zu analysieren. Informationen zu Ihrer Nutzung unserer Website werden an unsere Partner für soziale Medien, Werbung und Analysen weitergegeben. <a href='/myself2/privacy'>Mehr erfahren</a>.",
    accept: "Alle akzeptieren",
    customize: "Einstellungen",
    reject: "Nur notwendige Cookies verwenden",
    settingsText: "Hier können Sie Ihre Cookie-Einstellungen anpassen:"
  },
  en: {
    text: "We use cookies to personalize content and ads, provide social media features, and analyze our traffic. Information about your use of our site is shared with our social media, advertising, and analytics partners. <a href='/myself2/privacy'>Learn more</a>.",
    accept: "Accept all",
    customize: "Settings",
    reject: "Use necessary cookies only",
    settingsText: "Here you can adjust your cookie preferences:"
  },
  it: {
    text: "Utilizziamo i cookie per personalizzare contenuti e annunci, fornire funzionalità dei social media e analizzare il nostro traffico. Le informazioni sull'utilizzo del sito sono condivise con i nostri partner di social media, pubblicità e analisi. <a href='/myself2/privacy'>Scopri di più</a>.",
    accept: "Accetta tutto",
    customize: "Impostazioni",
    reject: "Usa solo cookie necessari",
    settingsText: "Qui puoi modificare le tue preferenze sui cookie:"
  },
  fr: {
    text: "Nous utilisons des cookies pour personnaliser le contenu et les publicités, offrir des fonctionnalités de médias sociaux et analyser notre trafic. Les informations sur votre utilisation de notre site sont partagées avec nos partenaires de médias sociaux, de publicité et d’analyse. <a href='/myself2/privacy'>En savoir plus</a>.",
    accept: "Tout accepter",
    customize: "Paramètres",
    reject: "Utiliser uniquement les cookies nécessaires",
    settingsText: "Ici, vous pouvez ajuster vos préférences en matière de cookies :"
  }
};

// Google gtag Consent Mode setup
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

// Default (before user action) – everything denied
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied'
});

// Handle consent choice
function handleConsent(status) {
  gtag('consent', 'update', {
    'ad_storage': status,
    'analytics_storage': status
  });

  const banner = document.getElementById('cookie-banner');
  if (banner) banner.style.display = 'none';

  localStorage.setItem('cookie_consent', status);
  console.log("✅ Cookie consent set to:", status);
}

// Open settings panel
function openSettings() {
  const panel = document.getElementById('settings-panel');
  if (panel) panel.style.display = 'block';
}

// Switch language dynamically
function switchLang(lang) {
  const t = translations[lang];
  if (!t) return;
  document.getElementById('cookie-text').innerHTML = t.text;
  document.getElementById('accept-label').innerText = t.accept;
  document.getElementById('settings-btn').innerText = t.customize;
  document.getElementById('reject-btn').innerText = t.reject;
  document.getElementById('settings-text').innerText = t.settingsText;
}

// Inject the banner automatically on all pages
window.addEventListener('DOMContentLoaded', function () {
  const storedConsent = localStorage.getItem('cookie_consent');
  if (storedConsent) {
    console.log("ℹ️ Consent already stored:", storedConsent);
    return;
  }

  // Banner HTML
  const bannerHTML = `
    <div id="cookie-banner" style="
      display:block;
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      background:#f9f9f9;
      color:#333;
      padding:1rem;
      z-index:2147483647;
      border-top:1px solid #ddd;
      box-shadow:0 -2px 6px rgba(0,0,0,0.15);
      font-size:0.9rem;
      line-height:1.4;
    ">
      <div style="display:flex; justify-content:flex-end; gap:0.3rem; margin-bottom:0.5rem;">
        <button class="btn-lang" onclick="switchLang('de')">DE</button>
        <button class="btn-lang" onclick="switchLang('it')">IT</button>
        <button class="btn-lang" onclick="switchLang('fr')">FR</button>
        <button class="btn-lang" onclick="switchLang('en')">EN</button>
      </div>

      <p id="cookie-text" style="margin-bottom:0.8rem;">
        Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren, Funktionen für soziale Medien anzubieten und die Zugriffe auf unsere Website zu analysieren. 
        Informationen zu Ihrer Nutzung unserer Website werden an unsere Partner weitergegeben. 
        <a href="/myself2/privacy">Mehr erfahren</a>.
      </p>

      <div class="cookie-buttons" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="btn-customize" onclick="openSettings()" id="settings-btn" style="padding:0.4rem 0.8rem; border:1px solid #ccc; background:#fff; border-radius:4px;">Einstellungen</button>
        <button class="btn btn-accept" onclick="handleConsent('granted')" id="accept-btn" style="background:#007bff; color:#fff; border:none; padding:0.4rem 0.8rem; border-radius:4px;">
          <span id="accept-label">Alle akzeptieren</span>
        </button>
      </div>

      <div id="settings-panel" style="display:none; margin-top:0.8rem;">
        <p id="settings-text" style="margin-bottom:0.5rem;">Hier können Sie Ihre Cookie-Einstellungen anpassen:</p>
        <button class="btn btn-reject" onclick="handleConsent('denied')" id="reject-btn" style="background:#e0e0e0; border:none; padding:0.4rem 0.8rem; border-radius:4px;">Nur notwendige Cookies verwenden</button>
      </div>
    </div>
  `;

  // Inject into page
  document.body.insertAdjacentHTML('beforeend', bannerHTML);
  switchLang('de'); // default language

  console.log("✅ Cookie banner injected and visible.");
});
