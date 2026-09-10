export function Stack({ items, label }: { items: readonly string[]; label: string }) {
  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-3 font-mono text-[12px] text-fg-muted">{label}</h2>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded border border-line-soft bg-ink-900 px-2 py-1 font-mono text-[12px] text-fg"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
