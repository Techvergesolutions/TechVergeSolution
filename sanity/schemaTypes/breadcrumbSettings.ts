import { defineArrayMember, defineField, defineType } from "sanity";

export const breadcrumbSettings = defineType({
  name: "breadcrumbSettings",
  title: "Breadcrumb labels",
  type: "document",
  description: "Labels for fixed pages and the local fallback article. Service and Sanity post labels use their document titles.",
  fields: [
    defineField({ name: "home", title: "Home", type: "string" }),
    defineField({ name: "services", title: "Services", type: "string" }),
    defineField({ name: "blog", title: "Blog", type: "string" }),
    defineField({ name: "portfolio", title: "Portfolio", type: "string" }),
    defineField({ name: "about", title: "About", type: "string" }),
    defineField({ name: "contact", title: "Contact", type: "string" }),
    defineField({
      name: "staticPostLabels", title: "Local article breadcrumb labels", type: "array",
      description: "Only used for articles still rendered from the local fallback registry.",
      of: [defineArrayMember({ name: "staticPostLabel", type: "object", fields: [
        defineField({ name: "slug", title: "Article slug", type: "string" }),
        defineField({ name: "title", title: "Breadcrumb title", type: "string" }),
      ], preview: { select: { title: "title", subtitle: "slug" } } })],
    }),
  ],
  preview: { prepare: () => ({ title: "Breadcrumb labels" }) },
});
