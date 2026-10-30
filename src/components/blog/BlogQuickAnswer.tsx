interface BlogQuickAnswerProps {
  text: string;
}

export function BlogQuickAnswer({ text }: BlogQuickAnswerProps) {
  if (!text?.trim()) return null;

  return (
    <aside
      className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 px-5 py-5 md:px-6 md:py-6"
      aria-label="Quick answer"
    >
      <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-2">
        Quick answer
      </p>
      <p className="text-foreground text-base md:text-lg leading-relaxed">
        {text}
      </p>
    </aside>
  );
}
