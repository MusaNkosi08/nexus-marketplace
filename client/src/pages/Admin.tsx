import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Boxes, LogIn, Package, ShieldCheck, Users } from "lucide-react";
import { Link } from "wouter";
import { formatZAR } from "@shared/nexusData";

export default function Admin() {
  const { user, loading } = useAuth();
  const products = trpc.admin.products.useQuery(undefined, { enabled: user?.role === "admin" });
  const users = trpc.admin.users.useQuery(undefined, { enabled: user?.role === "admin" });
  const orders = trpc.orders.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  if (loading) return <div className="admin-gate">Loading NEXUS workspace…</div>;
  if (!user) return <div className="admin-gate"><LogIn size={30} /><h1>Sign in to continue</h1><p>Administrator access is protected by the NEXUS identity layer.</p><a className="primary-button" href="/api/oauth/login">SIGN IN <ShieldCheck size={17} /></a></div>;
  if (user.role !== "admin") return <div className="admin-gate"><ShieldCheck size={30} /><h1>Access restricted.</h1><p>This workspace is reserved for NEXUS administrators.</p><Link href="/"><span className="text-button">RETURN TO STOREFRONT <ArrowLeft size={16} /></span></Link></div>;
  return <div className="admin-page"><header className="admin-header"><div><p className="kicker">NEXUS / OPERATIONS</p><h1>Admin workspace.</h1></div><Link href="/"><span className="text-button"><ArrowLeft size={15} /> STOREFRONT</span></Link></header><div className="admin-stats"><div><Boxes size={17} /><span>CATALOGUE</span><strong>{products.data?.length ?? 0}</strong></div><div><Users size={17} /><span>USERS</span><strong>{users.data?.length ?? 0}</strong></div><div><Package size={17} /><span>ORDERS</span><strong>{orders.data?.length ?? 0}</strong></div></div><section className="admin-table"><div className="admin-table-head"><div><p className="kicker">INVENTORY / LIVE</p><h2>Product control</h2></div><span className="availability"><i /> CONNECTED TO DATABASE</span></div><div className="admin-rows">{products.data?.map((product) => <div className="admin-row" key={product.id}><div><span>{product.brand}</span><strong>{product.name}</strong></div><span>{formatZAR(Number(product.priceZar))}</span><span>{product.stock} IN STOCK</span><button className="text-button">EDIT <ArrowLeft size={14} /></button></div>)}</div></section></div>;
}
