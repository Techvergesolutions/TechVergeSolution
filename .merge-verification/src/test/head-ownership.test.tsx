import { render, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, expect, it } from "vitest";
import { Seo } from "@/components/Seo";

afterEach(() => { cleanup(); document.head.innerHTML = ""; });

it("replaces the prerendered canonical during navigation", async () => {
  document.head.innerHTML = '<title data-rh="true">Home</title><link data-rh="true" rel="canonical" href="https://example.com/">';
  const client = new QueryClient({ defaultOptions: { queries: { enabled: false } } });
  const view = render(<HelmetProvider><QueryClientProvider client={client}><Seo title="Blog" description="Blog description" path="/blog" /></QueryClientProvider></HelmetProvider>);
  await waitFor(() => expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toMatch(/\/blog$/));
  expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  view.rerender(<HelmetProvider><QueryClientProvider client={client}><Seo title="About" description="About description" path="/about" /></QueryClientProvider></HelmetProvider>);
  await waitFor(() => expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toMatch(/\/about$/));
  expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(document.querySelectorAll("title")).toHaveLength(1);
});
