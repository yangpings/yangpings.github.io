// A short line about how Eric works, full width, between its opening and closing quotation marks. useGsapMotion splits it into letters and lights them
// from dim to gold as the reader scrolls through; without motion it reads as plain text.
export default function ScrollQuote({ text }: { text: string }) {
  return <figure className="code-quote">
    <blockquote><span className="quote-mark" aria-hidden="true">&ldquo;</span><span className="quote-text">{text}</span><span className="quote-mark" aria-hidden="true">&rdquo;</span></blockquote>
  </figure>;
}
