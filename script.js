/* ==========================================================================
   FLXUniversal — Felix Bettenworth
   script.js  ·  wird von index.html UND services.html geladen
   --------------------------------------------------------------------------
   Was hier passiert (in dieser Reihenfolge):
   1. Sprachumschalter EN/DE (Übersetzungen für beide Seiten)
   2. Tipp-Effekt im Hero (nur Startseite)
   3. Scramble-Effekt: Überschriften starten als Zeichenwirrwarr und
      lösen sich beim Reinscrollen in den echten Text auf
   4. Navigation: Glas-Effekt beim Scrollen, Fortschrittsbalken,
      aktiven Menüpunkt markieren, Burger-Menü fürs Handy
   5. Einblend-Animationen beim Scrollen (.reveal -> .visible)
   6. Lichtschein auf den Skill-Karten, der der Maus folgt
   7. Partikel-Netzwerk im Hero-Hintergrund (Canvas)
   8. Jahreszahl im Footer
   9. Cookie-Banner (inkl. markierter Stelle für den Google Tag Manager)

   Weil dieselbe Datei auf zwei verschiedenen Seiten läuft, wird überall
   geprüft, ob es das jeweilige Element überhaupt gibt. Fehlt es, wird der
   Block einfach übersprungen — es gibt keine Fehler in der Konsole.

   Alles ist in eine sofort ausgeführte Funktion (IIFE) gepackt,
   damit keine Variablen im globalen Scope landen.
   ========================================================================== */

