import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  description: "Optional search and social overrides; the site can fall back to the document content.",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      description: "Optional. Aim for 60 characters or fewer; otherwise use the document title.",
      validation: (rule) => rule.max(60).warning("SEO titles over 60 characters may be truncated."),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      description: "Optional. Aim for 155 characters or fewer; otherwise use the document summary.",
      validation: (rule) => rule.max(155).warning("SEO descriptions over 155 characters may be truncated."),
    }),
    defineField({ name: "ogImage", title: "Social sharing image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "Optional absolute canonical URL. Leave empty to use this page's URL.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      description: "Enable to request that search engines do not index this page.",
    }),
  ],
});
