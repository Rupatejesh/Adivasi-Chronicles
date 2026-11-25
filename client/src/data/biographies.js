// Future local targets only. Verification requires provenance and permission review.
export const biographyPreviews = [
  ['Birsa Munda', 'birsa-munda'],
  ['Komaram Bheem', 'komaram-bheem'],
  ['Alluri Sitarama Raju', 'alluri-sitarama-raju'],
  ['B. R. Ambedkar', 'br-ambedkar'],
  ['Jyotirao Phule', 'jyotirao-phule'],
  ['Bhagat Singh', 'bhagat-singh'],
  ['Basavanna', 'basavanna'],
].map(([name, slug], index) => ({
  name, slug, image: `/images/heroes/${slug}.jpg`, portraitAvailable: false,
  portraitVerificationStatus: 'pending', portraitSource: '', portraitCredit: '',
  descriptor: 'Biography and referenced material coming as the archive develops.',
  number: String(index + 1).padStart(2, '0'),
  initials: name.split(/\s+/).slice(0, 2).map(part => part[0]).join(''),
  quoteText: '', quoteAuthor: '', quoteSource: '', quoteSourceUrl: '', verificationStatus: 'pending',
}))
