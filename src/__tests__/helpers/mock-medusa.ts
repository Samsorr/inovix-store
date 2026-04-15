import { vi } from "vitest"

/**
 * Default mock for @/lib/medusa
 * Each test can override individual methods via vi.mocked().
 */
const medusa = {
  auth: {
    login: vi.fn().mockResolvedValue({ token: "mock-jwt-token" }),
    register: vi.fn().mockResolvedValue({ token: "mock-jwt-token" }),
    logout: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
  },
  store: {
    customer: {
      retrieve: vi.fn().mockResolvedValue({ customer: null }),
      create: vi.fn().mockResolvedValue({ customer: mockCustomer() }),
      update: vi.fn().mockResolvedValue({ customer: mockCustomer() }),
      listAddress: vi.fn().mockResolvedValue({ addresses: [] }),
      createAddress: vi.fn().mockResolvedValue({ address: {} }),
      deleteAddress: vi.fn().mockResolvedValue({ deleted: true }),
    },
    cart: {
      create: vi.fn().mockResolvedValue({ cart: mockCart() }),
      retrieve: vi.fn().mockResolvedValue({ cart: mockCart() }),
      update: vi.fn().mockResolvedValue({ cart: mockCart() }),
      createLineItem: vi.fn().mockResolvedValue({ cart: mockCart() }),
      updateLineItem: vi.fn().mockResolvedValue({ cart: mockCart() }),
      deleteLineItem: vi.fn().mockResolvedValue({ deleted: true, parent: mockCart() }),
      addShippingMethod: vi.fn().mockResolvedValue({ cart: mockCart() }),
      complete: vi.fn().mockResolvedValue({ type: "order", order: mockOrder() }),
    },
    region: {
      list: vi.fn().mockResolvedValue({ regions: [{ id: "reg_eu" }] }),
    },
    product: {
      list: vi.fn().mockResolvedValue({ products: [] }),
      retrieve: vi.fn().mockResolvedValue({ product: mockProduct() }),
    },
    order: {
      list: vi.fn().mockResolvedValue({ orders: [] }),
    },
    fulfillment: {
      listCartOptions: vi.fn().mockResolvedValue({ shipping_options: [] }),
    },
    payment: {
      listPaymentProviders: vi.fn().mockResolvedValue({ payment_providers: [] }),
      initiatePaymentSession: vi.fn().mockResolvedValue({}),
    },
  },
}

export default medusa

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

export function mockCustomer(overrides: Record<string, unknown> = {}) {
  return {
    id: "cus_test123",
    email: "test@example.com",
    first_name: "Jan",
    last_name: "de Vries",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  }
}

export function mockCart(overrides: Record<string, unknown> = {}) {
  return {
    id: "cart_test123",
    region_id: "reg_eu",
    email: "",
    items: [],
    total: 0,
    subtotal: 0,
    tax_total: 0,
    shipping_total: 0,
    shipping_address: null,
    ...overrides,
  }
}

export function mockCartWithItems(count = 1) {
  const items = Array.from({ length: count }, (_, i) => mockLineItem({ id: `item_${i}` }))
  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  return mockCart({ items, total, subtotal: total })
}

export function mockLineItem(overrides: Record<string, unknown> = {}) {
  return {
    id: "li_test123",
    title: "BPC-157",
    quantity: 1,
    unit_price: 4999,
    thumbnail: "/images/product-peptide.png",
    variant: { id: "var_test", title: "5mg" },
    ...overrides,
  }
}

export function mockProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: "prod_test123",
    title: "BPC-157",
    description: "Research peptide for laboratory use",
    handle: "bpc-157",
    thumbnail: "/images/product-peptide.png",
    images: [{ id: "img_1", url: "/images/product-peptide.png" }],
    variants: [
      {
        id: "var_5mg",
        title: "5mg",
        sku: "BPC-5MG",
        calculated_price: { calculated_amount: 4999 },
        inventory_quantity: 50,
      },
    ],
    metadata: {
      purity: "98",
      category: "Peptides",
      sequence: "GEPPPGKPADDAGLV",
      molecular_formula: "C62H98N16O22",
      molecular_weight: "1419.53",
      cas_number: "137525-51-0",
      physical_state: "Lyophilized powder",
      solubility: "Water, DMSO",
      shelf_life: "24 months",
      storage_temp: "-20C",
      handling_notes: "Store desiccated",
      coa_url: "/docs/bpc-157-coa.pdf",
    },
    collection: null,
    ...overrides,
  }
}

export function mockOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: "order_test123",
    display_id: 1001,
    status: "pending",
    created_at: "2025-01-01T00:00:00Z",
    email: "test@example.com",
    total: 4999,
    subtotal: 4999,
    tax_total: 0,
    shipping_total: 0,
    currency_code: "EUR",
    items: [
      {
        id: "oi_1",
        title: "BPC-157",
        quantity: 1,
        unit_price: 4999,
        variant: { title: "5mg" },
      },
    ],
    shipping_address: {
      first_name: "Jan",
      last_name: "de Vries",
      address_1: "Keizersgracht 123",
      postal_code: "1015 CJ",
      city: "Amsterdam",
      country_code: "nl",
    },
    ...overrides,
  }
}
