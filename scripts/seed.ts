import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  console.error('The Service Role Key is required to securely bypass RLS during seeding.');
  process.exit(1);
}

// Use the Service Role Key for backend administration tasks (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const LUXURY_MOODS = [
  {
    id: 'royal',
    name: 'Royal Heritage',
    description: 'Immerse in the timeless majesty of emperors and ancient dynastic craft.',
    ambientBg: 'bg-gradient-to-br from-[#0B0B0B] via-[#0D1117] to-[#121A2A]',
    accentColor: 'text-[#D4AF37]',
    cardStyle: 'bg-[#161B22]/80 border-[#D4AF37]/30',
    glowStyle: 'shadow-[0_0_15px_rgba(212,175,55,0.25)]',
    fonts: 'font-[#D4AF37]'
  },
  {
    id: 'romantic',
    name: 'Eternal Romance',
    description: 'Blush rose gold tones designed for soulmates, anniversaries, and soft promises.',
    ambientBg: 'bg-gradient-to-br from-[#0C0709] via-[#1A0D13] to-[#251019]',
    accentColor: 'text-[#E0A899]',
    cardStyle: 'bg-[#1E1118]/80 border-[#E0A899]/30',
    glowStyle: 'shadow-[0_0_15px_rgba(224,168,153,0.25)]',
    fonts: 'font-[#E0A899]'
  },
  {
    id: 'elegant',
    name: 'Sovereign Green',
    description: 'Deep royal emerald velvet themes paired with platinum-grade elements.',
    ambientBg: 'bg-gradient-to-br from-[#030605] via-[#051410] to-[#0A261D]',
    accentColor: 'text-[#10B981]',
    cardStyle: 'bg-[#0B1E19]/80 border-[#10B981]/30',
    glowStyle: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    fonts: 'font-[#10B981]'
  },
  {
    id: 'minimal',
    name: 'Modernist Purity',
    description: 'Crisp layout focusing on absolute negative space, thin contours, and raw diamonds.',
    ambientBg: 'bg-gradient-to-br from-[#FAF9F6] via-[#F4F3EF] to-[#EAE9E4] text-gray-900',
    accentColor: 'text-zinc-800',
    cardStyle: 'bg-white/90 border-[#18181B]/10 shadow-sm',
    glowStyle: 'shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
    fonts: 'font-zinc-800'
  },
  {
    id: 'vintage',
    name: 'Antique Grandeur',
    description: 'Dusty gold sepia finishes echoing centuries-old heritage filigree.',
    ambientBg: 'bg-gradient-to-br from-[#0A0807] via-[#1C130E] to-[#2E1F16]',
    accentColor: 'text-[#C29F6C]',
    cardStyle: 'bg-[#291B13]/80 border-[#C29F6C]/30',
    glowStyle: 'shadow-[0_0_15px_rgba(194,159,108,0.25)]',
    fonts: 'font-[#C29F6C]'
  },
  {
    id: 'bold',
    name: 'Avant-Garde Ruby',
    description: 'Daring geometries and heavy obsidian structures lit by molten red rubies.',
    ambientBg: 'bg-gradient-to-br from-[#050102] via-[#1A0307] to-[#31050F]',
    accentColor: 'text-[#EF4444]',
    cardStyle: 'bg-[#1C050B]/80 border-[#EF4444]/30',
    glowStyle: 'shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    fonts: 'font-[#EF4444]'
  }
];

