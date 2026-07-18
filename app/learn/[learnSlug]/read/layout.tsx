import ReaderGate from "@/app/books/[bookSlug]/read/ReaderGate";

type LearnReadLayoutProps = {
  children: React.ReactNode;
};

export default function LearnReadLayout({
  children,
}: LearnReadLayoutProps) {
  return <ReaderGate>{children}</ReaderGate>;
}
