interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <template
      data-json-ld=""
      suppressHydrationWarning
      // biome-ignore lint/security/noDangerouslySetInnerHtml: serialize JSON with HTML delimiters escaped before inserting into the template.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
