import './SchemeRecord.css'

const schemeFields = [
  ['department', 'Department / authority'],
  ['category', 'Category'],
  ['description', 'Verified description'],
  ['eligibility', 'Eligibility'],
  ['benefits', 'Benefits / support'],
  ['application', 'How to apply'],
  ['officialSource', 'Official source'],
  ['relevantYear', 'Relevant year'],
  ['lastVerifiedDate', 'Last verified'],
]

// Only absolute web URLs become links; unsupported values remain plain text.
function officialSourceUrl(value) {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : null
  } catch {
    return null
  }
}

function SchemeRecord({ record }) {
  if (!record || typeof record.name !== 'string' || !record.name.trim()) {
    return null
  }

  const populatedFields = schemeFields.filter(
    ([key]) => typeof record[key] === 'string' && record[key].trim(),
  )
  const sourceUrl = officialSourceUrl(record.officialSource)

  return (
    <article className="scheme-record">
      <header className="scheme-record__header">
        <p className="scheme-record__eyebrow">Programme information</p>
        <h3>{record.name}</h3>
      </header>
      {populatedFields.length > 0 && (
        <dl className="scheme-record__fields">
          {populatedFields.map(([key, label]) => (
            <div className="scheme-record__field" key={key}>
              <dt>{label}</dt>
              <dd>
                {key === 'officialSource' && sourceUrl ? (
                  <a href={sourceUrl} rel="external">
                    Official source for {record.name}
                  </a>
                ) : record[key]}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}

export default SchemeRecord
