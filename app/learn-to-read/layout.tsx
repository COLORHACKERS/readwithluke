import type { Metadata } from "next";
export const metadata: Metadata = { title: "Learn to Read — Coming Soon", robots: { index: false, follow: true } };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
