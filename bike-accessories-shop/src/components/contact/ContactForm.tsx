"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email address"),
  subject: z.string().trim().min(4, "Please add a short subject"),
  message: z.string().trim().min(10, "Your message should be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (values: ContactFormValues) => {
    toast.success(
      `Thanks, ${values.name.split(" ")[0] || "rider"}! Your message has been received.`
    );
    reset();
  };

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-carbon px-4 py-3 text-sm text-white placeholder:text-smoke focus:outline-none ${
      hasError ? "border-rose-500/70 focus:border-rose-500" : "border-line focus:border-brand"
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={errors.name ? "true" : "false"}
            className={fieldClass(Boolean(errors.name))}
            {...register("name")}
          />
          {errors.name ? (
            <p role="alert" className="mt-1.5 text-sm text-rose-400">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : "false"}
            className={fieldClass(Boolean(errors.email))}
            {...register("email")}
          />
          {errors.email ? (
            <p role="alert" className="mt-1.5 text-sm text-rose-400">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          placeholder="Order help, sizing advice, partnerships…"
          aria-invalid={errors.subject ? "true" : "false"}
          className={fieldClass(Boolean(errors.subject))}
          {...register("subject")}
        />
        {errors.subject ? (
          <p role="alert" className="mt-1.5 text-sm text-rose-400">
            {errors.subject.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-white">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell us what you need help with…"
          aria-invalid={errors.message ? "true" : "false"}
          className={`${fieldClass(Boolean(errors.message))} resize-y`}
          {...register("message")}
        />
        {errors.message ? (
          <p role="alert" className="mt-1.5 text-sm text-rose-400">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
        <Send aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  );
}
