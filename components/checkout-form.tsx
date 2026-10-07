"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/lib/cart";
import { checkoutSchema, paymentLabels, placeOrder, type CheckoutValues } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";

export const LAST_ORDER_KEY = "roshni-last-order";

const inputCls =
  "mt-1.5 block h-12 w-full rounded-lg border border-line bg-white px-4 outline-none focus:border-ink focus-visible:outline-2 focus-visible:outline-gold aria-[invalid=true]:border-henna";

export function CheckoutForm() {
  const { lines, subtotal, hydrated, clear } = useCart();
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: "", phone: "", email: "", address: "", city: "", notes: "", payment: "cod" },
  });

  const onSubmit = async (values: CheckoutValues) => {
    setSubmitError("");
    try {
      const { order, redirectUrl } = await placeOrder(values, lines);
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ id: order.id, total: order.subtotal, name: order.customer.name, redirectUrl }));
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
      clear();
      router.push("/order-success");
    } catch {
      setSubmitError("Something went wrong placing your order. Please try again.");
    }
  };

  if (!hydrated) return <div aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-3xl">Your bag is empty</p>
        <p className="mt-2 text-muted">Add a fabric before checking out.</p>
        <Link href="/collections" className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 text-ivory hover:bg-henna">
          Browse collections
        </Link>
      </div>
    );
  }

  const field = (name: keyof CheckoutValues, label: string, opts: { type?: string; autoComplete?: string; optional?: boolean; inputMode?: "tel" | "email" } = {}) => {
    const err = errors[name]?.message;
    return (
      <div>
        <label htmlFor={name} className="text-sm font-medium">
          {label} {opts.optional && <span className="font-normal text-muted">(optional)</span>}
        </label>
        <input
          id={name}
          type={opts.type ?? "text"}
          autoComplete={opts.autoComplete}
          inputMode={opts.inputMode}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${name}-error` : undefined}
          aria-required={!opts.optional}
          className={inputCls}
          {...register(name)}
        />
        {err && (
          <p id={`${name}-error`} className="mt-1.5 text-sm text-henna">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
        <fieldset className="space-y-5">
          <legend className="mb-4 font-serif text-2xl">Delivery details</legend>
          {field("name", "Full name", { autoComplete: "name" })}
          <div className="grid gap-5 sm:grid-cols-2">
            {field("phone", "Phone (WhatsApp)", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
            {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email", optional: true })}
          </div>
          {field("address", "Address", { autoComplete: "street-address" })}
          {field("city", "City", { autoComplete: "address-level2" })}
          <div>
            <label htmlFor="notes" className="text-sm font-medium">
              Order notes <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              aria-invalid={errors.notes ? true : undefined}
              aria-describedby={errors.notes ? "notes-error" : undefined}
              className={`${inputCls} h-auto py-3`}
              {...register("notes")}
            />
            {errors.notes && (
              <p id="notes-error" className="mt-1.5 text-sm text-henna">
                {errors.notes.message}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 font-serif text-2xl">Payment</legend>
          {(Object.keys(paymentLabels) as CheckoutValues["payment"][]).map((p) => (
            <label key={p} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-ink bg-white px-4">
              <input type="radio" value={p} className="h-4 w-4 accent-henna" {...register("payment")} />
              <span>
                <span className="block">{paymentLabels[p]}</span>
                <span className="block text-sm text-muted">Pay when your parcel arrives</span>
              </span>
            </label>
          ))}
        </fieldset>

        {submitError && (
          <p role="alert" className="text-henna">
            {submitError}
          </p>
        )}

        <div>
          <button type="submit" disabled={isSubmitting} className="h-13 w-full rounded-full bg-ink py-4 text-ivory hover:bg-henna disabled:opacity-60">
            {isSubmitting ? "Placing order…" : "Place order on WhatsApp"}
          </button>
          <p className="mt-3 text-center text-sm text-muted">WhatsApp opens with your order details so you can send it to us.</p>
        </div>
      </form>

      <aside aria-labelledby="summary-heading" className="h-fit rounded-xl bg-sand p-5 lg:sticky lg:top-24">
        <h2 id="summary-heading" className="mb-4 font-serif text-2xl">
          Order summary
        </h2>
        <ul className="divide-y divide-line">
          {lines.map((l) => (
            <li key={l.id} className="flex items-center gap-3 py-3">
              <Image src={l.image} alt="" width={48} height={60} className="h-[60px] w-12 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.name}</p>
                <p className="text-sm text-muted">
                  {[l.length, l.color].filter(Boolean).join(" · ")} × {l.qty}
                </p>
              </div>
              <p className="text-sm tabular-nums">{formatPrice(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Delivery</dt>
            <dd>Confirmed on WhatsApp</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
