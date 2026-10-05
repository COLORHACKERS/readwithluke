import Catalog, { catalogMetadata, type CatalogSearch } from "@/app/components/Catalog";
type Props = { searchParams: Promise<CatalogSearch> };
export async function generateMetadata({ searchParams }: Props) {
  return catalogMetadata("books", await searchParams);
}
export default async function Page({ searchParams }: Props) {
  return <Catalog kind="books" query={await searchParams} />;
}
