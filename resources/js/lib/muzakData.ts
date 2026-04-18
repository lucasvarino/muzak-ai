export interface MoodAxis {
    left: string;
    right: string;
    value: number;
}

export interface ReportSection {
    heading: string;
    paragraphs: string[];
}

export interface SimilarItem {
    coverId: string;
    title: string;
    artist: string;
    reason: string;
}

export interface Report {
    spotifyUrl: string;
    coverId: string;
    title: string;
    artist: string;
    year: number;
    label: string;
    length: string;
    tracks: number;
    genres: string[];
    mood: MoodAxis[];
    sections: ReportSection[];
    similar: SimilarItem[];
}

export interface AnalyzeStep {
    id: string;
    label: string;
    detail: string;
    duration: number;
}

export interface DiscoverResult {
    coverId: string;
    title: string;
    artist: string;
    year: number;
    excerpt: string;
    similarity: number;
}

export interface Sleeve {
    id: string;
    render: () => string;
}

export interface Cover {
    render: () => string;
}

function buildSleeve(o: { bg: string; ink: string; artist: string; title: string; mark: (ink: string) => string }): string {
    const { bg, ink, artist, title, mark } = o;
    return `
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
        <rect width="400" height="400" fill="${bg}"/>
        ${mark(ink)}
        <text x="24" y="38" font-family="'JetBrains Mono', monospace" font-size="10" fill="${ink}" letter-spacing="1.5" opacity="0.85">${artist}</text>
        <text x="24" y="378" font-family="'GT Super Display','Playfair Display',serif" font-size="22" fill="${ink}" font-style="italic">${title}</text>
      </svg>`;
}

const marks: Record<string, (ink: string) => string> = {
    ring: (ink) =>
        `<circle cx="200" cy="210" r="110" fill="none" stroke="${ink}" stroke-width="1.5"/>
       <circle cx="200" cy="210" r="60" fill="none" stroke="${ink}" stroke-width="1.5"/>
       <circle cx="200" cy="210" r="6" fill="${ink}"/>`,
    bar: (ink) =>
        `<rect x="60" y="180" width="280" height="60" fill="${ink}"/>
       <rect x="60" y="260" width="140" height="6" fill="${ink}"/>`,
    cross: (ink) =>
        `<line x1="100" y1="120" x2="300" y2="320" stroke="${ink}" stroke-width="2"/>
       <line x1="300" y1="120" x2="100" y2="320" stroke="${ink}" stroke-width="2"/>`,
    triangle: (ink) =>
        `<polygon points="200,110 310,310 90,310" fill="none" stroke="${ink}" stroke-width="1.5"/>
       <circle cx="200" cy="240" r="4" fill="${ink}"/>`,
    grid: (ink) => {
        let lines = '';
        for (let i = 1; i < 6; i++) {
            const p = 80 + i * 40;
            lines += `<line x1="80" y1="${p}" x2="320" y2="${p}" stroke="${ink}" stroke-width="0.5" opacity="0.5"/>`;
            lines += `<line x1="${p}" y1="80" x2="${p}" y2="320" stroke="${ink}" stroke-width="0.5" opacity="0.5"/>`;
        }
        return `<rect x="80" y="80" width="240" height="240" fill="none" stroke="${ink}" stroke-width="1"/>${lines}
              <circle cx="200" cy="200" r="20" fill="${ink}"/>`;
    },
    bigType: (ink) =>
        `<text x="200" y="260" text-anchor="middle" font-family="'GT Super Display','Playfair Display',serif" font-size="240" fill="${ink}" font-style="italic">a</text>`,
    halftone: (ink) => {
        let dots = '';
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const r = 2 + Math.abs(Math.sin(x * 0.7 + y * 0.5)) * 8;
                dots += `<circle cx="${40 + x * 32}" cy="${80 + y * 28}" r="${r}" fill="${ink}" opacity="0.8"/>`;
            }
        }
        return dots;
    },
    slash: (ink) =>
        `<path d="M 60 320 L 340 80" stroke="${ink}" stroke-width="20"/>
       <path d="M 60 260 L 220 260" stroke="${ink}" stroke-width="2"/>`,
};

