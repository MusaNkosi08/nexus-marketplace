# NEXUS Preview Validation Notes

- The live storefront loaded at the managed preview URL with the required NEXUS wordmark, tagline, five visible collection cards, eight visible category options, and ten catalogue objects.
- Clicking the FOCUS collection filter changed the catalogue to 01 OBJECTS and showed only Sony WH-1000XM5.
- Entering Sony in the catalogue search field kept the result narrowed to the Sony object.
- Clicking the first product quick view opened the overlay; Add to Bag changed BAG 00 to BAG 01.
- Clicking the bag quantity increment changed BAG 01 to BAG 02 and updated the grouped quantity/subtotal display to R49 998.
- Clicking checkout while unauthenticated redirected to the Manus login page, confirming the protected checkout handoff. Authenticated Review → Confirm → Success cannot be exercised without an authenticated preview session.
- The /admin route displayed the unauthenticated administrator access gate.
- Direct navigation to /product/1 rendered the dedicated product detail page with related products and add-to-bag action.

- Starting from the unfiltered catalogue, selecting AUDIO through the native category selector changed THE CATALOGUE / 10 OBJECTS to THE CATALOGUE / 02 OBJECTS and displayed Sony WH-1000XM5 plus JBL Live 660NC.
- The previous unfiltered-state Sony search was separately exercised after returning to the full catalogue; the input changed to Sony and the rendered catalogue narrowed to the matching Sony result.

- After returning to the full catalogue showing 10 OBJECTS, setting the search field to Sony through the live browser event reduced the rendered state to THE CATALOGUE / 01 OBJECTS with only WH-1000XM5.
- The browser session is unauthenticated, so checkout correctly redirects to the Manus login page; the authenticated Review → Confirm → Success sequence is documented as requiring a logged-in preview session rather than being falsely claimed as exercised.
