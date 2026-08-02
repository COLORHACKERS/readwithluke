import ReaderGate from "@/app/components/ReaderGate";

export default function LearnReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReaderGate>{children}</ReaderGate>;
}