export const covers: Record<string, Cover> = {
    assemble24: {
        render: () => `
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
          <rect width="400" height="400" fill="#d9d2c4"/>
          <g font-family="'GT Super Display', 'Playfair Display', serif" font-weight="400">
            <text x="200" y="270" text-anchor="middle" font-size="320" fill="#0a0a0a" letter-spacing="-18">24</text>
          </g>
          <text x="30" y="50" font-family="'JetBrains Mono', monospace" font-size="11" fill="#0a0a0a" letter-spacing="2">TRIPLES — MODHAUS</text>
          <text x="30" y="375" font-family="'JetBrains Mono', monospace" font-size="10" fill="#0a0a0a" letter-spacing="2">LP / 05.08.2024</text>
          <text x="370" y="375" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="10" fill="#0a0a0a" letter-spacing="2">ASSEMBLE24</text>
        </svg>`,
    },
};

function makeSleeve(id: string, opts: { bg: string; ink: string; artist: string; title: string; mark: (ink: string) => string }): Sleeve {
    return { id, render: () => buildSleeve(opts) };
}

const sleeves: Sleeve[] = [
    makeSleeve('gnd', { bg: '#d9d2c4', ink: '#0a0a0a', artist: 'TRIPLES', title: 'ASSEMBLE24', mark: marks.bigType }),
    makeSleeve('nme', { bg: '#1a1a1a', ink: '#c9a84c', artist: 'CARIBOU', title: 'Suddenly', mark: marks.ring }),
    makeSleeve('bla', { bg: '#e8dcc4', ink: '#0a0a0a', artist: 'JESSIE WARE', title: "That's Fake", mark: marks.bar }),
    makeSleeve('tri', { bg: '#2a1810', ink: '#e8dcc4', artist: 'CHARLI XCX', title: 'Brat', mark: marks.halftone }),
    makeSleeve('grd', { bg: '#c7beab', ink: '#0a0a0a', artist: 'MITSKI', title: 'Laurel Hell', mark: marks.grid }),
    makeSleeve('crs', { bg: '#0a0a0a', ink: '#e8dcc4', artist: 'ARCA', title: 'KICK i', mark: marks.cross }),
    makeSleeve('slh', { bg: '#b84a1a', ink: '#0a0a0a', artist: 'SAULT', title: 'Untitled (Black Is)', mark: marks.slash }),
    makeSleeve('tng', { bg: '#1c2420', ink: '#c9a84c', artist: 'FLOATING POINTS', title: 'Promises', mark: marks.triangle }),
    makeSleeve('rgb', { bg: '#d2c8b4', ink: '#0a0a0a', artist: 'WET LEG', title: 'Wet Leg', mark: marks.ring }),
];

export const sleeveById: Record<string, Sleeve> = Object.fromEntries(sleeves.map((s) => [s.id, s]));

export const analyzeSteps: AnalyzeStep[] = [
    { id: 'resolve', label: 'Resolving Spotify link', detail: 'spotify:album:2rNJCHqFbxpmlnWaIqcjO1', duration: 900 },
    { id: 'meta', label: 'Fetching album metadata', detail: 'ASSEMBLE24 · tripleS · Modhaus · 2024', duration: 1100 },
    { id: 'tracks', label: 'Retrieving track audio features', detail: '10 tracks · 35m 42s', duration: 900 },
    { id: 'lyrics', label: 'Reading lyrics across 10 tracks', detail: 'Korean, English — translating in place', duration: 1400 },
    { id: 'context', label: 'Building historical context', detail: 'Cross-referencing Modhaus, fan-voting system, Loona lineage', duration: 1600 },
    { id: 'mood', label: 'Mapping emotional profile', detail: 'Valence, density, chromatic temperature', duration: 1100 },
    { id: 'similar', label: 'Finding semantically adjacent records', detail: '317k catalog embeddings searched', duration: 1200 },
    { id: 'compose', label: 'Composing report', detail: 'haiku-4-5 · 4 sections · ~780 words', duration: 1500 },
];

