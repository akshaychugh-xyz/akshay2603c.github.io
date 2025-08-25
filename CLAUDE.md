# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Jekyll-based personal website and blog hosted on GitHub Pages for Akshay Chugh (akshaychugh.xyz). The site uses the Minima theme with extensive custom styling and features a dark/light mode toggle.

## Development Commands

### Local Development
```bash
# Install dependencies
bundle install

# Start the local development server
bundle exec jekyll serve

# The site will be available at http://127.0.0.1:4000/
```

### Building
```bash
# Build the site (output goes to _site/)
bundle exec jekyll build
```

## Architecture & Structure

### Key Directories
- `_posts/` - Blog posts in Markdown format with YAML frontmatter
- `_layouts/` - HTML templates (primarily `default.html`)
- `_includes/` - Reusable HTML components (`header.html`, `footer.html`)
- `assets/` - Static assets (CSS, JavaScript, images)
- `_site/` - Generated site output (auto-generated, don't edit)

### Content Organization
- **Posts**: Organized by date (YYYY-MM-DD-title.md) with categories like `writings`, `life`, `png`
- **Pages**: Root-level markdown files for main sections (books.md, writings.markdown, side-projects.markdown, uses-this.md)
- **Permalinks**: Custom URLs defined in frontmatter (e.g., `/writings/life/difficult-yet-simple`)

### Theme System
- Uses Flexoki color palette with CSS custom properties
- Supports both light and dark modes with system preference detection
- Theme persistence via localStorage
- Responsive design with mobile hamburger menu

### Custom Components
- **Dark mode toggle**: SVG-based sun/moon icons in header
- **Mobile navigation**: Collapsible hamburger menu for screens <600px
- **Custom styling**: Extensive CSS overrides in `assets/css/typewriter.css`
- **JavaScript functionality**: Theme switching and mobile menu in `assets/js/script.js`

## Content Guidelines

### Blog Post Format
```yaml
---
layout: default
title: "Post Title"
permalink: /writings/category/title
categories: [writings, category]
image: /assets/images/category/image.png  # optional
---

<small>{{ page.date | date_to_string }}</small>
# Post Title

Content here...
```

### Categories
- `writings` - Main blog posts
  - `life` - Personal reflections
  - `png` - Business/startup analysis posts
- `books` - Book reviews/notes
- `fitness` - Health and fitness content

### Image Management
- Store images in `assets/images/` with descriptive names
- Use PNG format for screenshots and diagrams
- Organize by category/topic when possible

## Jekyll Configuration
- Uses GitHub Pages gem for compatibility
- Plugins: jekyll-feed, jekyll-seo-tag
- Theme: minima (heavily customized)
- Site variables defined in `_config.yml`

## Deployment
The site auto-deploys via GitHub Pages when changes are pushed to the main branch. No manual deployment steps required.