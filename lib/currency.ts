export function formatCurrency(
  value: number,
  currency: string = "IDR",
  locale: string = "id-ID",
) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);

  // ubah "Rp10.000" → "Rp. 10.000"
  return formatted.replace("Rp", "Rp. ");
}

export function formatCurrencyInput(value: number, locale: string = "id-ID") {
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return `Rp.${number}`;
}

export function parseCurrency(value: string) {
  return Number(value.replace(/[^\d]/g, ""));
}