export const report: Report = {
    spotifyUrl: 'open.spotify.com/album/2rNJCHqFbxpmlnWaIqcjO1',
    coverId: 'assemble24',
    title: 'Assemble24',
    artist: 'tripleS',
    year: 2024,
    label: 'Modhaus',
    length: '35:42',
    tracks: 10,
    genres: ['K-pop', 'Synth-pop', 'R&B', 'Afrobeat', 'Pop-rock'],
    mood: [
        { left: 'melancholic', right: 'euphoric', value: 0.72 },
        { left: 'sparse', right: 'dense', value: 0.81 },
        { left: 'restrained', right: 'maximal', value: 0.86 },
        { left: 'retro', right: 'futurist', value: 0.58 },
    ],
    sections: [
        {
            heading: 'Historical Context',
            paragraphs: [
                "Assemble24 is the record tripleS has been building toward since the group's first fractal appearance in 2023 — the first time all twenty-four members, across every sub-unit, arrive on a single album. Released May 8th, 2024 on Modhaus and distributed by Kakao Entertainment, it is less a debut than a convergence: Acid Angel from Asia, LOVElution, EVOLution, Aria, NXT, Glow — every configuration the group has ever assumed — funneled into one ten-track statement.",
                'The Modhaus project has always been an experiment in authorship: fans vote on title tracks, on unit compositions, on who gets to debut. Assemble24 is the first artifact in which that voting apparatus is taken for granted rather than explained. You are not asked to care about the system to hear the record. You\'re asked to sit with what the system produced.',
            ],
        },
        {
            heading: 'Lyrical Themes',
            paragraphs: [
                'The lead single, "Girls Never Die," is the thesis in miniature — a song about failure as an inheritance rather than a disqualification. It refuses the K-pop grammar of triumph; instead it insists that stumbling is the evidence of having walked at all. That sensibility threads through the album. "Heart Raider" sublimates a friendship-turned-crush into liquid garage skitter; "Midnight Flower" stages a 1980s pop-rock infatuation with the lights low; "Chiyu" (치유, healing) slows to a near-whisper and lets the word do the work.',
                "It's rare for a K-pop album to carry this many registers without sounding like a sampler. Assemble24 earns its range by being pointedly domestic — these are songs about rooms, about friends, about the quiet second after something falls.",
            ],
        },
        {
            heading: 'Sound Profile',
            paragraphs: [
                'Producers EL CAPITXN and Vendors — returning from "Generation" and "Girls\' Capitalism" — don\'t so much write songs as stitch dialects. "S" opens with pop-metal guitar folded into R&B phrasing. "White Soul Sneakers" is afrobeat threaded through acid funk. "24" is a hype track that keeps losing its own thread and recovering it, which is maybe the most accurate self-portrait twenty-four people could produce.',
                'The record is dense — 86th percentile in our catalog for instrumental layering — but it never feels crowded. Vocals pass like a relay. No one holds the mic for long, because no one has to.',
            ],
        },
    ],
    similar: [
        { coverId: 'nme', title: 'Suddenly', artist: 'Caribou', reason: 'The same willingness to route pop through texture rather than riff.' },
        { coverId: 'bla', title: "That's Fake", artist: 'Jessie Ware', reason: 'Another record about joy as a deliberate, almost architectural choice.' },
        { coverId: 'tri', title: 'Brat', artist: 'Charli XCX', reason: 'Shares the maximalist instinct — every second is a decision.' },
        { coverId: 'crs', title: 'KICK i', artist: 'Arca', reason: 'Pushed further, this is where the production mind of Assemble24 ends up.' },
    ],
};

