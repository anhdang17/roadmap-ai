"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "-3s" }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 border border-accent/20">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <span className="font-bold text-lg text-text-primary">
            GoalPlan<span className="text-accent"> AI</span>
          </span>
        </Link>

        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
          appearance={{
            baseTheme: dark,
            variables: {
              colorBackground: "#18181b",
              colorInputBackground: "#27272a",
              colorText: "#fafafa",
              colorTextSecondary: "#a1a1aa",
              colorTextOnPrimaryBackground: "#ffffff",
              colorPrimary: "#8b5cf6",
              borderRadius: "8px",
              fontFamily: "Inter, system-ui, sans-serif",
            },
            elements: {
              card: "bg-surface border border-border shadow-2xl",
              headerTitle: "text-text-primary font-bold",
              headerSubtitle: "text-text-secondary",
              formButtonPrimary: "bg-accent hover:bg-accent-hover text-white font-medium",
              formFieldInput: "bg-elevated border-border",
              footerActionLink: "text-accent hover:text-accent-light",
            },
          }}
        />
      </div>
    </main>
  );
}
