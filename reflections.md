---
layout: default
title: reflections
permalink: /reflections/
---

## My reflections on things I've consumed

> Disclaimer: These posts are mainly my reflections from important books and non-books (articles/podcasts/videos etc). 
> 
> Ideas that I found interesting, stuff that I know but need constant reminding etc.



### Books

Check out my [Goodreads profile](https://www.goodreads.com/user/show/47835814-akshay-chugh) for all my book recommendations (maintained since 2021 Jan).

<ul>
  {% for post in site.categories.books %}
    <li>
    	<a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small> <small> <i>({{ post.tags }})️</i></small>
    </li>
  {% endfor %}
</ul>

### Non-Books

<ul>
  {% for post in site.categories.non-books %}
    <li>
    	<a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
    </li>
  {% endfor %}
</ul>


