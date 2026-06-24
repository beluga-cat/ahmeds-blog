# Ahmed's Blog

A tech blog built with Astro featuring guides on backups, virtualization, cloud, monitoring, and more.

## Features

- Dark mode with orange accents
- Markdown-based blog posts with frontmatter
- 9 categories: Backups, Virtualization, Cloud, Monitoring, Networking, Security, Automation, Windows Server, Linux
- Static site generation (fast, SEO-friendly)
- Fully responsive design
- Category filtering

## Tech Stack

- **Framework**: Astro 4.x
- **Styling**: CSS (no external frameworks)
- **Content**: Markdown with frontmatter
- **Build**: Static HTML output

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd ahmeds-blog
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:4321` in your browser.

### Build for Production

```bash
npm run build
```

The static site will be generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Structure

```
ahmeds-blog/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── BlogCard.astro
│   ├── content/
│   │   ├── config.ts     # Content schema
│   │   └── blog/         # Blog posts (Markdown)
│   ├── layouts/          # Page layouts
│   │   ├── BaseLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages/            # Routes
│   │   ├── index.astro           # Homepage
│   │   ├── blog/[slug].astro     # Individual posts
│   │   └── categories/[category].astro  # Category pages
│   └── styles/
│       └── global.css    # Global styles
├── public/               # Static assets
└── package.json
```

## Adding a New Blog Post

Create a new Markdown file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
pubDate: 2026-06-22
description: "Brief description of the post"
category: "Backups"
tags: ["tag1", "tag2"]
author: "Ahmed"
---

Your content here...
```

### Available Categories

- Backups
- Virtualization
- Cloud
- Monitoring
- Networking
- Security
- Automation
- Windows Server
- Linux

## Deployment

### Azure Static Web Apps

1. Push to GitHub (private repo)
2. Create Azure Static Web App
3. Connect to your GitHub repository
4. Configure build settings:
   - **App location**: `/`
   - **Output location**: `dist`
   - **Build command**: `npm run build`

### Manual Deployment

1. Run `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Configure your web server to serve `index.html` for all routes

## Customization

### Change Colors

Edit `src/styles/global.css`:

```css
:root {
  --accent: #ff6b35;        /* Primary accent color */
  --accent-hover: #ff8555;  /* Hover state */
  --bg-primary: #0a0a0a;    /* Main background */
  --bg-secondary: #1a1a1a;  /* Card backgrounds */
}
```

### Update Site Metadata

Edit `src/layouts/BaseLayout.astro` and `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
});
```

### Add/Remove Categories

Edit the schema in `src/content/config.ts` and update the dropdown in `src/components/Header.astro`.

## Author

Ahmed - ahmedamin1024@gmail.com

## Dev Notes

This is my primary IT lab notebook and portfolio. I'm treating it as a living project: the first release covers Azure, VMware, Veeam, and observability, and I intend to keep expanding it into a full certification and design walkthrough library.

Things I want to add next:
- Search and tag-based filtering
- Image diagrams and lab screenshots inline
- Content-related syntax highlighting tuned for YAML/Bicep/PowerShell
- Maybe a local “lab status” section that reflects what I'm currently studying

If you're reading this and have ideas, feel free to open an issue or PR.
