---
layout: default
title: writings
permalink: /writings/
---
## All articles

<ul>
  {% assign empty_array = "" | split: "," %}
  {% assign all_posts = empty_array %}
  {% if site.categories.png %}{% assign all_posts = all_posts | concat: site.categories.png %}{% endif %}
  {% if site.categories.fitness %}{% assign all_posts = all_posts | concat: site.categories.fitness %}{% endif %}
  {% if site.categories.life %}{% assign all_posts = all_posts | concat: site.categories.life %}{% endif %}
  {% if site.categories.web3 %}{% assign all_posts = all_posts | concat: site.categories.web3 %}{% endif %}
  {% assign all_posts = all_posts | sort: 'date' | reverse %}
  {% for post in all_posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
      <small><i>(<a href="/writings/{{ post.categories[1] }}">{% if post.categories[1] == "png" %}product & growth{% else %}{{ post.categories[1] }}{% endif %}</a>)</i></small>
    </li>
  {% endfor %}
</ul>

-----

#### Quicklinks:

- [product & growth](/writings/png)
- [web3](/writings/web3)
- [fitness](/writings/fitness)
- [just life in general](/writings/life)
