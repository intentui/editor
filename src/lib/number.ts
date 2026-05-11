type FormatOptions = {
  locale?: string;
  style?: "decimal" | "currency" | "percent";
  currency?: string;
  maximumFractionDigits?: number;
  notation?: "standard" | "scientific" | "engineering" | "compact";
  compactDisplay?: "short" | "long";
};

export function formatNumber(
  value: number,
  {
    locale = "en-US",
    style = "decimal",
    currency,
    maximumFractionDigits,
    notation,
    compactDisplay,
  }: FormatOptions = {},
): string {
  const options: Intl.NumberFormatOptions = {
    style,
    currency,
    maximumFractionDigits,
    notation,
    compactDisplay,
  };

  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatKilo(value: number, locale = "en-US"): string {
  return formatNumber(value, {
    locale,
    notation: "compact",
    compactDisplay: "short",
  });
}
