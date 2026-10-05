import Catalog, { catalogMetadata, type CatalogSearch } from "@/app/components/Catalog";
type Props = { searchParams: Promise<CatalogSearch> };
export async function generateMetadata({ searchParams }: Props) {
  return catalogMetadata("learn_items", await searchParams);
}
export default async function Page({ searchParams }: Props) {
  return <Catalog kind="learn_items" query={await searchParams} />;
}
