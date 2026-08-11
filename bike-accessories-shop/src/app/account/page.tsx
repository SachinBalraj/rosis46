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
    "Sign in or create your 46 Rossis Biker Spot account to track orders and check out faster.",
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
        className="border-b border-line bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="eyebrow">Your account</p>
          <h1
            id="account-hero"
            className="display-heading mt-6 max-w-3xl text-5xl text-foreground sm:text-6xl"
          >
            Your rides, your gear
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-smoke">
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
              <ul className="mt-8 flex flex-col gap-px border border-line bg-line">
                {accountBenefits.map((benefit) => (
                  <li key={benefit.title} className="bg-white">
                    <div className="flex items-start gap-4 p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-brand">
                        <benefit.icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-sm font-semibold tracking-wide uppercase">
                          {benefit.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-smoke">
                          {benefit.description}
                        </p>
                      </div>
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
