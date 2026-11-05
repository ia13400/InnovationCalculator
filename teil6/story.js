/*
 * Cinematic reading of the original Teil-6 plan in data.js.
 * All dates, gates, quantities and locations below come from ROCKET_DATA or
 * ROCKET_META. They remain planning assumptions (ROCKET_DATA.*.assumptions),
 * not reports of completed work. Scene language is conceptual.
 *
 * Chapters overlap where the source schedule overlaps. dateISO is the primary
 * chapter anchor; chef.date preserves the independent kitchen/team schedule.
 * laneIds are connected original rows, not a claim that every row starts at
 * the chapter anchor. Row 0 is the separate master lane and is never included.
 *
 * A rows: 1 safety, 2 pavilion, 3 culinary, 4 sales, 5 pilots, 6 scale-up.
 * B rows: 1 site, 2 permits, 3 architecture, 4 kitchen, 5 pilots, 6 opening.
 * The location candidates are schematic search labels, not actual parcels.
 */
window.ROCKET_STORY = {
  A: {
    // A.w4.was[0], A.t1[0,1,5], A.rows[1,2,6]; A.sources[2,3,8].
    location: {
      name: 'Mobiler Pavillon · Florida → Starbase, Texas',
      candidates: ['Konzeptfläche 01', 'Konzeptfläche 02', 'Konzeptfläche 03']
    },
    phases: [
      {
        // A.rows[0]: G0; A.rows[4]: ILTM; A.w4.was[0,1].
        key: 'intro',
        eyebrow: 'Die Idee',
        title: 'Erst der Horizont. Dann der Plan.',
        copy: 'Ein mobiler Glas-Pavillon bringt 20 Gäste an einen Nachtstart. Mit dem Projektauftrag beginnt der Weg zum ersten Pilot-Dinner im März 2028.',
        date: '30.11.2026',
        dateISO: '2026-11-30',
        year: '2026',
        gate: 'G0',
        master: 'Projektauftrag',
        laneIds: [4],
        laneNotes: { 4: 'ILTM Cannes · 30.11.2026' },
        chef: {
          state: 'off',
          title: 'Ein Abend beginnt als Idee.',
          copy: 'Die Suche nach dem kulinarischen Partner beginnt parallel zur Standortsuche.',
          date: 'Ab 01.12.2026'
        }
      },
      {
        // A.rows[1]: Stellplatzwahl 01.12.26–10.04.27; A.t1[0].
        // A.rows[3]: Koch-Auswahl 01.12.26–20.04.27; A.sources[7].
        key: 'scan',
        eyebrow: 'Standortsuche',
        title: 'Den richtigen Blick finden.',
        copy: 'Der Stellplatz wird außerhalb der Sperrzonen gesucht: Blickrichtung, Lärm und Sicherheit entscheiden. Gleichzeitig beginnt die Suche nach dem kulinarischen Partner.',
        date: '01.12.2026–10.04.2027',
        dateISO: '2026-12-01',
        year: '2026–2027',
        master: 'Konzept · Standort',
        laneIds: [1, 4],
        laneNotes: {
          1: 'Stellplatzwahl · 01.12.2026–10.04.2027',
          3: 'Koch-Auswahl · 01.12.2026–20.04.2027',
          4: 'Pitch & PR · 22.12.2026–03.04.2027'
        },
        chef: {
          state: 'shortlist',
          title: 'Die Küche entsteht parallel.',
          copy: 'Gesucht wird ein Sternekoch aus dem Raum Orlando. Die Auswahl läuft bis 20.04.2027; der Partnervertrag ist für 30.04.2027 geplant.',
          date: '01.12.2026–20.04.2027'
        }
      },
      {
        // A.rows[0,2]: G1 / Auftrag 30.06.27; A.rows[1,3,4].
        // A.t1[1] and A.sources[8] ground the modular pavilion, not its rendering.
        key: 'concept',
        eyebrow: 'Entwurf & Partner',
        title: 'Aus einer Fläche wird ein Entwurf.',
        copy: 'Der Pavillon legt sich als transparente Planung über den Standort. Am 30.06.2027 werden Konzept und Auftrag freigegeben; Menü und Service entwickeln sich parallel.',
        date: '30.06.2027',
        dateISO: '2027-06-30',
        year: '2027',
        gate: 'G1',
        master: 'Konzept frei',
        laneIds: [2, 1],
        laneNotes: {
          1: 'Gutachten · 10.04.–24.07.2027',
          2: 'Pavillon-Auftrag · 30.06.2027',
          3: 'Partnervertrag 30.04. · Menü ab 10.05.2027',
          4: 'Partnerkanäle · 23.04.–30.09.2027'
        },
        chef: {
          state: 'selected',
          title: 'Der Partner steht.',
          copy: 'Auf den Partnervertrag am 30.04.2027 folgt die gemeinsame Entwicklung von Menü und Service. Sie läuft vom 10.05. bis 31.10.2027.',
          date: '30.04.2027'
        }
      },
      {
        // A.rows[1]: Gutachten 31.07.27 and Florida approval 31.12.27.
        // A.rows[2,3,4] explicitly overlap this work; permits do not precede all construction.
        key: 'permit',
        eyebrow: 'Genehmigung & Sicherheit',
        title: 'Jede Freigabe macht die Idee belastbar.',
        copy: 'Das Gutachten ist für 31.07.2027 vorgesehen, die Florida-Genehmigung bis 31.12.2027. Währenddessen laufen Prototypbau und Menüentwicklung weiter.',
        date: '31.07.–31.12.2027',
        dateISO: '2027-07-31',
        year: '2027',
        master: 'Umsetzung · Freigaben',
        laneIds: [1, 2, 4],
        laneNotes: {
          1: 'Florida-Freigabe · Ziel 31.12.2027',
          2: 'Bau Prototyp · 10.07.–08.12.2027',
          3: 'Menü & Service · 10.05.–31.10.2027',
          4: 'Vorverkauf ab 01.10.2027'
        },
        chef: {
          state: 'selected',
          title: 'Menü trifft Startfenster.',
          copy: 'Der gewählte Partner entwickelt Menü und Service. Das Testdinner am 15.11.2027 führt die Abläufe zusammen.',
          date: '10.05.–31.10.2027'
        }
      },
      {
        // A.rows[2]: prototype acceptance 20.12.27; A.rows[1]: FL approval.
        // A.rows[0] / META.A.gates[2]: G2; A.rows[3]: rehearsal and training.
        key: 'build',
        eyebrow: 'Prototyp & Abnahme',
        title: 'Der Entwurf wird Wirklichkeit.',
        copy: 'Der Prototyp wird am 20.12.2027 abgenommen. Nach Florida-Freigabe und Testdinner entscheidet G2 am 31.01.2028 über den Pilotbetrieb.',
        date: '31.01.2028',
        dateISO: '2028-01-31',
        year: '2028',
        gate: 'G2',
        master: 'Go Pilot',
        laneIds: [2, 3],
        laneNotes: {
          1: 'Genehmigung Florida · 31.12.2027',
          2: 'Prototyp-Abnahme · 20.12.2027',
          3: 'Testdinner 15.11.2027 · Schulung bis 20.02.2028',
          4: '64 verkaufte Plätze · Ziel 20.02.2028'
        },
        chef: {
          state: 'rehearsal',
          title: 'Der Abend wird geprobt.',
          copy: 'Nach dem Testdinner am 15.11.2027 schult das Team die Abläufe. Die Schulungsphase endet am 20.02.2028.',
          date: '28.11.2027–20.02.2028'
        }
      },
      {
        // A.rows[5]: all four pilot dates, 20 guests, USD35,000; A.t1[4].
        // A.rows[1,2,4,6]: parallel TX preparation, optimisation and sales.
        key: 'pilot',
        eyebrow: 'Pilotphase Florida',
        title: 'Vier Abende. Echtes Feedback.',
        copy: 'Vier Pilot-Dinner mit je 20 Gästen testen Erlebnis und Nachfrage zu 35.000 USD pro Platz. Die Termine liegen im März, Mai, Oktober und November 2028; parallel beginnt die Vorbereitung für Texas.',
        date: '15.03.–15.11.2028',
        dateISO: '2028-03-15',
        year: '2028',
        master: 'Pilotphase Florida',
        laneIds: [5, 3, 4],
        laneNotes: {
          1: 'Genehmigung Texas · ab 01.07.2028',
          2: 'Optimierung · 01.06.–30.09.2028',
          3: 'Teamschulung bis 20.02.2028 · bereit für die Piloten',
          4: 'Vorverkauf zu 50.000 USD · ab 01.07.2028',
          5: '15.03. · 15.05. · 15.10. · 15.11.2028',
          6: 'Vorbereitung Starbase · 01.07.–31.12.2028'
        },
        chef: {
          state: 'ready',
          title: 'Bereit für die ersten Gäste.',
          copy: 'Menü und geschultes Team treffen auf den ersten Pilotabend. NPS und Zahlungsbereitschaft werden nach jedem Dinner erhoben.',
          date: '15.03.2028'
        }
      },
      {
        // A.rows[0] / META.A.gates[3]: G3 15.12.28, price and Starbase decision.
        // A.rows[1,2,4,5,6] preserve the independent Texas and scale-up dates.
        key: 'launch',
        eyebrow: 'Go Markteinführung',
        title: 'Aus dem Pilot wird ein Angebot.',
        copy: 'Am 15.12.2028 entscheidet G3 über die Markteinführung. Bestätigen NPS und Zahlungsbereitschaft den Zielpreis von 50.000 USD, folgt das Go für Starbase.',
        date: '15.12.2028',
        dateISO: '2028-12-15',
        year: '2028',
        gate: 'G3',
        master: 'Go Markteinführung',
        laneIds: [5, 4, 6],
        laneNotes: {
          1: 'Texas-Freigabe · Ziel 28.02.2029',
          2: 'Einsatz Florida und Texas · ab 01.01.2029',
          4: 'Warteliste & Vorverkauf · 50.000 USD',
          5: 'Vier Piloten bis 15.11.2028 · Auswertung G3',
          6: 'Vorbereitung Starbase · bis 31.12.2028'
        },
        chef: {
          state: 'ready',
          title: 'Erfahrung wird zum Standard.',
          copy: 'Die Erfahrungen aus den vier Pilot-Dinnern fließen in die nächsten Abende ein.',
          date: '15.12.2028'
        }
      },
      {
        // A.rows[6]: 10 / 16 / 24 events in 2029 / 2030 / 2031; first Starbase 2029.
        // A.rows[0] / META.A.gates[4]: G4 31.12.30. A.t1[5]: South Padre Island.
        key: 'horizon',
        eyebrow: 'Hochlauf & Regelbetrieb',
        title: 'Ein Pavillon. Zwei Horizonte.',
        copy: 'Florida und Starbase teilen sich den mobilen Pavillon: geplant sind 10 Events 2029, 16 im Jahr 2030 und 24 ab 2031. G4 übergibt das Projekt am 31.12.2030 an die Linie.',
        date: '2029–2031',
        dateISO: '2030-12-31',
        year: '2029–2031',
        gate: 'G4',
        master: 'Hochlauf FL + TX',
        laneIds: [6, 2],
        laneNotes: {
          1: 'Texas-Freigabe · 28.02.2029',
          2: 'Ein Pavillon für Florida und Texas · 2029–2030',
          4: 'Warteliste zum Zielpreis von 50.000 USD',
          6: 'Erstes Starbase-Event 2029 · 24 Events im Jahr 2031'
        },
        chef: {
          state: 'ready',
          title: 'Ein Service für beide Standorte.',
          copy: 'Das in Florida erprobte Konzept zieht mit dem Pavillon weiter. Geplant ist der Regelbetrieb mit 24 Events im Jahr 2031.',
          date: '2031'
        }
      }
    ]
  },
  B: {
    // B.w4.was[0], B.t1[0], META.B.gates[1]; B.sources[8] is the group's source.
    // Deliberately no addresses or georeferenced parcels in the scene labels.
    location: {
      name: 'Indian River · Titusville, Florida',
      candidates: ['Konzeptfläche 01', 'Konzeptfläche 02', 'Konzeptfläche 03']
    },
    phases: [
      {
        // B.rows[0]: G0; B.rows[6]: ILTM; B.w4.was[0,1].
        key: 'intro',
        eyebrow: 'Die Idee',
        title: 'Ein Horizont wird zum Ziel.',
        copy: 'Am Indian River ist eine Lounge für 20 Gäste geplant, mit Glasfront Richtung LC-39A. Der Projektauftrag setzt am 30.11.2026 den Anfang.',
        date: '30.11.2026',
        dateISO: '2026-11-30',
        year: '2026',
        gate: 'G0',
        master: 'Projektauftrag',
        laneIds: [6],
        laneNotes: { 6: 'ILTM Cannes · 30.11.2026' },
        chef: {
          state: 'off',
          title: 'Der Abend beginnt vor dem Bau.',
          copy: 'Standort und kulinarischer Partner werden ab Dezember 2026 parallel gesucht.',
          date: 'Ab 01.12.2026'
        }
      },
      {
        // B.rows[1]: search / LOI and G1; B.t1[0]: sightline, flood, zoning, contamination.
        // B.rows[4]: chef selection begins 01.12.26; B.rows[5]: KSC contract 31.03.27.
        key: 'scan',
        eyebrow: 'Standortsuche',
        title: 'Die Aussicht muss auch tragfähig sein.',
        copy: 'Die Suche prüft Sicht auf LC-39A, Flutzone, Zoning und Altlasten. Eine Kaufoption soll den Standort am 31.03.2027 sichern; gekauft wird erst nach der Baugenehmigung.',
        date: '01.12.2026–31.03.2027',
        dateISO: '2027-03-31',
        year: '2026–2027',
        gate: 'G1',
        master: 'Standort · Kaufoption',
        laneIds: [1, 2],
        laneNotes: {
          1: 'Suche & LOI · Kaufoption 31.03.2027',
          2: 'Pre-App 15.02. · Site Plan ab 25.02.2027',
          3: 'Architekt 28.02. · Entwurf ab 08.03.2027',
          4: 'Koch-Auswahl · 01.12.2026–20.04.2027',
          5: 'Pilot-Location · Vertrag KSC 31.03.2027'
        },
        chef: {
          state: 'shortlist',
          title: 'Parallel: den Partner finden.',
          copy: 'Die Koch-Auswahl läuft bereits seit 01.12.2026. Der Partnervertrag ist für 30.04.2027 vorgesehen, lange vor der Lounge-Eröffnung.',
          date: '01.12.2026–20.04.2027'
        }
      },
      {
        // B.rows[3]: design 08.03.–31.08.27; B.t1[2]: approx.1000m², two floors, roof terrace.
        // B.rows[2]: Site Plan 30.06.27; B.rows[4]: chef contract 30.04.27.
        key: 'concept',
        eyebrow: 'Architektur & Kulinarik',
        title: 'Eine transparente Idee nimmt Raum ein.',
        copy: 'Der Entwurf zeigt rund 1.000 m² auf zwei Geschossen, Glasfront, Dachterrasse und Profiküche. Architektur und Menü entwickeln sich parallel, während der Standort per Option gesichert bleibt.',
        date: '30.04.–31.08.2027',
        dateISO: '2027-04-30',
        year: '2027',
        master: 'Planung',
        laneIds: [3, 2],
        laneNotes: {
          1: 'Kaufoption bis zur Baugenehmigung',
          2: 'Site Plan · Ziel 30.06.2027',
          3: 'Entwurf & Planung · 08.03.–31.08.2027',
          4: 'Partnervertrag · 30.04.2027',
          5: 'Erster Pilot im KSC · 30.06.2027',
          6: 'Partnerkanäle · 23.04.–31.12.2027'
        },
        chef: {
          state: 'selected',
          title: 'Der Partner ist Teil des Entwurfs.',
          copy: 'Der Partnervertrag am 30.04.2027 schafft die Grundlage für die Pilot-Dinner. Deren Feedback fließt später in Menü und Innenausbau ein.',
          date: '30.04.2027'
        }
      },
      {
        // B.rows[0,2]: G2 / building permit 30.09.27; B.rows[1]: purchase 15.10.27.
        // B.t1[1] contains ERP / FAA / 2COP; B.rows[4,5] remain parallel.
        key: 'permit',
        eyebrow: 'Genehmigung & Sicherheit',
        title: 'Der Plan braucht eine Freigabe.',
        copy: 'Am 30.09.2027 liegt G2 auf dem kritischen Pfad: die Baugenehmigung. Erst danach folgen Grundstückskauf und die zweite Budgetstufe für den Bau.',
        date: '30.09.2027',
        dateISO: '2027-09-30',
        year: '2027',
        gate: 'G2',
        master: 'Baugenehmigung',
        laneIds: [2, 1],
        laneNotes: {
          1: 'Kauf nach Baugenehmigung · 15.10.2027',
          2: 'Baugenehmigung · 30.09.2027',
          3: 'Baubeginn geplant für 01.11.2027',
          4: 'GM suchen · 01.09.–20.12.2027',
          5: 'KSC-Piloten laufen seit 30.06.2027',
          6: 'Partnerkanäle · bis 31.12.2027'
        },
        chef: {
          state: 'selected',
          title: 'Der Partner steht. Das Team wächst.',
          copy: 'Der kulinarische Partner ist seit dem geplanten Vertrag am 30.04.2027 eingebunden. Parallel wird der General Manager gesucht; Ziel ist 31.12.2027.',
          date: '01.09.–31.12.2027'
        }
      },
      {
        // B.rows[3]: construction 01.11.27–20.08.28, handover31.08.28, 10% buffer.
        // B.rows[4]: team/training 01.03.–10.09.28; B.rows[5]: P2 15.11.27.
        // B.w4.wie[1,2] and B.sources[9] ground the buffer and parallel feedback.
        key: 'build',
        eyebrow: 'Bau & Ausstattung',
        title: 'Die Linien werden zu einem Ort.',
        copy: 'Am 01.11.2027 beginnt der Bau mit 10 % Zeitpuffer; die Übergabe ist für 31.08.2028 geplant. Während die Lounge entsteht, liefern die KSC-Piloten bereits Erfahrungen.',
        date: '01.11.2027',
        dateISO: '2027-11-01',
        year: '2027–2028',
        master: 'Bau & Pilot-Dinner',
        laneIds: [3, 2],
        laneNotes: {
          2: '2COP & Abnahmen · 01.03.–20.08.2028',
          3: 'Bau ab 01.11.2027 · Übergabe 31.08.2028',
          4: 'GM an Bord · Ziel 31.12.2027',
          5: 'Zweiter KSC-Pilot · 15.11.2027',
          6: 'Vorverkauf & Warteliste · ab 01.01.2028'
        },
        chef: {
          state: 'rehearsal',
          title: 'Im KSC wird das Erlebnis erprobt.',
          copy: 'Der zweite Pilotabend ist für 15.11.2027 geplant. Teamaufbau und Schulung für die Lounge folgen vom 01.03. bis 10.09.2028.',
          date: '15.11.2027'
        }
      },
      {
        // B.rows[5]: pilots30.06.27,15.11.27,15.03.28,30.06.28; B.rows[0]: G3.
        // This chapter is review, NOT a new pilot start after construction.
        // B.t1[4] / B.sources[3]: Apollo/Saturn V Center; B.w4.wie[2]: feedback.
        key: 'pilot',
        eyebrow: 'Pilot-Auswertung',
        title: 'Die Gäste waren schon Teil der Planung.',
        copy: 'Parallel seit Juni 2027: Vier Pilot-Dinner im KSC laufen bis 30.06.2028, während die Lounge entsteht. G3 wertet am 31.07.2028 Nachfrage, Preis und Gästeerfahrung aus.',
        date: '31.07.2028',
        dateISO: '2028-07-31',
        year: '2028',
        gate: 'G3',
        master: 'Pilot-Auswertung',
        laneIds: [5, 4, 3],
        laneNotes: {
          2: 'Betriebserlaubnis · Ziel 31.08.2028',
          3: 'Bau & Ausstattung · bis 20.08.2028',
          4: 'Team & Schulung · 01.03.–10.09.2028',
          5: 'Parallel seit 30.06.2027 · vier Piloten bis 30.06.2028',
          6: 'Vorverkauf & Warteliste · bis 20.09.2028'
        },
        chef: {
          state: 'rehearsal',
          title: 'Vom Pilot zum eingespielten Team.',
          copy: 'Das Feedback der vier KSC-Abende schärft Menü und Innenausbau. Teamaufbau und Schulung laufen bis 10.09.2028 weiter.',
          date: '01.03.–10.09.2028'
        }
      },
      {
        // B.rows[0,6]: opening01.10.28; B.rows[2,3]: permits/handover31.08.28.
        // B.rows[4]: training through10.09.28. B.w4.was[0]:20places.
        key: 'launch',
        eyebrow: 'Eröffnung',
        title: 'Der Ort ist bereit für seinen ersten Abend.',
        copy: 'Die Lounge soll am 01.10.2028 öffnen. Übergabe, Betriebserlaubnis und Teamschulung führen hier zusammen: 20 Plätze mit Blick Richtung LC-39A.',
        date: '01.10.2028',
        dateISO: '2028-10-01',
        year: '2028',
        master: 'Eröffnung & Anlauf',
        laneIds: [6, 4, 2],
        laneNotes: {
          2: 'Betriebserlaubnis · 31.08.2028',
          3: 'Übergabe · 31.08.2028',
          4: 'Teamschulung abgeschlossen · 10.09.2028',
          6: 'Eröffnung · 01.10.2028'
        },
        chef: {
          state: 'ready',
          title: 'Bereit für den Eröffnungsabend.',
          copy: 'Partner, General Manager und geschultes Team führen das in den Piloten erprobte Erlebnis in der Lounge zusammen.',
          date: '01.10.2028'
        }
      },
      {
        // B.rows[0]: G4 31.03.29 and regular operation10/16/24events; META.B.gates[4].
        // B.rows[6]: run-up12.10.28–15.03.29. B.w4.was[2]:24events/year target.
        key: 'horizon',
        eyebrow: 'Übergabe & Regelbetrieb',
        title: 'Ein neuer Fixpunkt an der Space Coast.',
        copy: 'Nach der Anlaufphase übergibt G4 die Lounge am 31.03.2029 an den Betrieb. Der Plan führt über 10 und 16 auf 24 Events pro Jahr.',
        date: '31.03.2029 · Ausblick bis 2031',
        dateISO: '2029-03-31',
        year: '2029–2031',
        gate: 'G4',
        master: 'Übergabe & Regelbetrieb',
        laneIds: [6],
        laneNotes: {
          6: 'Anlauf bis 15.03.2029 · Übergabe 31.03.2029'
        },
        chef: {
          state: 'ready',
          title: 'Aus Erfahrung wird Routine.',
          copy: 'Das Team trägt das kulinarische Konzept in den Regelbetrieb und den geplanten Hochlauf auf 24 Events pro Jahr.',
          date: '2029–2031'
        }
      }
    ]
  }
};