const PRODUCTS = [
  {
    id: 'luxe-01',
    name: 'Imperial Mughal Emerald Choker',
    price: 18400,
    rating: 4.9,
    category: 'bridal',
    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=600',
    metal: '22K Kundan Gold',
    stone: 'Colombian Emerald',
    weight: '74.2 grams',
    hallmark: 'BIS Hallmarked 916',
    purity: '22K Pure Pristine Gold',
    description: 'A royal bridal heirloom matching hand-cut Zambian emeralds with classical Kundan settings.',
    longDescription: 'Created as a tribute to classical Indian court jewelry, this Masterpiece Choker is carefully assembled with over 45 carats of vibrant cushion-cut Colombian emeralds. The base is crafted in sovereign 22-karat yellow gold and decorated with floral openwork on the reverse side. Perfect for weddings and milestones of extreme importance.',
    specifications: {
      'Gemstone Carat Weight': '45.8 Carats',
      'Gold Purity': '22K Yellow Gold (BIS 916)',
      'Setting Type': 'Traditional Jadau Prong',
      'Artisanship Duration': '240 Hours by Master Craftsmen',
      'Clasp Type': 'Adjustable silk embroidery tassel'
    },
    isFeatured: true,
    reviews: [
      { author: 'Meera Deshmukh', rating: 5, date: '2026-04-12', comment: 'An unbelievable heirloom. The detail is flawless and the emerald shine is pristine.' },
      { author: 'Aria Carter', rating: 5, date: '2026-05-01', comment: 'Spectacular gold plating and fine details. It was the jewel of my wedding.' }
    ]
  },
  {
    id: 'luxe-02',
    name: 'Victoria Brilliant Cut Solitaire Ring',
    price: 8500,
    rating: 4.8,
    category: 'diamond',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600',
    metal: '950 Platinum',
    stone: 'VVS1 Brilliant Cut Diamond',
    weight: '3.4 grams',
    hallmark: 'GIA & IGI Certified',
    purity: '950 Pure Platinum',
    description: 'An iconic solitaire ring utilizing claw prongs to maximize natural diamond radiance.',
    longDescription: 'The Victoria solitaire boasts a handcrafted 2.5-carat round brilliant-cut diamond, graded VVS1 with an exceptional D-color index. Nestled inside a highly polished 950-grade platinum frame, its double-claw structure emphasizes fire, brilliance, and scintillation.',
    specifications: {
      'Diamond Carat Weight': '2.52 Carats',
      'Clarity Grade': 'VVS1 (Exceptional Cut)',
      'Color Grade': 'D (Colorless)',
      'Metal Weight': '3.4 grams Platinum',
      'Certification': 'GIA Documented #898231'
    },
    isTrending: true,
    reviews: [
      { author: 'Christopher Vance', rating: 5, date: '2026-03-24', comment: 'She said yes! The sparkle is mesmerizing under sunlight.' }
    ]
  },
  {
    id: 'luxe-03',
    name: 'Royal Heritage Temple Haram Necklace',
    price: 12900,
    rating: 4.9,
    category: 'gold',
    image: '/images/heritage_temple_haram_1779367022104.png',
    metal: 'Antique Crafted 22K Gold',
    stone: 'Deep Red Ruby Accents',
    weight: '82.5 grams',
    hallmark: 'BIS Hallmark 916',
    purity: '22K Ancient Gold',
    description: 'A stately layering necklace carved with classical divine motifs and majestic ruby drops.',
    longDescription: 'Our signature Temple Haram features a hand-chiseled pendant modeling the dancing Lakshmi, framed by twin miniature temple vaults. Standard double-cuban links run throughout the length to ensure high durability and absolute royal comfort.',
    specifications: {
      'Gold Purity': '22 Karat Standard Antique Gold',
      'Product Length': '24 Inches Adjustable',
      'Ruby Carats': '4.1 Carats Birmean Ruby',
      'Net Weight': '82.50 Grams'
    },
    reviews: []
  },
  {
    id: 'luxe-04',
    name: 'Symphony Sapphire Chandelier Earrings',
    price: 9400,
    rating: 4.7,
    category: 'precious-stones',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600',
    metal: '18K White Gold',
    stone: 'Kashmir Blue Sapphire',
    weight: '16.8 grams',
    hallmark: 'SGL Certified Luxury Jewel',
    purity: '18K Brilliant White Gold',
    description: 'Waterfall earrings boasting dark blue sapphires and brilliant diamond micro-pave.',
    longDescription: 'Capturing the serenity of Alpine lakes, these drop chandelier earrings highlight deep-saturated Kashmir blue sapphires of exceptional translucency. Standard pushbacks are reinforced with secondary security locks for seamless wearable security.',
    specifications: {
      'Sapphire Count': '8 Precision Marquise Gems (12.2 carats)',
      'Diamond Accents': '112 Round Paved Diamonds (1.8 carats)',
      'Mount Metal': '18K Sterling White Gold',
      'Drop Length': '2.1 Inches'
    },
    isFeatured: true,
    reviews: [
      { author: 'Helena S.', rating: 5, date: '2026-05-15', comment: 'Matches my sapphire gowns perfectly. Heavy but balanced.' }
    ]
  },
  {
    id: 'luxe-05',
    name: 'Nouveau Silver Twist Kada Bracelet',
    price: 2100,
    rating: 4.6,
    category: 'silver',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600',
    metal: '925 Sterling Silver',
    stone: 'None (Plain Textured)',
    weight: '44.5 grams',
    hallmark: 'S925 Stamped',
    purity: '92.5% Premium Silver',
    description: 'A thick, solid silver cuff styled with geometric helix patterns for a modern premium wear.',
    longDescription: 'Designed for versatility, our Nouveau Twist Kada combines hand-drawn fine silver lines with a brushed industrial finish. Fits both modern men and women who prefer majestic, understated wrist accents.',
    specifications: {
      'Silver Stamp': 'Hallmarked S925',
      'Diameter': '2.6 Inches Adjustable',
      'Weight': '44.50 Grams',
      'ArtStyle': 'Symmetric Twist'
    },
    reviews: []
  },
  {
    id: 'luxe-06',
    name: 'The Empress Queen Diamond Tiara Necklet',
    price: 24500,
    rating: 5.0,
    category: 'diamond',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    metal: '18K Platinum Alloy',
    stone: 'F-Color Clarity Diamonds',
    weight: '98.4 grams',
    hallmark: 'IGI Certified Diamond',
    purity: '950 Platinum Base',
    description: 'An elite necklet inspired by French baroque architectures, featuring 600 sparkling diamonds.',
    longDescription: 'For absolute luxury, this piece is the pinnacle of Luxeora design. Every single diamond is set under microscope lenses by sixth-generation setters to ensure perfect alignment, projecting a seamless crown-like halo around the collar.',
    specifications: {
      'Total Carats': '28.5 Carats VS-F Grade',
      'Base Frame': 'Sovereign Platinum-Palladium Alloy',
      'Occasion Rating': 'Bridal/Met Gala Class',
      'Weight': '98.40 Grams'
    },
    isTrending: true,
    reviews: []
  },
  {
    id: 'luxe-07',
    name: 'Birman Radiant Ruby Ring',
    price: 7600,
    rating: 4.8,
    category: 'precious-stones',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    metal: '18K Yellow Gold Shank',
    stone: 'Pigeon-Blood Ruby',
    weight: '6.8 grams',
    hallmark: 'GIA Ruby certified',
    purity: '18K Classic Gold',
    description: 'A deep pigeon-blood Birman ruby set on a diamond-encrusted yellow gold band.',
    longDescription: 'The pigeon-blood hue represents the rarest shade of natural rubies in existence. Sourced responsibly from northern valleys, this ruby shines with an inner warmth that captures light beautifully.',
    specifications: {
      'Ruby Source': 'Responsible Burma Valleys',
      'Carats': '3.2 Carats Natural Ruby',
      'Shoulder Accents': 'Pave Brilliant Diamonds (0.80 Carats)',
      'Metal Purity': '18K Pristine Gold'
    },
    reviews: []
  },
  {
    id: 'luxe-08',
    name: 'Monaco Heavy Men Loop Link Chain',
    price: 6100,
    rating: 4.7,
    category: 'gold',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
    metal: '18K Yellow Solid Gold',
    stone: 'Marquise-Cut Diamond Clasps',
    weight: '58.0 grams',
    hallmark: 'BIS 750 Hallmarked',
    purity: '18K Solid Gold',
    description: 'A robust luxury Cuban-inspired chain with custom flat-beveled heavy links.',
    longDescription: 'A modern staple for men with sophisticated taste. Every link is dense, mirror-polished, and reinforced with double-tongue designer clasps covered in pavé diamonds.',
    specifications: {
      'Metal Purity': '18K Solid Yellow Gold',
      'Chain Width': '8.5 mm',
      'Length': '22 Inches Standard',
      'Clasp Cladding': '0.5 Carat Diamond Accents'
    },
    reviews: []
  },
  {
    id: 'luxe-09',
    name: 'Gilded Flora Filigree Bangle',
    price: 5200,
    rating: 4.8,
    category: 'gold',
    image: '/images/gold_flora_bangle_1779367093769.png',
    metal: '22K Kundan Gold',
    stone: 'Spinel & Emerald Accents',
    weight: '36.5 grams',
    hallmark: 'BIS Hallmarked 916',
    purity: '22K Solid Gold',
    description: 'An exquisitely hand-carved solid gold cuff showcasing natural flora patterns in relief.',
    longDescription: 'Rich gold foliage flourishes across this structural bangle. Handcrafted by master artisans in Rajasthan over several weeks, the design mixes heavy gold relief engraving with tiny emerald studs and Kundan embellishments to create a magnificent look on the wrist.',
    specifications: {
      'Gold Purity': '22 Karat Standard Antique Gold',
      'Diameter': '2.4 Inches (Flexible fit)',
      'Stone Accents': '0.8 Carats Colombian Emeralds',
      'Net Weight': '36.50 Grams'
    },
    isFeatured: true,
    reviews: []
  },
  {
    id: 'luxe-10',
    name: 'Royal Marquise Ruby Choker',
    price: 11500,
    rating: 4.9,
    category: 'precious-stones',
    image: '/images/marquise_ruby_choker_1779367042539.png',
    metal: '18K Yellow Gold Base',
    stone: 'Marquise Burmese Rubies',
    weight: '42.8 grams',
    hallmark: 'GIA Certified Ruby',
    purity: '18K Royal Gold',
    description: 'A delicate gold lace choker adorned with stellar pigeon-blood rubies in floral marquise lattices.',
    longDescription: 'Symphonically designed to gracefully grace the modern neck, this choker holds over 18 carats of carefully selected marquise rubies of exceptional deep crimson flame. Backed by solid 18K yellow gold settings, it feels feather-light while projecting maximum royal power.',
    specifications: {
      'Ruby Weight': '18.4 Carats Marquise',
      'Base Frame': '18K Brilliant Yellow Gold',
      'Choker Width': '0.7 Inches',
      'Artisanship Duration': '180 Hours'
    },
    isTrending: true,
    reviews: []
  },
  {
    id: 'luxe-11',
    name: 'Diamond Solitaire Halo Earring Studs',
    price: 4800,
    rating: 4.8,
    category: 'diamond',
    image: '/images/diamond_halo_studs_1779367057418.png',
    metal: '950 Platinum',
    stone: 'Ideal-Cut Sparkle Diamonds',
    weight: '5.2 grams',
    hallmark: 'GIA Certified Diamond',
    purity: 'Platinum 950',
    description: 'Brilliant round-cut diamond solitaire studs surrounded by micro-pavé halos.',
    longDescription: 'Dazzle with these ultra-bright solitaire studs. Perfect for both sophisticated galas and intimate candlelit dinners, they pair 1.2-carat central GIA diamonds with circular micro-pavé frames, offering dramatic fire and unmatched light return from all angles.',
    specifications: {
      'Total Carat Weight': '2.80 Carats',
      'Center Diamonds': 'Twin 1.2-Carat Solitaires (Total 2.4)',
      'Clarity': 'VVS2 Excellent Cut',
      'Color Grade': 'E (Nearly Colorless)'
    },
    reviews: []
  },
  {
    id: 'luxe-12',
    name: 'The Maharani Polki Choker Set',
    price: 21800,
    rating: 5.0,
    category: 'bridal',
    image: '/images/maharani_polki_set_1779367072272.png',
    metal: '22K Kundan Yellow Gold',
    stone: 'Uncut Diamonds & Basra Pearls',
    weight: '110.5 grams',
    hallmark: 'BIS Hallmarked',
    purity: '22K Royal Kundan',
    description: 'A stellar heritage bridal collar set highlighting layered uncut diamonds and pristine pearls.',
    longDescription: 'Evoking the royal heritage of the Mughal queens, the Maharani set represents wedding design at its zenith. Built with premium-grade uncut Polki diamonds set in 22K gold foil with traditional red enamel backings, complete with a gorgeous fringe of Basra seed pearls.',
    specifications: {
      'Polki Diamond Weight': '38.2 Carats',
      'Pearl Quality': 'Pristine Natural Basra South-Sea Pearls',
      'Necklace Weight': '110.5 Grams',
      'Occasion Class': 'Grand Imperial Bridal'
    },
    isFeatured: true,
    reviews: []
  },
  {
    id: 'luxe-13',
    name: 'Classic Vintage Silver Chandelier Drops',
    price: 1650,
    rating: 4.7,
    category: 'silver',
    image: '/images/silver_vintage_drops_1779367111145.png',
    metal: '925 Oxidized Silver',
    stone: 'Aquitaine Blue Zircon',
    weight: '22.4 grams',
    hallmark: 'Silver S925 Hallmarked',
    purity: '92.5% Fine Silver',
    description: 'Delicately styled chandelier drop earrings with baroque swirls and dangling aquamarine droplets.',
    longDescription: 'Taking inspiration from Victorian era chandelier details, these lightweight 925 sterling silver earrings boast beautifully hand-oxidized swirls that accentuate their relief details, finished with sparkling aquamarine zircons that catch every breath of wind.',
    specifications: {
      'Silver Base': '925 Fine Sterling Silver with Antique Finish',
      'Drop Length': '2.4 Inches',
      'Dangle Stones': 'Natural Zircon Drops',
      'Locking': 'Leverback Security'
    },
    reviews: []
  }
];

