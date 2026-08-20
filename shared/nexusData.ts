export const collections = [
  { name: "STUDY", eyebrow: "01", description: "Tools for learning, research and academic productivity.", tone: "palladian", image: "/manus-storage/macbook-air_169c651b.jpg" },
  { name: "CREATE", eyebrow: "02", description: "Precision technology for designers, photographers and digital creators.", tone: "oatmeal", image: "/manus-storage/canon-eos-4000d_dc1de794.jpg" },
  { name: "BUILD", eyebrow: "03", description: "Serious hardware for developers, workstations and ambitious projects.", tone: "blue", image: "/manus-storage/asus-proart-pa247cv_31b2932d.png" },
  { name: "FOCUS", eyebrow: "04", description: "Quiet, considered technology for deep work and concentration.", tone: "flame", image: "/manus-storage/sony-wh1000xm5_4e7bf772.jpg" },
  { name: "TRAVEL", eyebrow: "05", description: "Portable essentials for working, studying and creating anywhere.", tone: "truffle", image: "/manus-storage/samsung-t7_11de5251.jpg" },
] as const;

export const categories = ["AUDIO", "KEYBOARDS", "DISPLAYS", "STORAGE", "ACCESSORIES", "MOBILE", "WORKSTATIONS", "CAMERAS"] as const;

export type Product = {
  id: number; brand: string; name: string; price: number; category: typeof categories[number]; collection: typeof collections[number]["name"]; image: string; description: string; stock: number; badge?: string;
};

