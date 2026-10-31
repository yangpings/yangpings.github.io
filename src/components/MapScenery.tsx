// The island's scenery, drawn in layers from back to front: night sky and sea, a far mountain range,
// the island with its cliff, shore and meadows, rocks and flowers, the castle on its
// hill, and the secret islet. Flat colours from the site palette; light comes from the top left.

const stars = [[60, 40], [140, 90], [235, 30], [330, 70], [410, 22], [470, 95], [640, 35], [700, 80], [760, 20], [960, 60], [990, 120], [30, 150], [600, 110], [890, 28]];
const rocks = [[198, 520], [520, 505], [760, 515], [355, 512]];
const flowers = [[110, 470], [180, 455], [330, 470], [395, 500], [560, 480], [640, 500], [800, 480], [450, 470], [720, 455], [870, 495]];

export default function MapScenery({ allClear }: { allClear: boolean }) {
  return <g className="map-scenery" aria-hidden="true">
    {/* Sky and sea. */}
    <rect width="1000" height="560" fill="#14060d"/>
    <rect y="230" width="1000" height="330" fill="#1b0912"/>
    <g fill="#fff1db">{stars.map(([x, y], i) => <circle key={i} className="map-twinkle" cx={x} cy={y} r={i % 3 ? 1.2 : 1.9} style={{ animationDelay: `${(i % 5) * .7}s` }}/>)}</g>
    <circle cx="90" cy="70" r="26" fill="#ffd078"/><circle cx="101" cy="62" r="24" fill="#14060d"/>
    <g fill="none" stroke="#ff7868" strokeOpacity=".16" strokeWidth="2" strokeLinecap="round" className="map-waves">
      {[[40, 300], [180, 270], [960, 300], [20, 540], [960, 540], [430, 255], [680, 250], [300, 545], [700, 548]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q8-6 16 0t16 0`}/>)}
    </g>

    {/* A far mountain range behind the island. */}
    <path d="M520 300 600 200l40 40 60-90 70 80 60-70 90 140Z" fill="#2b0d18"/>
    <path d="M700 150l18 21-14-2-10 12-6-14Zm-100 50 12 14-10-1-6 8-4-10Z" fill="#fff1db" opacity=".55"/>

    {/* Island: cliff underside, sandy shore, then meadow. */}
    <path d="M40 480C28 390 110 310 210 310c60-60 170-40 230 0 70-50 190-40 250-10 60-150 230-170 270-40 60 60 50 190 10 250-70 60-210 70-330 60-160 10-320 20-440 0C10 552 45 512 40 480Z" fill="#0f0408" transform="translate(6 22)"/>
    <path d="M40 480C28 390 110 310 210 310c60-60 170-40 230 0 70-50 190-40 250-10 60-150 230-170 270-40 60 60 50 190 10 250-70 60-210 70-330 60-160 10-320 20-440 0C10 552 45 512 40 480Z" fill="#c98a52"/>
    <path d="M40 480C28 390 110 310 210 310c60-60 170-40 230 0 70-50 190-40 250-10 60-150 230-170 270-40 60 60 50 190 10 250-70 60-210 70-330 60-160 10-320 20-440 0C10 552 45 512 40 480Z" fill="#ffd078" opacity=".35" transform="translate(-2 -3)"/>
    <path d="M58 476c-6-74 74-140 166-140 70-50 160-30 210 10 70-40 170-30 220 0 60-30 150-20 200 30 30 50 22 120-10 152-160 30-480 30-764 10C66 520 58 500 58 476Z" fill="#5a1a25"/>
    <path d="M70 470c0-60 70-115 154-115 64-44 150-26 198 8 64-34 160-26 208 2 52-24 132-14 176 26" fill="none" stroke="#7a2a3c" strokeWidth="10" strokeLinecap="round" opacity=".7"/>
    {/* Meadow patches in two tones. */}
    {[[150, 470, 70, 22], [420, 480, 90, 24], [690, 470, 80, 20], [300, 500, 60, 16]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#6a2133"/>)}

    {/* Castle hill. */}
    <path d="M752 262c18-118 192-128 214 0 10 54-22 96-64 106h-96c-44-10-62-64-54-106Z" fill="#6a2133"/>
    <path d="M770 240c20-80 150-92 176-16" fill="none" stroke="#ff7868" strokeOpacity=".3" strokeWidth="4" strokeLinecap="round"/>

    {/* Rocks and flowers. */}
    {rocks.map(([x, y], i) => <g key={i} transform={`translate(${x},${y})`}><path d="M-10 4-6-5 3-7 10 1 7 5Z" fill="#3b1420"/><path d="M-6-5 3-7 5-3-4-2Z" fill="#7a2a3c"/></g>)}
    {flowers.map(([x, y], i) => <g key={i} transform={`translate(${x},${y})`} fill={['#ffd078', '#ff7868', '#fff1db'][i % 3]}><circle r="2.2"/><circle cx="5" cy="2" r="1.7"/><circle cx="-4" cy="3" r="1.7"/></g>)}

    {/* The castle on its hill: a crenellated keep between two round towers with pointed roofs,
        lit windows, an arched gate, and the flag that rises once every level is explored. */}
    <g transform="translate(900,128)" className={`map-castle${allClear ? ' is-clear' : ''}`}>
      <ellipse cy="46" rx="86" ry="14" fill="#4a1622"/>
      {/* Curtain wall */}
      <rect x="-62" y="2" width="124" height="44" fill="#d9524f"/>
      <path d="M-62 2h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h4v8" fill="#d9524f"/>
      <path d="M-62 18h124M-62 32h124" stroke="#b8403f" strokeWidth="1.2" opacity=".6"/>
      {/* Towers */}
      {[-58, 58].map(x => <g key={x} transform={`translate(${x} 0)`}>
        <rect x="-15" y="-26" width="30" height="72" fill="#ff7868"/>
        <rect x="-15" y="-26" width="9" height="72" fill="#ffffff22"/>
        <path d="M-19-26 0-66 19-26Z" fill="#ffd078"/><path d="M-19-26 0-66 0-26Z" fill="#ffe7ad"/>
        <path d="M-19-26h38" stroke="#b8862d" strokeWidth="3"/>
        <rect className="castle-window" x="-4" y="-12" width="8" height="13" rx="4" fill="#ffd078"/>
        <rect className="castle-window" x="-4" y="14" width="8" height="13" rx="4" fill="#ffd078"/>
      </g>)}
      {/* Keep */}
      <rect x="-26" y="-34" width="52" height="80" fill="#ff8a78"/>
      <rect x="-26" y="-34" width="14" height="80" fill="#ffffff1f"/>
      <path d="M-30-34h8v-9h8v9h8v-9h8v9h8v-9h8v9h8v-9h8v9" fill="#ff8a78"/>
      <rect className="castle-window" x="-12" y="-20" width="9" height="14" rx="4.5" fill="#ffd078"/>
      <rect className="castle-window" x="3" y="-20" width="9" height="14" rx="4.5" fill="#ffd078"/>
      <path d="M-14 46V20a14 14 0 0 1 28 0v26Z" fill="#2a0d16"/>
      <path d="M-14 46V20a14 14 0 0 1 28 0v26" fill="none" stroke="#ffd078" strokeWidth="2.5"/>
      <path d="M-7 46V14m7 32V8m7 38V14M-14 30h28" stroke="#ffd07866" strokeWidth="1.5"/>
      {/* Flag */}
      <path d="M0-43v-40" stroke="#fff1db" strokeWidth="2.5" strokeLinecap="round"/>
      <path className="castle-flag" d="M1.5-83h26l-7 7.5 7 7.5h-26Z" fill="#ffd078"/>
    </g>
    {/* The secret islet: shore, a tuft of grass. */}
    <g transform="translate(560,140)">
      <ellipse cy="6" rx="60" ry="18" fill="#0f0408"/>
      <ellipse rx="58" ry="18" fill="#c98a52"/>
      <ellipse cy="-4" rx="42" ry="12" fill="#5a1a25"/>
      <path d="M-30-6q4-10 8 0m40-2q4-9 8 0" stroke="#ff7868" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </g>
    <path d="M510 350C520 260 545 200 560 160" fill="none" stroke="#ffd078" strokeOpacity=".3" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round"/>

    {/* Drifting clouds in front of the far mountains. */}
    <g className="map-clouds" fill="#fff1db" opacity=".24">
      <path d="M150 92a20 20 0 0 1 36-10 16 16 0 0 1 28 6 14 14 0 0 1 4 26h-64a12 12 0 0 1-4-22Z"/>
      <path d="M470 60a22 22 0 0 1 40-10 18 18 0 0 1 30 8 15 15 0 0 1 2 28h-70a13 13 0 0 1-2-26Z"/>
    </g>
  </g>;
}
