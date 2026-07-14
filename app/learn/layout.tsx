import ReaderGate from "@/app/components/ReaderGate";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReaderGate>{children}</ReaderGate>;
}
