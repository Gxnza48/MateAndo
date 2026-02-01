export const config = {
  // WhatsApp
  whatsappNumber: "5493415850155",

  // Site info
  siteName: "Paraiso Matero",
  siteDescription: "Productos de Mate Premium",
}

export const currency = {
  primary: "ARS",
  secondary: "USD",
}

export function formatPrice(priceArs: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(priceArs)
}

export function generateWhatsAppLink(
  items: Array<{ name: string; quantity: number; price: string }>,
  total: string
): string {
  const greeting = "¡Hola!"
  const intro = "Me gustaría comprar:"
  const totalText = "Total:"
  const thanks = "Muchas gracias"

  const itemsList = items
    .map((item) => `- ${item.quantity}x ${item.name} — ${item.price}`)
    .join("\n")

  const message = `${greeting} ${intro}
${itemsList}
${totalText} ${total}
${thanks}`

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`
}
