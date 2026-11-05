# EmbodyStar current design

This design supersedes the earlier slate Almanac treatment following the user's request for a more beautiful portal. The user-facing surface is now warm off-white with forest green, a restrained lime primary action, rounded white resource cards, and a locally hosted robotics photo.

## Design

- Keep the existing sidebar, destinations, resource data, search, sort, filters, local bookmarks, additions, and detail dialogs.
- Use a dark forest feature panel with a real LeRobot demo still; source, derivative notice, and license are in `public/images/ATTRIBUTION.md`.
- Replace the ruled index with a three-column resource grid on desktop, two columns at intermediate sizes, and one column on phones.
- Give category icons distinct soft color treatments. These are category symbols, not project or organization logos.
- Keep Hanken Grotesk local. No remote font, image, or API request is needed to render the page.
- Retain deterministic prerendering: read the current year only after hydration.

## Verification

- Production build and static page generation pass.
- ESLint and TypeScript pass.
- Chromium interaction checks pass for search, category filters, alphabetical sort, bookmarks, bookmark persistence, native form validation, local resource additions and persistence, resource detail links, Escape dismissal, and mobile navigation.
- No horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1440, or 1920 pixels in the tested flows.
- No uncaught browser errors.
- The locally hosted hero image loads at desktop and mobile sizes.
- Desktop and mobile screenshots reviewed at `.hallmark/current/desktop.png` and `.hallmark/current/mobile.png` (local artifacts, ignored by Git).

Hallmark's earlier Almanac-specific clean report and review apply to the previous design, not this redesign. The new direction follows the user's visual feedback rather than treating the theme's rules as the objective.

## Limits

Bookmarks and added resources remain browser-local. There are no new shared accounts or remote data services.
