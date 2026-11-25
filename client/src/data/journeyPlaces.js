// Future local photographs require approval and accurate alt text before display.
const place = (name, slug) => ({ name, slug, src: `/images/places/${slug}.jpg`, approved: false, alt: '' })
export const journeyPlaces = [
  place('Araku Valley', 'araku-valley'), place('Lambasingi', 'lambasingi'),
  place('Vanjangi', 'vanjangi'), place('Ananthagiri', 'ananthagiri'),
  place('Maredumilli', 'maredumilli'), place('Chintapalli', 'chintapalli'),
  place('Paderu', 'paderu'),
]
export const futureJourneyPlaces = [
  place('Dumbriguda', 'dumbriguda'), place('G. Madugula', 'g-madugula'),
  place('G.K. Veedhi', 'gk-veedhi'), place('Koyyuru', 'koyyuru'),
  place('Hukumpeta', 'hukumpeta'), place('Peddabayalu', 'peddabayalu'),
  place('Munchingiputtu', 'munchingiputtu'),
]
