"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className={active ? "activeNav" : ""}>
      {children}
    </Link>
  );
}