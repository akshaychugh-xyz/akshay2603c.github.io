---
layout: default
title: book summaries
permalink: /books/
---

## A list of all my book summaries, starting 2022 Nov. 

> Disclaimer: These posts are mainly my reflections from the books that I have read (ideas that I found interesting, stuff that I know but need constant reminding etc.). 
> 
> Check out my [Goodreads profile](https://www.goodreads.com/user/show/47835814-akshay-chugh) for all my book recommendations (maintained since 2021 Jan).


<ul>
  {% for post in site.categories.books %}
    <li>
    	<a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small> <small> <i>({{ post.tags }})️</i></small>
    </li>
  {% endfor %}
</ul>
