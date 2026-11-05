# EmbodyStar design review

The existing portal was redesigned using the Hallmark Almanac material for an app screen. The shell, resource facts and interaction handlers remain. No placeholders or third-party photography were added.

## Files

- Edit `app/page.tsx` and `app/globals.css`.
- Add `app/tokens.css`, `app/base.css`, and a locally hosted Hanken Grotesk variable font with its SIL Open Font License.
- Delete no routes or files.

## Decisions

The actual resource index is the signature: clear names, descriptions, categories, maintainers and bookmark controls. Slate stock, square edges and two rule weights replace the decorative card grid. Magenta identifies the selected state and primary action.

Hanken Grotesk is used for prose and controls as an intentional app adaptation. Hallmark's app-screen guidance permits a single sans family. There are no measurement columns needing an outlier mono face.

## Verification

- Production build passes, including static generation.
- ESLint and TypeScript pass.
- Hallmark static and browser checks: 0 FAIL, 0 REFLEX, 0 WARN.
- Preservation record: 2/2 links, 14/14 named fields and 21/21 handlers. Icon `name` props are included in the field inventory.
- Chromium interaction checks pass: search, category filters, alphabetical sort, bookmarks, bookmark persistence, required form fields, local resource submission and persistence, resource dialog links, Escape dismissal, mobile navigation, and no horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440 and 1920 pixels.
- No uncaught browser errors in the tested flows.
- Browser checks found a weak select edge and short resource title hit target; both were fixed. Mobile filter wrapping and wordmark visibility were also fixed.
- Fresh-context review found no app usability regression. The theme's serif/mono pairing was suggested; the single sans app adaptation is retained deliberately.

## Copy changes

Generic copy was tightened under Hallmark gates 19, 54, 63 and 67. Resource titles, descriptions, organizations, tags, URLs and the local-storage disclosure retain their meaning.

| Before | After |
| --- | --- |
| The embodied AI hub | The embodied AI index |
| Your exploration starts here / Explore | Browse by subject |
| Where intelligence meets the real world. | A field guide to embodied AI. |
| Discover the models, tools, and ideas bringing embodied AI to life. | Models, datasets, and tools for building intelligence that acts. |
| A world of possibilities / Curated for builders | Removed decorative labels |
| The next frontier / Intelligence. Beyond the screen. | LeRobot, the actual featured resource |
| From perception to action. Explore the open ecosystem shaping a more capable world. | Existing LeRobot resource description |
| Explore the ecosystem | Browse the index |
| Open knowledge. Real-world impact. / Perception / Action / Embodied intelligence 01 | Featured in models / Imitation learning / PyTorch |
| A launchpad for your next idea | Resource index |
| Good places to start. Great things to build with. | Removed redundant introduction |
| Your corner of discovery. | Your reference shelf. |
| Your bookmarked resources, ready when inspiration strikes. | Your bookmarked resources, kept on this device. |
| Make room for your next idea. | Your shelf is empty. |
| Build the future. Together. / Made for the curious. | A reference shelf for things that move. |
| The next breakthrough starts with a connection. | Keep your own reference shelf. |
| Bring your favorite tools and ideas into your personal collection. | Add a useful tool, paper, or project. It stays in this browser. |
| A small step for discovery. A giant leap for what's next. | Independent resources. Connected ideas. |
| Your personal ecosystem / Share your next discovery. | Add a resource. |
| Add a resource to this browser's collection. Your additions stay on this device. | Your additions and bookmarks stay on this device. |
| Open-source community | Community |
| A–Z | A to Z |

## Scope and limits

The SVG robot, CSS illustrations, decorative statuses, uppercase eyebrows, motivational text and generated avatar were removed. Their SVG gradient IDs `glow`, `metal` and `visor` were decorative only. No content assets are required to use the page.

Bookmarks and additions remain local to the browser, as before. This redesign does not introduce shared accounts, remote storage, data loading states or URL-persisted filters.

Before/after comparison: `.hallmark/compare.html` (local, ignored by Git).
