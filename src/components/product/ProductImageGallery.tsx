"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
  images: Array<{ id: string; url: string }>
  thumbnail: string | null
  title: string
}

export function ProductImageGallery({
  images,
  thumbnail,
  title,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const displayImages =
    images.length > 0
      ? images
      : [{ id: "thumb", url: thumbnail || "/images/product-peptide.png" }]

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-tertiary">
        <Image
          src={displayImages[selectedIndex].url}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnail strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden bg-surface-tertiary",
                index === selectedIndex
                  ? "border-2 border-navy-500"
                  : "border border-border"
              )}
            >
              <Image
                src={image.url}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
