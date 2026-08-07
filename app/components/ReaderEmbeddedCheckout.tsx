"use client";

import { useCallback } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type ReaderPlan =
  | "monthly"
  | "yearly"
  | "partner30";

type ReaderEmbeddedCheckoutProps = {
  email: string;
  plan: ReaderPlan;
};

export default function ReaderEmbeddedCheckout({
  email,
  plan,
}: ReaderEmbeddedCheckoutProps) {
  const fetchClientSecret = useCallback(
    async () => {
      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            plan,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load secure checkout."
        );
      }

      if (!data.clientSecret) {
        throw new Error(
          "Stripe did not return a client secret."
        );
      }

      return data.clientSecret;
    },
    [email, plan]
  );

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret,
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
