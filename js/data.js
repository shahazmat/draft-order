// ─── FLAG & LOGO ASSETS ─────────────────────────────────────────────────────
const FLAG_CODE = {
  'Iran':                 'ir',
  'Egypt':                'eg',
  'Saudi Arabia':         'sa',
  'Colombia':             'co',
  'New Zealand':          'nz',
  'Norway':               'no',
  'Canada':               'ca',
  'Sweden':               'se',
  'England':              'gb-eng',
  'Spain':                'es',
  'Türkiye':              'tr',
  'Haiti':                'ht',
  'Portugal':             'pt',
  'Ghana':                'gh',
  'Germany':              'de',
  'Ivory Coast':          'ci',
  'Netherlands':          'nl',
  'USA':                  'us',
  'South Korea':          'kr',
  'Iraq':                 'iq',
  'Tunisia':              'tn',
  'Qatar':                'qa',
  'Senegal':              'sn',
  'Austria':              'at',
  'Jordan':               'jo',
  'Switzerland':          'ch',
  'Australia':            'au',
  'Belgium':              'be',
  'Czechia':              'cz',
  'DR Congo':             'cd',
  'Uzbekistan':           'uz',
  'Bosnia & Herzegovina': 'ba',
  'France':               'fr',
  'South Africa':         'za',
  'Scotland':             'gb-sct',
  'Curaçao':              'cw',
  'Ecuador':              'ec',
  'Mexico':               'mx',
  'Uruguay':              'uy',
  'Argentina':            'ar',
  'Algeria':              'dz',
  'Brazil':               'br',
  'Panama':               'pa',
  'Cabo Verde':           'cv',
  'Japan':                'jp',
  'Morocco':              'ma',
  'Croatia':              'hr',
  'Paraguay':             'py',
};

function flagUrl(country) {
  const code = FLAG_CODE[country];
  return code ? `https://flagcdn.com/w40/${code}.png` : null;
}

// ─── FANTASY TEAM ALLOCATIONS ───────────────────────────────────────────────
const FANTASY_TEAMS = {
  'Kurlewis':      ['Iran', 'Egypt', 'Saudi Arabia'],
  'Seamen':        ['Colombia', 'New Zealand', 'Norway'],
  'A&T':           ['Canada', 'Sweden', 'England'],
  'Barons':        ['Spain', 'Türkiye', 'Haiti'],
  'SDs':           ['Portugal', 'Ghana', 'Germany'],
  'Dirty Birds':   ['Ivory Coast', 'Netherlands', 'USA'],
  'Aligators':     ['South Korea', 'Iraq', 'Tunisia'],
  'Dynamics':      ['Qatar', 'Senegal', 'Austria'],
  'SERPION':       ['Jordan', 'Switzerland', 'Australia'],
  'Fishies':       ['Belgium', 'Czechia', 'DR Congo'],
  'Piggies':       ['Uzbekistan', 'Bosnia & Herzegovina', 'France'],
  'Puffins':       ['South Africa', 'Scotland', 'Curaçao'],
  'Ester':         ['Ecuador', 'Mexico', 'Uruguay'],
  'Puddings':      ['Argentina', 'Algeria', 'Brazil'],
  'Leeanacondas':  ['Panama', 'Cabo Verde', 'Japan'],
  'Pat':           ['Morocco', 'Croatia', 'Paraguay'],
};

// ─── TEAM STRENGTHS (FIFA ranking points, approx. June 2026) ────────────────
// The 8 QF-stage survivors were recalibrated 2026-07-08 so the simulated
// P(win World Cup) matches betting-market implied odds (France 31.4%,
// Spain 19.5%, Argentina 17.6%, England 16%, Norway 5.9%, Belgium 3.4%,
// Morocco 3.4%, Switzerland 2.8%), holding their combined total constant.
// Eliminated teams keep FIFA points (they no longer affect any simulation).
const TEAM_STRENGTH = {
  'Argentina':            1819,
  'Spain':                1856,
  'France':               1986,
  'England':              1827,
  'Portugal':             1768,
  'Brazil':               1766,
  'Netherlands':          1740,
  'Belgium':              1588,
  'Germany':              1715,
  'Croatia':              1700,
  'Italy':                1685,
  'Uruguay':              1670,
  'Colombia':             1655,
  'Morocco':              1602,
  'USA':                  1625,
  'Mexico':               1610,
  'Japan':                1600,
  'Switzerland':          1560,
  'Senegal':              1580,
  'Iran':                 1570,
  'South Korea':          1560,
  'Ecuador':              1550,
  'Australia':            1535,
  'Austria':              1525,
  'Türkiye':              1515,
  'Denmark':              1505,
  'Norway':               1667,
  'Canada':               1490,
  'Sweden':               1515,
  'Ivory Coast':          1533,
  'Ghana':                1485,
  'Paraguay':             1503,
  'Algeria':              1470,
  'Tunisia':              1483,
  'Panama':               1541,
  'Qatar':                1450,
  'Egypt':                1460,
  'Saudi Arabia':         1445,
  'Scotland':             1498,
  'South Africa':         1430,
  'DR Congo':             1478,
  'Bosnia & Herzegovina': 1465,
  'Czechia':              1501,
  'Uzbekistan':           1440,
  'Jordan':               1430,
  'Iraq':                 1420,
  'New Zealand':          1410,
  'Cabo Verde':           1395,
  'Curaçao':              1350,
  'Haiti':                1340,
};

const AVG_STRENGTH = Object.values(TEAM_STRENGTH).reduce((a, b) => a + b, 0) / Object.values(TEAM_STRENGTH).length;

function getStrength(team) {
  return TEAM_STRENGTH[team] || AVG_STRENGTH;
}

// Lambda for Poisson goal model from the head-to-head strength ratio.
// λ = 1.3 × (S_team/S_opp)²: the λ ratio within a pairing is (S1/S2)⁴ — the
// same win-prob spread as the old (S/AVG)⁴ tournament-average model — but
// scoring rates now respond to the opponent: minnows are suppressed by strong
// defenses, favorites inflate against weak ones, and λ1×λ2 is constant so
// mismatches are high-scoring while even matchups play tight.
function goalLambda(team, opp) {
  const ratio = getStrength(team) / getStrength(opp);
  return Math.max(0.3, Math.min(4.0, 1.3 * ratio * ratio));
}

// ESPN display name → canonical name used above
const ESPN_NORMALIZE = {
  'United States':        'USA',
  'Bosnia-Herzegovina':   'Bosnia & Herzegovina',
  "Côte d'Ivoire":        'Ivory Coast',
  'Korea Republic':       'South Korea',
  'Republic of Korea':    'South Korea',
  'Congo DR':             'DR Congo',
  'Cape Verde':           'Cabo Verde',
  'Cabo Verde':           'Cabo Verde',
  'Curacao':              'Curaçao',
  'Turkey':               'Türkiye',
  'Czech Republic':       'Czechia',
  'New Zealand':          'New Zealand',
  'DR Congo':             'DR Congo',
};

function normalize(name) {
  return ESPN_NORMALIZE[name] || name;
}