export const products: Product[] = [
  { id: 1, brand: "Apple", name: "MacBook Air 13-inch M3", price: 24999, category: "WORKSTATIONS", collection: "STUDY", image: "/manus-storage/macbook-air_169c651b.jpg", description: "The remarkably thin laptop with the power of Apple silicon for study, work and everything between.", stock: 12, badge: "EDITOR'S PICK" },
  { id: 2, brand: "Sony", name: "WH-1000XM5", price: 7499, category: "AUDIO", collection: "FOCUS", image: "/manus-storage/sony-wh1000xm5_4e7bf772.jpg", description: "Industry-leading noise cancellation and exceptional sound, tuned for long listening sessions.", stock: 8, badge: "BESTSELLER" },
  { id: 3, brand: "Logitech", name: "MX Master 3S", price: 1899, category: "ACCESSORIES", collection: "BUILD", image: "/manus-storage/logitech-mx-master-3s_8abee217.png", description: "A precision wireless mouse with quiet clicks and an 8,000 DPI track-on-glass sensor.", stock: 24 },
  { id: 4, brand: "Samsung", name: "T7 Portable SSD 1TB", price: 2199, category: "STORAGE", collection: "TRAVEL", image: "/manus-storage/samsung-t7_11de5251.jpg", description: "Compact, durable and fast external storage for projects on the move.", stock: 18 },
  { id: 5, brand: "ASUS", name: "ProArt Display PA247CV", price: 6999, category: "DISPLAYS", collection: "CREATE", image: "/manus-storage/asus-proart-pa247cv_31b2932d.png", description: "A colour-accurate 24-inch professional display made for creative workflows.", stock: 6 },
  { id: 6, brand: "Keychron", name: "K2 Wireless Mechanical Keyboard", price: 1999, category: "KEYBOARDS", collection: "BUILD", image: "/manus-storage/keychron-k2_11de0ef6.jpg", description: "A compact mechanical keyboard with hot-swappable options and multi-device pairing.", stock: 14 },
  { id: 7, brand: "Canon", name: "EOS 4000D DSLR Camera", price: 5999, category: "CAMERAS", collection: "CREATE", image: "/manus-storage/canon-eos-4000d_dc1de794.jpg", description: "A capable DSLR entry point for learning photography and telling better stories.", stock: 5 },
  { id: 30007, brand: "ASUS", name: "ROG Ally", price: 12999, category: "WORKSTATIONS", collection: "BUILD", image: "/manus-storage/ipad-air_c779f4bc.jpg", description: "A powerful, portable canvas for notes, reading, sketches and creative work.", stock: 9 },
  { id: 9, brand: "Anker", name: "737 Power Bank", price: 2499, category: "ACCESSORIES", collection: "TRAVEL", image: "/manus-storage/anker-737_dd4692b2.jpg", description: "High-capacity portable power with a smart display for demanding days away from a desk.", stock: 16 },
  { id: 10, brand: "JBL", name: "Live 660NC", price: 2499, category: "AUDIO", collection: "STUDY", image: "/manus-storage/jbl-live-660nc_4e993cab.jpeg", description: "Adaptive noise cancelling headphones with a spacious sound for focused study.", stock: 11 },
  { id: 30011, brand: "Apple", name: "Magic Mouse 2", price: 1899, category: "ACCESSORIES", collection: "STUDY", image: "/manus-storage/apple-magic-keyboard_fa364119.jpg", description: "A rechargeable multi-touch mouse with a low profile and precise gesture control for focused desk work.", stock: 12 },
  { id: 30012, brand: "Amazon", name: "Kindle Paperwhite 16GB", price: 2999, category: "MOBILE", collection: "STUDY", image: "/manus-storage/ipad-air_c779f4bc.jpg", description: "A glare-free 6.8-inch e-reader with adjustable warm light and weeks of battery life.", stock: 14 },
  { id: 30013, brand: "SanDisk", name: "Extreme Portable SSD 2TB", price: 3199, category: "STORAGE", collection: "STUDY", image: "/manus-storage/samsung-t7_11de5251.jpg", description: "A compact USB-C solid-state drive for carrying study archives, creative files, and backups.", stock: 11 },
  { id: 30014, brand: "GoPro", name: "HERO12 Black", price: 8499, category: "CAMERAS", collection: "CREATE", image: "/manus-storage/canon-eos-r50_5c9740bb.jpg", description: "A rugged 5.3K action camera with HyperSmooth stabilisation for documenting work beyond the desk.", stock: 8 },
  { id: 30015, brand: "Western Digital", name: "My Passport SSD 2TB", price: 3499, category: "STORAGE", collection: "CREATE", image: "/manus-storage/samsung-t7_11de5251.jpg", description: "A slim USB-C portable SSD for high-speed creative project storage and travel-ready backups.", stock: 10 },
  { id: 30016, brand: "BenQ", name: "GW2480 24-inch Monitor", price: 3299, category: "DISPLAYS", collection: "FOCUS", image: "/manus-storage/asus-proart-pa247cv_31b2932d.png", description: "A 24-inch IPS monitor with eye-care features for a calm, productive daily workspace.", stock: 9 },
  { id: 30017, brand: "Dell", name: "UltraSharp U2720Q 27-inch Monitor", price: 8999, category: "DISPLAYS", collection: "FOCUS", image: "/manus-storage/asus-proart-pa247cv_31b2932d.png", description: "A 4K USB-C display with accurate colour and a height-adjustable stand for focused production.", stock: 7 },
  { id: 30018, brand: "LG", name: "27UP850-W 27-inch Monitor", price: 7499, category: "DISPLAYS", collection: "FOCUS", image: "/manus-storage/asus-proart-pa247cv_31b2932d.png", description: "A 4K UHD USB-C monitor with wide colour coverage for long-form work and creative review.", stock: 6 },
  { id: 30019, brand: "Anker", name: "735 Charger 65W", price: 1299, category: "ACCESSORIES", collection: "FOCUS", image: "/manus-storage/anker-737_dd4692b2.jpg", description: "A compact GaN charger with three ports for keeping a focused mobile setup powered.", stock: 18 },
  { id: 30020, brand: "Crucial", name: "X9 Pro Portable SSD 1TB", price: 2299, category: "STORAGE", collection: "FOCUS", image: "/manus-storage/samsung-t7_11de5251.jpg", description: "A durable USB-C portable SSD for secure everyday project storage with fast transfer speeds.", stock: 13 },
];

export const formatZAR = (price: number) => `R${price.toLocaleString("en-ZA")}`;
