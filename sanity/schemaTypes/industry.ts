import { defineField, defineType } from "sanity";

export const industry = defineType({
  name: "industry", title: "Industry", type: "object",
  fields: [
    defineField({ name: "title", title: "Industry name", type: "string", description: "For example: clinics, real estate, e-commerce or logistics." }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "marketPage", title: "Related market page", type: "reference", to: [{ type: "marketPage" }], description: "Optional: link to a published, relevant market page." }),
  ], preview: { select: { title: "title", subtitle: "description" } },
});
