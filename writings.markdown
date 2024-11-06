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
    <li style="margin-bottom: 0.5em;">
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span style="float: right; color: #888;">
        <small>{{ post.date | date_to_string }}</small>
        <small><i>(<a href="/writings/{{ post.categories[1] }}" style="color: #888;">{% if post.categories[1] == "png" %}product & growth{% else %}{{ post.categories[1] }}{% endif %}</a>)</i></small>
      </span>
    </li>
  {% endfor %}
</ul>

-----

#### Quicklinks:

- [product & growth](/writings/png)
- [web3](/writings/web3)
- [fitness](/writings/fitness)
- [just life in general](/writings/life)
