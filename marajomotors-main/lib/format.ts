export function formatPrice(price: number | null): string {
  if (price === null) return "CONSULTE O VALOR"
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
}
