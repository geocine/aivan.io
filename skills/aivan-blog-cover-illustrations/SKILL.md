---
name: aivan-blog-cover-illustrations
description: Generate and deploy consistent hand-drawn illustrative cover images for aivan.io blog posts. Use when adding, replacing, or refreshing blog post cover art in this Astro project, especially for posts under content/blog/**/index.mdx that need topic-relevant non-generic images matching the current watercolor/ink technical illustration style and should be published through the separate D:\PL\aivan-assets CDN repository.
---

# Aivan Blog Cover Illustrations

## Workflow

1. Read the full target blog post before prompting for an image. Extract the actual subject, audience, tools, workflow, pain points, and outcome.
2. Read [references/style-guide.md](references/style-guide.md) before generating or judging cover art.
3. Generate a wide hand-drawn illustration that communicates the post topic without literal brand-heavy UI screenshots.
4. Include subtle upper-half shadow/texture so the cover has depth when it sits across the blue header and white body boundary.
5. Reject generic covers. The image must include 3-5 visual cues that only make sense for that post.
6. Save work-in-progress preview images under `tmp/covers/<post-slug>/` in this repo. This directory is for local debugging only and must stay ignored.
7. For local preview before CDN upload, temporarily point the post frontmatter to `/tmp/covers/<post-slug>/cover.webp`.
8. When the cover is approved, copy the final optimized WebP into the assets repository as `D:\PL\aivan-assets\www\<post-slug>\cover.webp`.
9. Before committing the site repo, update the post frontmatter to `https://cdn.aivan.io/<post-slug>/cover.webp` and remove any local `/tmp/covers/...` references.
10. Verify locally that the image renders on the index card and the post page.

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

## Local Debug Previews

Use `tmp/covers/` in this site repository for generated images while iterating. This path is intentionally ignored by Git and should not be committed.

Expected local preview layout:

```text
D:\PL\aivan.io\
└── tmp\
    └── covers\
        └── <post-slug>\
            ├── source.png
            └── cover.webp
```

During local iteration only, frontmatter may temporarily use:

```yaml
cover: '/tmp/covers/<post-slug>/cover.webp'
```

Do not leave that value in committed posts. Before committing, replace it with:

```yaml
cover: 'https://cdn.aivan.io/<post-slug>/cover.webp'
```

This local debug path exists only so future agents can see and test the image before uploading it to the CDN repository.

## Asset Repository Deployment

Use `D:\PL\aivan-assets` as the source of truth for blog cover images that should deploy through `cdn.aivan.io`.

Expected layout:

```text
D:\PL\aivan-assets\
└── www\
    └── <post-slug>\
        └── cover.webp
```

For a post at `content/blog/migrating-gatsby-5-to-astrojs/index.mdx`, save the cover at:

```text
D:\PL\aivan-assets\www\migrating-gatsby-5-to-astrojs\cover.webp
```

Then set frontmatter in the blog post:

```yaml
cover: 'https://cdn.aivan.io/migrating-gatsby-5-to-astrojs/cover.webp'
```

If the assets repository is a Git checkout and Git reports dubious ownership, do not change global Git config silently. Tell the user Git needs `D:\PL\aivan-assets` added as a safe directory before status/commit operations can run.

When writing to the assets repository from another workspace, create the slug directory if needed and copy the final optimized WebP there. Do not delete existing assets in the same slug folder unless the user explicitly asks.

After copying to `D:\PL\aivan-assets`, verify the file exists and has the expected dimensions/size. Git operations in `D:\PL\aivan-assets` may need safe-directory setup because the repo can be owned by the normal Windows user while Codex runs as a sandbox user.

## Verification

Run `npm run build`.

With the dev server on `localhost:4321`, verify:

- The index page shows every published post with a cover.
- During iteration, the temporary `/tmp/covers/<post-slug>/cover.webp` cover renders correctly.
- Before commit/deploy, the cover URL is `https://cdn.aivan.io/<post-slug>/cover.webp`.
- No committed file references `/tmp/covers/` or `/assets/covers/`.
- Each loaded cover has natural dimensions `1700x580`.
- Card cover wrappers retain rounded clipped corners.
- The target post page uses the new cover and has no horizontal overflow.
