import { useMemo, useState } from "react";
import { Check, Link2, Linkedin } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

interface BlogShareRowProps {
  title: string;
  path: string;
}

export function BlogShareRow({ title, path }: BlogShareRowProps) {
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => absoluteUrl(path), [path]);

  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground font-medium">Share</span>
      <a
        href={linkedInHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" aria-hidden="true" />
        LinkedIn
      </a>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        aria-label="Share on X"
      >
        X
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Link2 className="w-4 h-4" aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
