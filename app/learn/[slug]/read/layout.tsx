import LearnGate from "./LearnGate";

export default function LearnReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LearnGate>{children}</LearnGate>;
}
