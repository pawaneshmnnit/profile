# Setup & Upload Guide

This zip is a complete static site. No build step. GitHub Pages serves it as-is.

## 1. What's inside

```
index.html      ← the whole page (About · News · Research · Contact)
css/style.css   ← styles + light/dark theme
js/main.js      ← theme toggle, mobile menu, BibTeX copy
README.md       ← repo readme
SETUP.md        ← this file (you can delete after setup)
```

## 2. IMPORTANT — add your profile photo

The page expects a photo named **`pic2.jpg`** in the repo root.
This zip does NOT include it (so it can't overwrite the one you already have).

- If your repo already has `pic2.jpg`, keep it — nothing to do.
- Otherwise, add a square photo (~440×440 px works well) named exactly `pic2.jpg`
  next to `index.html`.

## 3. Clean up the old repo

Your old repo has a lot of leftover portfolio files. After backing up anything
you want to keep, you can delete these (they are NOT used by the new site):

```
admin-2023rcs04.html
certificate.html
csed_phd_scholar.html
portfolio.html
app.js
site-data.json
site-loader.js
click.jpg
insta.jpg
noimage.png
pkt.png
pkimg.png
profile.png
profile.jpg
py.jpg
MNNIT.png
certificate/      (folder)
fonts/            (folder)
images/           (folder)   ← unless a file here is your photo
sass/             (folder)
src/              (folder)
```

Keep: `pic2.jpg` (your photo). Everything in this zip replaces the old
`index.html`, `css/`, `js/`, and `README.md`.

If you use the command line:

```bash
git rm -r admin-2023rcs04.html certificate.html csed_phd_scholar.html \
  portfolio.html app.js site-data.json site-loader.js \
  click.jpg insta.jpg noimage.png pkt.png pkimg.png profile.png profile.jpg py.jpg MNNIT.png \
  certificate fonts images sass src
```

## 4. Upload / commit

**Web (easiest):**
1. Open your repo on GitHub → **Add file ▸ Upload files**.
2. Drag in `index.html`, the `css` folder, and the `js` folder (and `README.md`).
3. Make sure `pic2.jpg` is present in the repo root.
4. Commit to the `main` branch.

**Command line:**
```bash
# from inside your cloned repo, after copying these files in
git add index.html css js README.md pic2.jpg
git commit -m "Rebuild site: clean researcher layout"
git push
```

## 5. Check it live

GitHub Pages will redeploy in a minute or two:
https://pawaneshmnnit.github.io/profile/

## Editing later

- **New publication:** duplicate an `<article class="pub">…</article>` block in
  `index.html`, then edit the title/authors/venue/links and the `<pre class="pub__bib">`.
- **New news item:** duplicate a `<li class="news__item">…</li>` block.
- **Colours/fonts:** edit the CSS variables at the top of `css/style.css`.
