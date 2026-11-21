// Every string, product and seed record the store shows lives in this file.
// Edit here to rebrand; components only read from it.

export const brand = {
  name: 'VERDÉ',
  tagline: 'Naturally in balance.',
  currency: 'USD',
  freeShippingFrom: 60,
  promo: { code: 'VERDE10', percent: 10 },
}

/**
 * Photography. Every image the store shows goes through this one constant:
 * swap a path for your own file in public/images/ (or a CDN URL). Remove an
 * entry and that spot falls back to an SVG still life, so nothing breaks.
 * Product shots are transparent cut-outs; the hero keeps the model right of
 * centre so the copy on the left stays readable.
 */
const productSlugs = [
  'centella-ampoule-foam', 'calming-toner-pads', 'centella-facial-serum', 'barrier-recovery-gel',
  'rice-milk-cleansing-balm', 'dew-milk-toner', 'blemish-clearing-serum', 'vitamin-c-glow-drops',
  'peptide-eye-balm', 'cica-sleeping-mask', 'daily-sheer-spf', 'rose-water-mist',
]
const base = import.meta.env.BASE_URL

export const PHOTOS: { hero?: string; about?: string; avatars: string[]; products: Record<string, string | undefined> } = {
  hero: `${base}images/hero.webp`,
  about: `${base}images/about.webp`,
  /** Review and community avatars. Use real customer photos only with consent. */
  avatars: [1, 2, 3, 4].map((n) => `${base}images/avatar-${n}.webp`),
  products: Object.fromEntries(productSlugs.map((s) => [s, `${base}images/${s}.webp`])),
}

