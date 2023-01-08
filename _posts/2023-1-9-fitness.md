---
layout: page
title: fitness writings
permalink: /writings/fitness
---

#### A list of all my writings on fitness. 

<ul>
  {% for post in site.categories.fitness %}
    <li>
    	<a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
    </li>
  {% endfor %}
</ul>
