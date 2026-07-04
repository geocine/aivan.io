---
name: aivan-blog-cover-illustrations
description: Generate consistent hand-drawn illustrative cover images for aivan.io blog posts. Use when adding, replacing, or refreshing blog post cover art in this Astro project, especially for posts under content/blog/**/index.mdx that need topic-relevant non-generic images matching the current watercolor/ink technical illustration style.
---

# Aivan Blog Cover Illustrations

## Workflow

1. Read the full target blog post before prompting for an image. Extract the actual subject, audience, tools, workflow, pain points, and outcome.
2. Read [references/style-guide.md](references/style-guide.md) before generating or judging cover art.
3. Generate a wide hand-drawn illustration that communicates the post topic without literal brand-heavy UI screenshots.
4. Include subtle upper-half shadow/texture so the cover has depth when it sits across the blue header and white body boundary.
5. Reject generic covers. The image must include 3-5 visual cues that only make sense for that post.
6. Save the selected cover as `public/assets/covers/<post-slug>.webp`.
7. Update the post frontmatter `cover` to `/assets/covers/<post-slug>.webp`.
8. Verify locally that the image renders on the index card and the post page.

## Prompt Shape

Build prompts from the post summary, not only the title:

```text
Create a wide blog cover illustration for an engineering article about <specific post topic>.
Style: refined hand-drawn ink and watercolor illustration, clean white background, blue watercolor washes with small orange and green accents, crisp sketch lines, friendly but professional technical blog aesthetic.
Texture: subtle blue-gray shadow over roughly the upper half of the banner, faint edge/corner falloff, and light paper grain; keep the illustration bright and readable.
Composition: 1700:580 wide banner, centered readable scene, enough white margin, no text labels, no logos, no photorealism.
Include visual cues: <cue 1>, <cue 2>, <cue 3>, <cue 4>.
Avoid: cringe mascot art, stock illustration look, fake UI text, clutter, gradients, dark backgrounds, oversized logos, random abstract shapes unrelated to the article.
```

Use the current cover set as the style target:

- Dev.to API post: author desk, content cards, API connector, generated blog page.
- Gatsby/WordPress post: WordPress-like dashboard, data/API connector, generated page layout.
- Headless WordPress challenges post: fragmented UI panels, build/cache/API route problem-solving flow.
- Portfolio post: laptop/code/deploy flow, GitHub-style hosting and personal-site result.

## Image Processing

Use a high-resolution source when possible. Crop or resize to exactly `1700x580` for consistent card and post rendering. Prefer WebP around quality 88-92.

After resizing, add a subtle texture pass if the generated image is too flat:

- A blue-gray shadow wash over the upper 45-55% of the canvas, fading toward the center.
- Very soft side/corner falloff near the upper left and upper right edges.
- Faint paper grain in the shadowed half only.
- No heavy vignette, dark full overlay, or loss of the hand-drawn linework.

If using Pillow:

```python
from PIL import Image

src = Image.open(input_path).convert("RGB")
target = (1700, 580)
ratio = max(target[0] / src.width, target[1] / src.height)
resized = src.resize((round(src.width * ratio), round(src.height * ratio)), Image.Resampling.LANCZOS)
left = (resized.width - target[0]) // 2
top = (resized.height - target[1]) // 2
cropped = resized.crop((left, top, left + target[0], top + target[1]))
cropped.save(output_path, "WEBP", quality=90, method=6)
```

## Verification

Run `npm run build`.

With the dev server on `localhost:4321`, verify:

- The index page shows every published post with a cover.
- Each cover URL starts with `/assets/covers/`.
- Each loaded cover has natural dimensions `1700x580`.
- Card cover wrappers retain rounded clipped corners.
- The target post page uses the new cover and has no horizontal overflow.
