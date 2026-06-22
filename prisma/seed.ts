import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Tech", slug: "tech", description: "Cutting-edge technology and gadgets", icon: "Laptop", sortOrder: 1 },
  { name: "Accessories", slug: "accessories", description: "Premium daily carry and accessories", icon: "Watch", sortOrder: 2 },
  { name: "Home", slug: "home", description: "Modern living essentials", icon: "Home", sortOrder: 3 },
  { name: "Lifestyle", slug: "lifestyle", description: "Curated lifestyle products", icon: "Sparkles", sortOrder: 4 },
  { name: "Fitness", slug: "fitness", description: "Performance-driven fitness gear", icon: "Activity", sortOrder: 5 },
];

const products = [
  {
    name: "Minimalist Wireless Headphones",
    slug: "minimalist-wireless-headphones",
    description: "Experience audio purity with our flagship wireless headphones. Precision-engineered drivers deliver a soundstage that reveals every nuance in your music. The anodized aluminum frame provides durability while maintaining a featherlight 195g weight. With 40 hours of battery life and active noise cancellation, these headphones are designed for the modern professional who demands excellence in every detail.",
    shortDescription: "40h battery, ANC, premium aluminum build",
    price: 349.00,
    comparePrice: 449.00,
    costPrice: 175.00,
    sku: "M4VX-WH-001",
    stock: 150,
    isFeatured: true,
    isNew: true,
    weight: 0.195,
    dimensions: "18.5 x 15.2 x 7.6 cm",
    material: "Anodized aluminum, protein leather ear cups",
    countryOfOrigin: "Japan",
    warrantyInfo: "2-year limited warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", alt: "Minimalist Wireless Headphones - Side view", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", alt: "Headphones on display stand", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80", alt: "Headphones folded", isPrimary: false, sortOrder: 2 },
      { url: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80", alt: "Headphones detail shot", isPrimary: false, sortOrder: 3 },
    ],
    variants: [
      { name: "Matte Black", stock: 60 },
      { name: "Silver", stock: 50 },
      { name: "Space Gray", stock: 40 },
    ],
    reviews: [
      { rating: 5, title: "Best headphones I've ever owned", body: "The sound quality is incredible. Crystal clear highs and deep, punchy bass. The noise cancellation is on par with Sony's XM series. Highly recommend.", isApproved: true },
      { rating: 4, title: "Almost perfect", body: "Great build quality and sound. The only downside is the case is a bit bulky. But the headphones themselves are exceptional.", isApproved: true },
      { rating: 5, title: "Worth every penny", body: "Upgraded from AirPods Pro and the difference is night and day. These are in a completely different league.", isApproved: true },
    ],
    categoryNames: ["Tech", "Accessories"],
  },
  {
    name: "Sculpted Desk Lamp",
    slug: "sculpted-desk-lamp",
    description: "A desk lamp that doubles as a sculptural object. Machined from a single block of aluminum with an adjustable arm that glides with precision counterbalance. The LED array delivers 95+ CRI color accuracy across five brightness levels, while the integrated wireless charging pad keeps your devices powered.",
    shortDescription: "Aluminum build, 95+ CRI, wireless charger base",
    price: 289.00,
    comparePrice: null,
    costPrice: 145.00,
    sku: "M4VX-LP-001",
    stock: 85,
    isFeatured: true,
    isNew: false,
    weight: 1.2,
    dimensions: "45 x 15 x 12 cm",
    material: "Machined aluminum, polycarbonate diffuser",
    countryOfOrigin: "Germany",
    warrantyInfo: "3-year warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&q=80", alt: "Desk lamp on modern desk", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80", alt: "Lamp angled view", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1534105615258-00a42e3eae7e?w=800&q=80", alt: "Lamp in dark room", isPrimary: false, sortOrder: 2 },
    ],
    reviews: [
      { rating: 5, title: "A work of art", body: "This lamp is absolutely stunning. The build quality is exceptional and the lighting is perfect for my workspace. The wireless charger is a nice bonus.", isApproved: true },
      { rating: 4, title: "Beautiful but pricey", body: "It's definitely expensive for a desk lamp, but the design and build quality justify the price. Looks like a sculpture on my desk.", isApproved: true },
    ],
    categoryNames: ["Home", "Tech"],
  },
  {
    name: "Horizon Leather Tote",
    slug: "horizon-leather-tote",
    description: "A tote bag that redefines everyday carry. Cut from full-grain Italian leather that develops a rich patina over time. The minimalist silhouette conceals a thoughtfully organized interior with padded laptop sleeve, magnetic closure, and hidden pocket for essentials. Hand-stitched in Tuscany.",
    shortDescription: "Full-grain Italian leather, fits 16\" laptop",
    price: 595.00,
    comparePrice: 795.00,
    costPrice: 298.00,
    sku: "M4VX-TT-001",
    stock: 45,
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    weight: 0.85,
    dimensions: "38 x 30 x 10 cm",
    material: "Full-grain Italian leather, waxed canvas lining",
    countryOfOrigin: "Italy",
    warrantyInfo: "Lifetime warranty against manufacturing defects",
    images: [
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", alt: "Leather tote front view", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80", alt: "Tote interior detail", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", alt: "Tote worn on shoulder", isPrimary: false, sortOrder: 2 },
    ],
    reviews: [
      { rating: 5, title: "Incredible quality", body: "The leather is gorgeous and the craftsmanship is impeccable. I've received so many compliments. Worth every cent.", isApproved: true },
      { rating: 5, title: "My new everyday bag", body: "Perfect size for work and weekend trips. The leather is already developing a beautiful patina after just a month.", isApproved: true },
      { rating: 4, title: "Beautiful bag", body: "Stunning design and amazing leather quality. Would love to see more color options in the future.", isApproved: true },
    ],
    categoryNames: ["Accessories", "Lifestyle"],
  },
  {
    name: "Prism Water Bottle",
    slug: "prism-water-bottle",
    description: "Hydration reimagined. This triple-insulated stainless steel bottle keeps drinks cold for 48 hours or hot for 24. The geometric faceted design catches light beautifully while providing exceptional grip. The leak-proof cap features a magnetic carry loop and a precision-machined spout.",
    shortDescription: "Triple-insulated, 48h cold, 750ml capacity",
    price: 85.00,
    comparePrice: 95.00,
    costPrice: 42.00,
    sku: "M4VX-WB-001",
    stock: 300,
    isFeatured: false,
    isNew: true,
    isBestSeller: true,
    weight: 0.4,
    dimensions: "25 x 7.5 cm",
    material: "18/8 stainless steel, silicone base",
    countryOfOrigin: "China",
    warrantyInfo: "5-year warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80", alt: "Water bottle in hand", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80", alt: "Bottle studio shot", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&q=80", alt: "Bottle detail", isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { name: "Obsidian Black", stock: 100 },
      { name: "Frost White", stock: 120 },
      { name: "Slate Gray", stock: 80 },
    ],
    reviews: [
      { rating: 5, title: "Best water bottle ever", body: "The design is gorgeous and it actually keeps ice cold for over 48 hours. The magnetic cap loop is genius.", isApproved: true },
      { rating: 5, title: "Beautiful and functional", body: "I get compliments everywhere I go. The faceted design is unique and the insulation is incredible.", isApproved: true },
      { rating: 4, title: "Great bottle", body: "Really well designed bottle. The only thing I'd change is adding a carry handle. Otherwise perfect.", isApproved: true },
    ],
    categoryNames: ["Lifestyle", "Fitness"],
  },
  {
    name: "Apex Fitness Tracker",
    slug: "apex-fitness-tracker",
    description: "A precision health instrument that monitors more than just steps. The Apex features a sapphire crystal display, continuous heart rate monitoring with ECG capability, blood oxygen sensing, sleep stage analysis, and built-in GPS with GLONASS. The titanium case is rated to 100m water resistance.",
    shortDescription: "Sapphire display, ECG, GPS, 7-day battery",
    price: 499.00,
    comparePrice: 599.00,
    costPrice: 250.00,
    sku: "M4VX-FT-001",
    stock: 120,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    weight: 0.052,
    dimensions: "4.4 x 3.8 x 1.2 cm",
    material: "Titanium case, sapphire crystal, fluoroelastomer band",
    countryOfOrigin: "Switzerland",
    warrantyInfo: "2-year warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80", alt: "Fitness tracker on wrist", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", alt: "Tracker display closeup", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", alt: "Tracker product shot", isPrimary: false, sortOrder: 2 },
      { url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80", alt: "Tracker on desk", isPrimary: false, sortOrder: 3 },
    ],
    variants: [
      { name: "Titanium Natural", stock: 50 },
      { name: "Titanium Black", stock: 70 },
    ],
    reviews: [
      { rating: 5, title: "Incredible health tracker", body: "The ECG feature is amazing and the build quality is top notch. The sapphire screen is scratch-free after 6 months of daily wear.", isApproved: true },
      { rating: 5, title: "Worth the investment", body: "Upgraded from an Apple Watch and this is leagues ahead in health tracking. The battery lasts a full week.", isApproved: true },
      { rating: 4, title: "Almost perfect", body: "Great device but the app could use some improvements. The hardware is exceptional though.", isApproved: true },
    ],
    categoryNames: ["Tech", "Fitness"],
  },
  {
    name: "Nordic Wool Throw",
    slug: "nordic-wool-throw",
    description: "Handwoven by master artisans in the Faroe Islands, this throw blanket is crafted from the wool of free-range Faroese sheep. The natural lanolin content makes it water-resistant and self-cleaning. Each throw takes three days to weave on traditional looms, resulting in a textile that will last generations.",
    shortDescription: "Handwoven Faroese wool, heirloom quality",
    price: 425.00,
    comparePrice: null,
    costPrice: 212.00,
    sku: "M4VX-TH-001",
    stock: 30,
    isFeatured: false,
    isNew: false,
    weight: 1.1,
    dimensions: "140 x 180 cm",
    material: "100% Faroese wool",
    countryOfOrigin: "Faroe Islands",
    warrantyInfo: "Lifetime guarantee",
    images: [
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", alt: "Wool throw on couch", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", alt: "Throw fabric detail", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "Heirloom quality", body: "This is not just a blanket, it's a piece of art. The wool is incredibly soft and warm. Will pass this down to my children.", isApproved: true },
    ],
    categoryNames: ["Home", "Lifestyle"],
  },
  {
    name: "Kin Desk Organizer",
    slug: "kin-desk-organizer",
    description: "A modular desk organization system crafted from solid walnut and precision-milled aluminum. The magnetic baseplate allows infinite configuration of the included modules — pen holder, phone stand, card holder, and catch-all tray. Each piece is finished with Danish oil to highlight the natural grain.",
    shortDescription: "Walnut + aluminum modular system",
    price: 195.00,
    comparePrice: 245.00,
    costPrice: 98.00,
    sku: "M4VX-DO-001",
    stock: 65,
    isFeatured: false,
    isNew: true,
    weight: 0.65,
    dimensions: "28 x 18 x 4 cm",
    material: "Walnut, anodized aluminum, neodymium magnets",
    countryOfOrigin: "USA",
    warrantyInfo: "1-year warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1496113728416-3e4607b0e99b?w=800&q=80", alt: "Desk organizer full setup", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1495904786722-d2c5a3a0f8e3?w=800&q=80", alt: "Organizer detail", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "Beautiful organization", body: "My desk has never looked better. The magnetic system is brilliant and the walnut is gorgeous.", isApproved: true },
    ],
    categoryNames: ["Tech", "Home"],
  },
  {
    name: "Cipher Notebook",
    slug: "cipher-notebook",
    description: "A notebook for those who think on paper. Bound in Japanese waxed cotton with a refillable lay-flat binding. The 160gsm Tomoe River paper is fountain pen friendly with minimal bleed-through. Features numbered pages, a ribbon bookmark, and an expandable back pocket.",
    shortDescription: "Tomoe River paper, waxed cotton cover, A5",
    price: 65.00,
    comparePrice: null,
    costPrice: 32.00,
    sku: "M4VX-NB-001",
    stock: 200,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    weight: 0.3,
    dimensions: "21 x 14.8 cm",
    material: "Japanese waxed cotton, Tomoe River 160gsm paper",
    countryOfOrigin: "Japan",
    warrantyInfo: null,
    images: [
      { url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80", alt: "Notebook on desk", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&q=80", alt: "Notebook open pages", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "Beautiful notebook", body: "The paper is simply incredible. Fountain pens glide across it like butter. The waxed cotton cover is aging beautifully.", isApproved: true },
      { rating: 5, title: "Perfect everyday notebook", body: "I've tried dozens of notebooks and this is by far the best. The lay-flat binding is perfect for writing.", isApproved: true },
    ],
    categoryNames: ["Lifestyle", "Accessories"],
  },
  {
    name: "Pulse Wireless Speaker",
    slug: "pulse-wireless-speaker",
    description: "A wireless speaker that looks as good as it sounds. The Pulse features a bespoke 3-driver array tuned by Grammy-winning engineers, delivering room-filling sound from a compact ceramic enclosure. The textile wrap is made from recycled ocean plastics, and the speaker supports multi-room synchronization.",
    shortDescription: "Ceramic enclosure, multi-room, 20h battery",
    price: 249.00,
    comparePrice: 299.00,
    costPrice: 125.00,
    sku: "M4VX-SP-001",
    stock: 90,
    isFeatured: false,
    isNew: true,
    weight: 0.75,
    dimensions: "17 x 10 x 10 cm",
    material: "Ceramic, recycled textile, silicone base",
    countryOfOrigin: "Denmark",
    warrantyInfo: "2-year warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80", alt: "Wireless speaker on shelf", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80", alt: "Speaker detail texture", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "Incredible sound", body: "I was skeptical a speaker this size could sound this good. The bass response is amazing and the ceramic body looks stunning on my shelf.", isApproved: true },
    ],
    categoryNames: ["Tech", "Lifestyle"],
  },
  {
    name: "Terra Plant Pot Set",
    slug: "terra-plant-pot-set",
    description: "A set of three planters crafted from terracotta with a matte charcoal glaze. Each pot features an integrated drainage system with a hidden water reservoir that indicates when your plants need watering. The geometric forms are designed to complement any modern interior.",
    shortDescription: "Set of 3, self-watering, matte charcoal glaze",
    price: 145.00,
    comparePrice: null,
    costPrice: 72.00,
    sku: "M4VX-PP-001",
    stock: 55,
    isFeatured: false,
    isNew: false,
    weight: 2.1,
    dimensions: "S: 10cm, M: 14cm, L: 18cm diameter",
    material: "Terracotta with charcoal glaze",
    countryOfOrigin: "Portugal",
    warrantyInfo: null,
    images: [
      { url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80", alt: "Plant pot set on shelf", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80", alt: "Single plant pot", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "Beautiful planters", body: "The glaze is stunning and the self-watering feature actually works. My plants have never been happier.", isApproved: true },
    ],
    categoryNames: ["Home", "Lifestyle"],
  },
  {
    name: "Vault Cable Organizer",
    slug: "vault-cable-organizer",
    description: "A cable management solution that doesn't hide your cables — it displays them. The Vault is machined from solid aluminum with precisely cut channels that route cables with satisfying precision. Holds up to 6 cables simultaneously with magnetic quick-release clips.",
    shortDescription: "Solid aluminum, 6 cables, magnetic clips",
    price: 79.00,
    comparePrice: 99.00,
    costPrice: 40.00,
    sku: "M4VX-CO-001",
    stock: 180,
    isFeatured: false,
    isNew: true,
    weight: 0.35,
    dimensions: "20 x 8 x 3 cm",
    material: "Aluminum, silicone grips",
    countryOfOrigin: "Taiwan",
    warrantyInfo: "1-year warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1610953696244-fa27e4b5ce34?w=800&q=80", alt: "Cable organizer on desk", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80", alt: "Cable routing detail", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "So satisfying", body: "Routing cables through this thing is genuinely satisfying. My desk has never been this clean.", isApproved: true },
    ],
    categoryNames: ["Tech", "Accessories"],
  },
  {
    name: "Forma Yoga Mat",
    slug: "forma-yoga-mat",
    description: "A yoga mat engineered for performance. The dual-layer construction features a natural rubber base for exceptional grip and a microfiber suede top layer that becomes grippier as you sweat. At 6mm thick, it provides optimal cushioning without sacrificing stability. The carrying strap is included.",
    shortDescription: "Natural rubber + suede, 6mm, eco-friendly",
    price: 128.00,
    comparePrice: 148.00,
    costPrice: 64.00,
    sku: "M4VX-YM-001",
    stock: 100,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    weight: 2.5,
    dimensions: "183 x 61 x 0.6 cm",
    material: "Natural rubber, microfiber suede",
    countryOfOrigin: "India",
    warrantyInfo: "2-year warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80", alt: "Yoga mat rolled", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", alt: "Yoga mat on floor", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "Game changer for practice", body: "The grip when sweating is incredible. I no longer slip during hot yoga. Worth every penny.", isApproved: true },
      { rating: 5, title: "Premium quality", body: "You can feel the quality difference immediately. The rubber base stays put on any floor surface.", isApproved: true },
    ],
    categoryNames: ["Fitness", "Lifestyle"],
  },
  {
    name: "Arc Reading Light",
    slug: "arc-reading-light",
    description: "A reading light designed for the avid reader. The Arc features a precision-ground optical lens that projects a focused, warm 3000K beam that illuminates only your page without disturbing others. The articulating arm adjusts with one finger, and the rechargeable battery provides 30 hours of reading on a single charge.",
    shortDescription: "Warm 3000K LED, 30h battery, adjustable arm",
    price: 95.00,
    comparePrice: null,
    costPrice: 48.00,
    sku: "M4VX-RL-001",
    stock: 75,
    isFeatured: false,
    isNew: false,
    weight: 0.18,
    dimensions: "28 x 3 x 2 cm",
    material: "Aluminum, polycarbonate lens",
    countryOfOrigin: "China",
    warrantyInfo: "1-year warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80", alt: "Reading light on book", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1527903789995-dc8ad2ad6de0?w=800&q=80", alt: "Reading light angled", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "Perfect for bedtime reading", body: "My wife can sleep right next to me while I read. The focused beam only illuminates the page. Brilliant design.", isApproved: true },
    ],
    categoryNames: ["Accessories", "Lifestyle"],
  },
  {
    name: "Resin Coaster Set",
    slug: "resin-coaster-set",
    description: "A set of four coasters hand-poured from high-density resin with embedded natural elements. Each coaster is unique, capturing botanicals, mineral pigments, and metallic accents in crystal-clear resin. The non-slip cork base protects your surfaces, and each set comes in a magnetic closure gift box.",
    shortDescription: "Set of 4, hand-poured, botanical inclusions",
    price: 55.00,
    comparePrice: 65.00,
    costPrice: 28.00,
    sku: "M4VX-CS-001",
    stock: 40,
    isFeatured: false,
    isNew: false,
    weight: 0.4,
    dimensions: "10 x 10 x 1 cm each",
    material: "High-density resin, cork base",
    countryOfOrigin: "USA",
    warrantyInfo: null,
    images: [
      { url: "https://images.unsplash.com/photo-1567225591456-82a51e998cbc?w=800&q=80", alt: "Coasters on table", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80", alt: "Coaster detail", isPrimary: false, sortOrder: 1 },
    ],
    reviews: [
      { rating: 5, title: "Art for your table", body: "Every coaster is genuinely unique. The botanical inclusions are beautiful and the resin is crystal clear. Makes a great gift.", isApproved: true },
    ],
    categoryNames: ["Home", "Lifestyle"],
  },
  {
    name: "Stride Running Shoes",
    slug: "stride-running-shoes",
    description: "Engineering meets athletic performance. The Stride features a woven Flyknit upper that adapts to your foot shape, a carbon fiber plate for explosive toe-off, and responsive Pebax foam that returns 85% of your energy. The outsole uses recycled rubber in a tread pattern optimized for both road and trail.",
    shortDescription: "Carbon fiber plate, Flyknit upper, Pebax foam",
    price: 220.00,
    comparePrice: 260.00,
    costPrice: 110.00,
    sku: "M4VX-RS-001",
    stock: 200,
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    weight: 0.26,
    dimensions: "Various sizes (US 7-13)",
    material: "Flyknit upper, Pebax foam, carbon fiber plate",
    countryOfOrigin: "Vietnam",
    warrantyInfo: "90-day satisfaction guarantee",
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", alt: "Running shoes front view", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", alt: "Shoes side profile", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", alt: "Shoes on foot", isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { name: "Black/White", stock: 80 },
      { name: "All Black", stock: 70 },
      { name: "White/Cream", stock: 50 },
    ],
    reviews: [
      { rating: 5, title: "Fastest shoes I've owned", body: "The carbon fiber plate makes a noticeable difference in my pace. Broke my 5K PR on the first run.", isApproved: true },
      { rating: 5, title: "Incredibly comfortable", body: "Like running on clouds but with explosive energy return. The knit upper fits like a sock.", isApproved: true },
      { rating: 4, title: "Great shoes", body: "Really comfortable and fast. Took a few runs to break in. Sizing runs slightly small, go half size up.", isApproved: true },
    ],
    categoryNames: ["Fitness", "Lifestyle"],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.productCategory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVideo.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.productView.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@m4vx.com",
      name: "M4vx Admin",
      role: "ADMIN",
      emailVerified: true,
    },
  });
  console.log(`  ✓ Admin user: ${adminUser.email}`);

  const testUsers = await Promise.all([
    prisma.user.create({ data: { email: "alex@example.com", name: "Alex Morgan", role: "CUSTOMER", emailVerified: true } }),
    prisma.user.create({ data: { email: "sam@example.com", name: "Sam Chen", role: "CUSTOMER", emailVerified: true } }),
    prisma.user.create({ data: { email: "jordan@example.com", name: "Jordan Lee", role: "CUSTOMER", emailVerified: true } }),
    prisma.user.create({ data: { email: "taylor@example.com", name: "Taylor Smith", role: "CUSTOMER", emailVerified: true } }),
    prisma.user.create({ data: { email: "riley@example.com", name: "Riley Johnson", role: "CUSTOMER", emailVerified: true } }),
  ]);

  // Create categories
  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.name] = created.id;
  }
  console.log(`  ✓ ${categories.length} categories created`);

  // Create collection
  const newArrivals = await prisma.collection.create({
    data: {
      name: "New Arrivals",
      slug: "new-arrivals",
      description: "The latest additions to the M4vx collection",
    },
  });

  const essentials = await prisma.collection.create({
    data: {
      name: "Essentials",
      slug: "essentials",
      description: "Everyday essentials reimagined",
    },
  });

  // Create coupons
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 50,
      maxUses: 100,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "FREESHIP",
      description: "Free shipping on orders over $100",
      discountType: "FIXED",
      discountValue: 15,
      minOrderAmount: 100,
      maxUses: 50,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "SUMMER25",
      description: "25% off summer essentials",
      discountType: "PERCENTAGE",
      discountValue: 25,
      minOrderAmount: 75,
      maxUses: 200,
      isActive: true,
      expiresAt: new Date("2026-09-01"),
    },
  });

  console.log("  ✓ 3 coupons created");

  // Create products
  for (const productData of products) {
    const { images, variants = [], reviews = [], categoryNames, ...data } = productData;

    const product = await prisma.product.create({
      data: {
        ...data,
        price: data.price,
        comparePrice: data.comparePrice,
        costPrice: data.costPrice,
        weight: data.weight,
        collectionId: data.isNew ? newArrivals.id : essentials.id,
      },
    });

    // Create images
    for (const img of images) {
      await prisma.productImage.create({
        data: { ...img, productId: product.id },
      });
    }

    // Create variants
    for (const variant of variants) {
      await prisma.productVariant.create({
        data: { ...variant, productId: product.id },
      });
    }

    // Link categories
    for (const catName of categoryNames) {
      const catId = createdCategories[catName];
      if (catId) {
        await prisma.productCategory.create({
          data: { productId: product.id, categoryId: catId },
        });
      }
    }

    // Create reviews (cycle through users to avoid unique constraint)
    for (let ri = 0; ri < reviews.length; ri++) {
      const review = reviews[ri];
      const userId = testUsers[ri % testUsers.length].id;
      await prisma.review.create({
        data: {
          ...review,
          productId: product.id,
          userId,
        },
      });
    }
  }
  console.log(`  ✓ ${products.length} products created with images, variants, and reviews`);

  // Create sample orders (after all products exist)
  const leatherTote = await prisma.product.findUnique({ where: { slug: "horizon-leather-tote" } });
  const cipherNotebook = await prisma.product.findUnique({ where: { slug: "cipher-notebook" } });
  const prismBottle = await prisma.product.findUnique({ where: { slug: "prism-water-bottle" } });
  const strideShoes = await prisma.product.findUnique({ where: { slug: "stride-running-shoes" } });
  const apexTracker = await prisma.product.findUnique({ where: { slug: "apex-fitness-tracker" } });

  if (leatherTote && cipherNotebook && prismBottle) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: "M4VX-00001",
        user: { connect: { id: testUsers[0].id } },
        email: testUsers[0].email,
        status: "DELIVERED",
        paymentStatus: "PAID",
        subtotal: 745,
        shippingCost: 15,
        taxAmount: 60.80,
        total: 820.80,
        shippingMethod: "Standard",
        trackingNumber: "1Z999AA10123456784",
        shippingAddress: {
          create: {
            userId: testUsers[0].id,
            label: "Home",
            line1: "742 Evergreen Terrace",
            city: "Portland",
            state: "OR",
            postalCode: "97201",
            country: "US",
            phone: "+1 (555) 123-4567",
            isDefault: true,
          },
        },
      },
    });

    await prisma.orderItem.create({ data: { orderId: order1.id, productId: leatherTote.id, name: "Horizon Leather Tote", price: 595, quantity: 1, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80" } });
    await prisma.orderItem.create({ data: { orderId: order1.id, productId: cipherNotebook.id, name: "Cipher Notebook", price: 65, quantity: 2, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&q=80" } });
    await prisma.orderItem.create({ data: { orderId: order1.id, productId: prismBottle.id, name: "Prism Water Bottle", price: 85, quantity: 1, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80" } });
  }

  if (strideShoes && apexTracker) {
    const order2 = await prisma.order.create({
      data: {
        orderNumber: "M4VX-00002",
        user: { connect: { id: testUsers[1].id } },
        email: testUsers[1].email,
        status: "PROCESSING",
        paymentStatus: "PAID",
        subtotal: 719,
        shippingCost: 0,
        taxAmount: 57.52,
        total: 776.52,
        shippingMethod: "Express",
        shippingAddress: {
          create: {
            userId: testUsers[1].id,
            label: "Home",
            line1: "456 Oak Avenue",
            city: "Brooklyn",
            state: "NY",
            postalCode: "11201",
            country: "US",
            isDefault: true,
          },
        },
      },
    });

    await prisma.orderItem.create({ data: { orderId: order2.id, productId: strideShoes.id, name: "Stride Running Shoes", price: 220, quantity: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" } });
    await prisma.orderItem.create({ data: { orderId: order2.id, productId: apexTracker.id, name: "Apex Fitness Tracker", price: 499, quantity: 1, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&q=80" } });
  }

  console.log("  ✓ Sample orders created");

  // Create newsletter subscribers
  await prisma.newsletterSubscriber.create({
    data: { email: "subscriber@example.com" },
  });
  await prisma.newsletterSubscriber.create({
    data: { email: "test@m4vx.com" },
  });

  // Create sample page views for analytics
  const pagePaths = ["/", "/shop", "/shop/stride-running-shoes", "/shop/horizon-leather-tote", "/cart", "/checkout"];
  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 168));
    await prisma.pageView.create({
      data: {
        path: pagePaths[Math.floor(Math.random() * pagePaths.length)],
        timestamp: date,
      },
    });
  }

  console.log("  ✓ Analytics data created (50 page views)");
  console.log("");
  console.log("✅ Database seeded successfully!");
  console.log("");
  console.log("  Admin: admin@m4vx.com");
  console.log("  Users: alex@example.com, sam@example.com");
  console.log(`  Products: ${products.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log("  3 Coupons: WELCOME10, FREESHIP, SUMMER25");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
