import { defineField, defineType, defineArrayMember } from "sanity";

export const contactSettings = defineType({
  name: "contactSettings", title: "Contact settings", type: "document",
  description: "Use one published document for contact details. Enter only real availability.",
  fields: [
    defineField({ name: "email", title: "Email", type: "string", validation: (rule) => rule.email() }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string", description: "International number with country code, e.g. +971...", validation: (rule) => rule.regex(/^\+?[1-9]\d{6,14}$/, { name: "international number" }).warning("Use digits and an optional leading +, including the country code.") }),
    defineField({ name: "bookingUrl", title: "Booking link", type: "url", validation: (rule) => rule.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "availableHours", title: "Available hours", type: "array", description: "Enter each actual time range with its timezone. Do not list equivalent times unless verified.", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "hours", title: "Days and hours", type: "string", description: "For example: Mon-Fri, 9am-6pm" }),
      defineField({ name: "timezone", title: "Timezone", type: "string", description: "For example: GMT, EST, GST, or an IANA timezone." }),
    ], preview: { select: { title: "hours", subtitle: "timezone" } } })] }),
  ], preview: { prepare: () => ({ title: "Contact settings" }) },
});
