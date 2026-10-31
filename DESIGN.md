# DESIGN.md: Eric Yang's world

Direction: **the split stage, coloured by chapter.** Half the screen holds one large picture that never moves while the column beside it scrolls; between the splits, full-width chapters flood the page with one flat colour each. The contrast between chapters is the energy of the page.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--ground` | `#280d15` | Burgundy field; ink on the bright fields |
| `--plum` | `#170811` | Deep field (experience, roadmap) |
| `--coral` | `#ff7868` | Field (projects, contact); actions; the footer name |
| `--gold` | `#ffd078` | Field (play, art); the giant name; roles |
| `--ink` | `#fff1db` | Text on the dark fields |
| `--deep` | `#5a1a25` | Secondary text on the bright fields |

On coral and gold every word is burgundy. Real interfaces (the room game, marked `data-ui`) keep their own colours.

## Chapters

| Chapter | Field | Layout |
| --- | --- | --- |
| Opening and About | Burgundy | Split: portrait, then "Travel to the Future", fixed left; giant "eric yang" crosses onto the photo |
| Play (room game) | Gold | Full width |
| Projects | Coral | Big-name index with a preview; the active name flips to a burgundy block |
| Skills | Burgundy | Two columns over the Vanta waves |
| Experience | Plum | Education and both timelines |
| Motto | Burgundy | Scroll-lit statement over the Vanta cells |
| Art | Gold | Split: artwork fixed right, shown whole |
| Gallery | Burgundy | One row dragged or scrolled sideways |
| Roadmap | Plum | The mountain climb |
| Contact | Coral | Sentence, small portrait, links; burgundy globe |
| Footer | Burgundy | The name in coral at full width |

## Type

One family, **Bricolage Grotesque**. Display 700–800 weight, tracking -0.035 to -0.06em, leading 0.78–1.05. Body 16–18px, leading 1.6. Nothing readable under 13px.

## Motion

- Signature: the giant name sinks as the opening leaves; the footer name grows into place.
- The fixed picture opens like a curtain on load and crossfades between chapters.
- The headline types; the roles roll; the about statement and the motto light up as they are read.
- Lenis smooth scrolling; GSAP reveals; Vanta scenes only on desktop and only while near view.
- "Pause motion" freezes everything that moves on its own; reduced motion turns all of it off.
