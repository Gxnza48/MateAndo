"use client"

import { motion } from "framer-motion"
import { MapPin, Gem, Truck, ShieldCheck } from "lucide-react"
import { useStore } from "@/contexts/store-context"

const featureIcons = {
  argentina: MapPin,
  premium: Gem,
  shipping: Truck,
  secure: ShieldCheck,
}

export function Features() {
  const { t } = useStore()

  const features = [
    {
      key: "argentina",
      icon: featureIcons.argentina,
      title: t("features.argentina"),
      description: t("features.argentina.desc"),
    },
    {
      key: "premium",
      icon: featureIcons.premium,
      title: t("features.premium"),
      description: t("features.premium.desc"),
    },
    {
      key: "shipping",
      icon: featureIcons.shipping,
      title: t("features.shipping"),
      description: t("features.shipping.desc"),
    },
    {
      key: "secure",
      icon: featureIcons.secure,
      title: t("features.secure"),
      description: t("features.secure.desc"),
    },
  ]

  return (
    <section className="border-y border-border bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
