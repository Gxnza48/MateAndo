"use client"

import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { AboutMate } from "@/components/landing/about-mate"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedProducts />
      <AboutMate />
      <Testimonials />
      <FAQ />
    </>
  )
}
