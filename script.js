/* ==========================================================================
   FLXUniversal — Felix Bettenworth, Portfolio
   script.js
   --------------------------------------------------------------------------
   Was hier passiert (in dieser Reihenfolge):
   1. Sprachumschalter EN/DE (Übersetzungen + Button in der Navigation)
   2. Tipp-Effekt im Hero (Rollen werden getippt und wieder gelöscht)
   3. Navigation: Glas-Effekt beim Scrollen, Fortschrittsbalken,
      aktiven Menüpunkt markieren, Burger-Menü fürs Handy
   4. Einblend-Animationen beim Scrollen (.reveal -> .visible)
   5. Lichtschein auf den Skill-Karten, der der Maus folgt
   6. Partikel-Netzwerk im Hero-Hintergrund (Canvas)
   7. Jahreszahl im Footer automatisch setzen
   8. Cookie-Banner (inkl. markierter Stelle für den Google Tag Manager)

   Alles ist in eine sofort ausgeführte Funktion (IIFE) gepackt,
   damit keine Variablen im globalen Scope landen.
   ========================================================================== */

(function () {
  "use strict";

  // Hat der Besucher im Betriebssystem "Bewegung reduzieren" aktiviert?
  // Dann verzichten wir auf Tipp-Effekt und Partikel.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ------------------------------------------------------------------------
     1. Sprachumschalter EN/DE
     So funktioniert es:
     - Jedes übersetzbare Element im HTML trägt ein data-i18n-Attribut,
       z. B. data-i18n="hero.sub".
     - Die englischen Texte stehen direkt im HTML und werden beim Laden
       einmal eingesammelt (englishTexts).
     - Die deutschen Texte stehen hier im Objekt germanTexts.
     - Beim Klick auf den Button werden alle Elemente mit der jeweils
       anderen Sprache befüllt. Die Wahl wird im localStorage gespeichert
       und beim nächsten Besuch wiederhergestellt.
     ------------------------------------------------------------------------ */

  const germanTexts = {
    // Navigation
    "nav.about": "Über mich",
    "nav.timeline": "Werdegang",
    "nav.skills": "Skills",
    "nav.work": "Projekte",
    "nav.contact": "Kontakt aufnehmen",

    // Hero
    "hero.badge": "Verfügbar für Freelance-Projekte",
    "hero.title": 'Hi, ich bin <span class="grad">Felix Bettenworth</span>',
    "hero.sub": "Ich betreibe eigene E-Commerce-Projekte und baue Shops, Kampagnen und Tracking-Setups für Kunden. Am liebsten arbeite ich an Dingen, die wirklich verkaufen.",
    "hero.cta1": "Lass uns zusammenarbeiten",
    "hero.cta2": "Das mache ich",
    "hero.toolsLabel": "Womit ich täglich arbeite",

    // About
    "about.tag": "Über mich",
    "about.title": "Eigene Produkte, Kundenprojekte<br>und alles dazwischen.",
    "about.p1": 'Zusammen mit Freunden betreibe ich ein <strong>Amazon-FBA-Business</strong>: eigene Produkte, mit Herstellern entwickelt, nach Deutschland geholt und über eigene Listings und PPC-Kampagnen verkauft. Eins unserer früheren Projekte haben wir aufgebaut und verkauft.',
    "about.p2": '<strong>FLXUniversal</strong> ist mein Zuhause für Kundenprojekte: Webshops mit <strong>WordPress, WooCommerce und Shopify</strong>, Dropshipping-Projekte, Design-Aufträge und das Marketing dahinter, von Google Ads bis zum sauberen Tracking mit dem Google Tag Manager.',
    "about.p3": 'Wenn ich mich festlegen müsste: <strong>Performance Marketing und die Technik dahinter</strong>. Kampagnen, Tracking und Shopsysteme aus einer Hand, zum Beispiel ein internationales B2B-Google-Shopping-Setup über mehrere Länder.',
    "about.cardTitle": "Kurz & knapp",
    "about.f1b": "Wedel / Hamburg, Deutschland",
    "about.f1s": "Offen für Remote-Projekte",
    "about.f2b": "B.Sc. E-Commerce",
    "about.f2s": "FH Wedel, abgeschlossen 2026",
    "about.f3b": "DE Muttersprache · EN C1/C2 · ES B1",
    "about.f3s": "Sicher im internationalen Einkauf und Vertrieb",
    "about.f4b": "Zwei Unternehmen",
    "about.f4s": "Amazon FBA mit Freunden, FLXUniversal für Kundenprojekte",

    // Timeline
    "tl.tag": "Werdegang",
    "tl.title": "Wie ich hierher gekommen bin.",
    "tl.lead": "Die Kurzfassung, Jahr für Jahr.",
    "tl1.text": "Erste Freelance-Projekte noch während der Schulzeit: Websites, kleine Shops und Design-Aufträge für Kunden.",
    "tl2.text": "Abitur gemacht, das E-Commerce-Studium an der FH Wedel gestartet und mit Freunden ein eigenes Amazon-FBA-Business gegründet.",
    "tl3.text": "B.Sc. an der FH Wedel abgeschlossen. Meine Thesis: Wie wirkt sich die Kennzeichnung von KI-Inhalten auf die Glaubwürdigkeit im Online-Marketing aus?",
    "tl4.year": "Heute",
    "tl4.text": "FBA-Business und FLXUniversal laufen parallel: Shops, Kampagnen, Tracking und Dropshipping-Projekte. Eins unserer früheren Projekte ist verkauft, die aktuellen laufen weiter.",

    // Skills
    "skills.tag": "Skills",
    "skills.title": "Mein Stack.",
    "skills.lead": "Die Tools, mit denen ich wirklich arbeite, gruppiert nach Einsatzzweck.",
    "sk2.title": "Shops & Webentwicklung",
    "sk3.title": "Tracking & Daten",
    "sk3.c3": "Web-Tracking",
    "sk4.title": "E-Commerce & Content",
    "sk4.c3": "Sourcing & Logistik",
    "sk4.c4": "Listing-Optimierung",

    // Work
    "work.tag": "Das mache ich",
    "work.title": "Projekte & Leistungen.",
    "work.lead": "Ein Überblick über meine Arbeit, eigene Projekte und Kundenaufträge.",
    "w1.title": "Amazon-FBA-Business",
    "w1.text": "Eigene Produkte auf Amazon, gemeinsam mit Freunden: Nischen-Recherche, Produktentwicklung, Import nach Deutschland, Listings und PPC. Ein früheres Projekt haben wir aufgebaut und verkauft.",
    "w1.c3": "Eigene Produkte",
    "w2.title": "Webshops für Kunden",
    "w2.text": "Shops mit WordPress, WooCommerce und Shopify, komplett umgesetzt mit FLXUniversal: Struktur, Design, Produkte, Zahlungen, Launch.",
    "w3.text": "Kampagnen auf Google, Microsoft und Meta. Bisheriges Highlight: ein internationales B2B-Google-Shopping-Setup über mehrere Länder.",
    "w4.title": "Tracking & Analytics",
    "w4.text": "Saubere Tracking-Setups mit Google Tag Manager und Google Analytics, Cookie-Consent inklusive. Was man nicht messen kann, kann man nicht skalieren.",
    "w5.title": "Dropshipping-Projekte",
    "w5.text": "Dropshipping-Stores von der Produktauswahl bis zum Fulfillment-Setup, dazu die Anzeigen, die den Traffic bringen.",
    "w6.title": "Design & Content",
    "w6.text": "Produktfotos, Visitenkarten, Speisekarten, Flyer und Videoschnitt in DaVinci Resolve. Die Dinge, die eine kleine Marke gut aussehen lassen.",

    // Sprachen
    "lang1.name": "Deutsch",
    "lang1.lvl": "Muttersprache",
    "lang2.name": "Englisch",
    "lang2.lvl": "Verhandlungssicher · C1/C2",
    "lang3.name": "Spanisch",
    "lang3.lvl": "Grundkenntnisse · B1",

    // Insights (Bachelorarbeit)
    "ins.tag": "Insights",
    "ins.title": "Worum es in meiner Thesis ging.",
    "ins.lead": "Meine Bachelorarbeit in einem Satz: Was passiert mit der Glaubwürdigkeit, wenn Marketing-Inhalte als KI-generiert gekennzeichnet werden?",
    "ins1.title": "Die Frage",
    "ins1.text": "KI-Inhalte sind im Marketing überall. Aber wie verändert eine offene Kennzeichnung die Art, wie Menschen Glaubwürdigkeit beurteilen?",
    "ins2.title": "Warum es relevant ist",
    "ins2.text": "Die Regeln zur Kennzeichnung von KI-Inhalten werden strenger und das Publikum wird skeptischer. Jede Marke, die KI nutzt, steht früher oder später vor dieser Frage.",
    "ins3.title": "Mein Fazit",
    "ins3.text": "KI zu verstecken wird bald keine Option mehr sein. Marken, die früh lernen, transparent damit umzugehen, haben es leichter. Über Details rede ich gern.",

    // Warum ich
    "why.tag": "Warum ich",
    "why.title": "Warum mit mir arbeiten.",
    "why.lead": "Der ehrliche Pitch, ohne Buzzwords.",
    "why1.title": "Du bekommst mich, keine Ticketnummer",
    "why1.text": "Ich bin Freelancer mit bewusst kleiner Kundenliste. Dein Projekt landet nicht irgendwo in einer Warteschlange, sondern auf meinem Tisch und bekommt meine volle Aufmerksamkeit.",
    "why2.title": "Schnelle Antworten, kurze Wege",
    "why2.text": "Keine Account-Manager, keine Meetings über Meetings. Du schreibst mir, ich antworte, meistens innerhalb von 24 Stunden. Und wenn etwas schnell gehen muss, bin ich flexibel.",
    "why3.title": "Ich habe etwas zu beweisen",
    "why3.text": "Ich bin jung und baue mir gerade meinen Ruf auf. Für dich ist das gut: Ich kann mir keinen schlampigen Job leisten und behandle jedes Projekt so, als hinge mein eigenes Business daran. Tut es nämlich auch.",
    "why4.title": "Ich betreibe selbst Shops",
    "why4.text": "Ich gebe mein eigenes Geld für Ads aus und lebe von den Ergebnissen. Deshalb verkaufe ich dir nichts, was du nicht brauchst. Wenn sich etwas nicht lohnt, sage ich es dir ehrlich.",

    // Kontakt
    "contact.tag": "Kontakt",
    "contact.title": "Lass uns etwas bauen,<br>das sich verkauft.",
    "contact.text": "Egal ob Shop, Kampagne oder Tracking-Setup: Erzähl mir davon. Ich antworte meistens innerhalb von 24 Stunden.",
    "contact.emailLabel": "E-Mail",
    "contact.locLabel": "Standort",
    "contact.loc": "Wedel / Hamburg, Deutschland",
    "contact.btn": "Schreib mir eine E-Mail",

    // Footer
    "footer.text": "FLXUniversal · Felix Bettenworth · Wedel, Deutschland",

    // Cookie-Banner
    "cookie.title": "Kurze Cookie-Frage",
    "cookie.text": "Ich nutze Cookies, um zu sehen, wie die Seite genutzt wird, und um sie besser zu machen. In Ordnung für dich?",
    "cookie.decline": "Nein danke",
    "cookie.accept": "Akzeptieren"
  };

  // Die Rollen für den Tipp-Effekt gibt es ebenfalls in beiden Sprachen
  const rolesEn = [
    "E-Commerce Entrepreneur",
    "Performance Marketer",
    "Web Developer",
    "Online Marketing Manager"
  ];
  const rolesDe = [
    "E-Commerce-Unternehmer",
    "Performance-Marketer",
    "Webentwickler",
    "Online-Marketing-Manager"
  ];

  const i18nElements = document.querySelectorAll("[data-i18n]");
  const langToggle = document.getElementById("langToggle");

  // Englische Originaltexte einmal aus dem HTML einsammeln
  const englishTexts = {};
  i18nElements.forEach(function (element) {
    const key = element.dataset.i18n;
    if (!(key in englishTexts)) {
      englishTexts[key] = element.innerHTML;
    }
  });

  let currentLang = "en";
  let activeRoles = rolesEn;

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Alle markierten Elemente mit der passenden Sprache befüllen.
    // Fällt eine Übersetzung mal weg, bleibt das Englische stehen.
    i18nElements.forEach(function (element) {
      const key = element.dataset.i18n;
      element.innerHTML = (lang === "de" && germanTexts[key]) ? germanTexts[key] : englishTexts[key];
    });

    // Der Button zeigt immer die Sprache, zu der man wechseln kann
    langToggle.textContent = (lang === "de") ? "EN" : "DE";

    // Tipp-Effekt mit den Rollen der neuen Sprache neu starten
    activeRoles = (lang === "de") ? rolesDe : rolesEn;
    startTyping();

    // Wahl merken (try/catch, falls localStorage blockiert ist)
    try {
      localStorage.setItem("lang", lang);
    } catch (e) { /* dann eben nicht, kein Beinbruch */ }
  }

  langToggle.addEventListener("click", function () {
    setLanguage(currentLang === "de" ? "en" : "de");
  });


  /* ------------------------------------------------------------------------
     2. Tipp-Effekt
     Tippt die Rollen Buchstabe für Buchstabe, wartet kurz, löscht sie
     wieder und springt zur nächsten. Läuft endlos im Kreis.
     startTyping() bricht eine laufende Animation sauber ab und beginnt
     von vorn — wichtig für den Sprachwechsel.
     ------------------------------------------------------------------------ */

  const typedElement = document.getElementById("typed");

  const TYPE_SPEED = 70;      // ms pro getipptem Buchstaben
  const DELETE_SPEED = 38;    // Löschen geht etwas schneller
  const HOLD_TIME = 2100;     // Pause, wenn ein Wort fertig getippt ist
  const SWITCH_PAUSE = 350;   // kurze Pause vor dem nächsten Wort

  let typeTimer = null;

  function startTyping() {
    clearTimeout(typeTimer);

    if (reducedMotion) {
      // Ohne Animation: einfach die erste Rolle statisch anzeigen
      typedElement.textContent = activeRoles[0];
      return;
    }

    let roleIndex = 0;      // welche Rolle gerade dran ist
    let charCount = 0;      // wie viele Buchstaben aktuell sichtbar sind
    let isDeleting = false;

    function typeTick() {
      const word = activeRoles[roleIndex];

      if (!isDeleting) {
        // Buchstaben anhängen
        charCount++;
        typedElement.textContent = word.slice(0, charCount);

        if (charCount === word.length) {
          // Wort komplett -> kurz stehen lassen, dann löschen
          isDeleting = true;
          typeTimer = setTimeout(typeTick, HOLD_TIME);
          return;
        }
        typeTimer = setTimeout(typeTick, TYPE_SPEED);

      } else {
        // Buchstaben entfernen
        charCount--;
        typedElement.textContent = word.slice(0, charCount);

        if (charCount === 0) {
          // Wort weg -> zur nächsten Rolle wechseln
          isDeleting = false;
          roleIndex = (roleIndex + 1) % activeRoles.length;
          typeTimer = setTimeout(typeTick, SWITCH_PAUSE);
          return;
        }
        typeTimer = setTimeout(typeTick, DELETE_SPEED);
      }
    }

    typeTick();
  }


  /* ------------------------------------------------------------------------
     3. Navigation
     - beim Scrollen bekommt die Nav die Klasse .scrolled
       (Glas-Optik für die Top-Bar auf Tablet/Handy)
     - der Balken oben zeigt an, wie weit man auf der Seite ist
     - der Menüpunkt der Section, in der man sich befindet, wird markiert
     - Burger-Button öffnet/schließt das Menü auf dem Handy und sperrt
       dabei die Seite dahinter (body.menu-open)
     ------------------------------------------------------------------------ */

  const nav = document.getElementById("nav");
  const progressBar = document.getElementById("progress");
  const menuLinks = document.querySelectorAll(".nav-links a[href^='#']");

  // Jedem Menülink seine Ziel-Section zuordnen (für die Markierung)
  const linkedSections = [];
  menuLinks.forEach(function (link) {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) {
      linkedSections.push({ link: link, section: section });
    }
  });

  function handleScroll() {
    const scrollY = window.scrollY;

    // Glas-Effekt an/aus
    nav.classList.toggle("scrolled", scrollY > 40);

    // Fortschrittsbalken: gescrollte Strecke / maximal scrollbare Strecke
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0) + "%";

    // Aktive Section finden: die letzte, deren Oberkante schon erreicht ist
    // (140px Puffer, damit die Markierung nicht erst am Section-Anfang umspringt)
    let currentEntry = null;
    linkedSections.forEach(function (entry) {
      if (entry.section.offsetTop - 140 <= scrollY) {
        currentEntry = entry;
      }
    });

    menuLinks.forEach(function (link) {
      link.classList.remove("active");
    });
    if (currentEntry) {
      currentEntry.link.classList.add("active");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // einmal direkt ausführen, falls die Seite gescrollt lädt

  // Burger-Menü (Handy)
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", function () {
    burger.classList.toggle("open");
    navLinks.classList.toggle("open");
    // Seite hinter dem offenen Menü sperren, damit nichts
    // horizontal oder vertikal mitscrollt (CSS: body.menu-open)
    document.body.classList.toggle("menu-open", navLinks.classList.contains("open"));
  });

  // Nach Klick auf einen Menüpunkt das Overlay wieder schließen
  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });


  /* ------------------------------------------------------------------------
     4. Einblend-Animationen beim Scrollen
     Ein IntersectionObserver meldet, sobald ein .reveal-Element ins
     Sichtfeld kommt. Dann bekommt es .visible und die CSS-Transition
     blendet es ein. Danach wird es nicht weiter beobachtet (unobserve),
     die Animation läuft also pro Element nur einmal.
     ------------------------------------------------------------------------ */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,                  // 12% des Elements müssen sichtbar sein
    rootMargin: "0px 0px -40px 0px"   // löst etwas vor dem unteren Rand aus
  });

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });


  /* ------------------------------------------------------------------------
     5. Lichtschein auf den Skill-Karten
     Bei jeder Mausbewegung wird die Position relativ zur Karte in die
     CSS-Variablen --mx / --my geschrieben. Das ::after-Overlay im CSS
     legt an genau diese Stelle einen radialen Verlauf.
     ------------------------------------------------------------------------ */

  document.querySelectorAll(".skill-card").forEach(function (card) {
    card.addEventListener("mousemove", function (event) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (event.clientX - rect.left) + "px");
      card.style.setProperty("--my", (event.clientY - rect.top) + "px");
    });
  });


  /* ------------------------------------------------------------------------
     6. Partikel-Netzwerk im Hero
     Punkte treiben langsam über ein Canvas und prallen an den Rändern ab.
     Kommen sich zwei Punkte näher als 130px, wird eine Linie zwischen
     ihnen gezeichnet — je näher, desto kräftiger.
     Läuft über requestAnimationFrame (~60 Bilder/Sekunde) und pausiert,
     wenn der Tab im Hintergrund ist.
     ------------------------------------------------------------------------ */

  const canvas = document.getElementById("particles");

  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext("2d");

    const LINK_DISTANCE = 130;   // ab dieser Entfernung (px) keine Linie mehr
    const MAX_PARTICLES = 90;

    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationId;

    // Canvas an die Hero-Größe anpassen und Punkte neu verteilen
    function setupCanvas() {
      const hero = document.getElementById("hero");
      canvasWidth = canvas.width = hero.offsetWidth;
      canvasHeight = canvas.height = hero.offsetHeight;

      // Anzahl der Punkte an die Fläche koppeln, damit es auf kleinen
      // Bildschirmen nicht zu voll und auf großen nicht zu leer wirkt
      const count = Math.min(MAX_PARTICLES, Math.floor(canvasWidth * canvasHeight / 22000));

      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          vx: (Math.random() - 0.5) * 0.35,   // Geschwindigkeit x (px/Frame)
          vy: (Math.random() - 0.5) * 0.35,   // Geschwindigkeit y
          radius: Math.random() * 1.6 + 0.6
        });
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Punkt bewegen, an den Rändern abprallen lassen
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvasWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvasHeight) p.vy *= -1;

        // Punkt zeichnen
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, .5)";
        ctx.fill();

        // Linien zu allen näheren Punkten ziehen.
        // Vergleich über das Abstands-Quadrat — spart die teure
        // Wurzel-Berechnung, das Ergebnis ist dasselbe.
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSquared = dx * dx + dy * dy;

          if (distSquared < LINK_DISTANCE * LINK_DISTANCE) {
            // Deckkraft steigt, je näher sich die Punkte sind
            const opacity = 0.14 * (1 - distSquared / (LINK_DISTANCE * LINK_DISTANCE));

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(56, 189, 248, " + opacity + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawFrame);
    }

    setupCanvas();
    drawFrame();

    // Bei Größenänderung des Fensters alles neu aufsetzen
    window.addEventListener("resize", function () {
      cancelAnimationFrame(animationId);
      setupCanvas();
      drawFrame();
    });

    // Animation pausieren, wenn der Tab nicht sichtbar ist (spart Akku/CPU)
    document.addEventListener("visibilitychange", function () {
      cancelAnimationFrame(animationId);
      if (!document.hidden) {
        drawFrame();
      }
    });
  }


  /* ------------------------------------------------------------------------
     7. Jahreszahl im Footer
     Immer aktuell, muss nie von Hand gepflegt werden.
     ------------------------------------------------------------------------ */

  document.getElementById("year").textContent = new Date().getFullYear();


  /* ------------------------------------------------------------------------
     8. Cookie-Banner
     Ablauf:
     - Beim Laden wird geprüft, ob schon eine Entscheidung gespeichert ist
       (localStorage-Schlüssel "cookieConsent": "accepted" oder "declined").
     - Wenn nicht, taucht das Banner nach einer Sekunde auf.
     - "Akzeptieren" speichert die Zustimmung und ruft activateTracking()
       auf. "Nein danke" speichert die Ablehnung, es wird nichts geladen.
     - Bei späteren Besuchen mit gespeicherter Zustimmung läuft
       activateTracking() direkt beim Laden, ohne Banner.

     >>> GOOGLE TAG MANAGER: Der GTM-Code kommt in activateTracking(). <<<
     So wird er garantiert erst nach der Zustimmung geladen (DSGVO).
     Zusätzlich wird das Event "cookie_consent_granted" in den dataLayer
     gepusht. Das kann im GTM direkt als Trigger genutzt werden.
     ------------------------------------------------------------------------ */

  const CONSENT_KEY = "cookieConsent";
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptButton = document.getElementById("cookieAccept");
  const declineButton = document.getElementById("cookieDecline");

  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) { /* localStorage blockiert: Banner kommt dann eben wieder */ }
  }

  function activateTracking() {
    // Event für den Google Tag Manager bereitstellen
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "cookie_consent_granted" });

    // ================================================================
    // >>> HIER später das Google-Tag-Manager-Snippet einfügen <<<
    // (den <script>-Teil aus dem GTM-Container, als JS-Code)
    // ================================================================
  }

  function hideBanner() {
    cookieBanner.classList.remove("show");
    // erst nach der Ausblend-Animation komplett aus dem Layout nehmen
    setTimeout(function () {
      cookieBanner.hidden = true;
    }, 400);
  }

  const consent = getConsent();

  if (consent === "accepted") {
    // Zustimmung liegt schon vor: Tracking direkt aktivieren, kein Banner
    activateTracking();
  } else if (consent !== "declined") {
    // Noch keine Entscheidung: Banner nach kurzer Verzögerung einblenden
    cookieBanner.hidden = false;
    setTimeout(function () {
      cookieBanner.classList.add("show");
    }, 1000);
  }

  acceptButton.addEventListener("click", function () {
    saveConsent("accepted");
    activateTracking();
    hideBanner();
  });

  declineButton.addEventListener("click", function () {
    saveConsent("declined");
    hideBanner();
  });


  /* ------------------------------------------------------------------------
     Start: gespeicherte Sprachwahl wiederherstellen (Standard: Englisch).
     Steht hier am Ende, weil setLanguage() den Tipp-Effekt startet und
     dafür alle Funktionen oben schon definiert sein müssen.
     ------------------------------------------------------------------------ */

  let savedLang = "en";
  try {
    savedLang = localStorage.getItem("lang") || "en";
  } catch (e) { /* localStorage nicht verfügbar, Standard bleibt Englisch */ }

  setLanguage(savedLang);

})();