export const nav = [
  { label: 'Our Lab', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Products', to: '/shop' },
  { label: 'Skin Quiz', to: '/quiz' },
]

export const hero = {
  title: ['Thoughtful care,', 'lasting glow'],
  body: 'Small-batch serums and balms built on centella, ceramides and nothing you need a dictionary for. Calm skin first, then the glow. Naturally in balance.',
  promo: { code: 'VERDE10', percent: 10 },
  community: { value: '480K +', label: 'routines built with the skin quiz' },
  featured: 'barrier-recovery-gel',
  cards: ['centella-ampoule-foam', 'calming-toner-pads', 'centella-facial-serum'],
}

export type ArtKind = 'dropper' | 'tube' | 'jar' | 'pump' | 'pads' | 'mist' | 'stick'
export type Category = 'Cleanse' | 'Tone' | 'Treat' | 'Moisturise' | 'Protect'
export type Concern = 'Redness' | 'Dryness' | 'Breakouts' | 'Dullness' | 'Fine lines'
export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'Normal'

export interface Art {
  kind: ArtKind
  /** Liquid or cream colour. */
  fill: string
  /** Cap, collar or pump colour. */
  cap: string
  /** Container colour (glass bottles ignore it). */
  body?: string
}

export interface Size {
  label: string
  oz: string
  price: number
}

export interface Product {
  slug: string
  name: string
  category: Category
  concerns: Concern[]
  skinTypes: SkinType[]
  sizes: Size[]
  rating: number
  reviews: number
  badge?: string
  short: string
  description: string
  ingredients: { name: string; role: string }[]
  howTo: string
  fullIngredients: string
  art: Art
  step: number
}

export const products: Product[] = [
  {
    slug: 'centella-ampoule-foam',
    name: 'Centella Ampoule Foam Cleanser',
    category: 'Cleanse',
    concerns: ['Redness', 'Breakouts'],
    skinTypes: ['Sensitive', 'Oily', 'Combination', 'Normal'],
    sizes: [
      { label: '125 ml', oz: '4.2 fl oz', price: 68.99 },
      { label: '250 ml', oz: '8.4 fl oz', price: 112 },
    ],
    rating: 4.8,
    reviews: 2184,
    badge: 'Bestseller',
    short: 'A cushiony low-pH foam that lifts sunscreen without the squeak.',
    description:
      'Whipped from a centella ampoule base, this foam cleanser rinses clean at pH 5.5. Amino-acid surfactants lift sunscreen and sebum while madecassoside keeps reactive skin quiet.',
    ingredients: [
      { name: 'Centella asiatica', role: 'Soothes visible redness' },
      { name: 'Amino-acid cleansers', role: 'Lift oil without stripping' },
      { name: 'Panthenol', role: 'Holds water in the barrier' },
    ],
    howTo: 'Work a pea-sized amount into a foam with damp hands. Massage for 30 seconds, then rinse with lukewarm water. Morning and evening.',
    fullIngredients:
      'Water, Centella Asiatica Extract, Glycerin, Sodium Cocoyl Glycinate, Coco-Betaine, Panthenol, Madecassoside, Asiaticoside, Allantoin, Citric Acid, 1,2-Hexanediol.',
    art: { kind: 'tube', fill: '#c9a46a', cap: '#f3efe9', body: '#d6b98a' },
    step: 1,
  },
  {
    slug: 'calming-toner-pads',
    name: 'Quick Calming Toner Pads',
    category: 'Tone',
    concerns: ['Redness', 'Dullness'],
    skinTypes: ['Sensitive', 'Dry', 'Combination', 'Normal'],
    sizes: [{ label: '70 pads', oz: '170 ml', price: 27.69 }],
    rating: 4.7,
    reviews: 1406,
    short: 'Soft embossed pads soaked in a centella and PHA essence.',
    description:
      'Two-sided cotton pads: the textured side lifts dull flakes with gentle PHA, the smooth side lays down a cooling essence. Leave one on hot cheeks for three minutes as a mini mask.',
    ingredients: [
      { name: 'Gluconolactone (PHA)', role: 'Polishes without sting' },
      { name: 'Centella leaf water', role: 'Calms flushed skin' },
      { name: 'Hyaluronic acid', role: 'Plumps with water' },
    ],
    howTo: 'After cleansing, sweep the textured side across the face, then press the smooth side over any redness. Close the lid tightly.',
    fullIngredients:
      'Centella Asiatica Leaf Water, Butylene Glycol, Gluconolactone, Glycerin, Sodium Hyaluronate, Betaine, Allantoin, Panthenol, Ethylhexylglycerin.',
    art: { kind: 'pads', fill: '#efe2c4', cap: '#f7f5f2', body: '#eadcbd' },
    step: 2,
  },
  {
    slug: 'centella-facial-serum',
    name: 'Centella Asiatica Facial Serum',
    category: 'Treat',
    concerns: ['Redness', 'Breakouts', 'Dryness'],
    skinTypes: ['Sensitive', 'Oily', 'Combination', 'Dry', 'Normal'],
    sizes: [
      { label: '55 ml', oz: '1.85 fl oz', price: 68.99 },
      { label: '100 ml', oz: '3.4 fl oz', price: 108 },
    ],
    rating: 4.9,
    reviews: 3920,
    badge: 'Award winner',
    short: 'Our signature golden serum: 72% centella for calm, even skin.',
    description:
      'Our signature serum, seventy-two percent centella extract, cold-pressed in small batches with a touch of squalane so it sinks in as a veil, never a film. Most people see calmer skin within a week.',
    ingredients: [
      { name: 'Centella extract 72%', role: 'Calms and supports repair' },
      { name: 'Squalane', role: 'Light, skin-identical oil' },
      { name: 'Niacinamide 2%', role: 'Evens tone and pores' },
    ],
    howTo: 'Press three or four drops into skin after toner, morning and night. Follow with moisturiser, and SPF by day.',
    fullIngredients:
      'Centella Asiatica Extract (72%), Water, Niacinamide, Squalane, Glycerin, Madecassoside, Asiatic Acid, Madecassic Acid, Sodium Hyaluronate, Tocopherol.',
    art: { kind: 'dropper', fill: '#d8a13c', cap: '#c8923c' },
    step: 3,
  },
  {
    slug: 'barrier-recovery-gel',
    name: 'Ultimate Skin Recovery Gel Cream',
    category: 'Moisturise',
    concerns: ['Dryness', 'Redness'],
    skinTypes: ['Sensitive', 'Dry', 'Combination', 'Normal'],
    sizes: [{ label: '75 ml', oz: '2.5 fl oz', price: 46 }],
    rating: 4.8,
    reviews: 2766,
    badge: 'New',
    short: 'A bouncy ceramide gel cream that feels like water and lasts all day.',
    description:
      'Three ceramides, cholesterol and fatty acids in the ratio skin uses itself, suspended in a cooling gel. It drinks in fast, sits well under makeup and keeps tight, flaky patches comfortable until evening.',
    ingredients: [
      { name: 'Ceramide complex', role: 'Rebuilds the moisture barrier' },
      { name: 'Beta-glucan', role: 'Soothes and hydrates' },
      { name: 'Cica callus extract', role: 'Supports overnight recovery' },
    ],
    howTo: 'Smooth a fingertip over face and neck as the last step at night, or before SPF in the morning.',
    fullIngredients:
      'Water, Glycerin, Squalane, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Beta-Glucan, Centella Asiatica Callus Culture Extract, Carbomer, Tromethamine.',
    art: { kind: 'jar', fill: '#f2ece2', cap: '#e9e4dd', body: '#f5f2ee' },
    step: 4,
  },
  {
    slug: 'rice-milk-cleansing-balm',
    name: 'Rice Milk Cleansing Balm',
    category: 'Cleanse',
    concerns: ['Dullness', 'Dryness'],
    skinTypes: ['Dry', 'Normal', 'Combination'],
    sizes: [{ label: '100 ml', oz: '3.4 fl oz', price: 34 }],
    rating: 4.6,
    reviews: 842,
    short: 'Melts long-wear makeup into a milk and rinses clean.',
    description:
      'A sherbet balm of rice bran and camellia oils that turns milky with water. Takes off mascara and SPF in one pass and leaves skin soft rather than tight.',
    ingredients: [
      { name: 'Rice bran oil', role: 'Dissolves makeup and SPF' },
      { name: 'Camellia seed oil', role: 'Leaves skin supple' },
      { name: 'Vitamin E', role: 'Antioxidant care' },
    ],
    howTo: 'Massage a scoop into dry skin, add a splash of water to emulsify, then rinse. Follow with the foam cleanser.',
    fullIngredients: 'Oryza Sativa Bran Oil, Camellia Japonica Seed Oil, PEG-20 Glyceryl Triisostearate, Polyethylene, Tocopherol, Oryza Sativa Extract.',
    art: { kind: 'jar', fill: '#f4ead6', cap: '#d7c3a1', body: '#f8f3ea' },
    step: 1,
  },
  {
    slug: 'dew-milk-toner',
    name: 'Dew Milk Toner',
    category: 'Tone',
    concerns: ['Dryness', 'Fine lines'],
    skinTypes: ['Dry', 'Normal', 'Sensitive'],
    sizes: [{ label: '150 ml', oz: '5 fl oz', price: 29 }],
    rating: 4.7,
    reviews: 1188,
    short: 'A milky essence-toner that layers like a light lotion.',
    description:
      'Five weights of hyaluronic acid and oat lipids in a milky toner. Layer it two or three times on dry days for that glassy morning finish.',
    ingredients: [
      { name: 'Five hyaluronic acids', role: 'Hydrate at every depth' },
      { name: 'Oat lipids', role: 'Comfort tight skin' },
      { name: 'Peptides', role: 'Soften fine lines' },
    ],
    howTo: 'Pat a coin-sized amount into skin with your palms. Repeat up to three times.',
    fullIngredients: 'Water, Glycerin, Avena Sativa Kernel Extract, Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Palmitoyl Tripeptide-1, Squalane, Allantoin.',
    art: { kind: 'pump', fill: '#f3eee6', cap: '#1d1a17', body: '#efe8de' },
    step: 2,
  },
  {
    slug: 'blemish-clearing-serum',
    name: 'Willow Clear Serum',
    category: 'Treat',
    concerns: ['Breakouts'],
    skinTypes: ['Oily', 'Combination'],
    sizes: [{ label: '30 ml', oz: '1 fl oz', price: 32 }],
    rating: 4.5,
    reviews: 964,
    short: '2% salicylic acid with green tea to keep pores clear.',
    description:
      'A water-light serum with 2% BHA from willow bark and green tea polyphenols. Clears congestion over weeks without the dry patches harsher acids leave.',
    ingredients: [
      { name: 'Salicylic acid 2%', role: 'Clears inside the pore' },
      { name: 'Green tea', role: 'Calms active spots' },
      { name: 'Zinc PCA', role: 'Balances shine' },
    ],
    howTo: 'Apply two drops at night to clean skin, three nights a week at first. Always use SPF the next morning.',
    fullIngredients: 'Water, Salicylic Acid, Camellia Sinensis Leaf Extract, Zinc PCA, Propanediol, Centella Asiatica Extract, Xanthan Gum.',
    art: { kind: 'dropper', fill: '#bfcfb2', cap: '#8fa58a' },
    step: 3,
  },
  {
    slug: 'vitamin-c-glow-drops',
    name: 'Sea Buckthorn Glow Drops',
    category: 'Treat',
    concerns: ['Dullness', 'Fine lines'],
    skinTypes: ['Normal', 'Dry', 'Combination'],
    sizes: [{ label: '30 ml', oz: '1 fl oz', price: 44 }],
    rating: 4.7,
    reviews: 1530,
    short: 'Stable vitamin C and sea buckthorn for a lit-from-within look.',
    description:
      'Ethyl ascorbic acid stays potent to the last drop. Sea buckthorn adds its natural amber tint and omega oils so dull, tired skin looks rested.',
    ingredients: [
      { name: 'Ethyl ascorbic acid 10%', role: 'Brightens uneven tone' },
      { name: 'Sea buckthorn oil', role: 'Nourishes and adds glow' },
      { name: 'Ferulic acid', role: 'Boosts antioxidant care' },
    ],
    howTo: 'Mornings, after toner: press two drops into skin before moisturiser and SPF.',
    fullIngredients: 'Water, 3-O-Ethyl Ascorbic Acid, Hippophae Rhamnoides Fruit Oil, Ferulic Acid, Glycerin, Tocopherol, Polysorbate 20.',
    art: { kind: 'dropper', fill: '#e8892c', cap: '#b9772f' },
    step: 3,
  },
  {
    slug: 'peptide-eye-balm',
    name: 'Peptide Eye Balm',
    category: 'Treat',
    concerns: ['Fine lines', 'Dryness'],
    skinTypes: ['Dry', 'Normal', 'Sensitive', 'Combination'],
    sizes: [{ label: '15 ml', oz: '0.5 fl oz', price: 38 }],
    rating: 4.6,
    reviews: 611,
    short: 'A cooling stick balm for puffiness and fine lines.',
    description:
      'Swipe-on balm with copper peptides and caffeine. The metal tip cools on contact, so it doubles as a morning de-puffer.',
    ingredients: [
      { name: 'Copper peptides', role: 'Smooth the look of lines' },
      { name: 'Caffeine', role: 'Reduces morning puffiness' },
      { name: 'Shea butter', role: 'Cushions thin skin' },
    ],
    howTo: 'Glide under and around the eyes, then tap in with your ring finger.',
    fullIngredients: 'Butyrospermum Parkii Butter, Caprylic/Capric Triglyceride, Copper Tripeptide-1, Caffeine, Candelilla Wax, Tocopherol.',
    art: { kind: 'stick', fill: '#efe4d6', cap: '#cdbca9', body: '#f5efe8' },
    step: 4,
  },
  {
    slug: 'cica-sleeping-mask',
    name: 'Cica Overnight Mask',
    category: 'Moisturise',
    concerns: ['Redness', 'Dryness', 'Fine lines'],
    skinTypes: ['Dry', 'Sensitive', 'Normal'],
    sizes: [{ label: '80 ml', oz: '2.7 fl oz', price: 36 }],
    rating: 4.8,
    reviews: 1077,
    short: 'A sage-green sleeping mask for skin that had a rough day.',
    description:
      'A rich gel balm of centella, mugwort and shea that seals in your routine overnight. Wake to skin that looks rested and feels cushioned.',
    ingredients: [
      { name: 'Centella and mugwort', role: 'Calm overnight' },
      { name: 'Shea butter', role: 'Seals in moisture' },
      { name: 'Allantoin', role: 'Softens rough texture' },
    ],
    howTo: 'Two or three nights a week, smooth a thin layer over your last step. Rinse in the morning.',
    fullIngredients: 'Water, Centella Asiatica Extract, Artemisia Vulgaris Extract, Butyrospermum Parkii Butter, Glycerin, Allantoin, Carbomer.',
    art: { kind: 'jar', fill: '#c9d4bf', cap: '#8fa58a', body: '#eef1ea' },
    step: 4,
  },
  {
    slug: 'daily-sheer-spf',
    name: 'Daily Sheer Fluid SPF 50',
    category: 'Protect',
    concerns: ['Dullness', 'Fine lines', 'Redness'],
    skinTypes: ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'],
    sizes: [{ label: '50 ml', oz: '1.7 fl oz', price: 32 }],
    rating: 4.9,
    reviews: 4410,
    badge: 'Bestseller',
    short: 'Invisible broad-spectrum SPF 50 with no white cast.',
    description:
      'A fluid sunscreen that disappears on every skin tone. New-generation filters, centella and niacinamide, with a soft satin finish that works under makeup.',
    ingredients: [
      { name: 'Broad-spectrum filters', role: 'SPF 50, PA++++' },
      { name: 'Niacinamide', role: 'Evens tone' },
      { name: 'Centella extract', role: 'Keeps skin calm' },
    ],
    howTo: 'Apply two finger-lengths to face and neck as the last morning step. Reapply every two hours outdoors.',
    fullIngredients: 'Water, Dibutyl Adipate, Ethylhexyl Triazone, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Niacinamide, Centella Asiatica Extract, Glycerin.',
    art: { kind: 'tube', fill: '#f2e9dd', cap: '#d3a35a', body: '#faf6f0' },
    step: 5,
  },
  {
    slug: 'rose-water-mist',
    name: 'Rose Water Hydro Mist',
    category: 'Tone',
    concerns: ['Dryness', 'Dullness'],
    skinTypes: ['Dry', 'Normal', 'Sensitive', 'Combination', 'Oily'],
    sizes: [{ label: '100 ml', oz: '3.4 fl oz', price: 24 }],
    rating: 4.5,
    reviews: 690,
    short: 'A fine mist of rose water and glycerin for midday refreshes.',
    description:
      'Steam-distilled rose water with a little glycerin and panthenol. Mist it over makeup, after a flight, or between serum layers for extra slip.',
    ingredients: [
      { name: 'Rose flower water', role: 'Refreshes and softens' },
      { name: 'Glycerin', role: 'Draws in moisture' },
      { name: 'Panthenol', role: 'Comforts' },
    ],
    howTo: 'Hold 20 cm from the face and mist with eyes closed, whenever skin feels tight.',
    fullIngredients: 'Rosa Damascena Flower Water, Glycerin, Panthenol, Propanediol, Allantoin, Ethylhexylglycerin.',
    art: { kind: 'mist', fill: '#f0d6cf', cap: '#e8e2dc' },
    step: 2,
  },
]

export const categories: Category[] = ['Cleanse', 'Tone', 'Treat', 'Moisturise', 'Protect']
export const concerns: Concern[] = ['Redness', 'Dryness', 'Breakouts', 'Dullness', 'Fine lines']
export const skinTypes: SkinType[] = ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal']

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
] as const

