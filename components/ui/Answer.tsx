/**
 * The quotable sentence. Self-contained, factual and dated, so it keeps its
 * meaning when a language model lifts it out of the page on its own.
 */
export function Answer({ children }: { children: string }) {
  return (
    <p className="measure border-l-2 border-amber/50 pl-4 text-[15px] leading-relaxed text-fg-bright">
      {children}
    </p>
  )
}
