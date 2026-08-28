"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { AnimatedFormWrapper } from "@/components/ui/AnimatedFormWrapper";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email address"),
  contactNumber: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid contact number"),
  message: z.string().trim().min(10, "Your message should be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", contactNumber: "", message: "" },
  });

  const watchedName = useWatch({ control, name: "name" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedContactNumber = useWatch({ control, name: "contactNumber" });
  const watchedMessage = useWatch({ control, name: "message" });
  const filledFields = [
    watchedName,
    watchedEmail,
    watchedContactNumber,
    watchedMessage,
  ].filter((value) => value && value.trim().length > 0).length;
  const formProgress = (filledFields / 4) * 100;

  const onSubmit = (values: ContactFormValues) => {
    toast.success(
      `Thanks, ${values.name.split(" ")[0] || "rider"}! Your message has been received.`
    );
    reset();
  };

  const fieldClass = (hasError: boolean) =>
    `w-full border bg-white px-4 py-3 text-sm text-foreground placeholder:text-smoke focus:outline-none ${
      hasError
        ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
        : "border-line focus:border-brand focus:ring-1 focus:ring-brand"
    }`;

  const labelClass =
    "mb-2 block text-xs font-semibold tracking-widest text-foreground uppercase";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <AnimatedFormWrapper progress={formProgress}>
        <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
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
            <p role="alert" className="mt-1.5 text-sm text-rose-500">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
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
            <p role="alert" className="mt-1.5 text-sm text-rose-500">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="contactNumber" className={labelClass}>
          Contact Number
        </label>
        <input
          id="contactNumber"
          type="tel"
          autoComplete="tel"
          placeholder="+91 00000 00000"
          aria-invalid={errors.contactNumber ? "true" : "false"}
          className={fieldClass(Boolean(errors.contactNumber))}
          {...register("contactNumber")}
        />
        {errors.contactNumber ? (
          <p role="alert" className="mt-1.5 text-sm text-rose-500">
            {errors.contactNumber.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
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
          <p role="alert" className="mt-1.5 text-sm text-rose-500">
            {errors.message.message}
          </p>
        ) : null}
      </div>
      </AnimatedFormWrapper>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 items-center justify-center gap-2 bg-brand px-7 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
        <Send aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  );
}
