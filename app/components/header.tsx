import Link from "next/link";
export default function Header() {
  return (
    <header className="w-full bg-[#F8F1E6] px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="block">
          <img
            src="/read-with-luke-logo.png"
            alt="Read With Luke"
            className="h-20 w-auto"
          />
        </Link>

        <Link
          href="/profile"
          className="rounded-full bg-[#13294B] px-5 py-3 text-sm font-black text-white"
        >
          Profile
        </Link>
      </div>
    </header>
  );
}