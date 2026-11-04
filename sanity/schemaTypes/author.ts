import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", description: "Author's display name." }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 } }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true }, fields: [
      defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the image for accessibility." }),
    ] }),
  ],
  preview: { select: { title: "name", subtitle: "slug.current", media: "image" } },
});
