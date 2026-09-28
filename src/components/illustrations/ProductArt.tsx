import type { Product } from "@/data/products";
import { FlowArt } from "./FlowArt";
import { PitcherArt } from "./PitcherArt";

export function ProductArt({ product, uid, className }: { product: Product; uid: string; className?: string }) {
  return product.category === "pitcher" ? (
    <PitcherArt accent={product.accent} uid={uid} className={className} />
  ) : (
    <FlowArt accent={product.accent} stages={product.stages} uid={uid} className={className} />
  );
}
