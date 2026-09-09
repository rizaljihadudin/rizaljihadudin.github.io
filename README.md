# rizaljihadudin.github.io

Personal portfolio site. Static, plain HTML, CSS, and JavaScript served from GitHub Pages.

Live: https://rizaljihadudin.github.io

## Structure

```
index.html      markup and page shell (header, hero, grid, modal, lightbox)
constants.js    data: profile, socials, project list
app.js          grid rendering, pagination, detail modal, image lightbox
style.css       all styling
assets/images/projects/<slug>/1.png, 2.png, 3.png
```

## Running locally

Opening `index.html` in a browser is enough. If you need a server:

```bash
python -m http.server 8000
```

## Adding a project

1. Drop screenshots into `assets/images/projects/<slug>/` named `1.png`, `2.png`, `3.png`. The first image is used as the card cover.
2. Append an entry to the `PROJECTS` array in `constants.js`:

```js
{
    id: "<slug>",
    title: "Project Name",
    category: "Web App",
    summary: "One line, shown on the grid card.",
    description: [
        "Longer copy, shown in the modal. Multiple paragraphs allowed."
    ],
    stack: ["React JS", "tailwindcss"],
    url: "https://example.com",   // "-" for internal or non-public work
    ...media("<slug>")
}
```

`id` must match the image folder name — the `media()` helper builds the paths from it.

The grid renders `PAGE_SIZE` (default 9) projects per batch; the rest load via the Muat Lebih Banyak button or on scroll.
