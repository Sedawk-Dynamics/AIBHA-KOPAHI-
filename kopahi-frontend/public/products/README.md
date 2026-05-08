# Product Images — Save Guide

Drop each uploaded image into this folder using the exact filename below.
The site references these paths — once the file is on disk, the page picks it
up immediately (no rebuild needed in dev).

## Required filenames (everything goes here, `kopahi-frontend/public/products/`)

| Filename | What's in the image | Used on |
|---|---|---|
| `assam-tea.jpg` | Two women carrying baskets in tea fields at sunset | Home (Featured · GI Agri), GI Tagged catalogue |
| `joha-rice.jpg` | White rice grains in clay pot | Home (Featured · GI Agri), GI Tagged catalogue |
| `karbi-anglong-ginger.jpg` | Ginger root with ginger powder bowl | Home (Featured · GI Agri), GI Tagged catalogue |
| `lychee.jpg` | Pink lychee fruits on a branch | Home (Featured · GI Agri), GI Tagged catalogue |
| `bhut-jolokia.jpg` | Red bowl with chillies (Naga / Bhut Jolokia) | Home (Featured · GI Agri), GI Tagged catalogue |
| `lakadong-turmeric.jpg` | Turmeric roots + bright orange powder, dark mood | Home (Featured · GI Agri), GI Tagged catalogue |
| `muga-silk-thread.jpg` | Spools of thread (brown, teal, orange, yellow) | Home (Featured · GI Agri), GI Tagged catalogue |
| `muga-silk-stole.jpg` | Linen stole with green embroidery on rod | Home (Featured · GI Crafts), GI Tagged catalogue |
| `cane-baskets.jpg` | Woven cane / bamboo baskets | Home (Featured · GI Crafts), GI Tagged catalogue |
| `purple-rice.jpg` | Pink/purple rice grains (close-up) | Home (Featured · Non-GI), Non-GI catalogue |
| `pepper-powder.jpg` | Red/orange powder in wooden bowl + peppercorns | Home (Featured · Non-GI), Non-GI catalogue |
| `black-cardamom.jpg` | Cardamom pods (close-up) | Home (Featured · Non-GI), Non-GI catalogue |
| `rose-tea.jpg` | Glass cup of red tea with rose petals | Home (Featured · Non-GI), Non-GI catalogue |
| `chamomile-tea.jpg` | Cup of chamomile tea with mint leaves | Home (Featured · Non-GI), Non-GI catalogue |
| `tea-garden.jpg` | Wide tea plantation with workers on terraces | Home hero video poster, About hero video poster, Farmer Stories hero |

## Optional — extra images you uploaded

These didn't have a 1:1 product match in the current catalogue. Save them
anyway if you'd like to use them later:

| Suggested filename | What's in the image | Possible future use |
|---|---|---|
| `turmeric-fresh.jpg` | Raw turmeric root pieces on banana leaf | Alt photo for Lakadong Turmeric |
| `black-rice.jpg` | Black rice grains close-up | If you re-add Black Rice as a product |

## How to save

1. Right-click each image → "Save image as…"
2. Save into `kopahi-frontend/public/products/` with the filename from the
   table above (lowercase, hyphenated, `.jpg`).
3. Refresh the page — Next.js serves anything in `/public/` at the root path.

## Where the image is referenced in code

- Home: `app/page.tsx` → `giAgri` / `giCrafts` / `nonGi` arrays
- GI Tagged catalogue: `app/products/gi-tagged/page.tsx` → `giProducts` array
- Non-GI catalogue: `app/products/non-gi-tagged/page.tsx` → `products` array
- Hero video posters: `app/page.tsx`, `app/about/page.tsx`, `app/about/farmers/page.tsx`
