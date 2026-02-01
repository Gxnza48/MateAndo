"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useStore } from "@/contexts/store-context"

const testimonials = [
  {
    id: 1,
    name: "Martín García",
    location: "Buenos Aires",
    rating: 5,
    text_es:
      "Excelente calidad en todos los productos. El mate de algarrobo que compré es hermoso y llegó muy bien empacado.",
    text_en:
      "Excellent quality in all products. The algarrobo mate I bought is beautiful and arrived very well packaged.",
  },
  {
    id: 2,
    name: "Luciana Fernández",
    location: "Rosario",
    rating: 5,
    text_es:
      "El kit de iniciación es perfecto para regalar. Mi hermano que vive afuera quedó encantado.",
    text_en:
      "The starter kit is perfect for gifting. My brother who lives abroad was delighted.",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    location: "Córdoba",
    rating: 5,
    text_es:
      "La atención por WhatsApp fue muy rápida y amable. El termo mantiene el agua caliente todo el día.",
    text_en:
      "WhatsApp customer service was very quick and friendly. The thermos keeps water hot all day.",
  },
]

export function Testimonials() {
  const { t, language } = useStore()

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mt-4 text-muted-foreground">
                {testimonial.text_es}
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
