---
layout: default
title: writings
permalink: /writings/
---

## Fresh from the human brain, no AI used :)
{: data-handwriting="Fresh from the human brain, no AI used :)" }

<div class="wr-filters">
<button class="wr-filter active" data-tag="all">all</button>
<button class="wr-filter" data-tag="png">product & growth</button>
<button class="wr-filter" data-tag="life">life</button>
<button class="wr-filter" data-tag="fitness">fitness</button>
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

{% raw %}
<script type="module">
  import { annotate } from "https://esm.sh/rough-notation@0.5.1";

  const accent = () =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-orange").trim() || "#DA702C";

  let currentAnno = null;
  function circleActive() {
    const active = document.querySelector('.wr-filter.active');
    if (!active) return;
    if (currentAnno) {
      currentAnno.remove();
      currentAnno = null;
    }
    currentAnno = annotate(active, {
      type: 'circle',
      color: accent(),
      strokeWidth: 2,
      padding: 5,
      iterations: 2,
      animationDuration: 380,
    });
    currentAnno.show();
  }

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
    circleActive();
  }

  document.querySelectorAll('.wr-filter').forEach((btn) => {
    btn.addEventListener('click', () => filterWritings(btn.dataset.tag, btn));
  });

  function safeRedraw() {
    if (currentAnno) { currentAnno.remove(); currentAnno = null; }
    circleActive();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(safeRedraw));
  } else {
    requestAnimationFrame(safeRedraw);
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(safeRedraw, 120);
  });
</script>
{% endraw %}
