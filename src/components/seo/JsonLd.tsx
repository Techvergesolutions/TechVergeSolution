import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[] | null | undefined;
}

/** Renders one or more schema.org JSON-LD script tags via Helmet. */
export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;
  const graphs = Array.isArray(data) ? data : [data];
  if (!graphs.length) return null;

  return (
    <Helmet>
      {graphs.map((graph, index) => (
        <script
          key={`${graph["@type"] ?? "ld"}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </Helmet>
  );
}
