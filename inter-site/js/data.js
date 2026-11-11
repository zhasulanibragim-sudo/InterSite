/* =====================================================
   Site data — edit this file to update matches & kits.
   ===================================================== */

/* Fixtures: Serie A 2026/27, Matchdays 6–19 (from Inter's official calendar).
   - date: ISO string WITH timezone offset (Italy: +02:00 in summer, +01:00 in winter)
   - home: true  = Inter play at home
   - score: [homeTeamGoals, awayTeamGoals] in match order, or null if not added yet
   Example for a finished game:  score: [2, 1]                                      */
const MATCHES = [
  { id: 6,  date: "2026-10-10T18:00:00+02:00", opp: "Parma",      home: true,  comp: "Serie A", round: "Matchday 6",  score: null },
  { id: 7,  date: "2026-10-17T18:00:00+02:00", opp: "Bologna",    home: false, comp: "Serie A", round: "Matchday 7",  score: null },
  { id: 8,  date: "2026-10-25T12:30:00+01:00", opp: "Fiorentina", home: true,  comp: "Serie A", round: "Matchday 8",  score: null },
  { id: 9,  date: "2026-10-28T18:30:00+01:00", opp: "Venezia",    home: false, comp: "Serie A", round: "Matchday 9",  score: null },
  { id: 10, date: "2026-10-31T20:45:00+01:00", opp: "AC Milan",   home: false, comp: "Serie A", round: "Derby della Madonnina", score: null },
  { id: 11, date: "2026-11-08T18:00:00+01:00", opp: "Como",       home: true,  comp: "Serie A", round: "Matchday 11", score: null },
  { id: 12, date: "2026-11-22T20:45:00+01:00", opp: "Atalanta",   home: false, comp: "Serie A", round: "Matchday 12", score: null },
  { id: 13, date: "2026-11-28T20:45:00+01:00", opp: "Genoa",      home: true,  comp: "Serie A", round: "Matchday 13", score: null },
  { id: 14, date: "2026-12-05T18:00:00+01:00", opp: "Frosinone",  home: false, comp: "Serie A", round: "Matchday 14", score: null },
  { id: 15, date: "2026-12-13T15:00:00+01:00", opp: "Torino",     home: true,  comp: "Serie A", round: "Matchday 15", score: null },
  { id: 16, date: "2026-12-18T20:45:00+01:00", opp: "Lecce",      home: false, comp: "Serie A", round: "Matchday 16", score: null },
  { id: 17, date: "2027-01-03T12:30:00+01:00", opp: "Sassuolo",   home: true,  comp: "Serie A", round: "Matchday 17", score: null },
  { id: 18, date: "2027-01-06T20:45:00+01:00", opp: "Lazio",      home: false, comp: "Serie A", round: "Matchday 18", score: null },
  { id: 19, date: "2027-01-10T20:45:00+01:00", opp: "Juventus",   home: true,  comp: "Serie A", round: "Matchday 19", score: null }
];

/* Store products. Prices are demo prices in EUR.
   pattern: "stripes" | "hoops" | "band" | "solid"  (drawn as SVG in main.js) */
const KITS = [
  { id: "home",     name: "Home Kit",       tag: "Concept · 2026/27", desc: "The classic black & blue stripes. Lightweight, breathable match fabric.", price: 99.99, pattern: "stripes", c1: "#1558b0", c2: "#07090f", trim: "#d4af5a" },
  { id: "away",     name: "Away Kit",       tag: "Concept · 2026/27", desc: "Clean white base with a bold diagonal band across the chest.",            price: 99.99, pattern: "band",    c1: "#f3f5fa", c2: "#1558b0", trim: "#07090f" },
  { id: "third",    name: "Third Kit",      tag: "Concept · 2026/27", desc: "Midnight hoops with gold detailing for the big European nights.",         price: 94.99, pattern: "hoops",   c1: "#10162a", c2: "#1d2b52", trim: "#d4af5a" },
  { id: "gk",       name: "Goalkeeper Kit", tag: "Concept · 2026/27", desc: "High-visibility amber with a roomy fit for diving saves.",                price: 84.99, pattern: "solid",   c1: "#e8a317", c2: "",        trim: "#07090f" },
  { id: "training", name: "Training Top",   tag: "Training",          desc: "Quick-dry fabric for warm-ups and five-a-side with friends.",             price: 64.99, pattern: "band",    c1: "#0e2a5a", c2: "#2a7de1", trim: "#e9eefb" },
  { id: "retro",    name: "Retro Stripes",  tag: "Heritage",          desc: "Slim-stripe throwback inspired by the Grande Inter era.",                 price: 89.99, pattern: "stripes", stripeW: 10, c1: "#1b4f9c", c2: "#0a0d14", trim: "#f3f5fa" }
];
