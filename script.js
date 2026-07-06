/* ==========================================================================
   Felix Bettenworth — Portfolio
   script.js
   --------------------------------------------------------------------------
   Was hier passiert (in dieser Reihenfolge):
   1. Tipp-Effekt im Hero (Rollen werden getippt und wieder gelöscht)
   2. Navigation: Glas-Effekt beim Scrollen, Fortschrittsbalken,
      aktiven Menüpunkt markieren, Burger-Menü fürs Handy
   3. Einblend-Animationen beim Scrollen (.reveal -> .visible)
   4. Zähler in der Statistik-Leiste hochzählen
   5. Skill-Balken auf ihre Zielbreite füllen
   6. Lichtschein auf den Skill-Karten, der der Maus folgt
   7. Partikel-Netzwerk im Hero-Hintergrund (Canvas)
   8. Jahreszahl im Footer automatisch setzen

   Alles ist in eine sofort ausgeführte Funktion (IIFE) gepackt,
   damit keine Variablen im globalen Scope landen.
   ========================================================================== */

(function () {
  "use strict";

  // Hat der Besucher im Betriebssystem "Bewegung reduzieren" aktiviert?
  // Dann verzichten wir auf Tipp-Effekt, Zähler-Animation und Partikel.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ------------------------------------------------------------------------
     1. Tipp-Effekt
     Tippt die Rollen Buchstabe für Buchstabe, wartet kurz, löscht sie
     wieder und springt zur nächsten. Läuft endlos im Kreis.
     ------------------------------------------------------------------------ */

  const roles = [
    "Amazon FBA Entrepreneur",
    "Web Developer & Freelancer",
    "Performance Marketer",
    "Shopify & WooCommerce Expert",
    "E-Commerce Manager"
  ];

  const typedElement = document.getElementById("typed");

  const TYPE_SPEED = 70;      // ms pro getipptem Buchstaben
  const DELETE_SPEED = 38;    // Löschen geht etwas schneller
  const HOLD_TIME = 2100;     // Pause, wenn ein Wort fertig getippt ist
  const SWITCH_PAUSE = 350;   // kurze Pause vor dem nächsten Wort

  if (reducedMotion) {
    // Ohne Animation: einfach die erste Rolle statisch anzeigen
    typedElement.textContent = roles[0];
  } else {
    let roleIndex = 0;      // welche Rolle gerade dran ist
    let charCount = 0;      // wie viele Buchstaben aktuell sichtbar sind
    let isDeleting = false;

    function typeTick() {
      const word = roles[roleIndex];

      if (!isDeleting) {
        // Buchstaben anhängen
        charCount++;
        typedElement.textContent = word.slice(0, charCount);

        if (charCount === word.length) {
          // Wort komplett -> kurz stehen lassen, dann löschen
          isDeleting = true;
          setTimeout(typeTick, HOLD_TIME);
          return;
        }
        setTimeout(typeTick, TYPE_SPEED);

      } else {
        // Buchstaben entfernen
        charCount--;
        typedElement.textContent = word.slice(0, charCount);

        if (charCount === 0) {
          // Wort weg -> zur nächsten Rolle wechseln
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeTick, SWITCH_PAUSE);
          return;
        }
        setTimeout(typeTick, DELETE_SPEED);
      }
    }

    typeTick();
  }


  /* ------------------------------------------------------------------------
     2. Navigation
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
     3. Einblend-Animationen beim Scrollen
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
     4. Zähler in der Statistik-Leiste
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
     5. Skill-Balken
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
     6. Lichtschein auf den Skill-Karten
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
     7. Partikel-Netzwerk im Hero
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
     8. Jahreszahl im Footer
     Immer aktuell, muss nie von Hand gepflegt werden.
     ------------------------------------------------------------------------ */

  document.getElementById("year").textContent = new Date().getFullYear();

})();