const SHOWROOM_ZONES = [
  {
    id: 'diamond',
    name: 'Diamond Lounge',
    description: 'Step into an atmosphere of icy perfection and high brilliance under spotlights.',
    bgHex: '#080A10',
    imageUrl: '/images/diamond_lounge_1779366486978.png',
    spotlightTarget: 'luxe-02',
    hotspots: [
      { id: 'hs-01', productId: 'luxe-02', x: 35, y: 48, title: 'Victoria Solitaire Ring', price: '$8,500', shimmerColor: 'rgba(255,255,255,0.7)' },
      { id: 'hs-02', productId: 'luxe-06', x: 65, y: 35, title: 'Empress Diamond Tiara', price: '$24,500', shimmerColor: 'rgba(255,255,255,0.8)' }
    ]
  },
  {
    id: 'gold',
    name: 'Gold Heritage Hall',
    description: 'Feel the rich warmth of standard yellow sovereigns and exquisite design filigree.',
    bgHex: '#140F05',
    imageUrl: '/images/gold_heritage_1779366503738.png',
    spotlightTarget: 'luxe-03',
    hotspots: [
      { id: 'hs-03', productId: 'luxe-03', x: 50, y: 40, title: 'Heritage Temple Haram', price: '$12,900', shimmerColor: 'rgba(212,175,55,0.8)' },
      { id: 'hs-04', productId: 'luxe-08', x: 25, y: 60, title: 'Monaco Men Link Chain', price: '$6,100', shimmerColor: 'rgba(212,175,55,0.7)' }
    ]
  },
  {
    id: 'bridal',
    name: 'Bridal Gallery',
    description: 'Immersive wedding canopies showing signature multi-tier jewelry sets.',
    bgHex: '#1A0A0E',
    imageUrl: '/images/bridal_gallery_1779366524639.png',
    spotlightTarget: 'luxe-01',
    hotspots: [
      { id: 'hs-05', productId: 'luxe-01', x: 50, y: 50, title: 'Imperial Mughal Emerald Choker', price: '$18,400', shimmerColor: 'rgba(16,185,129,0.8)' }
    ]
  },
  {
    id: 'stones',
    name: 'Precious Stone Chamber',
    description: 'Glows in deep, mysterious hues of ruby red, emerald, and midnight blue sapphire.',
    bgHex: '#081C15',
    imageUrl: '/images/gems_chamber_1779366543334.png',
    spotlightTarget: 'luxe-04',
    hotspots: [
      { id: 'hs-06', productId: 'luxe-04', x: 40, y: 45, title: 'Symphony Sapphire Earrings', price: '$9,400', shimmerColor: 'rgba(59,130,246,0.8)' },
      { id: 'hs-07', productId: 'luxe-07', x: 70, y: 55, title: 'Birman Radiant Ruby Ring', price: '$7,600', shimmerColor: 'rgba(239,68,68,0.8)' }
    ]
  }
];

