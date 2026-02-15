---
layout: default
title: writings
permalink: /writings/
---

## Fresh from the human brain, no AI used :)

<div class="wr-filters">
<button class="wr-filter active" onclick="filterWritings('all', this)">all</button>
<button class="wr-filter" onclick="filterWritings('png', this)">product & growth</button>
<button class="wr-filter" onclick="filterWritings('life', this)">life</button>
<button class="wr-filter" onclick="filterWritings('fitness', this)">fitness</button>
<button class="wr-filter" onclick="filterWritings('web3', this)">web3</button>
</div>

{% assign empty_array = "" | split: "," %}
{% assign all_posts = empty_array %}
{% if site.categories.png %}{% assign all_posts = all_posts | concat: site.categories.png %}{% endif %}
{% if site.categories.fitness %}{% assign all_posts = all_posts | concat: site.categories.fitness %}{% endif %}
{% if site.categories.life %}{% assign all_posts = all_posts | concat: site.categories.life %}{% endif %}
{% if site.categories.web3 %}{% assign all_posts = all_posts | concat: site.categories.web3 %}{% endif %}
{% assign all_posts = all_posts | sort: 'date' | reverse %}

{% assign current_year = "" %}
{% for post in all_posts %}
{% assign this_year = post.date | date: "%Y" %}
{% if this_year != current_year %}
{% if current_year != "" %}</ul></div>{% endif %}
<div class="wr-year-group">
<div class="wr-year-label">{{ this_year }}</div>
<ul class="wr-year-list">
{% assign current_year = this_year %}
{% endif %}
<li class="wr-year-item" data-tag="{{ post.categories[1] }}">
<a href="{{ post.url }}">{{ post.title }}</a>
<span class="wr-year-meta">
<span class="wr-year-date">{{ post.date | date: "%-d %b" }}</span>
<span class="wr-year-tag hide-on-mobile">{% if post.categories[1] == "png" %}product & growth{% else %}{{ post.categories[1] }}{% endif %}</span>
</span>
</li>
{% endfor %}
{% if current_year != "" %}</ul></div>{% endif %}

<script>
function filterWritings(tag, btn) {
  document.querySelectorAll('.wr-filter').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.wr-year-item').forEach(function(item) {
    if (tag === 'all' || item.dataset.tag === tag) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
  document.querySelectorAll('.wr-year-group').forEach(function(group) {
    var visibleItems = group.querySelectorAll('.wr-year-item:not(.hidden)');
    group.classList.toggle('hidden', visibleItems.length === 0);
  });
}
</script>
