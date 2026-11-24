/**
 * Personal Archive Data ("Beyond the Equations")
 * Easily editable: add new questions, curiosities, rabbit holes, or scrapbook items here.
 */
export const QUESTIONS = [
  {
    code: 'Q-01',
    text: 'Why does mathematics describe physical reality so effectively?'
  },
  {
    code: 'Q-02',
    text: 'What does it mean to understand a physical system rather than merely predict it?'
  },
  {
    code: 'Q-03',
    text: 'How does information emerge from physical structures?'
  },
  {
    code: 'Q-04',
    text: 'Can matter itself perform computation?'
  },
  {
    code: 'Q-05',
    text: 'What would technological progress look like if it were genuinely symbiotic with Earth’s living systems?'
  },
  {
    code: 'Q-06',
    text: 'What are the implications of unconventional information storage and physical computing?'
  }
];

export const FASCINATIONS = [
  { tag: 'COSMOS', title: 'Astrophysics & Cosmology', note: 'Large-scale structure, orbital mechanics, and how simple conservation laws scale to galaxies.' },
  { tag: 'PARTICLES', title: 'CERN & Particle Physics', note: 'Detector geometry, neutrinos, quarks, muons — probing matter at its smallest scales.' },
  { tag: 'SETI', title: 'The Fermi Paradox', note: 'Silence in a vast universe, thermodynamic signatures, and civilizational longevity.' },
  { tag: 'TOPOLOGY', title: 'Skyrmions & Unconventional Phenomena', note: 'Topological spin textures and non-trivial order parameters in condensed matter.' },
  { tag: 'MATTER', title: 'Metamaterials & Architected Matter', note: 'Geometry-driven mechanical properties — where structure becomes the material.' },
  { tag: 'COMPUTE', title: 'Physical Computing', note: 'Emerging curiosity about substrate-level computation beyond silicon.' },
  { tag: 'ART', title: 'Computational Art & Generative Geometry', note: 'Implicit fields, raymarched shaders, and algorithmic visual systems.' },
  { tag: 'SOUND', title: 'Electronic Music & Algorave', note: 'Livecoding patterns, TidalCycles, Pulsar, Haskell, and algorithmic rhythm.' },
  { tag: 'DESIGN', title: 'Y2K Digital Culture & Experimental Design', note: 'Early-2000s interfaces, CRT phosphor, bitmap typography, chrome lettering, and technical zines.' },
  { tag: 'RETRO', title: 'Vintage Computer Culture', note: 'Hardware constraints that forced elegance in memory and display.' },
  { tag: 'VISUAL', title: 'Unusual Scientific Visualizations', note: 'Vector fields, phase portraits, schlieren optics, and thermal imaging.' }
];

export const RABBIT_HOLES = [
  {
    id: 'RH-01',
    title: 'Understanding GPU architecture by writing CUDA kernels',
    body: 'Instead of treating PyTorch as magic, flattening grids into 1D Unified Memory and writing inline ghost-cell stencils for cuSPARSE.'
  },
  {
    id: 'RH-02',
    title: 'Learning physical systems by implementing their equations',
    body: 'You only notice every hidden boundary assumption once you discretize the PDE yourself.'
  },
  {
    id: 'RH-03',
    title: 'Exploring geometric representations through shaders',
    body: 'Trading gigabyte STL triangle soups for a few lines of analytic trigonometric SDFs in GLSL.'
  },
  {
    id: 'RH-04',
    title: 'Investigating how physical phenomena relate to information',
    body: 'Reading across mechanics, thermodynamics, and unconventional computing — strictly as curiosity, not claimed lab work.'
  },
  {
    id: 'RH-05',
    title: 'Learning manufacturing systems through actual simulations',
    body: 'Wiring CAD geometry, toolpaths, discrete-event queues, and wear physics together to see how a shopfloor behaves.'
  }
];

/**
 * Editable Scrapbook Slots — drop image paths into assets/scrapbook/ and update here.
 */
export const SCRAPBOOK_SLOTS = [
  {
    slot: 'SLOT_01 // VISUAL EXPERIMENT',
    title: 'Procedural Field & Shader Captures',
    caption: 'Space reserved for personal shader stills, experimental renders, and CRT/dither tests.',
    img: null
  },
  {
    slot: 'SLOT_02 // NOTEBOOK',
    title: 'Equations, Sketches & Margin Notes',
    caption: 'Space reserved for scanned notebook pages, mechanical sketches, and derivation scraps.',
    img: null
  },
  {
    slot: 'SLOT_03 // SOUND & CULTURE',
    title: 'Algorave / Livecoding / Music Logs',
    caption: 'Space reserved for TidalCycles patterns, listening notes, and non-engineering discoveries.',
    img: null
  },
  {
    slot: 'SLOT_04 // FIELD PHOTOS',
    title: 'Workshop & Everyday Photographs',
    caption: 'Space reserved for personal photographs — nothing fabricated or stock-filled.',
    img: null
  }
];