export const bySlug = (slug: string) => products.find((p) => p.slug === slug)

export interface Review {
  id: string
  product: string
  name: string
  rating: number
  title: string
  body: string
  skinType: SkinType
  date: string
  /** Index into PHOTOS.avatars. */
  avatar?: number
}

export const seedReviews: Review[] = [
  { id: 'r1', product: 'centella-facial-serum', name: 'Maya R.', rating: 5, title: 'My redness finally settled', body: 'Two weeks in and my cheeks are the calmest they have been in years. Sinks in fast and plays well with SPF.', skinType: 'Sensitive', date: '2026-10-21', avatar: 0 },
  { id: 'r2', product: 'centella-facial-serum', name: 'Jonah K.', rating: 5, title: 'Light and golden', body: 'Thought it might be oily on me but it disappears. I use it morning and night.', skinType: 'Oily', date: '2026-10-02', avatar: 1 },
  { id: 'r3', product: 'centella-facial-serum', name: 'Priya S.', rating: 4, title: 'Lovely, wish it were bigger', body: 'Gorgeous texture, I go through a bottle in six weeks. Grabbing the 100 ml next time.', skinType: 'Combination', date: '2026-09-14', avatar: 3 },
  { id: 'r4', product: 'barrier-recovery-gel', name: 'Elena M.', rating: 5, title: 'Fixed my winter patches', body: 'Bouncy and cooling but somehow lasts all day. My dry patches around my nose are gone.', skinType: 'Dry', date: '2026-10-30', avatar: 2 },
  { id: 'r5', product: 'centella-ampoule-foam', name: 'Sam T.', rating: 5, title: 'Gentle but thorough', body: 'Takes off mineral sunscreen without leaving my face tight. A little goes a long way.', skinType: 'Sensitive', date: '2026-10-11', avatar: 1 },
  { id: 'r6', product: 'daily-sheer-spf', name: 'Ama O.', rating: 5, title: 'No cast on deep skin', body: 'Finally an SPF 50 that looks like nothing on me. Wears beautifully under foundation.', skinType: 'Normal', date: '2026-10-18', avatar: 3 },
  { id: 'r7', product: 'calming-toner-pads', name: 'Lena W.', rating: 4, title: 'Great after the gym', body: 'I leave one on my cheeks after a workout and the flush goes down quickly.', skinType: 'Combination', date: '2026-09-29', avatar: 2 },
]

