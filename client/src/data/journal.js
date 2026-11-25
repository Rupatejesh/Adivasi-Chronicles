export const journalCategories = [
  ['Tribal History', '/tribal-history'], ['People & Heroes', '/heroes'],
  ['Constitution & Rights', '/constitution'], ['Books & Ideas', '/books'],
  ['Culture', '/gallery'], ['Eastern Ghats', '/gallery'],
  ['Development', '/itda'], ['My Journey', '/my-journey'],
]
// Editorial slots, not published articles. Populate only with reviewed content.
export const journalSlots = ['History & memory', 'Reading & ideas', 'Land & culture'].map((topic, index) => ({
  id: `planned-${index}`, topic, title: null, slug: null, author: null,
  publishedAt: null, summary: null, tags: [], references: [], status: 'pending',
}))
