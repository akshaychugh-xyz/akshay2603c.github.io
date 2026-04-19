---
layout: default
title: side projects
permalink: /side-projects/
---

## Things I've built, with my bestie Claude Code 🧡

{% assign projects = site.data.projects | sort: 'date' | reverse %}
{% for project in projects %}
- <a href="{{ project.url }}" target="_blank" rel="noopener noreferrer">{{ project.name }}</a> <span style="float: right; color: var(--text-secondary);"><small>{{ project.date | date: "%d %b %Y" }}</small></span>
  <div style="color: var(--text-secondary);">{{ project.description }}</div>
{% endfor %}



