import LearnGate from "./LearnGate";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LearnGate>{children}</LearnGate>;
}
