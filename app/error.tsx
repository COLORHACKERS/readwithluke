"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="siteStatus" role="alert"><h1>Let’s try that again</h1><p>We couldn’t load this page right now. Please try again in a moment.</p><button onClick={reset}>Try again</button><Link href="/">Back to home</Link></main>;
}
