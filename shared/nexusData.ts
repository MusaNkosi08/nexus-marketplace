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
  { id: 8, brand: "Apple", name: "iPad Air 11-inch", price: 11999, category: "MOBILE", collection: "TRAVEL", image: "/manus-storage/ipad-air_c779f4bc.jpg", description: "A powerful, portable canvas for notes, reading, sketches and creative work.", stock: 9 },
  { id: 9, brand: "Anker", name: "737 Power Bank", price: 2499, category: "ACCESSORIES", collection: "TRAVEL", image: "/manus-storage/anker-737_dd4692b2.jpg", description: "High-capacity portable power with a smart display for demanding days away from a desk.", stock: 16 },
  { id: 10, brand: "JBL", name: "Live 660NC", price: 2499, category: "AUDIO", collection: "STUDY", image: "/manus-storage/jbl-live-660nc_4e993cab.jpeg", description: "Adaptive noise cancelling headphones with a spacious sound for focused study.", stock: 11 },
];

export const formatZAR = (price: number) => `R${price.toLocaleString("en-ZA")}`;
