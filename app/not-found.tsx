import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
export default function NotFound() {
  return <><Header /><main className="siteStatus"><p>LET’S FIND ANOTHER ADVENTURE</p><h1>Page not found</h1><p>This page may have moved or is no longer available.</p><Link href="/library">Explore the books →</Link></main><Footer /></>;
}
