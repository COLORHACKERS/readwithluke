import AdventurePreview from "@/app/components/AdventurePreview";
import { previewMetadata } from "@/lib/preview-metadata";
type Props = { params: Promise<{ learnSlug: string }> };
export async function generateMetadata({ params }: Props) { return previewMetadata("learn_items", (await params).learnSlug); }
export default async function Page({ params }: Props) { return <AdventurePreview kind="learn_items" slug={(await params).learnSlug} />; }
