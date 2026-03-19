"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deliverySlots,
  fulfillmentOptions,
  getDeliverySlot,
  getSubstitutionOption,
  pickupLocationLabel,
  substitutionOptions,
} from "@/lib/storefront/mock-data/orders";
import { useStorefrontSession } from "@/lib/storefront/browser-session";
import type { CheckoutDraft } from "@/lib/storefront/types";
import { AgeRestrictedNotice } from "@/components/storefront/shared/AgeRestrictedNotice";
import { StockBadge } from "@/components/storefront/shared/StockBadge";

type CheckoutErrors = Partial<Record<keyof CheckoutDraft | "ageConfirmation" | "form", string>>;
type CheckoutStep = (typeof checkoutSteps)[number]["id"];
type PaymentMethodOption = Readonly<{
  description: string;
  label: string;
  value: CheckoutDraft["paymentMethod"];
}>;

const checkoutSteps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Fulfillment" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Review" },
] as const;

const paymentMethodOptions: readonly PaymentMethodOption[] = [
  {
    value: "card",
    label: "Card",
    description: "Pay by card at checkout.",
  },
  {
    value: "cash",
    label: "Cash on delivery",
    description: "Pay when your order arrives.",
  },
] as const;

function FieldError({ message }: Readonly<{ message?: string }>) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-[0.84rem] font-bold text-[#A33A3A]">{message}</p>;
}

function getDetailsStepErrors(checkoutDraft: CheckoutDraft): CheckoutErrors {
  const nextErrors: CheckoutErrors = {};

  if (!checkoutDraft.firstName.trim()) {
    nextErrors.firstName = "First name is required.";
  }
  if (!checkoutDraft.lastName.trim()) {
    nextErrors.lastName = "Last name is required.";
  }
  if (!checkoutDraft.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!checkoutDraft.email.includes("@")) {
    nextErrors.email = "Enter a valid email address.";
  }
  if (!checkoutDraft.phone.trim()) {
    nextErrors.phone = "Phone number is required.";
  }

  return nextErrors;
}

function getFulfillmentStepErrors(
  checkoutDraft: CheckoutDraft,
  requiresDeliveryAddress: boolean,
): CheckoutErrors {
  if (!requiresDeliveryAddress) {
    return {};
  }

  const nextErrors: CheckoutErrors = {};

  if (!checkoutDraft.addressLine1.trim()) {
    nextErrors.addressLine1 = "Delivery address is required.";
  }
  if (!checkoutDraft.city.trim()) {
    nextErrors.city = "City is required for delivery.";
  }
  if (!checkoutDraft.deliverySlot) {
    nextErrors.deliverySlot = "Choose a delivery slot.";
  }

  return nextErrors;
}

function getPaymentStepErrors(checkoutDraft: CheckoutDraft): CheckoutErrors {
  return checkoutDraft.paymentMethod
    ? {}
    : { paymentMethod: "Choose a payment method." };
}

function getReviewStepErrors(
  checkoutDraft: CheckoutDraft,
  hasWineryItems: boolean,
): CheckoutErrors {
  return hasWineryItems && !checkoutDraft.ageConfirmation
    ? { ageConfirmation: "Confirm the 18+ notice before placing the order." }
    : {};
}

function getStepErrors(
  step: CheckoutStep,
  checkoutDraft: CheckoutDraft,
  requiresDeliveryAddress: boolean,
  hasWineryItems: boolean,
): CheckoutErrors {
  switch (step) {
    case 1:
      return getDetailsStepErrors(checkoutDraft);
    case 2:
      return getFulfillmentStepErrors(checkoutDraft, requiresDeliveryAddress);
    case 3:
      return getPaymentStepErrors(checkoutDraft);
    case 4:
      return getReviewStepErrors(checkoutDraft, hasWineryItems);
    default:
      return {};
  }
}

