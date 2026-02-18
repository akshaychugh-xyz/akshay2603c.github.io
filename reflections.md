---
layout: default
title: notes
permalink: /notes/
---

<div class="nt-header">
<h2>Notes & Reflections</h2>
<p class="nt-subtitle">Reflections from books, articles, podcasts, and videos. Ideas that stuck, and things I need constant reminding of.</p>
</div>

<div class="nt-filters">
<button class="nt-filter active" onclick="filterNotes('all', this)">all</button>
<button class="nt-filter" onclick="filterNotes('books', this)">books</button>
<button class="nt-filter" onclick="filterNotes('non-books', this)">non-books</button>
</div>

<div class="nt-goodreads" data-tag="books">
<svg class="nt-goodreads-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M11.43 23.995c-3.608-.208-6.274-2.077-6.448-5.078.695.007 1.375-.013 2.07-.006.224 1.342 1.065 2.43 2.683 3.026 1.583.496 3.737.46 5.082-.174 1.351-.636 2.098-1.826 2.203-3.391.021-.375.017-.736.016-1.104v-1.53c-.667 1.11-1.373 1.847-2.436 2.334-.949.416-2.398.698-3.87.457-2.15-.352-3.463-1.551-4.318-3.12-.726-1.333-1.022-2.98-1.057-4.677-.036-1.7.26-3.458.985-4.823.822-1.585 2.12-2.794 4.31-3.186 1.483-.265 2.958-.012 3.912.418 1.047.474 1.728 1.122 2.474 2.282V.003h2.031v16.59c-.001.67.034 1.363-.025 2.09-.232 2.861-1.395 4.42-3.452 5.166-1.208.437-2.774.577-4.16.146zm2.065-6.424c.965-.39 1.59-1.09 2.05-1.905.484-.894.765-1.972.84-3.104.074-1.135-.04-2.282-.414-3.268-.376-.998-.922-1.847-1.794-2.394-.86-.558-1.956-.792-3.199-.603-1.232.15-2.105.78-2.705 1.592-.579.807-.922 1.824-1.058 2.879-.128 1.058-.05 2.165.262 3.132.317.979.81 1.858 1.616 2.446.823.601 1.875.862 3.066.812.435-.024.88-.11 1.336-.587z"/></svg>
<span>For all my book recs, check my <a href="https://www.goodreads.com/user/show/47835814-akshay-chugh" target="_blank" rel="noopener noreferrer">Goodreads profile</a> (maintained since Jan 2021).</span>
</div>

{% assign all_notes = "" | split: "," %}
{% if site.categories.books %}{% assign all_notes = all_notes | concat: site.categories.books %}{% endif %}
{% if site.categories.non-books %}{% assign all_notes = all_notes | concat: site.categories.non-books %}{% endif %}
{% assign all_notes = all_notes | sort: 'date' | reverse %}

{% assign current_year = "" %}
{% for post in all_notes %}
{% assign this_year = post.date | date: "%Y" %}
{% if this_year != current_year %}
{% if current_year != "" %}</div></div>{% endif %}
<div class="nt-year-group">
<div class="nt-year-label">{{ this_year }}</div>
<div class="nt-year-entries">
{% assign current_year = this_year %}
{% endif %}
<div class="nt-entry" data-tag="{{ post.categories[1] }}">
<div class="nt-entry-main">
<a href="{{ post.url }}" class="nt-entry-title">{{ post.title }}</a>
<div class="nt-entry-meta">
<span class="nt-entry-date">{{ post.date | date: "%-d %b" }}</span>
{% if post.categories[1] == "books" and post.tag %}
<span class="nt-entry-rating" title="{{ post.tag }}">
{% assign stars = post.tag | split: "-" | first | plus: 0 %}
{% for i in (1..5) %}{% if i <= stars %}<svg class="nt-star nt-star--filled" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="currentColor" stroke-width="1"/></svg>{% else %}<svg class="nt-star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" stroke-width="1"/></svg>{% endif %}{% endfor %}
</span>
{% endif %}
<span class="nt-entry-type">{{ post.categories[1] }}</span>
</div>
</div>
</div>
{% endfor %}
{% if current_year != "" %}</div></div>{% endif %}

<script>
function filterNotes(tag, btn) {
  document.querySelectorAll('.nt-filter').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.nt-entry').forEach(function(item) {
    if (tag === 'all' || item.dataset.tag === tag) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
  document.querySelectorAll('.nt-year-group').forEach(function(group) {
    var visibleItems = group.querySelectorAll('.nt-entry:not(.hidden)');
    group.classList.toggle('hidden', visibleItems.length === 0);
  });
  // Show/hide goodreads callout
  var gr = document.querySelector('.nt-goodreads');
  if (gr) {
    gr.classList.toggle('hidden', tag === 'non-books');
  }
}
</script>