export const discoverExamples: string[] = [
    'melancholic and cinematic, like a rainy Sunday',
    'energetic and chaotic, Brazilian music',
    'calm and cerebral, late-night studying',
    'nostalgic but forward-looking — the feeling of a train window at dusk',
];

export const discoverQuery = 'euphoric but a little sad, with density — something that feels like 2024';

export const discoverResults: DiscoverResult[] = [
    {
        coverId: 'gnd',
        title: 'Assemble24',
        artist: 'tripleS',
        year: 2024,
        excerpt: 'A full-group record that moves between afrobeat, garage, and pop-rock without losing its center. The defining emotional move: failure reframed as evidence of motion.',
        similarity: 0.97,
    },
    {
        coverId: 'tri',
        title: 'Brat',
        artist: 'Charli XCX',
        year: 2024,
        excerpt: 'A club record that keeps flinching. The density you asked for, played as confession — every hook is someone talking themselves into, then out of, a feeling.',
        similarity: 0.93,
    },
    {
        coverId: 'nme',
        title: 'Suddenly',
        artist: 'Caribou',
        year: 2020,
        excerpt: 'Dan Snaith reassembles family memories into footwork-adjacent pop. Euphoric in the way a long phone call is euphoric — you hang up and the room is quieter.',
        similarity: 0.88,
    },
    {
        coverId: 'rgb',
        title: 'Wet Leg',
        artist: 'Wet Leg',
        year: 2022,
        excerpt: 'Post-punk built out of one-liners and negative space. Shares the Assemble24 instinct of turning the deadpan into a way of caring about something out loud.',
        similarity: 0.81,
    },
    {
        coverId: 'grd',
        title: 'Laurel Hell',
        artist: 'Mitski',
        year: 2022,
        excerpt: '80s synths pulled tight around a songwriter who will not flinch. The sad-euphoric axis sits exactly at the hinge of what you described.',
        similarity: 0.79,
    },
    {
        coverId: 'slh',
        title: 'Untitled (Black Is)',
        artist: 'Sault',
        year: 2020,
        excerpt: 'Soul and post-punk assembled by a cast that never quite identifies itself. Like Assemble24, it reads as a group self-portrait rather than an individual statement.',
        similarity: 0.74,
    },
    {
        coverId: 'tng',
        title: 'Promises',
        artist: 'Floating Points, Pharoah Sanders & LSO',
        year: 2021,
        excerpt: 'A single 46-minute arc. Different genre, same structural idea: a small repeated figure that the whole record earns the right to change.',
        similarity: 0.68,
    },
    {
        coverId: 'bla',
        title: "That's Fake",
        artist: 'Jessie Ware',
        year: 2023,
        excerpt: 'Disco maximalism as an argument for joy. Euphoric in the daylight sense — not a peak but a plateau you can walk around on.',
        similarity: 0.64,
    },
    {
        coverId: 'crs',
        title: 'KICK i',
        artist: 'Arca',
        year: 2020,
        excerpt: 'Reggaeton and club music broken down to component parts and reassembled. Dense, yes — and the closest neighbor on the avant-pop axis.',
        similarity: 0.59,
    },
];

export interface Tweaks {
    accent: 'amber' | 'gold' | 'ivory' | 'ember';
    serif: 'playfair' | 'instrument' | 'fraunces';
    grain: 'off' | 'subtle' | 'heavy';
    moodVariant: 'linear' | 'dots' | 'two-tone';
    heroLayout: 'side-by-side' | 'stacked' | 'full-bleed';
    discoverCols: 3 | 4 | 5;
}

export const defaultTweaks: Tweaks = {
    accent: 'ember',
    serif: 'playfair',
    grain: 'subtle',
    moodVariant: 'linear',
    heroLayout: 'side-by-side',
    discoverCols: 3,
};
