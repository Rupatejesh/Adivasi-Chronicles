# Genuine Eastern Ghats cover

Future target: `/images/intro/eastern-ghats-cover.jpg`.
No photograph is supplied. The CSS landscape is decorative, not documentary imagery.
Only add a genuine user-provided photograph after confirming provenance and permission.
Then set `easternGhatsCover.verified` in `src/components/intro/CinematicIntro.jsx`.
Failed loads retain the CSS landscape without a broken-image icon.

Portrait records live in `src/data/biographies.js`. Add only verified local portraits
with provenance, permission and accurate credits. Set portraitAvailable and
portraitVerificationStatus only after review. Do not invent a portrait or quotation.

# Optional symbolic figures

Targets: `tribal-grandmother.png`, `tribal-girl.png`, `tribal-boy.png` in this folder.
Review supplied artwork, rights and representation before setting `approved: true`
in `src/data/introMedia.js`. Set useful alt text for meaningful images (empty only
for decoration). CSS silhouettes remain until approved images load successfully.
These figures represent Memory / Present / Future, not historical individuals.
Do not add fake documentary photography or stereotypical costume/ornament.
If using genuine photographs, review permission and update the symbolic-artwork
caption accurately before publishing. No image files are currently supplied.

## Final user-selected intro media

The active intro now uses `/images/adivasi-jeevana-vidhvamsam.png` followed by
`/images/asr-launch.png`. Both live one directory above this folder and remain
unchanged. The optional cover and symbolic-figure targets above are historical
architecture, not required by the active launch. No temporary figures render
in the final sequence. Missing active media uses CSS/text fallbacks.
