export default function VerifiedQuotation({ person }) {
  const verified = person.verificationStatus === 'verified' && person.quoteText?.trim() && person.quoteAuthor === person.name && person.quoteSource?.trim()
  const safeUrl = /^https?:\/\//i.test(person.quoteSourceUrl || '')
  return <div className="biography-quotation">
    {verified ? <figure>
      <blockquote>{person.quoteText}</blockquote>
      <figcaption>{person.quoteAuthor} — <cite>{safeUrl ? <a href={person.quoteSourceUrl}>{person.quoteSource}</a> : person.quoteSource}</cite></figcaption>
    </figure> : <p>Quotation pending source verification.</p>}
  </div>
}
