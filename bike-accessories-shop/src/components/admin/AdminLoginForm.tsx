"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Enter your admin username"),
  password: z.string().min(1, "Enter your password"),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const inputClass = (hasError: boolean) =>
  cn(
    "w-full border bg-white px-4 py-3 text-sm text-foreground placeholder:text-smoke focus:outline-none",
    hasError
      ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
      : "border-line focus:border-brand focus:ring-1 focus:ring-brand"
  );

const labelClass =
  "mb-2 block text-xs font-semibold tracking-widest text-foreground uppercase";

export function AdminLoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: AdminLoginValues) => {
    setAuthError(null);
    const result = await signIn("admin", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      const message = "Invalid username or password. Please try again.";
      setAuthError(message);
      toast.error(message);
      return;
    }

    toast.success("Welcome back to Rossis Biker Spot.");
    router.push("/admin");
    router.refresh();
  };

  return (
    <section
      aria-labelledby="admin-login-title"
      className="relative overflow-hidden border-b border-line-dark bg-night"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(225_6_0/0.25),transparent_55%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto w-full max-w-md">
          <div className="border border-line-dark bg-white p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center bg-brand text-white">
                <LockKeyhole aria-hidden="true" className="h-7 w-7" />
              </span>
              <p className="mt-6 inline-flex items-center gap-2 border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-brand uppercase">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
                Admin console
              </p>
              <h1
                id="admin-login-title"
                className="display-heading mt-5 text-3xl uppercase text-foreground sm:text-4xl"
              >
                Rossis Biker Spot admin
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-smoke">
                Sign in to manage products, categories and orders.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <Image
                src="/images/rossislogo.png"
                alt="Rossis Biker Spot logo"
                width={320}
                height={252}
                className="h-24 w-auto border border-line bg-white object-contain p-1"
              />
            </div>

            {authError ? (
              <p
                role="alert"
                className="mt-8 flex items-start gap-2.5 border border-rose-500/40 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
              >
                <TriangleAlert
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                {authError}
              </p>
            ) : null}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-8 space-y-5"
            >
              <div>
                <label htmlFor="admin-username" className={labelClass}>
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Admin username"
                  aria-invalid={errors.username ? "true" : "false"}
                  aria-describedby={
                    errors.username ? "admin-username-error" : undefined
                  }
                  className={inputClass(Boolean(errors.username))}
                  {...register("username")}
                />
                {errors.username ? (
                  <p
                    id="admin-username-error"
                    role="alert"
                    className="mt-1.5 text-sm text-rose-500"
                  >
                    {errors.username.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="admin-password" className={labelClass}>
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Admin password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "admin-password-error" : undefined
                  }
                  className={inputClass(Boolean(errors.password))}
                  {...register("password")}
                />
                {errors.password ? (
                  <p
                    id="admin-password-error"
                    role="alert"
                    className="mt-1.5 text-sm text-rose-500"
                  >
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 bg-brand text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs tracking-widest text-white/60 uppercase">
            Authorized personnel only · Rossis Biker Spot
          </p>
        </div>
      </div>
    </section>
  );
}
