# Letter-by-letter masked reveal in Astro

## What this pattern does
- Reveals text character-by-character from left to right.
- Uses `IntersectionObserver`.
- Uses a stable mask wrapper as the observer target.
- Splits text into character spans with JavaScript.
- Adds `.is-visible` to the mask wrapper, not to each character individually.

## Key lesson
- Do not observe the hidden or moving character spans.
- Observe the stable visible mask wrapper.

If the observer watches the translated/clipped characters themselves, they can report `isIntersecting: false` and never trigger the reveal reliably.

## Astro-specific lesson
- Dynamically injected spans do not receive Astro’s scoped CSS attribute.
- Character span styles must therefore use `:global(...)`.

Without `:global(...)`, the JavaScript-injected spans can exist in the DOM but never pick up their intended hidden/reveal styles.

## Final settings used
- `translateY: 5px`
- `blur: 1.5px`
- `transition duration: 0.26s`
- `stagger: 12ms`
- `delay before reveal: 180ms`
- Double `requestAnimationFrame()` before adding `.is-visible`

## Example pattern

### Markup
```html
<div class="clinical-workflow-reveal-mask">
  <p class="clinical-workflow-reveal-text js-clinical-workflow-reveal">
    EndoTech NZ Clinical Workflow
  </p>
</div>
```

### CSS
```css
.clinical-workflow-reveal-mask {
  display: block;
  overflow: hidden;
}

.clinical-workflow-reveal-text {
  white-space: nowrap;
}

:global(.clinical-workflow-reveal-char) {
  display: inline-block;
  opacity: 0;
  transform: translateY(5px);
  filter: blur(1.5px);
  transition:
    opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.26s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.26s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--char-index) * 12ms);
  will-change: opacity, transform, filter;
}

:global(.clinical-workflow-reveal-mask.is-visible .clinical-workflow-reveal-char) {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
```

### JavaScript
```html
<script>
  const mask = document.querySelector('.clinical-workflow-reveal-mask');
  const text = document.querySelector('.js-clinical-workflow-reveal');

  if (mask && text) {
    const originalText = 'EndoTech NZ Clinical Workflow';

    text.setAttribute('aria-label', originalText);
    text.innerHTML = Array.from(originalText)
      .map((char, index) => {
        const safeChar = char === ' ' ? '&nbsp;' : char;
        return `<span class="clinical-workflow-reveal-char" aria-hidden="true" style="--char-index:${index}">${safeChar}</span>`;
      })
      .join('');

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  mask.classList.add('is-visible');
                });
              });
            }, 180);

            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    observer.observe(mask);
  }
</script>
```
