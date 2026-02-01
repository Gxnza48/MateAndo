"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useStore } from "@/contexts/store-context"

export function AboutMate() {
  const { t } = useStore()

  return (
    <section id="about" className="bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              <Image
                src="https://acdn-us.mitiendanube.com/stores/002/143/544/products/dsc_0242-e029c3b3843ba2ce0e17448997970277-1024-1024.webp"
                alt="Mate ceremony"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 rounded-xl border border-border bg-background p-4 shadow-lg md:-bottom-8 md:-right-8 md:p-6"
            >
              <p className="font-serif text-3xl font-bold text-primary md:text-4xl">
                500+
              </p>
              <p className="text-sm text-muted-foreground">
                {t("features.argentina")}
              </p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {t("about.title")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t("about.text")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
