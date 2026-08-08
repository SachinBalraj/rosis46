import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { CheckCircle2, Package, Truck, UserRound, Zap } from "lucide-react";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountForms } from "@/components/account/AccountForms";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Sign in or create your RideReady account to track orders, manage addresses and get faster checkout.",
};

const accountBenefits = [
  {
    icon: Package,
    title: "Track every order",
    description: "Live tracking for every dispatch, from our warehouse to your door.",
  },
  {
    icon: Zap,
    title: "Faster checkout",
    description: "Saved addresses and payment details make reordering one tap.",
  },
  {
    icon: Truck,
    title: "Order history",
    description: "Revisit past orders and reorder your favourite gear in seconds.",
  },
  {
    icon: UserRound,
    title: "Fit profile",
    description: "Save your helmet size and bike details for spot-on recommendations.",
  },
];

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const orders = user
    ? await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          totalInPaise: true,
          status: true,
          paymentStatus: true,
          items: { select: { quantity: true } },
        },
      })
    : [];

  return (
    <>
      <section
        aria-labelledby="account-hero"
        className="relative overflow-hidden border-b border-line"
      >
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand/15 blur-[120px]"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-brand uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
            Your account
          </p>
          <h1
            id="account-hero"
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Your rides, <span className="text-brand">your gear.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-smoke">
            {user
              ? "Track your orders, review payments and keep your gear moving."
              : "Track orders, save your fit profile and check out in one tap. Create an account or sign in to get started."}
          </p>
        </div>
      </section>

      {user ? (
        <AccountDashboard
          user={{
            id: user.id,
            name: user.name ?? "",
            email: user.email ?? "",
            role: user.role,
          }}
          orders={orders.map((order) => ({
            id: order.id,
            createdAt: order.createdAt.toISOString(),
            totalInPaise: order.totalInPaise,
            status: order.status,
            paymentStatus: order.paymentStatus,
            itemCount: order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            ),
          }))}
        />
      ) : (
        <section
          aria-labelledby="account-section"
          className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Membership"
                title="What an account gets you"
                description=""
              />
              <ul className="mt-8 flex flex-col gap-4">
                {accountBenefits.map((benefit) => (
                  <li
                    key={benefit.title}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-carbon p-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <benefit.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-smoke">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-start gap-2 text-sm text-smoke">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                />
                No spam, ever. Your data stays yours — we never sell it.
              </p>
            </div>

            <div className="lg:pt-10">
              <AccountForms />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