const STORIES = [
  {
    id: 'st-01',
    title: 'The Mughal Filigree Renaissance',
    tag: 'Craftsmanship Sagas',
    excerpt: 'Discover how sixth-generation royal handcraftsmen build Luxeora filigrees over three months.',
    content: 'Deep in Jaipur’s historic alleys, our head jeweler Pandit Hariprasad leads a small group of specialists dedicated to reviving traditional filigree. By drawing sovereign gold into thin wires measuring less than 0.1mm, they weave intricate flower tapestries that rest as light as silk on the collar, yet carry generations of prestige.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400',
    duration: '5 min read'
  },
  {
    id: 'st-02',
    title: 'Ethical sourcing: The D-Color Solitaire Journey',
    tag: 'Gemstone Origins',
    excerpt: 'Trace our conflict-free extraction system from deep Kimberlite pipes to Antwerp certification.',
    content: 'We believe premium products should boast pure pristine origins. Every single Luxeora brilliant diamond is tracked using a immutable blockchain-registered dossier. Families from our source mines receive fair livelihood shares, medical, and regional educational infrastructure backups.',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=400',
    duration: '4 min read'
  },
  {
    id: 'st-03',
    title: 'Sacred Alignments: Temple Jewellery Archetypes',
    tag: 'Divine History',
    excerpt: 'Uncover the esoteric geometries behind deep gold temple motifs to elevate your daily aura.',
    content: 'Classic temple neck pieces were modeled on cosmic constellations. They are built as focal devices designed to ground the wearer’s aura in courage, majesty, and prosperity during sacred events.',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=400',
    duration: '6 min read'
  }
];

