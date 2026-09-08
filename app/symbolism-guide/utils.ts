import { symbols } from "./data";
import { slugify } from "@/lib/utils";

export { slugify };

export function getSymbolBySlug(slug: string) {
  return symbols.find((s) => slugify(s.name) === slug);
}

export function getAllSymbolSlugs() {
  return symbols.map((s) => ({
    slug: slugify(s.name),
    ...s
  }));
}
