import { useMemo } from "react";
import { ArrowLeft, ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { products, formatZAR } from "@shared/nexusData";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = Number(params?.id);
  const query = trpc.catalogue.product.useQuery({ id }, { enabled: Number.isFinite(id) });
  const product = query.data;
  const related = useMemo(() => products.filter((item) => item.id !== id).slice(0, 3), [id]);
  if (query.isLoading) return <div className="product-detail-state">Loading the object…</div>;
  if (!product) return <div className="product-detail-state"><h1>Object not found.</h1><Link href="/"><span className="text-button"><ArrowLeft size={16} /> BACK TO CATALOGUE</span></Link></div>;
  return <div className="product-detail-page"><header className="site-header"><Link href="/"><span className="wordmark">NEXUS<span>®</span></span></Link><Link href="/"><span className="text-button"><ArrowLeft size={16} /> BACK TO CATALOGUE</span></Link></header><main><div className="detail-breadcrumb"><span>CATALOGUE</span><ArrowUpRight size={14} /><span>{product.brand.toUpperCase()}</span></div><section className="detail-hero"><div className="detail-image"><img src={product.imageUrl} alt={`${product.brand} ${product.name}`} /></div><div className="detail-copy"><p className="kicker">{product.brand.toUpperCase()} / NEXUS EDIT</p><h1>{product.name}</h1><p>{product.description}</p><div className="detail-price">{formatZAR(Number(product.priceZar))}</div><div className="detail-availability"><Check size={15} /> {product.stock > 0 ? `${product.stock} IN STOCK` : "SOLD OUT"}</div><button className="primary-button" disabled={!product.stock} onClick={() => { const bag = JSON.parse(localStorage.getItem("nexus-bag") || "[]"); localStorage.setItem("nexus-bag", JSON.stringify([...bag, { ...products.find((item) => item.id === id), id: product.id, brand: product.brand, name: product.name, price: Number(product.priceZar), image: product.imageUrl, description: product.description, stock: product.stock }])); }}>ADD TO BAG <ShoppingBag size={17} /></button></div></section><section className="related-section"><p className="kicker">YOU MAY ALSO CONSIDER</p><div className="related-grid">{related.map((item) => <Link href={`/product/${item.id}`} key={item.id}><article className="related-card"><img src={item.image} alt={item.name} /><div><span>{item.brand}</span><h3>{item.name}</h3><strong>{formatZAR(item.price)}</strong></div></article></Link>)}</div></section></main></div>;
}