async function seed() {
  console.log('--- Starting Luxeora Seeding Process ---');

  console.log('Seeding luxury_moods...');
  const { error: moodError } = await supabase.from('luxury_moods').upsert(LUXURY_MOODS);
  if (moodError) {
    console.error('Failed to seed luxury_moods. Maybe the table is not created yet? Details:', moodError.message);
    process.exit(1);
  }
  console.log('Successfully seeded luxury_moods.');

  console.log('Seeding products...');
  const productInsertData = PRODUCTS.map(({ reviews, ...product }) => product);
  const { error: productError } = await supabase.from('products').upsert(productInsertData);
  if (productError) {
    console.error('Failed to seed products:', productError.message);
    process.exit(1);
  }
  console.log('Successfully seeded products.');

  console.log('Seeding product_reviews...');
  const allReviews: any[] = [];
  PRODUCTS.forEach(p => {
    if (p.reviews && p.reviews.length > 0) {
      p.reviews.forEach(r => {
        allReviews.push({
          productId: p.id,
          author: r.author,
          rating: r.rating,
          date: r.date,
          comment: r.comment
        });
      });
    }
  });

  if (allReviews.length > 0) {
    await supabase.from('product_reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: reviewsError } = await supabase.from('product_reviews').insert(allReviews);
    if (reviewsError) {
      console.error('Failed to seed product_reviews:', reviewsError.message);
      process.exit(1);
    }
    console.log(`Successfully seeded ${allReviews.length} reviews.`);
  }

  console.log('Seeding showroom_zones...');
  const zoneInsertData = SHOWROOM_ZONES.map(({ hotspots, ...zone }) => zone);
  const { error: zoneError } = await supabase.from('showroom_zones').upsert(zoneInsertData);
  if (zoneError) {
    console.error('Failed to seed showroom_zones:', zoneError.message);
    process.exit(1);
  }
  console.log('Successfully seeded showroom_zones.');

  console.log('Seeding showroom_hotspots...');
  const allHotspots: any[] = [];
  SHOWROOM_ZONES.forEach(z => {
    z.hotspots.forEach(hs => {
      allHotspots.push({
        id: hs.id,
        zoneId: z.id,
        productId: hs.productId,
        x: hs.x,
        y: hs.y,
        title: hs.title,
        price: hs.price,
        shimmerColor: hs.shimmerColor
      });
    });
  });

  const { error: hotspotsError } = await supabase.from('showroom_hotspots').upsert(allHotspots);
  if (hotspotsError) {
    console.error('Failed to seed showroom_hotspots:', hotspotsError.message);
    process.exit(1);
  }
  console.log('Successfully seeded showroom_hotspots.');

  console.log('Seeding stories...');
  const { error: storiesError } = await supabase.from('stories').upsert(STORIES);
  if (storiesError) {
    console.error('Failed to seed stories:', storiesError.message);
    process.exit(1);
  }
  console.log('Successfully seeded stories.');

  console.log('--- Luxeora Seeding Completed Successfully ---');
}

seed().catch(err => {
  console.error('Unexpected error during seeding:', err);
  process.exit(1);
});
