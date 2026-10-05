import AdventurePreview from "@/app/components/AdventurePreview";
import { previewMetadata } from "@/lib/preview-metadata";
type Props = { params: Promise<{ bookSlug: string }> };
export async function generateMetadata({ params }: Props) { return previewMetadata("books", (await params).bookSlug); }
export default async function Page({ params }: Props) { return <AdventurePreview kind="books" slug={(await params).bookSlug} />; }
