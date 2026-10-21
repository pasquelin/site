/**
 * French puts a space before `:` `;` `?` `!` `%` `»` and after `«`, and a line
 * must never break there: a colon opening a line, or a `%` stranded from its
 * number, reads as a mistake. Content is written with plain spaces, so they
 * become non-breaking at render time. English text has none of these spaces,
 * so it passes through unchanged.
 */
export const keepTogether = (text: string): string =>
  text.replace(/ ([:;?!%»])/g, ' $1').replace(/« /g, '« ')
