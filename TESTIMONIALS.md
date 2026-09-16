# Restoring the testimonial section

The homepage currently shows a "We'd rather show you than quote ourselves" section instead of
testimonials. Swap it back for real quotes **only** when all three of these are true:

1. A **real client** — someone who actually paid you and got a result.
2. **Their actual words** — not a quote you wrote and they nodded at.
3. **Written permission** to publish their name, role and company.

Invented reviews are an unfair trade practice under India's consumer-review rules, and a prospect
who spots one stops believing everything else on the page. You sell marketing — being caught
faking social proof is the worst possible advertisement for your own service.

> **Why this file, and not an HTML comment:** it used to live commented out inside `index.html`.
> The block contained a nested `<!-- ... -->`, and because HTML comments cannot nest, the inner
> `-->` closed the outer comment early and the placeholder testimonial rendered on the live site.
> Markup belongs in a file, not inside a comment.

---

## The markup

Paste this in place of the current "Why Trust Us Yet" section in `index.html`. One `<figure>` per
client; the grid takes three across on desktop and stacks on mobile.

```html
<section class="section section--soft">
  <div class="container">
    <div class="sec-head reveal">
      <span class="eyebrow">Client Results</span>
      <h2>What our clients say</h2>
    </div>
    <div class="quotes reveal">

      <figure class="quote">
        <div class="stars" aria-label="5 out of 5">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.5 7L12 17.8 5.7 21.2l1.5-7L2 9.4l7-.8Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.5 7L12 17.8 5.7 21.2l1.5-7L2 9.4l7-.8Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.5 7L12 17.8 5.7 21.2l1.5-7L2 9.4l7-.8Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.5 7L12 17.8 5.7 21.2l1.5-7L2 9.4l7-.8Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.5 7L12 17.8 5.7 21.2l1.5-7L2 9.4l7-.8Z"/></svg>
        </div>
        <blockquote>THEIR ACTUAL WORDS, VERBATIM.</blockquote>
        <div class="result-pills"><span class="pill">A RESULT YOU CAN EVIDENCE</span></div>
        <figcaption>
          <span class="avatar">X</span>
          <span>
            <span class="who">THEIR NAME</span>
            <span class="role">THEIR ROLE, THEIR COMPANY</span>
          </span>
        </figcaption>
      </figure>

    </div>
  </div>
</section>
```

Notes:

- `.avatar` takes a single initial. Replace it with `<img src="assets/img/client-1.jpg" alt="Their name">`
  once you have a photo they've agreed you can use.
- The `.pill` should carry a figure you can evidence from GA4, Search Console or the ad account —
  not a round number you like the sound of.
- Star ratings imply a review actually took place. If nobody rated you, remove the `.stars` block.
- Fewer real quotes beat more invented ones. One genuine testimonial is worth three fake ones.
