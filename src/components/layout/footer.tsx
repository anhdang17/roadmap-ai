import Link from "next/link";
import { Zap, Github, Twitter } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 border border-accent/20">
              <Zap className="h-4 w-4 text-accent" />
            </div>
            <span className="font-bold text-base text-text-primary">
              GoalPlan<span className="text-accent"> AI</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} GoalPlan AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
