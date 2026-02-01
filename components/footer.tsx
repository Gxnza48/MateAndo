"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MessageCircle, Github } from "lucide-react"
import { useStore } from "@/contexts/store-context"
import { config } from "@/lib/config"

export function Footer() {
  const { t } = useStore()

  return (
    <footer className="border-t border-border bg-card">
      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <span className="font-serif text-lg font-bold text-primary-foreground">M</span>
              </div>
              <span className="font-serif text-xl font-bold text-foreground">MateAR</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground">Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/store"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.store")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.cart")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="mt-4 flex items-center gap-4">
              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/Gxnza48"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {t("footer.developed")}{" "}
            <a
              href="https://github.com/Gxnza48"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Gonza_Bonadeo
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MateAR. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  )
}