export const testimonials = [
  { quote: 'The serum calmed a decade of redness in a month. I have stopped wearing colour corrector.', name: 'Maya R.', detail: 'Sensitive skin, 2 years with VERDÉ', avatar: 0 },
  { quote: 'The quiz gave me four products instead of the eleven I had. My skin has never been better.', name: 'Daniel P.', detail: 'Combination skin', avatar: 1 },
  { quote: 'Gel cream plus SPF is the whole morning now. Glowy, never greasy.', name: 'Ama O.', detail: 'Normal skin', avatar: 3 },
]

export const promises = [
  { title: 'Clinically calm', body: 'Every formula is patch-tested on sensitive skin panels before launch.' },
  { title: 'Small batches', body: 'Made in runs of 2,000 so serums reach you within 90 days of bottling.' },
  { title: 'Refill and return', body: 'Send empties back free; we clean and reuse the glass.' },
  { title: '60-night trial', body: 'Not right for your skin? Return it, even opened, within 60 nights.' },
]

export const routineSteps = [
  { step: 1, name: 'Cleanse', body: 'Lift the day off with a low-pH foam or balm.' },
  { step: 2, name: 'Tone', body: 'Rebalance and prep skin to drink in what comes next.' },
  { step: 3, name: 'Treat', body: 'One targeted serum for your main concern.' },
  { step: 4, name: 'Moisturise', body: 'Seal it in and support the barrier.' },
  { step: 5, name: 'Protect', body: 'SPF every morning, the best anti-ageing step there is.' },
]

