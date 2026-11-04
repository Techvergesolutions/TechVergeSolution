import { defineArrayMember, defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", description: "Service name used in listings and as the SEO title fallback." }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, description: "Changing an existing slug requires a redirect." }),
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 3, description: "A concise summary for listings and SEO fallback." }),
    defineField({ name: "heroHeading", title: "Hero heading", type: "string", description: "Optional heading; the service title can be used as a fallback." }),
    defineField({
      name: "body", title: "Body", type: "array", description: "Main service content.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" }, { title: "H2", value: "h2" },
            { title: "H3", value: "h3" }, { title: "Quote", value: "blockquote" },
          ],
          marks: { annotations: [{
            name: "link", title: "Link", type: "object",
            fields: [defineField({ name: "href", title: "URL", type: "url", validation: (rule) => rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }) })],
          }] },
        }),
        defineArrayMember({ type: "image", options: { hotspot: true }, fields: [
          defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the image for accessibility." }),
          defineField({ name: "caption", title: "Caption", type: "string" }),
        ] }),
      ],
    }),
    defineField({
      name: "features", title: "Features or process steps", type: "array",
      description: "Add features or ordered steps; drag to reorder.",
      of: [defineArrayMember({ type: "object", name: "feature", fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      ], preview: { select: { title: "title", subtitle: "description" } } })],
    }),
    defineField({ name: "processHeading", title: "Process heading", type: "string", description: "Optional heading for the process steps." }),
    defineField({ name: "industries", title: "Industries", type: "array", of: [defineArrayMember({ type: "industry" })], description: "Industries this service actually supports." }),
    defineField({ name: "processDescription", title: "Process introduction", type: "text", rows: 3 }),
    defineField({ name: "faqs", title: "FAQs", type: "array", description: "Questions and answers about this service.", of: [
      defineArrayMember({ type: "object", name: "faq", fields: [
        defineField({ name: "question", title: "Question", type: "string" }),
        defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
      ], preview: { select: { title: "question", subtitle: "answer" } } }),
    ] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({ name: "order", title: "Display order", type: "number", description: "Lower numbers appear first in service listings." }),
    defineField({ name: "relatedPosts", title: "Related posts", type: "array", description: "Optional articles relevant to this service.", of: [
      defineArrayMember({ type: "reference", to: [{ type: "post" }] }),
    ] }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
