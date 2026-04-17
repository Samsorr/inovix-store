# Checkout design

Living doc for the storefront checkout UX. Current state is a v1 pass | future polish iterations edit this file, then change the code.

Location: `src/app/checkout/page.tsx` (orchestration) plus extracted components alongside it.

## Flow

4 steps in a vertical accordion:

1. **E-mail** | plain email input, guest checkout
2. **Adres** | shipping + billing address (same form, billing mirrors shipping)
3. **Verzending** | radio list of shipping options from `medusa.store.fulfillment.listCartOptions`
4. **Betaling** | radio list of payment providers from `medusa.store.payment.listPaymentProviders`, plus the research-use confirmation checkbox and the Place Order button

Right sidebar: order summary with items, totals breakdown, trust markers, and a promo-code input.

## Progress indicator (`CheckoutStepper`)

Lives above the accordion. Horizontal on desktop, collapses to a one-line `Stap X van 4 | Label` with a thin progress bar on mobile.

Each step node renders one of three visual states:

- **Completed**: filled teal circle with white check icon, muted label, full teal line to the next node, clickable (jumps the accordion back to that step via `editStep`).
- **Current**: teal-outlined circle with a teal numeral, teal label, connecting line behind it half-filled.
- **Upcoming**: hollow circle with a muted numeral, muted label, untouched line.

Steps are not clickable when in `upcoming` state. The stepper receives `activeStep`, `completedSteps`, and `onEdit` as props | the page owns the orchestration state.

Dutch labels: `E-mail`, `Adres`, `Verzending`, `Betaling`.

## Login vs guest (banner pattern)

Top of the checkout page, right-aligned, single line:

- **Not authenticated**: `Al klant? [Inloggen]` | link goes to `/account/login?redirect=/checkout` so the user returns to checkout after sign-in.
- **Authenticated**: `Ingelogd als <email>` | no action needed; acts as a signal that pre-fill has happened.

### Auto-advance when logged in

When `useAuth()` reports a customer:

1. Step 1 auto-completes with `customer.email` and the active step jumps to 2.
2. The existing `listAddress` call pre-fills the address form. If the customer has a complete saved address (all required fields present), step 2 also auto-completes and the active step jumps to 3 (shipping).
3. The "Wijzigen" link on every completed step remains, so users can override any auto-filled value.

The auto-advance runs at most once per checkout session (guarded by a ref or a mount-gate) so that going back via "Wijzigen" doesn't re-skip.

## Promo code (`PromoCodeInput`)

Lives in the right-hand order summary, between the line items and the totals block.

### Collapsed state

Plain text button: `+ Kortingscode toevoegen`.

### Expanded state

- Short text input (`placeholder="BV. VIVATEST"`) + `Toepassen` button, same row.
- Submit via `medusa.store.cart.update(cartId, { promo_codes: [...currentCodes, newCode] })`.
- Inline error below the input on failure: `Code niet geldig of niet toepasbaar.`
- Applied codes render as dismissible chips (`VIVATEST ×`). Dismiss via `medusa.store.cart.update(cartId, { promo_codes: codes.filter(c => c !== removed) })`.

### Totals

When `cart.discount_total > 0`, a `Korting` line appears in the totals block with a negative amount (`-€X,XX`). Subtotal and total recalculate from the Medusa-returned cart.

## Component boundaries

Splitting `page.tsx` just enough to keep the diff reviewable:

| Component | Responsibility |
| --- | --- |
| `page.tsx` | Step orchestration, form state, Medusa SDK calls, place-order handler |
| `CheckoutStepper.tsx` | Progress indicator (pure presentational, receives `activeStep`, `completedSteps`, `onEdit`, optional `labels`) |
| `PromoCodeInput.tsx` | Input + chips UI; receives `cart` and an `onChange` callback that refetches the cart |
| `OrderSummary` (in-file) | Items, totals, trust markers; renders `PromoCodeInput` |
| `StepSection` (in-file) | Accordion step wrapper (unchanged) |

Full refactor into a `/components` tree is out of scope for this pass.

## Out of scope (explicit)

Capturing these so future iterations don't rediscover them:

- Multi-currency coupon errors (only EUR region today).
- Saving an entered address to the logged-in customer's address book (no "save this address" toggle).
- A "Remember me" / social login at the banner level.
- A separate review step between payment and place-order; the research checkbox already gates the submit.
- Per-carrier branding/icons on shipping options.
- Address autocomplete (PostNL / Google Places).
- Splitting payments (one provider per cart today).

## Open questions / future polish

- Should logged-in customers see their billing address separately from shipping? (Today: billing mirrors shipping, even when logged in.)
- Should we persist an in-progress checkout (email + address) in localStorage so refresh doesn't lose state? Medusa preserves it on the cart, but current pre-fill runs only from customer, not from a draft-saved cart.
- Coupon-code-from-URL: `?promo=XYZ` auto-applied on mount would help marketing links.
- Estimated delivery dates on shipping options.

## References

- Medusa store API: `POST /store/carts/:id/promotions` (dedicated endpoint) vs `POST /store/carts/:id` with `promo_codes` (update endpoint). v1 uses `cart.update` because the SDK wraps it.
- Stripe Checkout, Shopify Checkout, and Zalando informed the stepper + banner patterns.