export const quiz = {
  title: 'Find your routine in a minute',
  intro: 'Four questions, no sign-up. We match you with a routine of three to five products and explain why each one is there.',
  questions: [
    {
      id: 'type',
      question: 'By midday, how does your skin feel?',
      options: [
        { value: 'Dry', label: 'Tight or flaky', hint: 'Dry' },
        { value: 'Oily', label: 'Shiny all over', hint: 'Oily' },
        { value: 'Combination', label: 'Shiny T-zone, dry cheeks', hint: 'Combination' },
        { value: 'Normal', label: 'Comfortable, mostly balanced', hint: 'Normal' },
      ],
    },
    {
      id: 'concern',
      question: 'What would you most like to change?',
      options: [
        { value: 'Redness', label: 'Redness and flushing' },
        { value: 'Dryness', label: 'Dryness and dehydration' },
        { value: 'Breakouts', label: 'Breakouts and congestion' },
        { value: 'Dullness', label: 'Dullness and uneven tone' },
        { value: 'Fine lines', label: 'Fine lines and texture' },
      ],
    },
    {
      id: 'sensitive',
      question: 'Does new skincare often sting or itch?',
      options: [
        { value: 'yes', label: 'Yes, often' },
        { value: 'sometimes', label: 'Now and then' },
        { value: 'no', label: 'Rarely or never' },
      ],
    },
    {
      id: 'length',
      question: 'How many steps do you want each morning?',
      options: [
        { value: '3', label: 'Three, keep it quick' },
        { value: '5', label: 'Five, I enjoy the ritual' },
      ],
    },
  ],
}

