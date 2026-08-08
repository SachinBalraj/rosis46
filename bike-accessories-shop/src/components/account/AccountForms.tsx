"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = signInSchema.extend({
  name: z.string().trim().min(2, "Enter your full name"),
});

type SignInValues = z.infer<typeof signInSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AccountForms() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("register");

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSignIn = async (values: SignInValues) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid email or password. Please try again.");
      return;
    }

    toast.success("Welcome back!");
    signInForm.reset();
    router.push("/account");
    router.refresh();
  };

  const onRegister = async (values: RegisterValues) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok) {
      toast.error(data.error ?? "Could not create your account.");
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      toast.success("Account created — please sign in.");
      registerForm.reset();
      router.push("/account");
      return;
    }

    toast.success(`Welcome to RideReady, ${values.name.split(" ")[0]}!`);
    registerForm.reset();
    router.push("/account");
    router.refresh();
  };

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border bg-carbon px-4 py-3 text-sm text-white placeholder:text-smoke focus:outline-none",
      hasError
        ? "border-rose-500/70 focus:border-rose-500"
        : "border-line focus:border-brand"
    );

  return (
    <div className="rounded-3xl border border-line bg-carbon p-6 sm:p-8">
      <div
        role="tablist"
        aria-label="Account access"
        className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-night p-1"
      >
        {(
          [
            { value: "register", label: "Create account" },
            { value: "signin", label: "Sign in" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={mode === tab.value}
            onClick={() => setMode(tab.value)}
            className={cn(
              "rounded-lg py-2.5 text-sm font-semibold transition-colors",
              mode === tab.value
                ? "bg-brand text-white"
                : "text-smoke hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "register" ? (
        <form
          onSubmit={registerForm.handleSubmit(onRegister)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label htmlFor="account-name" className="mb-2 block text-sm font-medium text-white">
              Full name
            </label>
            <input
              id="account-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={registerForm.formState.errors.name ? "true" : "false"}
              className={inputClass(Boolean(registerForm.formState.errors.name))}
              {...registerForm.register("name")}
            />
            {registerForm.formState.errors.name ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {registerForm.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-white">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={registerForm.formState.errors.email ? "true" : "false"}
              className={inputClass(Boolean(registerForm.formState.errors.email))}
              {...registerForm.register("email")}
            />
            {registerForm.formState.errors.email ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {registerForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-white">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={registerForm.formState.errors.password ? "true" : "false"}
              className={inputClass(Boolean(registerForm.formState.errors.password))}
              {...registerForm.register("password")}
            />
            {registerForm.formState.errors.password ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {registerForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={registerForm.formState.isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
          >
            {registerForm.formState.isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>
      ) : (
        <form
          onSubmit={signInForm.handleSubmit(onSignIn)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label htmlFor="signin-email" className="mb-2 block text-sm font-medium text-white">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={signInForm.formState.errors.email ? "true" : "false"}
              className={inputClass(Boolean(signInForm.formState.errors.email))}
              {...signInForm.register("email")}
            />
            {signInForm.formState.errors.email ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {signInForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="signin-password" className="mb-2 block text-sm font-medium text-white">
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={signInForm.formState.errors.password ? "true" : "false"}
              className={inputClass(Boolean(signInForm.formState.errors.password))}
              {...signInForm.register("password")}
            />
            {signInForm.formState.errors.password ? (
              <p role="alert" className="mt-1.5 text-sm text-rose-400">
                {signInForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={signInForm.formState.isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
          >
            {signInForm.formState.isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