(function () {
  "use strict";

  // Hat der Besucher im Betriebssystem "Bewegung reduzieren" aktiviert?
  // Dann verzichten wir auf Tipp-Effekt, Scramble und Partikel.
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
       und gilt auch beim Wechsel auf die andere Seite.

     Das Objekt enthält die Schlüssel BEIDER Seiten. Jede Seite holt sich
     nur die Schlüssel, die sie auch verwendet — der Rest bleibt ungenutzt.
     ------------------------------------------------------------------------ */

  const germanTexts = {

    /* ===== gemeinsam (Footer & Cookie-Banner) ===== */
    "footer.text": "FLXUniversal · Felix Bettenworth · Wedel, Deutschland",
    "footer.l1": "Über mich",
    "footer.l2": "Leistungen",
    "footer.l3": "E-Mail",
    "cookie.title": "Kurze Cookie-Frage",
    "cookie.text": "Ich nutze Cookies, um zu sehen, wie die Seite genutzt wird, und um sie besser zu machen. In Ordnung für dich?",
    "cookie.decline": "Nein danke",
    "cookie.accept": "Akzeptieren",


    /* ======================================================================
       STARTSEITE (index.html)
       ====================================================================== */

    // Navigation
    "nav.about": "Über mich",
    "nav.timeline": "Werdegang",
    "nav.skills": "Skills",
    "nav.highlights": "Referenzen",
    "nav.services": "Leistungen",
    "nav.contact": "Kontakt",

    // Hero
    "hero.badge": "Verfügbar für Freelance-Projekte",
    "hero.title": 'Hi, ich bin <span class="grad">Felix Bettenworth</span>',
    "hero.sub": "E-Commerce-Unternehmer, Performance-Marketer und Webentwickler aus dem Hamburger Umland. Ich betreibe ein eigenes Amazon-Business und baue Shops, Kampagnen und Tracking-Setups für Kunden. Diese Seite handelt von mir und dem, was ich bisher gemacht habe — wenn du wissen willst, was ich für dich tun kann, geht es hier zu meinen Leistungen.",
    "hero.cta1": "Meine Leistungen",
    "hero.cta2": "Mehr über mich",
    "hero.toolsLabel": "Womit ich täglich arbeite",

    // Über mich
    "about.tag": "Über mich",
    "about.title": "Eigene Produkte, Kundenprojekte<br>und alles dazwischen.",
    "about.p1": "Ich bin auf dem praktischen Weg in den E-Commerce gekommen: nicht über einen Kurs, sondern indem ich eigene Sachen gebaut habe. 2020, noch in der Schule, entstanden meine ersten Webshops — für mich selbst, nicht für Kunden. Sourcing, Shop, Fotos, Texte, Ads: alles allein, und jeden Fehler habe ich selbst bezahlt. Seitdem hat es eigentlich nie aufgehört.",
    "about.p2": 'Zusammen mit Freunden betreibe ich ein <strong>Amazon-FBA-Business</strong>: eigene Produkte, mit Herstellern in Asien entwickelt, nach Deutschland importiert und über eigene Listings und PPC-Kampagnen verkauft. Wir machen alles selbst — Sourcing, Muster, Zoll, Fotos, Listings, Ads. Eins unserer früheren Projekte haben wir aufgebaut und verkauft.',
    "about.p3": '<strong>FLXUniversal</strong> ist mein Zuhause für Kundenprojekte: Webshops mit <strong>WordPress, WooCommerce und Shopify</strong>, Dropshipping-Projekte, Design- und Druckaufträge und das Marketing dahinter — von Google Ads bis zum sauberen Tracking mit dem Google Tag Manager.',
    "about.p4": 'Wenn ich mich festlegen müsste: <strong>Performance Marketing und die Technik dahinter</strong>. Kampagnen, Tracking und Shopsysteme aus einer Hand. Ich habe E-Commerce an der FH Wedel studiert und 2026 meinen B.Sc. abgeschlossen — das hat die Theorie zu dem geliefert, was ich vorher schon jahrelang gemacht habe.',
    "about.cardTitle": "Kurz & knapp",
    "about.f1b": "Wedel / Hamburg, Deutschland",
    "about.f1s": "Offen für Remote-Projekte",
    "about.f2b": "B.Sc. E-Commerce",
    "about.f2s": "FH Wedel, abgeschlossen 2026",
    "about.f3b": "DE Muttersprache · EN C1/C2 · ES B1",
    "about.f3s": "Sicher im internationalen Einkauf und Vertrieb",
    "about.f4b": "Zwei Unternehmen",
    "about.f4s": "Amazon FBA mit Freunden, FLXUniversal für Kundenprojekte",
    "about.f5b": "Seit 2020 im Geschäft",
    "about.f5s": "Angefangen mit eigenen Shops, noch während der Schulzeit",

    // Werdegang
    "tl.tag": "Werdegang",
    "tl.title": "Wie ich hierher gekommen bin.",
    "tl.lead": "Die Kurzfassung, Jahr für Jahr.",
    "tl1.title": "Meine ersten eigenen Projekte",
    "tl1.text": "Noch in der Schule, schon Websites und kleine Shops gebaut — alle für mich selbst. Kein Kunde, kein Budget, niemand, an den man die schwierigen Teile abgeben konnte. Da habe ich gelernt, dass ein Shop nicht fertig ist, wenn er gut aussieht, sondern wenn er wirklich etwas verkauft.",
    "tl2.title": "Studium und erste eigene Marke",
    "tl2.text": "Abitur gemacht, das E-Commerce-Studium an der FH Wedel gestartet und mit Freunden ein Amazon-FBA-Business gegründet: eigene Produkte, eigene Listings, eigenes Geld im Risiko.",
    "tl3.title": "FLXUniversal und Kundenprojekte",
    "tl3.text": "Shops mit WordPress, WooCommerce und Shopify, Google- und Microsoft-Kampagnen, Tracking-Setups und Druckerzeugnisse für Kunden. Highlight dieser Zeit: ein internationales B2B-Google-Shopping-Setup über mehrere Länder. Eins unserer früheren E-Commerce-Projekte wurde aufgebaut und verkauft.",
    "tl4.title": "B.Sc. E-Commerce",
    "tl4.text": "Studium an der FH Wedel abgeschlossen. Meine Thesis: Wie wirkt sich die Kennzeichnung von KI-Inhalten auf die Glaubwürdigkeit im Online-Marketing aus — eine Frage, vor der früher oder später jede Marke steht, die KI einsetzt.",
    "tl5.year": "Heute",
    "tl5.title": "Freelance, volle Konzentration",
    "tl5.text": "FBA-Business und FLXUniversal laufen parallel, dazu Freelance-Kunden, die Shops, Kampagnen, SEO, Tracking oder Design von einer Person wollen statt von fünf Abteilungen.",

    // Skills
    "skills.tag": "Skills",
    "skills.title": "Was ich wirklich kann.",
    "skills.lead": "Keine Wunschliste — das sind die Tools und Disziplinen, mit denen ich regelmäßig arbeite, sortiert nach Einsatzzweck.",
    "sk1.note": "Bezahlte Kampagnen aufbauen, steuern und optimieren — inklusive internationaler Setups über mehrere Länder und Sprachen.",
    "sk2.title": "Shops & Webentwicklung",
    "sk2.note": "Von der handgebauten Landingpage bis zum kompletten Shop mit Zahlung, Versand und Produktdaten. Dazu die laufende Wartung, die keiner machen will.",
    "sk3.title": "SEO, Tracking & Daten",
    "sk3.note": "Organisch gefunden werden — und belegen können, was tatsächlich funktioniert hat. DSGVO-konform aufgesetzt, nicht nur ein Tag im Header.",
    "sk3.c1": "OnPage-SEO",
    "sk3.c2": "Keyword-Recherche",
    "sk4.title": "Amazon & Produktentwicklung",
    "sk4.note": "Der ganze Zyklus: Nische finden, Produkt mit dem Hersteller entwickeln, nach Deutschland holen und das Listing so bauen, dass es rankt und verkauft.",
    "sk4.c3": "Sourcing & Logistik",
    "sk4.c4": "Listing-Optimierung",
    "sk4.c6": "Import & Zoll",
    "sk5.title": "Design, Druck & Content",
    "sk5.note": "Produktfotografie, Druckerzeugnisse und Video. Die Dinge, die entscheiden, ob eine kleine Marke seriös oder improvisiert wirkt.",
    "sk5.c4": "Produktfotografie",
    "sk5.c5": "Flyer & Speisekarten",
    "sk5.c6": "Visitenkarten",
    "sk6.title": "Business & Prozess",
    "sk6.note": "Zwei eigene Unternehmen heißt auch: Ich kenne die unglamouröse Seite. Margenrechnung, Lieferantenverhandlung, DSGVO — und das Gespür dafür, wann sich ein Projekt nicht lohnt.",
    "sk6.c1": "Marge & Kalkulation",
    "sk6.c2": "Lieferantenverhandlung",
    "sk6.c3": "DSGVO-Grundlagen",
    "sk6.c4": "Projektsteuerung",
    "sk6.c5": "KI-Workflows",

    // Referenzen / Erfolge
    "hl.tag": "Referenzen",
    "hl.title": "Was ich bisher gemacht habe.",
    "hl.lead": "Konkrete Dinge, keine Adjektive. Manche Kundennamen bleiben vertraulich — im Gespräch gehe ich gern ins Detail.",
    "hl1.title": "E-Commerce-Projekt aufgebaut und verkauft",
    "hl1.text": "Eins unserer früheren Vorhaben ging von der Idee bis zum laufenden Geschäft und wurde dann verkauft. Produktauswahl, Lieferant, Branding, Listings und Ads — alles von uns selbst gemacht.",
    "hl1.c1": "Exit",
    "hl1.c2": "Eigene Marke",
    "hl2.title": "Internationales B2B-Google-Shopping-Setup",
    "hl2.text": "Für einen B2B-Kunden eine Google-Shopping- und Ads-Struktur über mehrere Länder geplant und umgesetzt: Feed-Aufbau, Kampagnenstruktur pro Markt, Tracking und Reporting.",
    "hl2.c3": "Mehrere Länder",
    "hl3.title": "Eigene Amazon-FBA-Marke, läuft weiter",
    "hl3.text": "Eigene Produkte mit Herstellern entwickelt, nach Deutschland importiert und über eigene Listings verkauft. Sourcing, Zoll, Fotos, Listing-Optimierung und PPC machen wir selbst — jeden Tag, mit eigenem Geld.",
    "hl3.c3": "Eigene Produkte",
    "hl4.title": "Shops von A bis Z gebaut",
    "hl4.text": "Webshops mit WordPress, WooCommerce und Shopify — von Struktur und Design über Produkte, Zahlung und Versand bis zum Launch, danach die laufende Betreuung.",
    "hl5.title": "Tracking, das einer Prüfung standhält",
    "hl5.text": "Google-Tag-Manager- und GA4-Setups mit sauberem Consent, Conversion-Tracking, das zu den Zahlen im Shop passt, und Auswertungen, die der Kunde auch lesen kann.",
    "hl6.title": "Design und Druck für lokale Betriebe",
    "hl6.text": "Speisekarten, Flyer, Visitenkarten, Produktfotos und Videoschnitt für kleine Unternehmen rund um Hamburg — oft als sichtbare Hälfte eines Website-Projekts.",
    "hl6.c2": "Fotografie",
    "hl6.c3": "Video",

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

    // Kontakt (Startseite)
    "contact.tag": "Kontakt",
    "contact.title": "Lass uns etwas bauen,<br>das sich verkauft.",
    "contact.text": "Neugierig, wie das konkret aussieht? Auf der Leistungsseite steht alles, was ich anbiete. Oder schreib mir einfach — eine kurze Nachricht mit deinem Vorhaben reicht.",
    "contact.emailLabel": "E-Mail",
    "contact.locLabel": "Standort",
    "contact.loc": "Wedel / Hamburg, Deutschland",
    "contact.timeLabel": "Antwortzeit",
    "contact.time": "Meistens innerhalb von 24 Stunden",
    "contact.btnServices": "Meine Leistungen ansehen",
    "contact.btnMail": "Schreib mir eine E-Mail",


    /* ======================================================================
       LEISTUNGSSEITE (services.html)
       ====================================================================== */

    // Navigation
    "snav.about": "Über mich",
    "snav.services": "Leistungen",
    "snav.process": "Ablauf",
    "snav.pricing": "Preise",
    "snav.contact": "Anfrage stellen",

    // Hero
    "shero.badge": "Nehme aktuell neue Kunden an",
    "shero.title": 'Was ich für<br><span class="grad">dein Business tun kann.</span>',
    "shero.sub": "Alles, was eine moderne Agentur anbietet — Produktentwicklung für Amazon, Kampagnen, SEO und SEA, Websites und Shops, Tracking, Design und Druck. Nur ohne Agentur: Du sprichst mit der Person, die die Arbeit auch macht.",
    "shero.cta1": "Alle Leistungen ansehen",
    "shero.cta2": "Anfrage stellen",
    "shero.toolsLabel": "Wo ich helfen kann",
    "shero.t1": "Amazon & Produktentwicklung",
    "shero.t2": "Bezahlte Kampagnen",
    "shero.t4": "Websites & Shops",
    "shero.t5": "Tracking",
    "shero.t6": "Design & Druck",

    // Abschnittskopf
    "srv.tag": "Leistungen",
    "srv.title": "Sechs Dinge, die ich gut kann.",
    "srv.lead": "Du kannst einzelne Punkte buchen oder die ganze Kette. Die meisten starten mit einem und nehmen den Rest dazu, wenn sie sehen, dass es funktioniert.",

    // 01 Amazon
    "s1.title": "Amazon & Produktentwicklung",
    "s1.lead": "Von „ich habe eine Idee“ bis zum Produkt, das sich auf Amazon verkauft. Ich mache das täglich für meine eigene Marke — du bekommst also die Version, die den Realitätstest schon hinter sich hat.",
    "s1.p1": "<b>Nischen- & Wettbewerbsanalyse</b> — Nachfrage, Margen und wie schlagbar die Konkurrenz wirklich ist, auf Basis von Helium-10-Daten statt Bauchgefühl.",
    "s1.p2": "<b>Produktentwicklung & Sourcing</b> — Hersteller finden, Angebote vergleichen, Musterrunden und das Produkt genau dort verbessern, wo die Rezensionen der Konkurrenz die Schwachstellen zeigen.",
    "s1.p3": "<b>Import, Zoll & Logistik</b> — die Ware nach Deutschland und ins FBA-Lager bringen, ohne teure Überraschungen.",
    "s1.p4": "<b>Listing, das rankt und verkauft</b> — Keyword-Recherche, Titel, Bulletpoints, Beschreibung, A+ Content und Backend-Keywords.",
    "s1.p5": "<b>Bilder, Fotos und 3D-Renderings</b> — das Hauptbild entscheidet, ob überhaupt jemand klickt. Mache ich selbst mit Affinity Photo und KeyShot.",
    "s1.p6": "<b>Launch-Strategie</b> — Preisgestaltung, PPC-Push, Bewertungsaufbau und was man in den ersten Wochen tut, wenn sich noch nichts bewegt.",

    // 02 Kampagnen
    "s2.title": "Kampagnen & bezahlte Werbung",
    "s2.lead": "Anzeigen, die daran gemessen werden, was sie einbringen — nicht daran, wie viele Impressionen sie sammeln. Ich schalte Kampagnen mit eigenem Geld und weiß, wie sich ein schlechter ACOS anfühlt.",
    "s2.p1": "<b>Amazon PPC</b> — Sponsored Products, Brands und Display: Kampagnenstruktur, Keyword-Harvesting, Gebotssteuerung und negative Keywords, die auch wirklich gepflegt werden.",
    "s2.p2": "<b>Google Ads & Google Shopping</b> — Suche, Performance Max und Shopping inklusive Produktfeed. Auch international über mehrere Länder und Sprachen.",
    "s2.p3": "<b>Microsoft Advertising</b> — der Kanal, den die meisten vergessen, im B2B oft mit spürbar günstigeren Klicks.",
    "s2.p4": "<b>Meta Ads</b> — Facebook und Instagram für Produkte, die man zeigen muss, statt darauf zu warten, dass jemand sie sucht.",
    "s2.p5": "<b>Laufende Optimierung</b> — wöchentlich oder monatlich, mit einem Report, den du in fünf Minuten liest: was ausgegeben wurde, was zurückkam, was ich geändert habe und warum.",
    "s2.p6": "<b>Konto-Rettung</b> — ein Konto übernehmen, das jemand anders aufgesetzt hat, es ausmisten und finden, wo das Budget versickert.",

    // 03 SEO & SEA
    "s3.title": "SEO & SEA",
    "s3.lead": "Bezahlter Traffic wirkt ab Tag eins, hört aber auf, sobald du aufhörst zu zahlen. Organisch dauert länger und läuft dann weiter. Die meisten brauchen beides — die Frage ist das Verhältnis.",
    "s3.p1": "<b>Technisches SEO</b> — Seitenstruktur, Ladezeit, Mobil, Indexierung, strukturierte Daten. Der unspektakuläre Teil, an dem die meisten Seiten scheitern.",
    "s3.p2": "<b>Keyword-Recherche & Content-Planung</b> — für welche Begriffe es sich in deiner Größenordnung überhaupt lohnt zu ranken und welche Inhalte dafür nötig sind.",
    "s3.p3": "<b>OnPage-Optimierung</b> — Titel, Meta-Descriptions, Überschriften, interne Verlinkung und Produkttexte, die klingen, als wären sie für Menschen geschrieben.",
    "s3.p4": "<b>Amazon-SEO</b> — Ranking innerhalb von Amazon funktioniert anders als bei Google. Listing-Struktur, Keyword-Abdeckung und das Zusammenspiel von PPC und organischem Rang.",
    "s3.p5": "<b>Lokales SEO</b> — Google-Unternehmensprofil und lokale Sichtbarkeit für Betriebe, deren Kunden aus der Nachbarschaft kommen.",
    "s3.p6": "<b>Ehrliches Reporting</b> — Rankings, Traffic und was das bedeutet. Wenn eine Maßnahme nicht funktioniert hat, hörst du das auch.",

    // 04 Websites
    "s4.title": "Websites & Shops — bauen und betreuen",
    "s4.lead": "Eine Seite, die schnell lädt, auf dem Handy funktioniert und die du in zwei Jahren noch pflegen kannst. Passend zum Zweck gebaut: handgeschrieben, wenn es leicht sein soll, WordPress oder Shopify, wenn du selbst ran willst.",
    "s4.p1": "<b>Unternehmenswebsites</b> — vom Einseiter bis zur mehrseitigen Website mit Blog, handgebaut oder auf WordPress, je nachdem, was du selbst ändern können musst.",
    "s4.p2": "<b>Onlineshops</b> — WooCommerce und Shopify: Produktdaten, Varianten, Zahlungsanbieter, Versandregeln, Steuereinstellungen und ein Checkout, der keine Kunden verliert.",
    "s4.p3": "<b>Dropshipping-Setups</b> — Lieferantenanbindung, automatisierter Bestellablauf und die Anzeigen, die den Traffic bringen.",
    "s4.p4": "<b>Relaunch & Rettung</b> — eine bestehende Seite übernehmen, die langsam ist, klemmt oder von jemandem gebaut wurde, der inzwischen verschwunden ist.",
    "s4.p5": "<b>Wartung & Pflege</b> — Updates, Backups, Sicherheit, Hosting, kleine Änderungen. Als monatliche Betreuung, damit du nicht daran denken musst.",
    "s4.p6": "<b>Rechtliches sauber eingebaut</b> — Cookie-Consent, Datenschutzerklärung und Impressum ordentlich integriert (Texte von deinem Anwalt, Einbau von mir).",

    // 05 Tracking
    "s5.title": "Tracking, Daten & Automatisierung",
    "s5.lead": "Was man nicht messen kann, kann man nicht skalieren. Und wer falsch misst, skaliert das Falsche — was noch schlimmer ist.",
    "s5.p1": "<b>Google Tag Manager & GA4</b> — ein sauberes Setup mit Events, die etwas bedeuten, statt vierzig Tags, die keiner mehr anzufassen wagt.",
    "s5.p2": "<b>Conversion-Tracking</b> — für Google, Meta und Microsoft, abgeglichen mit den Zahlen im Shop, damit die Plattformen nicht einfach melden, was du hören willst.",
    "s5.p3": "<b>Consent & DSGVO</b> — Consent-Banner, Consent Mode und Tags, die tatsächlich nur dann feuern, wenn sie dürfen.",
    "s5.p4": "<b>Dashboards & Auswertungen</b> — die relevanten Zahlen in einer Ansicht. Bei größeren Datenmengen mit Python, SQL oder R statt einer Tabelle, die eine Minute zum Öffnen braucht.",
    "s5.p5": "<b>Automatisierung</b> — wiederkehrende Handarbeit (Reports, Produktdaten, Preisabgleiche) wird zu einem Skript, das einfach läuft.",
    "s5.p6": "<b>KI im Arbeitsablauf</b> — wo KI in Content und Analyse wirklich Zeit spart und wo sie nur Text produziert, den keiner lesen will. Genau darum ging es in meiner Thesis.",

    // 06 Design
    "s6.title": "Design, Druck & Content",
    "s6.lead": "Die sichtbare Hälfte. Ein gutes Produkt mit schlechten Bildern verkauft sich schlechter als ein mittelmäßiges mit guten — unfair, aber so läuft es.",
    "s6.p1": "<b>Druckerzeugnisse</b> — Visitenkarten, Flyer, Speisekarten, Broschüren, Plakate und Etiketten, druckfertig geliefert.",
    "s6.p2": "<b>Produktfotografie</b> — saubere Freisteller auf Weiß für Shop und Amazon, dazu Lifestyle-Bilder, die das Produkt im Einsatz zeigen.",
    "s6.p3": "<b>Bildbearbeitung & Infografiken</b> — Retusche, Freisteller und die Grafiken, die ein Produkt in der Listing-Galerie erklären.",
    "s6.p4": "<b>3D-Renderings</b> — Produktvisualisierung mit KeyShot, wenn das Produkt noch nicht existiert oder ein Foto es nicht zeigen kann.",
    "s6.p5": "<b>Videoschnitt</b> — Produkt- und Werbevideos in DaVinci Resolve, in den Formaten, die jede Plattform haben will.",
    "s6.p6": "<b>Marken-Grundlagen</b> — Logo, Farben, Schriften und ein kleiner Style Guide, damit alles, was du veröffentlichst, zusammengehört.",

    // Ablauf
    "pr.tag": "Ablauf",
    "pr.title": "Von der ersten Nachricht zum laufenden Projekt.",
    "pr.lead": "Kein Onboarding-Marathon. Fünf Schritte, und nach dem ersten weißt du, ob es sich lohnt weiterzumachen.",
    "pr1.title": "Du meldest dich",
    "pr1.text": "Eine kurze Nachricht mit deinem Vorhaben reicht. Formular unten oder einfach eine E-Mail. Ich antworte innerhalb von 24 Stunden, meistens schneller.",
    "pr2.title": "Kostenloses Erstgespräch",
    "pr2.text": "30 Minuten, kostenlos, ohne Verkaufsgespräch. Wir schauen, wo du stehst und was tatsächlich helfen würde. Wenn ich nicht der Richtige dafür bin, sage ich das.",
    "pr3.title": "Angebot mit festem Umfang",
    "pr3.text": "Du bekommst ein schriftliches Angebot: was enthalten ist, was es kostet und wie lange es dauert. Keine versteckten Posten, die auf halber Strecke auftauchen.",
    "pr4.title": "Umsetzung",
    "pr4.text": "Ich baue, du bleibst informiert. Regelmäßige Updates, und du erreichst mich direkt — nicht über ein Kontaktformular oder einen Account-Manager.",
    "pr5.title": "Übergabe oder weitere Betreuung",
    "pr5.text": "Entweder bekommst du alles erklärt und übernimmst selbst, oder ich betreue es weiter — Wartung, Kampagnen, Reporting. Deine Entscheidung, keine Knebelverträge.",

    // Preise
    "pc.tag": "Preise",
    "pc.title": "Keine Pauschalpreise. Mit Absicht.",
    "pc.lead": "Ich veröffentliche keine festen Pakete, weil eine „Website ab X€“ entweder das kleine Projekt zu teuer macht oder dem großen zu wenig gibt. Was ein Projekt kostet, hängt von Größe und Komplexität ab — und das kann ich erst einschätzen, wenn ich weiß, was du vorhast.",
    "pc1.title": "Was den Preis bestimmt",
    "pc1.l1": "Umfang: eine Landingpage oder ein Shop mit 400 Produkten",
    "pc1.l2": "Komplexität: Standard-Setup oder Sonderanforderungen",
    "pc1.l3": "Ausgangslage: von null oder Bestehendes reparieren",
    "pc1.l4": "Zeitrahmen: normaler Ablauf oder eilig",
    "pc1.l5": "Betreuung: einmaliges Projekt oder monatliche Begleitung",
    "pc2.title": "Worauf du dich verlassen kannst",
    "pc2.l1": "Ein schriftliches Angebot, bevor irgendetwas startet",
    "pc2.l2": "Fester Preis für festen Umfang — keine Überraschungsrechnung",
    "pc2.l3": "Mehraufwand wird vorher abgestimmt, nie hinterher",
    "pc2.l4": "Kostenloses Erstgespräch, egal ob ein Projekt daraus wird",
    "pc2.l5": "Ein ehrliches Nein, wenn ich nicht der Richtige für dein Projekt bin",
    "pc.btn": "Angebot anfragen",

    // Kontakt (Leistungsseite)
    "sc.tag": "Kontakt",
    "sc.title": "Erzähl mir, was du<br>vorhast.",
    "sc.text": "Eine kurze Nachricht mit deinem Vorhaben reicht — was du hast, was du willst und ungefähr bis wann. Du bekommst von mir eine erste Einschätzung und eine ehrliche Antwort, ob ich der Richtige dafür bin.",
    "sc.emailLabel": "E-Mail",
    "sc.locLabel": "Standort",
    "sc.loc": "Wedel / Hamburg, Deutschland",
    "sc.timeLabel": "Antwortzeit",
    "sc.time": "Meistens innerhalb von 24 Stunden",
    "sc.btnMail": "Schreib mir eine E-Mail",
    "sc.btnAbout": "Mehr über mich",

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

  // Englische Originaltexte einmal aus dem HTML einsammeln.
  // WICHTIG: passiert vor dem ersten Scramble-Lauf, sonst würden
  // die verwürfelten Zeichen als "Original" gespeichert.
  const englishTexts = {};
  i18nElements.forEach(function (element) {
    const key = element.dataset.i18n;
    if (!(key in englishTexts)) {
      englishTexts[key] = element.innerHTML;
    }
  });

  let currentLang = "en";
  let activeRoles = rolesEn;
  let languageReady = false;   // steht auf true, sobald einmal gesetzt wurde

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Laufende Scramble-Animationen abbrechen: gleich wird der
    // Inhalt sowieso ausgetauscht.
    stopAllScrambles();

    // Alle markierten Elemente mit der passenden Sprache befüllen.
    // Fällt eine Übersetzung mal weg, bleibt das Englische stehen.
    i18nElements.forEach(function (element) {
      const key = element.dataset.i18n;
      element.innerHTML = (lang === "de" && germanTexts[key]) ? germanTexts[key] : englishTexts[key];
    });

    // Der Button zeigt immer die Sprache, zu der man wechseln kann
    if (langToggle) {
      langToggle.textContent = (lang === "de") ? "EN" : "DE";
    }

    // Tipp-Effekt mit den Rollen der neuen Sprache neu starten
    activeRoles = (lang === "de") ? rolesDe : rolesEn;
    startTyping();

    // Beim Umschalten während des Besuchs: sichtbare Überschriften noch
    // einmal auflösen lassen. Beim allerersten Aufruf nicht — da erledigt
    // das gleich der Beobachter, und doppelt gestartete Animationen
    // erzeugen nur unnötiges Ruckeln.
    if (languageReady) {
      replayVisibleScrambles();
    }
    languageReady = true;

    // Wahl merken (try/catch, falls localStorage blockiert ist)
    try {
      localStorage.setItem("lang", lang);
    } catch (e) { /* dann eben nicht, kein Beinbruch */ }
  }

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      setLanguage(currentLang === "de" ? "en" : "de");
    });
  }


  /* ------------------------------------------------------------------------
     2. Tipp-Effekt (nur Startseite)
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
    // Die Leistungsseite hat kein #typed — dann gibt es hier nichts zu tun
    if (!typedElement) {
      return;
    }

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
     3. Scramble-Effekt
     Überschriften mit data-scramble sehen zuerst aus wie zufälliger
     Zeichensalat und lösen sich beim Reinscrollen von links nach rechts
     in den echten Text auf.

     Wie es funktioniert:
     - Vor dem Start wird das innerHTML der Überschrift gesichert.
     - Danach werden nur die reinen Textknoten verändert. Dadurch bleiben
       <br> und <span class="grad"> unangetastet und das Layout stabil.
     - Über die Laufzeit wandert eine "Auflösungsgrenze" von links nach
       rechts: alles davor ist echt, alles dahinter ist Zufall.
     - Am Ende wird das gesicherte innerHTML zurückgeschrieben — so ist
       garantiert wieder exakt der Originaltext da.
     Leerzeichen bleiben immer Leerzeichen, sonst zerfällt die Zeile
     optisch in einen einzigen Block.

     Zwei Vorkehrungen gegen ruckelndes Layout:
     1. Ersetzt wird immer nur innerhalb derselben Zeichenklasse — für ein
        großes A kommt ein anderer Großbuchstabe, für ein kleines a ein
        Kleinbuchstabe, Satzzeichen bleiben stehen. Sonst schwanken die
        Zeilenbreiten so stark, dass die Überschrift mitten in der
        Animation umbricht.
     2. Während der Animation wird die gemessene Höhe der Überschrift
        festgehalten. Bricht sie doch einmal anders um, schiebt sich
        trotzdem nichts darunter weg.
     ------------------------------------------------------------------------ */

  // Bewusst ohne I, J, M, W, l, 1 und ähnliche Ausreißer: die sind deutlich
  // schmaler oder breiter als der Rest und lassen die Zeile zappeln.
  const SCRAMBLE_UPPER = "ABCDEFGHKLNOPQRSTUVXYZ";
  const SCRAMBLE_LOWER = "acdeghknopqrstuvxyz";
  const SCRAMBLE_DIGIT = "023456889";
  const scrambleElements = document.querySelectorAll("[data-scramble]");

  function scrambledChar(original) {
    if (original >= "A" && original <= "Z") {
      return SCRAMBLE_UPPER[Math.floor(Math.random() * SCRAMBLE_UPPER.length)];
    }
    if (original >= "a" && original <= "z") {
      return SCRAMBLE_LOWER[Math.floor(Math.random() * SCRAMBLE_LOWER.length)];
    }
    if (original >= "0" && original <= "9") {
      return SCRAMBLE_DIGIT[Math.floor(Math.random() * SCRAMBLE_DIGIT.length)];
    }
    // Leerzeichen, Umlaute, Satzzeichen: unverändert stehen lassen
    return original;
  }

  // Merkt sich pro Element die laufende Animation, damit sie abgebrochen
  // werden kann (z. B. beim Sprachwechsel).
  const runningScrambles = new Map();

  // Alle echten Textknoten unterhalb eines Elements einsammeln
  function collectTextNodes(root) {
    const found = [];
    (function walk(node) {
      node.childNodes.forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          if (child.nodeValue.length) {
            found.push({ node: child, text: child.nodeValue });
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    })(root);
    return found;
  }

  function finishScramble(element, state) {
    element.innerHTML = state.snapshot;       // Originaltext wiederherstellen
    element.style.minHeight = "";             // Höhensperre wieder lösen
    element.classList.remove("is-scrambling");
    runningScrambles.delete(element);
  }

  function stopScramble(element) {
    const running = runningScrambles.get(element);
    if (running) {
      cancelAnimationFrame(running.frameId);
      finishScramble(element, running);
    }
  }

  function stopAllScrambles() {
    Array.from(runningScrambles.keys()).forEach(stopScramble);
  }

  function runScramble(element) {
    if (reducedMotion) {
      return;
    }

    stopScramble(element);

    const snapshot = element.innerHTML;
    const textNodes = collectTextNodes(element);
    const totalChars = textNodes.reduce(function (sum, entry) {
      return sum + entry.text.length;
    }, 0);

    if (totalChars === 0) {
      return;
    }

    // Längere Überschriften dürfen etwas länger brauchen, aber nie ewig
    const duration = Math.min(320 + totalChars * 16, 1500);
