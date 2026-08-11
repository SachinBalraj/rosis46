"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("That email doesn't look right. Please check it.");
      return;
    }
    toast.success("You're on the list — gear deals coming your way!");
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="h-12 flex-1 border border-line-dark bg-night px-4 text-sm text-white placeholder:text-smoke focus:border-brand focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 border border-brand bg-brand px-6 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep"
      >
        Subscribe
        <Send aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  );
}
