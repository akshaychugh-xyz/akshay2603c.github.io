---
layout: default
title: til
permalink: /til/
---

<div class="til-header">
<h2>A running log of (small) things I learnt!</h2>
<button class="til-toggle" onclick="toggleAllTil(this)"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg> expand all</button>
</div>

<script>
function toggleAllTil(el) {
  var details = document.querySelectorAll('.til-tl-entry details');
  var expanding = el.textContent.trim().includes('expand');
  details.forEach(function(d) { d.open = expanding; });
  el.querySelector('svg').style.transform = expanding ? 'rotate(180deg)' : '';
  el.lastChild.textContent = expanding ? ' collapse all' : ' expand all';
}
</script>

{% assign current_month = "" %}
{% for til in site.data.til %}
{% assign this_month = til.date | date: "%B %Y" %}
{% if this_month != current_month %}
{% if current_month != "" %}</div></div>{% endif %}
<div class="til-month-group">
<div class="til-month-label">{{ this_month }}</div>
<div class="til-timeline">
{% assign current_month = this_month %}
{% endif %}

<div class="til-tl-entry">
<div class="til-tl-day">{{ til.date | date: "%-d" }}{% assign d = til.date | date: "%-d" | plus: 0 %}{% assign m = d | modulo: 10 %}{% if d == 11 or d == 12 or d == 13 %}th{% elsif m == 1 %}st{% elsif m == 2 %}nd{% elsif m == 3 %}rd{% else %}th{% endif %}</div>
{% if til.details %}
<details>
<summary>{{ til.title | markdownify | remove: '<p>' | remove: '</p>' }} <span class="til-tl-hint">&#9656;</span></summary>
<div class="til-tl-body">
{{ til.details | markdownify }}
</div>
</details>
{% else %}
<div class="til-tl-content">{{ til.title | markdownify | remove: '<p>' | remove: '</p>' }}</div>
{% endif %}
</div>

{% endfor %}
{% if current_month != "" %}</div></div>{% endif %}
