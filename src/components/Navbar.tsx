"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navbar = () => {
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Finance Visualizer
              </Link>
            </div>
            <div className="ml-10 flex items-center space-x-4">
              <NavLink href="/" exact>
                Dashboard
              </NavLink>
              <NavLink href="/transactions">
                Transactions
              </NavLink>
              <NavLink href="/budgets">
                Budgets
              </NavLink>
              <NavLink href="/income">
                Income
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}

const NavLink = ({ href, exact = false, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar; 