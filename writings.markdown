---
layout: page
title: writings
permalink: /writings/
---

### Quicklinks:

- [product and growth](/writings/png)
- [web3](/writings/web3)
- [fitness](/writings/fitness)
- [just life in general](/writings/life)

## All articles:

#### A list of all my writings on product and growth. 

<ul>
  {% for post in site.categories.png %}
    <li>
    	<a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
    </li>
  {% endfor %}
</ul>

#### A list of all my writings on Web3. 

<ul>
  {% for post in site.categories./web3 %}
    <li>
    	<a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
    </li>
  {% endfor %}
</ul>

#### A list of all my writings on fitness. 

<ul>
  {% for post in site.categories.fitness %}
    <li>
    	<a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
    </li>
  {% endfor %}
</ul>

#### A list of all my writings on life in general. 

<ul>
  {% for post in site.categories.life %}
    <li>
    	<a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date_to_string }}</small>
    </li>
  {% endfor %}
</ul>