function getReviewAddress(checkoutDraft: CheckoutDraft, requiresDeliveryAddress: boolean) {
  return requiresDeliveryAddress
    ? `${checkoutDraft.addressLine1}, ${checkoutDraft.city}`
    : pickupLocationLabel;
}

export function CheckoutClient() {
  const router = useRouter();
  const { loaded, preview, checkoutDraft, saveCheckoutDraft, placeOrder } = useStorefrontSession();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const hasWineryItems = preview.items.some((item) => item.product.ageRestricted);
  const selectedFulfillment = useMemo(
    () =>
      fulfillmentOptions.find((option) => option.method === checkoutDraft.fulfillmentMethod) ??
      fulfillmentOptions[0],
    [checkoutDraft.fulfillmentMethod],
  );
  const selectedSlot = useMemo(
    () => getDeliverySlot(checkoutDraft.deliverySlot),
    [checkoutDraft.deliverySlot],
  );
  const selectedSubstitution = useMemo(
    () => getSubstitutionOption(checkoutDraft.substitutionPreference),
    [checkoutDraft.substitutionPreference],
  );
  const requiresDeliveryAddress = checkoutDraft.fulfillmentMethod !== "pickup";

  function updateDraft(patch: Partial<CheckoutDraft>) {
    const nextDraft = {
      ...checkoutDraft,
      ...patch,
    };
    setErrors((current) => ({ ...current, form: undefined }));
    void saveCheckoutDraft(nextDraft);
  }

  function validateStep(nextStep: CheckoutStep) {
    const nextErrors = getStepErrors(
      nextStep,
      checkoutDraft,
      requiresDeliveryAddress,
      hasWineryItems,
    );
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handlePlaceOrder() {
    const isValid =
      validateStep(1) &&
      validateStep(2) &&
      validateStep(3) &&
      validateStep(4) &&
      preview.items.length > 0;

    if (!isValid) {
      setStep(hasWineryItems && !checkoutDraft.ageConfirmation ? 4 : step);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const order = await placeOrder();
      router.push(`/checkout/success?order=${order.id}`);
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Unable to place order.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) {
    return <p className="text-[var(--freshco-text-soft)]">Loading checkout…</p>;
  }

  if (preview.items.length === 0) {
    return (
      <p className="text-[var(--freshco-text-soft)]">
        Your cart is empty. Add products before checkout.
      </p>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
      <section className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-6">
        <div className="flex flex-wrap gap-2">
          {checkoutSteps.map((entry) => (
            <button
              key={entry.id}
              className={`inline-flex rounded-full px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] ${
                step === entry.id
                  ? "bg-[var(--freshco-brand)] text-white"
                  : "border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] text-[var(--freshco-text-soft)]"
              }`}
              onClick={() => setStep(entry.id)}
              type="button"
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6">
          {step === 1 ? (
            <>
              <div>
                <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                  Contact details
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      className="h-12 w-full rounded-[18px] border border-[var(--freshco-border)] px-4"
                      onChange={(event) => updateDraft({ firstName: event.target.value })}
                      placeholder="First name"
                      value={checkoutDraft.firstName}
                    />
                    <FieldError message={errors.firstName} />
                  </div>
                  <div>
                    <input
                      className="h-12 w-full rounded-[18px] border border-[var(--freshco-border)] px-4"
                      onChange={(event) => updateDraft({ lastName: event.target.value })}
                      placeholder="Last name"
                      value={checkoutDraft.lastName}
                    />
                    <FieldError message={errors.lastName} />
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      className="h-12 w-full rounded-[18px] border border-[var(--freshco-border)] px-4"
                      onChange={(event) => updateDraft({ email: event.target.value })}
                      placeholder="Email"
                      type="email"
                      value={checkoutDraft.email}
                    />
                    <FieldError message={errors.email} />
                  </div>
                  <div>
                    <input
                      className="h-12 w-full rounded-[18px] border border-[var(--freshco-border)] px-4"
                      onChange={(event) => updateDraft({ phone: event.target.value })}
                      placeholder="Phone"
                      value={checkoutDraft.phone}
                    />
                    <FieldError message={errors.phone} />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div>
                <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                  Delivery or pickup
                </p>
                <div className="mt-4 grid gap-3">
                  {fulfillmentOptions.map((option) => {
                    const selected = checkoutDraft.fulfillmentMethod === option.method;
                    return (
                      <label
                        key={option.method}
                        className={`flex cursor-pointer items-start gap-3 rounded-[22px] border p-4 transition ${
                          selected
                            ? "border-[var(--freshco-brand)] bg-[#F4FBF3]"
                            : "border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)]"
                        }`}
                      >
                        <input
                          checked={selected}
                          className="mt-1 h-4 w-4 accent-[var(--freshco-brand)]"
                          name="fulfillmentMethod"
                          onChange={() =>
                            updateDraft({
                              fulfillmentMethod: option.method,
                            })
                          }
                          type="radio"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[1rem] font-extrabold text-[var(--freshco-text)]">
                              {option.label}
                            </span>
                            <span className="text-[0.84rem] font-bold text-[var(--freshco-brand-dark)]">
                              {option.fee > 0 ? `$${option.fee.toFixed(2)}` : "Free"}
                            </span>
                          </div>
                          <p className="mt-1 text-[0.92rem] text-[var(--freshco-text-soft)]">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {requiresDeliveryAddress ? (
                <div className="grid gap-4">
                  <div>
                    <input
                      className="h-12 w-full rounded-[18px] border border-[var(--freshco-border)] px-4"
                      onChange={(event) => updateDraft({ addressLine1: event.target.value })}
                      placeholder="Address line 1"
                      value={checkoutDraft.addressLine1}
                    />
                    <FieldError message={errors.addressLine1} />
                  </div>
                  <input
                    className="h-12 w-full rounded-[18px] border border-[var(--freshco-border)] px-4"
                    onChange={(event) => updateDraft({ addressLine2: event.target.value })}
                    placeholder="Address line 2"
                    value={checkoutDraft.addressLine2}
                  />
                  <div>
                    <input
                      className="h-12 w-full rounded-[18px] border border-[var(--freshco-border)] px-4"
                      onChange={(event) => updateDraft({ city: event.target.value })}
                      placeholder="City"
                      value={checkoutDraft.city}
                    />
                    <FieldError message={errors.city} />
                  </div>
                  <textarea
                    className="min-h-[110px] rounded-[18px] border border-[var(--freshco-border)] px-4 py-3"
                    onChange={(event) => updateDraft({ deliveryNotes: event.target.value })}
                    placeholder="Delivery instructions"
                    value={checkoutDraft.deliveryNotes}
                  />
                </div>
              ) : (
                <div className="rounded-[22px] bg-[var(--freshco-surface-soft)] p-5 text-[var(--freshco-text-soft)]">
                  Pickup location:{" "}
                  <strong className="text-[var(--freshco-text)]">{pickupLocationLabel}</strong>
                </div>
              )}

              <div>
                <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                  Delivery slot
                </p>
                <div className="mt-4 grid gap-3">
                  {deliverySlots.map((slot) => {
                    const selected = checkoutDraft.deliverySlot === slot.value;
                    return (
                      <label
                        key={slot.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-[22px] border p-4 transition ${
                          selected
                            ? "border-[var(--freshco-brand)] bg-[#F4FBF3]"
                            : "border-[var(--freshco-border)] bg-white"
                        } ${!requiresDeliveryAddress ? "opacity-60" : ""}`}
                      >
                        <input
                          checked={selected}
                          className="mt-1 h-4 w-4 accent-[var(--freshco-brand)]"
                          disabled={!requiresDeliveryAddress}
                          onChange={() => updateDraft({ deliverySlot: slot.value })}
                          type="radio"
                        />
                        <div>
                          <p className="text-[0.96rem] font-extrabold text-[var(--freshco-text)]">
                            {slot.label}
                          </p>
                          <p className="mt-1 text-[0.88rem] text-[var(--freshco-text-soft)]">
                            {slot.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <FieldError message={errors.deliverySlot} />
              </div>

              <div>
                <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                  Substitutions
                </p>
                <div className="mt-4 grid gap-3">
                  {substitutionOptions.map((option) => {
                    const selected = checkoutDraft.substitutionPreference === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-[22px] border p-4 transition ${
                          selected
                            ? "border-[var(--freshco-brand)] bg-[#F4FBF3]"
                            : "border-[var(--freshco-border)] bg-white"
                        }`}
                      >
                        <input
                          checked={selected}
                          className="mt-1 h-4 w-4 accent-[var(--freshco-brand)]"
                          onChange={() =>
                            updateDraft({ substitutionPreference: option.value })
                          }
                          type="radio"
                        />
                        <div>
                          <p className="text-[0.96rem] font-extrabold text-[var(--freshco-text)]">
                            {option.label}
                          </p>
                          <p className="mt-1 text-[0.88rem] text-[var(--freshco-text-soft)]">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <textarea
                className="min-h-[110px] rounded-[18px] border border-[var(--freshco-border)] px-4 py-3"
                onChange={(event) => updateDraft({ orderNotes: event.target.value })}
                placeholder="Order notes for the shopper team"
                value={checkoutDraft.orderNotes}
              />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div>
                <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-text-soft)]">
                  Payment method
                </p>
                <div className="mt-4 grid gap-3">
                  {paymentMethodOptions.map((option) => {
                    const selected = checkoutDraft.paymentMethod === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-[22px] border p-4 transition ${
                          selected
                            ? "border-[var(--freshco-brand)] bg-[#F4FBF3]"
                            : "border-[var(--freshco-border)] bg-white"
                        }`}
                      >
                        <input
                          checked={selected}
                          className="mt-1 h-4 w-4 accent-[var(--freshco-brand)]"
                          onChange={() => updateDraft({ paymentMethod: option.value })}
                          type="radio"
                        />
                        <div>
                          <p className="text-[0.96rem] font-extrabold text-[var(--freshco-text)]">
                            {option.label}
                          </p>
                          <p className="mt-1 text-[0.88rem] text-[var(--freshco-text-soft)]">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <FieldError message={errors.paymentMethod} />
              </div>

              <div className="rounded-[22px] bg-[var(--freshco-surface-soft)] p-5 text-[var(--freshco-text-soft)]">
                Review your payment choice before placing the order.
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <div className="rounded-[22px] bg-[var(--freshco-surface-soft)] p-5">
                <h3 className="text-[1.4rem] font-extrabold tracking-[-0.04em] text-[var(--freshco-text)]">
                  Final review
                </h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[18px] bg-white p-4">
                    <p className="text-[0.76rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                      Contact
                    </p>
                    <p className="mt-2 text-[0.96rem] text-[var(--freshco-text)]">
                      {checkoutDraft.firstName} {checkoutDraft.lastName}
                    </p>
                    <p className="mt-1 text-[0.92rem] text-[var(--freshco-text-soft)]">
                      {checkoutDraft.email}
                    </p>
                    <p className="mt-1 text-[0.92rem] text-[var(--freshco-text-soft)]">
                      {checkoutDraft.phone}
                    </p>
                  </div>
                  <div className="rounded-[18px] bg-white p-4">
                    <p className="text-[0.76rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                      Fulfillment
                    </p>
                    <p className="mt-2 text-[0.96rem] text-[var(--freshco-text)]">
                      {selectedFulfillment.label}
                    </p>
                    <p className="mt-1 text-[0.92rem] text-[var(--freshco-text-soft)]">
                      {getReviewAddress(checkoutDraft, requiresDeliveryAddress)}
                    </p>
                    <p className="mt-1 text-[0.92rem] text-[var(--freshco-text-soft)]">
                      {requiresDeliveryAddress ? selectedSlot.label : selectedFulfillment.etaLabel}
                    </p>
                  </div>
                  <div className="rounded-[18px] bg-white p-4">
                    <p className="text-[0.76rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                      Substitutions
                    </p>
                    <p className="mt-2 text-[0.96rem] text-[var(--freshco-text)]">
                      {selectedSubstitution.label}
                    </p>
                    <p className="mt-1 text-[0.92rem] text-[var(--freshco-text-soft)]">
                      {selectedSubstitution.description}
                    </p>
                  </div>
                  <div className="rounded-[18px] bg-white p-4">
                    <p className="text-[0.76rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                      Payment
                    </p>
                    <p className="mt-2 text-[0.96rem] text-[var(--freshco-text)]">
                      {checkoutDraft.paymentMethod === "card"
                        ? "Card"
                        : "Cash on delivery"}
                    </p>
                    <p className="mt-1 text-[0.92rem] text-[var(--freshco-text-soft)]">
                      Selected for this order.
                    </p>
                  </div>
                </div>
                {checkoutDraft.deliveryNotes || checkoutDraft.orderNotes ? (
                  <div className="mt-4 rounded-[18px] bg-white p-4">
                    <p className="text-[0.76rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
                      Notes
                    </p>
                    {checkoutDraft.deliveryNotes ? (
                      <p className="mt-2 text-[0.92rem] text-[var(--freshco-text-soft)]">
                        Delivery: {checkoutDraft.deliveryNotes}
                      </p>
                    ) : null}
                    {checkoutDraft.orderNotes ? (
                      <p className="mt-2 text-[0.92rem] text-[var(--freshco-text-soft)]">
                        Order: {checkoutDraft.orderNotes}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {hasWineryItems ? (
                <div className="rounded-[22px] border border-[#A66A00]/18 bg-[#FFF6D8] p-5 text-[#6E4C05]">
                  <AgeRestrictedNotice compact />
                  <label className="mt-4 flex items-start gap-3">
                    <input
                      checked={checkoutDraft.ageConfirmation}
                      className="mt-1 h-4 w-4 accent-[#A66A00]"
                      onChange={(event) =>
                        updateDraft({ ageConfirmation: event.target.checked })
                      }
                      type="checkbox"
                    />
                    <span className="text-[0.92rem] leading-7">
                      I confirm this order’s winery items are for a shopper who is 18+.
                    </span>
                  </label>
                  <FieldError message={errors.ageConfirmation} />
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        {errors.form ? <p className="mt-4 text-[0.92rem] text-[#A33A3A]">{errors.form}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {step > 1 ? (
            <button
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)]"
              onClick={() => setStep((current) => (current - 1) as typeof step)}
              type="button"
            >
              Back
            </button>
          ) : null}
          {step < 4 ? (
            <button
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white"
              onClick={() => {
                const targetStep = step;
                if (validateStep(targetStep)) {
                  setStep((current) => (current + 1) as typeof step);
                }
              }}
              type="button"
            >
              Continue
            </button>
          ) : (
            <button
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-text)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-[#7A8C8A]"
              disabled={submitting}
              onClick={() => void handlePlaceOrder()}
              type="button"
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>
          )}
        </div>
      </section>

      <aside className="rounded-[30px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6 xl:sticky xl:top-24">
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
            <span>Fulfillment</span>
            <strong className="text-[var(--freshco-text)]">{preview.fulfillmentLabel}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery slot</span>
            <strong className="text-right text-[var(--freshco-text)]">
              {requiresDeliveryAddress ? selectedSlot.label : "Pickup timing"}
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Substitutions</span>
            <strong className="text-right text-[var(--freshco-text)]">
              {selectedSubstitution.label}
            </strong>
          </div>
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
        <p className="mt-4 text-[0.9rem] text-[var(--freshco-text-soft)]">{preview.etaLabel}</p>
      </aside>
    </div>
  );
}
