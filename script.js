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
   5. Zähler in der Statistik-Leiste hochzählen
   6. Skill-Balken auf ihre Zielbreite füllen
   7. Lichtschein auf den Skill-Karten, der der Maus folgt
   8. Partikel-Netzwerk im Hero-Hintergrund (Canvas)
   9. Jahreszahl im Footer automatisch setzen

   Alles ist in eine sofort ausgeführte Funktion (IIFE) gepackt,
   damit keine Variablen im globalen Scope landen.
   ========================================================================== */

(function () {
  "use strict";

  // Hat der Besucher im Betriebssystem "Bewegung reduzieren" aktiviert?
  // Dann verzichten wir auf Tipp-Effekt, Zähler-Animation und Partikel.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ------------------------------------------------------------------------
     1. Sprachumschalter EN/DE
     So funktioniert es:
     - Jedes übersetzbare Element im HTML trägt ein data-i18n-Attribut,
       z. B. data-i18n="hero.sub".
     - Die englischen Texte stehen direkt im HTML und werden beim Laden
       einmal eingesammelt (englishTexts).
     - Die deutschen Texte stehen hier im Objekt germanTexts.
     - Beim Klick auf den Button werden einfach alle Elemente mit der
       jeweils anderen Sprache befüllt. Die Wahl wird im localStorage
       gespeichert und beim nächsten Besuch wiederhergestellt.
     ------------------------------------------------------------------------ */

  const germanTexts = {
    // Navigation
    "nav.about": "Über mich",
    "nav.experience": "Werdegang",
    "nav.skills": "Skills",
    "nav.work": "Projekte",
    "nav.contact": "Kontakt aufnehmen",

    // Hero
    "hero.badge": "Verfügbar für Freelance-Projekte",
    "hero.title": 'Hi, ich bin <span class="grad">Felix Bettenworth</span>',
    "hero.sub": "Ich baue Online-Businesses auf und bringe sie zum Wachsen. Einige davon sind meine eigenen Amazon-Marken, andere sind Shops und Marketing-Kampagnen für meine Kunden.",
    "hero.cta1": "Lass uns zusammenarbeiten",
    "hero.cta2": "Das mache ich",
    "hero.stat1": "Jahre im E-Commerce",
    "hero.stat2": "Jahre eigene Amazon-Marken",
    "hero.stat3": "Sprachen",

    // About
    "about.tag": "Über mich",
    "about.title": "Unternehmer zuerst,<br>Entwickler und Marketer aus Leidenschaft.",
    "about.p1": 'Ich bin <strong>E-Commerce-Unternehmer und freiberuflicher Webentwickler</strong> aus Wedel bei Hamburg. Mit meinem Unternehmen <strong>FLXUniversal</strong> führe ich seit 2022 meine eigenen <strong>Private-Label-Marken auf Amazon</strong>. Dabei mache ich alles selbst: das richtige Produkt finden, es mit Herstellern entwickeln, den Versand nach Deutschland organisieren, die Qualität prüfen, Listings schreiben und die PPC-Kampagnen steuern. Ein paar dieser Marken habe ich aufgebaut und später verkauft.',
    "about.p2": 'Nebenbei bin ich seit 2020 als <strong>Freelancer</strong> unterwegs. Ich baue Websites und Online-Shops für Kunden, meistens mit <strong>Shopify und WooCommerce</strong>, und kümmere mich auch um ihr Marketing: Google, Meta und Microsoft Ads, SEO, Analytics und Tracking. Produktfotos, Visitenkarten oder eine Speisekarte? Habe ich auch schon gemacht.',
    "about.p3": 'Gerade mache ich meinen <strong>B.Sc. E-Commerce an der FH Wedel</strong> fertig (Abschluss September 2026). Eine praktische Kombination: Was ich unter der Woche studiere, mache ich in der Praxis sowieso schon.',
    "about.cardTitle": "Kurz & knapp",
    "about.f1b": "Wedel / Hamburg, Deutschland",
    "about.f1s": "Offen für Remote-Projekte",
    "about.f2b": "B.Sc. E-Commerce",
    "about.f2s": "FH Wedel · Abschluss 09/2026",
    "about.f3b": "DE Muttersprache · EN C1/C2 · ES B1",
    "about.f3s": "Sicher im internationalen Einkauf und Vertrieb",
    "about.f4b": "Marken aufgebaut & verkauft",
    "about.f4s": "Mehrere eigene Amazon-FBA-Marken, einige davon verkauft",

    // Experience
    "exp.tag": "Werdegang",
    "exp.title": "Was ich bisher aufgebaut habe.",
    "exp.lead": "Ich betreibe eigene E-Commerce-Projekte und baue sie für andere auf. Beide Seiten machen sich gegenseitig besser.",
    "job1.when": "Seit 2022",
    "job1.title": "Gründer & Inhaber, eigene Amazon-FBA-Marken",
    "job1.org": "FLXUniversal · Online-Handel",
    "job1.b1": "Mehrere eigene Marken auf Amazon aufgebaut und geführt, von der ersten Produktidee bis zum fertigen Listing. Einige davon habe ich später verkauft.",
    "job1.b2": "Produkt- und Marktrecherche mit Helium 10, um profitable Nischen zu finden",
    "job1.b3": "Hersteller finden und verhandeln, den Versand nach Deutschland organisieren und die Produktqualität im Blick behalten",
    "job1.b4": "Listings schreiben und optimieren, dazu die Amazon-PPC-Kampagnen steuern",
    "job1.b5": "Einkauf, Kalkulation und Buchhaltung landen ebenfalls auf meinem Tisch",
    "job2.when": "Seit 2020",
    "job2.title": "Freiberuflicher E-Commerce- & Webentwickler",
    "job2.org": "FLXUniversal · Kundenprojekte",
    "job2.b1": "Websites und Online-Shops für Kunden, meistens Shopify und WooCommerce, dazu individuelles HTML, CSS und JavaScript",
    "job2.b2": "Bezahlte Kampagnen auf Google, Meta und Microsoft Ads, vom Targeting bis zur täglichen Optimierung",
    "job2.b3": "Keyword-Recherche und SEO für bessere organische Rankings",
    "job2.b4": "Web-Tracking und Google-Analytics-Setups, damit meine Kunden wissen, was wirklich funktioniert",
    "job2.b5": "Nebenbei Design-Aufträge: Visitenkarten, Speisekarten, Flyer und mehr",

    // Education
    "edu1.when": "2022 bis 2026",
    "edu1.org": "FH Wedel · Abschluss September 2026",
    "edu1.text": "Schwerpunkte: Online-Handel, Webentwicklung, Online-Marketing, Web-Analytics und Online-Recht. In meiner Bachelorarbeit geht es darum, wie sich die Kennzeichnung von KI-Inhalten auf Markenauthentizität und Kaufabsicht auswirkt.",
    "edu2.title": "Abitur",
    "edu2.org": "Schwerpunkte: Biologie & Chemie",
    "edu2.text": "Allgemeine Hochschulreife mit naturwissenschaftlichem Schwerpunkt. Das analytische Denken von damals hilft mir heute noch bei datengetriebenen Entscheidungen.",

    // Skills
    "skills.tag": "Skills",
    "skills.title": "Das bringe ich mit.",
    "skills.lead": "Alles, was es braucht, um online zu verkaufen: vom passenden Produkt bis zum profitablen Geschäft.",
    "sk1.title": "E-Commerce & Marktplätze",
    "sk1.l1": "Amazon FBA & Marktplatz-Management",
    "sk1.l2": "Produkt- & Marktrecherche (Helium 10)",
    "sk1.l3": "Sourcing, Logistik & Qualität",
    "sk1.l4": "Listing-Optimierung",
    "sk2.title": "Online-Marketing",
    "sk2.l3": "SEO & Keyword-Recherche",
    "sk3.title": "Webentwicklung",
    "sk3.c2": "Conversion-Optimierung",
    "sk3.c3": "Shop-Aufbau",
    "sk4.title": "Daten & Analyse",
    "sk4.l1": "Google Analytics & Web-Tracking",
    "lvl.expert": "Experte",
    "lvl.advanced": "Fortgeschritten",
    "lvl.working": "Solide Basis",

    // Work
    "work.tag": "Das mache ich",
    "work.title": "Projekte & Leistungen.",
    "work.lead": "Ein Überblick über meine Arbeit, für eigene Marken und für Kunden.",
    "w1.title": "Eigene Amazon-Marken",
    "w1.text": "Mehrere eigene Marken von null aufgebaut: Nischen-Recherche, Produktentwicklung mit Herstellern, Import nach Deutschland, Qualitätskontrolle, Listings und PPC. Einige davon habe ich weiterverkauft.",
    "w2.title": "Online-Shops für Kunden",
    "w2.text": "Conversion-starke Shopify- und WooCommerce-Shops, komplett umgesetzt: Struktur, Design, Produktpflege, Zahlungen und Launch. Individuelle Websites mit HTML, CSS und JavaScript gibt es auch.",
    "w3.title": "Performance-Marketing",
    "w3.text": "Bezahlte Kampagnen auf Google, Meta und Microsoft Ads: Zielgruppen-Strategie, Creatives, tägliche Optimierung und Reporting. Immer mit echten Umsatzzielen verknüpft.",
    "w4.title": "SEO, Tracking & Analytics",
    "w4.text": "Keyword-Recherche und On-Page-SEO für organisches Wachstum, dazu saubere Google-Analytics- und Tracking-Setups. So bleibt jeder Marketing-Euro messbar.",
    "w5.title": "Produktfotografie",
    "w5.text": "Produktfotos und Visuals für Amazon-Listings und Online-Shops: fotografiert, bearbeitet und auf Conversion optimiert. 3D-Renderings, wo sie Sinn ergeben.",
    "w6.title": "Brand- & Print-Design",
    "w6.text": "Design abseits des Webs: Visitenkarten, Speisekarten, Flyer und Marketingmaterialien, die an jedem Kontaktpunkt zur Marke passen.",

    // Sprachen
    "lang1.name": "Deutsch",
    "lang1.lvl": "Muttersprache",
    "lang2.name": "Englisch",
    "lang2.lvl": "Verhandlungssicher · C1/C2",
    "lang3.name": "Spanisch",
    "lang3.lvl": "Grundkenntnisse · B1",

    // Kontakt
    "contact.tag": "Kontakt",
    "contact.title": "Lass uns etwas bauen,<br>das sich verkauft.",
    "contact.text": "Egal ob neuer Shop, Marketing-Kampagne oder Amazon-Projekt: Erzähl mir davon. Ich antworte meistens innerhalb von 24 Stunden.",
    "contact.emailLabel": "E-Mail",
    "contact.phoneLabel": "Telefon",
    "contact.locLabel": "Standort",
    "contact.loc": "Wedel / Hamburg, Deutschland",
    "contact.btn": "Schreib mir eine E-Mail",

    // Footer
    "footer.text": "FLXUniversal · Felix Bettenworth · Wedel, Deutschland"
  };

  // Die Rollen für den Tipp-Effekt gibt es ebenfalls in beiden Sprachen
  const rolesEn = [
    "Amazon FBA Entrepreneur",
    "Web Developer & Freelancer",
    "Performance Marketer",
    "Shopify & WooCommerce Expert",
    "E-Commerce Manager"
  ];
  const rolesDe = [
    "Amazon-FBA-Unternehmer",
    "Webentwickler & Freelancer",
    "Performance-Marketer",
    "Shopify- & WooCommerce-Experte",
    "E-Commerce-Manager"
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
     - ab 40px Scrolltiefe bekommt die Nav die Klasse .scrolled (Glas-Optik)
     - der Balken oben zeigt an, wie weit man auf der Seite ist
     - der Menüpunkt der Section, in der man sich befindet, wird markiert
     - Burger-Button öffnet/schließt das Menü auf dem Handy
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
  });

  // Nach Klick auf einen Menüpunkt das Overlay wieder schließen
  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
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
     5. Zähler in der Statistik-Leiste
     Zählt von 0 auf den Zielwert (data-target), sobald die Zahl sichtbar
     wird. Die Kurve (1 - (1-p)^3) startet schnell und bremst zum Ende ab.
     ------------------------------------------------------------------------ */

  const COUNT_DURATION = 1400; // ms für den kompletten Hochzähl-Vorgang

  const counterElements = document.querySelectorAll(".count");

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);

      const element = entry.target;
      const targetValue = Number(element.dataset.target);

      if (reducedMotion) {
        element.textContent = targetValue;
        return;
      }

      let startTime = null;

      function countStep(timestamp) {
        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / COUNT_DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        element.textContent = Math.round(targetValue * eased);

        if (progress < 1) {
          requestAnimationFrame(countStep);
        }
      }

      requestAnimationFrame(countStep);
    });
  }, { threshold: 0.5 });

  counterElements.forEach(function (counter) {
    counterObserver.observe(counter);
  });


  /* ------------------------------------------------------------------------
     6. Skill-Balken
     Die Balken starten im CSS bei width: 0. Sobald einer sichtbar wird,
     setzen wir seine Breite auf den Zielwert aus data-w — die Transition
     im CSS macht daraus die Füll-Animation.
     ------------------------------------------------------------------------ */

  const skillBars = document.querySelectorAll(".bar i");

  const barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      barObserver.unobserve(entry.target);
      entry.target.style.width = entry.target.dataset.w + "%";
    });
  }, { threshold: 0.4 });

  skillBars.forEach(function (bar) {
    barObserver.observe(bar);
  });


  /* ------------------------------------------------------------------------
     7. Lichtschein auf den Skill-Karten
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
     8. Partikel-Netzwerk im Hero
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
     9. Jahreszahl im Footer
     Immer aktuell, muss nie von Hand gepflegt werden.
     ------------------------------------------------------------------------ */

  document.getElementById("year").textContent = new Date().getFullYear();


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


