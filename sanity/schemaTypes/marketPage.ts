import { defineArrayMember, defineField, defineType } from "sanity";

export const marketPage = defineType({
  name: "marketPage", title: "Market landing page", type: "document",
  description: "Publish only when this page has distinct, useful market-specific content. Do not duplicate pages for each country.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required(), description: "Changing a published slug requires a redirect." }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, description: "Distinct introduction and metadata fallback." }),
    defineField({ name: "body", title: "Unique content", type: "array", validation: (rule) => rule.required().min(1), of: [
      defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "H2", value: "h2" }, { title: "H3", value: "h3" }, { title: "Quote", value: "blockquote" }], marks: { annotations: [{ name: "link", title: "Link", type: "object", fields: [defineField({ name: "href", title: "URL", type: "url", validation: (rule) => rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }) })] }] } }),
      defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt text", type: "string" }), defineField({ name: "caption", title: "Caption", type: "string" })] }),
    ] }),
    defineField({ name: "testimonials", title: "Real testimonials", type: "array", description: "Only publish authentic testimonials you have permission to use.", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }), defineField({ name: "name", title: "Name", type: "string" }), defineField({ name: "role", title: "Role or company", type: "string" })], preview: { select: { title: "name", subtitle: "quote" } } })] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
  ], preview: { select: { title: "title", subtitle: "slug.current" } },
});