export const about = {
  eyebrow: 'Our Lab',
  title: 'Gentle formulas, made like a kitchen, tested like a lab',
  body: 'VERDÉ began in 2019 with one golden serum mixed for a friend whose skin reacted to everything. Today a team of eleven formulates, fills and ships every bottle from our studio in Portland, in batches small enough to taste-test the texture of each one.',
  stats: [
    { value: '72%', label: 'centella in our signature serum' },
    { value: '2,000', label: 'units per batch, never more' },
    { value: '96%', label: 'of testers saw calmer skin in 4 weeks' },
  ],
  values: [
    { title: 'Fewer, better steps', body: 'We would rather you own four products that work than twelve that compete.' },
    { title: 'Proof before claims', body: 'Each claim on a box is backed by an independent panel study we will email you on request.' },
    { title: 'Glass first', body: 'Serums ship in amber glass with a free return label for refills.' },
  ],
}

export const contact = {
  title: 'We read every message',
  body: 'Questions about an order, a reaction or which serum to pick? Our skin team answers within one working day.',
  topics: ['Order and delivery', 'Product advice', 'Returns', 'Wholesale', 'Something else'],
  details: [
    { label: 'Hours', value: 'Mon to Fri, 9am to 5pm PT' },
    { label: 'Studio', value: '1120 SE Alder St, Portland, OR' },
  ],
  faq: [
    { q: 'How long does shipping take?', a: 'US orders leave our studio within one working day and arrive in two to five days. Orders over $60 ship free.' },
    { q: 'Can I return opened products?', a: 'Yes. Our 60-night trial covers opened products. Start a return from your order page or write to us.' },
    { q: 'Are your products safe in pregnancy?', a: 'Most are, but the Willow Clear Serum contains salicylic acid. Please check with your doctor and send us the product list.' },
    { q: 'Do you test on animals?', a: 'Never. VERDÉ is cruelty-free and every formula is vegan.' },
  ],
}

export const shipping = [
  { id: 'standard', label: 'Standard', detail: '2 to 5 working days', price: 6 },
  { id: 'express', label: 'Express', detail: 'Next working day', price: 14 },
] as const

export const footer = {
  blurb: 'Modern botanical skincare in small batches. Made in Portland, shipped in glass.',
  columns: [
    { title: 'Shop', links: [{ label: 'All products', to: '/shop' }, { label: 'Serums', to: '/shop?category=Treat' }, { label: 'Skin quiz', to: '/quiz' }, { label: 'Wishlist', to: '/wishlist' }] },
    { title: 'Help', links: [{ label: 'Contact us', to: '/contact' }, { label: 'Your orders', to: '/orders' }, { label: 'Our lab', to: '/about' }] },
    { title: 'Studio', links: [{ label: 'Style guide', to: '/styleguide' }] },
  ],
  legal: '© 2026 VERDÉ. Portfolio demo.',
}

export const newsletter = {
  title: 'Skin notes, once a month',
  body: 'New batches, ingredient deep dives and early access. No spam, unsubscribe any time.',
}

export const notFound = {
  title: 'This page has evaporated',
  body: 'The link may be old, or the product sold out for good. Try the shop, or let the quiz pick for you.',
}
