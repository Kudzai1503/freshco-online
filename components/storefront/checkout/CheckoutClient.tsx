"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useStorefrontSession } from "@/lib/storefront/browser-session";
import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { StockBadge } from "@/components/storefront/shared/StockBadge";

export function CheckoutClient() {
  const router = useRouter();
  const { loaded, preview, checkoutDraft, saveCheckoutDraft, placeOrder } = useStorefrontSession();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = useMemo(() => {
    if (step === 1) {
      return Boolean(
        checkoutDraft.email &&
          checkoutDraft.firstName &&
          checkoutDraft.lastName &&
          checkoutDraft.phone &&
          checkoutDraft.addressLine1 &&
          checkoutDraft.city,
      );
    }

    return preview.items.length > 0;
  }, [checkoutDraft, preview.items.length, step]);

  if (!loaded) {
    return <p className="text-[var(--freshco-text-soft)]">Loading checkout…</p>;
  }

  if (preview.items.length === 0) {
    return <p className="text-[var(--freshco-text-soft)]">Your cart is empty. Add products before checkout.</p>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-6">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((entry) => (
            <button
              key={entry}
              className={`inline-flex rounded-full px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] ${
                step === entry
                  ? "bg-[var(--freshco-brand)] text-white"
                  : "border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] text-[var(--freshco-text-soft)]"
              }`}
              onClick={() => setStep(entry)}
              type="button"
            >
              Step {entry}
            </button>
          ))}
        </div>

        <form
          className="mt-6 grid gap-4"
          onChange={(event) => {
            const form = event.currentTarget;
            void saveCheckoutDraft({
              email: (form.elements.namedItem("email") as HTMLInputElement)?.value ?? "",
              firstName: (form.elements.namedItem("firstName") as HTMLInputElement)?.value ?? "",
              lastName: (form.elements.namedItem("lastName") as HTMLInputElement)?.value ?? "",
              phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value ?? "",
              addressLine1: (form.elements.namedItem("addressLine1") as HTMLInputElement)?.value ?? "",
              addressLine2: (form.elements.namedItem("addressLine2") as HTMLInputElement)?.value ?? "",
              city: (form.elements.namedItem("city") as HTMLInputElement)?.value ?? "",
              deliveryNotes: (form.elements.namedItem("deliveryNotes") as HTMLTextAreaElement)?.value ?? "",
              paymentMethod: (form.elements.namedItem("paymentMethod") as HTMLSelectElement)?.value === "cash" ? "cash" : "card",
            });
          }}
        >
          {step === 1 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={checkoutDraft.firstName} name="firstName" placeholder="First name" />
                <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={checkoutDraft.lastName} name="lastName" placeholder="Last name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={checkoutDraft.email} name="email" placeholder="Email" type="email" />
                <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={checkoutDraft.phone} name="phone" placeholder="Phone" />
              </div>
              <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={checkoutDraft.addressLine1} name="addressLine1" placeholder="Address line 1" />
              <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={checkoutDraft.addressLine2} name="addressLine2" placeholder="Address line 2" />
              <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={checkoutDraft.city} name="city" placeholder="City" />
              <textarea className="min-h-[120px] rounded-[18px] border border-[var(--freshco-border)] px-4 py-3" defaultValue={checkoutDraft.deliveryNotes} name="deliveryNotes" placeholder="Delivery notes" />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <select className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={checkoutDraft.paymentMethod} name="paymentMethod">
                <option value="card">Mock Card Payment</option>
                <option value="cash">Cash on Delivery</option>
              </select>
              <div className="rounded-[22px] bg-[var(--freshco-surface-soft)] p-5 text-[var(--freshco-text-soft)]">
                Payment is a demo placeholder only. No real gateway or transaction is processed in this phase.
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <div className="rounded-[22px] bg-[var(--freshco-surface-soft)] p-5">
              <h3 className="text-[1.4rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                Review your order
              </h3>
              <ul className="mt-4 space-y-2 text-[0.98rem] text-[var(--freshco-text-soft)]">
                {preview.items.map((item) => (
                  <li key={item.product.id}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </form>

        {error ? <p className="mt-4 text-[0.92rem] text-[#A33A3A]">{error}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {step > 1 ? (
            <button
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]"
              onClick={() => setStep((current) => current - 1)}
              type="button"
            >
              Back
            </button>
          ) : null}
          {step < 3 ? (
            <button
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-[#B9DDB7]"
              disabled={!canContinue}
              onClick={() => setStep((current) => current + 1)}
              type="button"
            >
              Continue
            </button>
          ) : (
            <button
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-text)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-[#7A8C8A]"
              disabled={submitting}
              onClick={async () => {
                setSubmitting(true);
                setError(null);
                try {
                  const order = await placeOrder();
                  router.push(`/checkout/confirmation?order=${order.id}`);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Unable to place order.");
                } finally {
                  setSubmitting(false);
                }
              }}
              type="button"
            >
              {submitting ? "Placing order..." : "Place mock order"}
            </button>
          )}
        </div>
      </section>

      <aside className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
        <h2 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[var(--freshco-text)]">
          Order summary
        </h2>
        <ul className="mt-5 space-y-2 text-[0.98rem] text-[var(--freshco-text-soft)]">
          {preview.items.map((item) => (
            <li className="rounded-[20px] bg-white p-4" key={item.product.id}>
              <div className="flex items-center justify-between gap-4">
                <span>{item.product.name} × {item.quantity}</span>
                <strong className="text-[var(--freshco-text)]">${item.lineTotal.toFixed(2)}</strong>
              </div>
              <div className="mt-3">
                <StockBadge
                  quantity={item.product.stockQuantity}
                  stockState={item.product.stockState}
                />
              </div>
              {item.product.ageRestricted ? (
                <div className="mt-3">
                  <AgeRestrictedNotice compact />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-3 border-t border-[var(--freshco-border)] pt-4 text-[0.98rem] text-[var(--freshco-text-soft)]">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <strong className="text-[var(--freshco-text)]">${preview.subtotal.toFixed(2)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery</span>
            <strong className="text-[var(--freshco-text)]">${preview.deliveryFee.toFixed(2)}</strong>
          </div>
          <div className="flex items-center justify-between text-[1.08rem]">
            <span>Total</span>
            <strong className="text-[var(--freshco-text)]">${preview.total.toFixed(2)}</strong>
          </div>
        </div>
      </aside>
    </div>
  );
}
