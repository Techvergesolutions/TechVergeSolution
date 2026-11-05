/**
 * Minimal Portable Text → Markdown converter for Sanity blog export.
 */
export function portableTextToMarkdown(blocks = []) {
  if (!Array.isArray(blocks)) return "";

  const lines = [];
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;

    if (block._type === "image") {
      const alt = block.alt || "";
      const caption = block.caption || "";
      // Asset URL may be filled by caller; keep placeholder if missing
      const src = block._resolvedUrl || "";
      if (src) {
        lines.push(`![${alt}](${src}${caption ? ` "${caption}"` : ""})`);
        lines.push("");
      }
      continue;
    }

    if (block._type !== "block") continue;

    const text = (block.children || [])
      .map((child) => {
        if (!child || child._type !== "span") return "";
        let value = child.text || "";
        const marks = child.marks || [];
        if (marks.includes("code")) value = `\`${value}\``;
        if (marks.includes("strong")) value = `**${value}**`;
        if (marks.includes("em")) value = `*${value}*`;
        const linkMark = marks.find((m) =>
          (block.markDefs || []).some((d) => d._key === m && d._type === "link"),
        );
        if (linkMark) {
          const def = (block.markDefs || []).find((d) => d._key === linkMark);
          if (def?.href) value = `[${value}](${def.href})`;
        }
        return value;
      })
      .join("");

    const style = block.style || "normal";
    if (style === "h2") lines.push(`## ${text}`, "");
    else if (style === "h3") lines.push(`### ${text}`, "");
    else if (style === "h4") lines.push(`#### ${text}`, "");
    else if (style === "blockquote") lines.push(`> ${text}`, "");
    else if (block.listItem === "bullet") lines.push(`- ${text}`);
    else if (block.listItem === "number") lines.push(`1. ${text}`);
    else lines.push(text, "");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
