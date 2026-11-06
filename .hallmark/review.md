# EmbodyStar technical shop, Hallmark redesign

The user rejected the previous marketing-style shopping page and chose: “Technical shop: clear specs, strong type, hardware photos.” This full redesign follows the Hallmark skill at https://github.com/Nutlope/hallmark, preserving the local Hanken Grotesk face, green brand accent, catalog facts, routes and shopping logic.

## Result

The catalog now leads the page. Product names, prices and specifications are arranged in ruled rows beside a hardware reference offer. The large forest hero, slogan bands, decorative status dots, tracked uppercase labels, tiny copy, image hover transforms and drawn product illustrations have been removed. The existing shopping controls remain.

Actual SKU photographs are unavailable. The LeRobot picture and the two additional openly licensed hardware photographs are explicitly labeled as reference images. The five products without appropriate reference photography show their existing specifications. No product facts, prices, stock or new sales claims were invented for the redesign.

## Verification

- Before: 143 static Floor findings, 130 Reflex findings and 7 warnings. Baseline inventory recorded before changes.
- After: 0 Floor failures, 0 open Reflex findings and 0 warnings in the full rendered Hallmark sweep. Three guarded exceptions remain: 39b for full-area product preview controls and compact cart steppers, 44c for the catalog's compact Banner opening, and 59 for commerce spacing. The short catalog anatomy warning was dismissed rather than adding filler sections.
- Kept audit: 2/2 original links, all real form controls and 33/33 handlers. The parser records component `name` attributes as fields; its `arrow` record was intentionally removed with the decorative suffix icons for gate 63 and is recorded in the CSS stamp. Existing repository tests were not edited.
- Build and static generation, TypeScript, ESLint and the existing test suite pass.
- Chromium checks pass for search, categories, price and alphabetic sorting, saved products and persistence, product details, Escape dismissal, cart quantities, shipping totals, removal and demo checkout. No broken images or uncaught browser errors were observed.
- No document overflow or overlapping specification columns at 320, 375, 390, 768, 1024, 1280, 1440 or 1920 pixels.
- The hero action fits within the 1280 × 800 viewport. The container stays capped at wide sizes.

The original dev server was unresponsive. Browser checks used an isolated copy of the exact app files under a temporary directory, with the same installed dependencies. The before screenshots use the saved pre-redesign HTML with the original commit's stylesheet and embedded original assets; they are a visual baseline, not an interactive before test.

## Independent reviews

- Hero review: `fix`. One Finish finding: the large photo showed too much tabletop. Resolved with a wider, tighter hardware crop.
- Finish review: `fix`. A Floor finding about decorative action-arrow suffixes was resolved by removing those icons without changing their handlers. A Finish finding about clipped phone filters was resolved with a two-column filter group.
- Scoring round: the reviewer confirmed both finish findings resolved.
- Tradeoff noted by the reviewer: the old grid exposed the eight-item range faster; the new specification index makes comparisons clearer and takes more scrolling.

## Artifacts

- Comparison: `.hallmark/compare.html`
- Desktop: `.hallmark/current/technical-shop-home-desktop.png`
- Phone: `.hallmark/current/technical-shop-home-phone.png`
- Before: `.hallmark/before/shopping-before-home-desktop.png` and `shopping-before-home-phone.png`

Screenshots and the comparison are local, ignored artifacts. The tracked review and log record the final state.

## Copy changes

Copy gates 19, 54, 63 and 67 required replacing generic slogans and decorative labels. Catalog descriptions, specifications, prices and inventory remain unchanged. Existing payment and order disclaimers retain their meaning: checkout remains a local demo and sends no order or payment.

| Before | After |
| --- | --- |
| A little curiosity. A world of possibility. | Robot kits, components & accessories |
| Demo storefront · USD | Demo storefront in USD |
| For the makers of tomorrow | Removed eyebrow |
| Good ideas. Real-world possibilities. | Robotics for the workbench. |
| Meet your next project. Thoughtfully chosen robot kits, clever components, and tools to bring a little imagination to life. | Desktop robotics and parts for your next build. |
| Find your next build (opening action) | Shop all products |
| Less scrolling. More making.; 01 / 01 | Removed decorative slogans and counter |
| The maker’s edit; Vol. 01, robotics | Removed tracked-capital decoration |
| A small start. Something extraordinary. | Orbit desktop arm, with its existing price and first two specifications |
| Explore the robot kits collection | Shop kits |
| Curated for curiosity; Every build starts somewhere | Removed generic benefit strip; category information remains in filters and product rows |
| From first kit to next idea; Parts that open up possibilities | Removed generic benefit strip |
| A shelf of your own; Save what inspires your next project | Removed generic benefit strip; saving controls remain |
| The workbench collection; Small parts. Big possibilities. | The catalog |
| Your saved finds. | Saved products |
| Fresh on the workbench. | New arrivals |
| A few good things for your next great idea. Explore our illustrative demo collection. | Compare specifications. Choose a part. |
| Find something for your next build… | Search products or components |
| finds to explore | products |
| Name: A–Z | Name: A to Z |
| A place for your next favorite. | No saved products |
| No finds just yet. | No matching products |
| The starting point; Just landed; Maker essential; Back soon | Removed marketing badges; product identities and stock states remain |
| Built around possibility; For the “what if” people. | About EmbodyStar |
| The curious ones. The tinkerers. The just-getting-started. There’s a little maker in all of us. | A demo shop for robot kits, components and workbench tools. |
| A little about us | About the shop |
| Make something that moves you. | Robot kits & components. |
| Designed for curious minds. | EmbodyStar demo shop |
| Image credits with arrow suffix | LeRobot image credits |
| Illustrative product render | Hardware reference captions where a photograph exists |
| USD · Demo price | USD, demo price |
| Saved to your finds | Saved product |
| Save for another day | Save for later |
| A little possibility, bagged | Removed decorative eyebrow |
| One last look. | Review demo order |
| Your shopping bag. | Your shopping bag |
| A good idea is taking shape. | Your selected products and quantities. |
| Demo checkout · No payment required | Demo checkout. No payment required. |
| Good things are waiting. | Your bag is empty |
| Your bag is empty. Find a little something for your next big idea. | Add a robot kit or component to start a demo order. |
| A little practice run | Removed eyebrow |
| That’s a wrap. | Demo order complete |
| Your next real-world idea is still waiting. | Your shopping bag has been cleared. |
| Hello, curious mind.; Ideas deserve a little momentum. | About EmbodyStar |
| Demo-shop “what if” story | A plain description of browsing, comparing specifications and saving products |
| Illustrative products, renders, prices, and inventory | Illustrative products, prices, and inventory; reference photographs are described separately |
| Curious Possibilities in metadata and Markdown | Robot Kits & Components |

The unsupported registered-trademark mark, decorative emoji, badges, colored heading fragment and arrow suffixes were removed. No route or component file was deleted.

## Material to replace

| Reference area | Current presentation | Useful replacement |
| --- | --- | --- |
| Featured arm | 280px desktop frame; 240px phone frame; tightly cropped LeRobot reference | A landscape photograph of the actual arm kit, at least 1600px wide |
| Arm, control board and toolkit rows | 120px reference area with 88px photograph | Actual SKU photos with consistent lighting and a neutral background |
| Five specification covers | Existing product specifications in type | Verified photographs of the rover, camera, gripper, servos and sensors |

Actual SKU photography would provide the largest next improvement. Demo checkout, browser-local storage and the absence of real order/payment services remain unchanged.
