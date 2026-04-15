import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ProductImageGallery } from "@/components/product/ProductImageGallery"

const multipleImages = [
  { id: "img_1", url: "/images/peptide-front.png" },
  { id: "img_2", url: "/images/peptide-side.png" },
  { id: "img_3", url: "/images/peptide-back.png" },
]

describe("ProductImageGallery", () => {
  it("renders main image with first image URL", () => {
    render(
      <ProductImageGallery
        images={multipleImages}
        thumbnail={null}
        title="BPC-157"
      />
    )

    const mainImages = screen.getAllByAltText("BPC-157")
    // The first match is the main image
    expect(mainImages[0]).toHaveAttribute("src", "/images/peptide-front.png")
  })

  it("renders thumbnail strip with all images", () => {
    render(
      <ProductImageGallery
        images={multipleImages}
        thumbnail={null}
        title="BPC-157"
      />
    )

    expect(screen.getByAltText("BPC-157 - 1")).toBeInTheDocument()
    expect(screen.getByAltText("BPC-157 - 2")).toBeInTheDocument()
    expect(screen.getByAltText("BPC-157 - 3")).toBeInTheDocument()
  })

  it("clicking a thumbnail changes the main image", async () => {
    const user = userEvent.setup()

    render(
      <ProductImageGallery
        images={multipleImages}
        thumbnail={null}
        title="BPC-157"
      />
    )

    // Initially the main image shows the first URL
    const mainImage = screen.getByAltText("BPC-157")
    expect(mainImage).toHaveAttribute("src", "/images/peptide-front.png")

    // Click the second thumbnail
    const secondThumb = screen.getByAltText("BPC-157 - 2")
    await user.click(secondThumb.closest("button")!)

    // Main image should now show the second URL
    expect(mainImage).toHaveAttribute("src", "/images/peptide-side.png")
  })

  it("uses title as alt text for the main image", () => {
    render(
      <ProductImageGallery
        images={multipleImages}
        thumbnail={null}
        title="TB-500"
      />
    )

    expect(screen.getByAltText("TB-500")).toBeInTheDocument()
  })

  it("falls back to thumbnail when images array is empty", () => {
    render(
      <ProductImageGallery
        images={[]}
        thumbnail="/images/fallback-thumb.png"
        title="BPC-157"
      />
    )

    const img = screen.getByAltText("BPC-157")
    expect(img).toHaveAttribute("src", "/images/fallback-thumb.png")
  })

  it("falls back to default placeholder when images and thumbnail are empty", () => {
    render(
      <ProductImageGallery images={[]} thumbnail={null} title="BPC-157" />
    )

    const img = screen.getByAltText("BPC-157")
    expect(img).toHaveAttribute("src", "/images/product-peptide.png")
  })

  it("does not render thumbnail strip when only one image", () => {
    render(
      <ProductImageGallery
        images={[{ id: "img_1", url: "/images/single.png" }]}
        thumbnail={null}
        title="BPC-157"
      />
    )

    // With a single image, there should be no thumbnail buttons
    const buttons = screen.queryAllByRole("button")
    expect(buttons.length).toBe(0)
  })
})
