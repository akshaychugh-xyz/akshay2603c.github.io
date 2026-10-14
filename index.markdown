---
layout: default
body_class: home
---

{% assign empty_array = "" | split: "," %}
{% assign writings_posts = empty_array %}
{% if site.categories.png %}{% assign writings_posts = writings_posts | concat: site.categories.png %}{% endif %}
{% if site.categories.fitness %}{% assign writings_posts = writings_posts | concat: site.categories.fitness %}{% endif %}
{% if site.categories.life %}{% assign writings_posts = writings_posts | concat: site.categories.life %}{% endif %}
{% if site.categories.web3 %}{% assign writings_posts = writings_posts | concat: site.categories.web3 %}{% endif %}
{% assign writings_posts = writings_posts | sort: 'date' | reverse %}

{% comment %}
  GitHub calendar: the SVG written daily by the "Update GitHub Contribution Chart"
  workflow is inlined at build time, so CSS can recolour it per theme. CSS shows
  only the newest 26 weeks and clips the rest.
{% endcomment %}
{% capture gh_svg %}{% include_relative assets/images/github-contributions.svg %}{% endcapture %}

<div class="home">

  <section class="home-tile home-intro" aria-label="Intro">
    <div class="home-intro-text">
      <div class="home-intro-wave" aria-hidden="true">&#x1F44B;</div>
      <h1 class="home-intro-name" data-handwriting="Hi, I am Akshay." data-handwriting-size="2.4rem" data-handwriting-duration="1.7">Hi, I am Akshay.</h1>
      <p class="home-intro-bio">Welcome to my little garden on the Internet! I currently lead Product for Coinbase India and am obsessed with Claude Code on the side.</p>
    </div>
    <a class="home-gh" href="https://github.com/akshaychugh-xyz" aria-label="GitHub profile">
      <span class="home-gh-head">
        <span class="home-gh-iykyk">proudest about, IYKYK :)</span>
        <span class="home-gh-link">GitHub &rarr;</span>
      </span>
      <span class="home-gh-cal" aria-hidden="true">{{ gh_svg }}</span>
    </a>
  </section>

  <div class="home-main">

    <section class="home-tile home-writing" aria-labelledby="home-writing-label">
      <div class="home-label">
        <h2 class="home-label-title" id="home-writing-label"><span class="bento-label-dot"></span>Writings</h2>
        <a href="{{ '/writings/' | relative_url }}" class="home-view-all">All &rarr;</a>
      </div>

      <div class="home-features">
        {% for post in writings_posts limit: 2 %}
        {% capture img %}{% include first-image.html post=post %}{% endcapture %}{% assign img = img | strip %}
        {% if post.categories[1] == "png" %}{% assign cat = "Product & growth" %}{% else %}{% assign cat = post.categories[1] | capitalize %}{% endif %}
        <a class="home-feature" href="{{ post.url | relative_url }}">
          {% if img != "" %}
          <img class="home-feature-img" src="{{ img }}" alt="" loading="lazy">
          {% else %}
          <span class="home-feature-img home-feature-img--blank" aria-hidden="true">{{ cat | downcase }}</span>
          {% endif %}
          <span class="home-kicker">{% if forloop.first %}Latest &middot; {% endif %}{{ cat }}</span>
          <span class="home-feature-title">{{ post.title }}</span>
          <span class="home-meta">{{ post.date | date: "%-d %b %Y" }}</span>
        </a>
        {% endfor %}
      </div>

      <ol class="home-posts">
        {% for post in writings_posts offset: 2 limit: 6 %}
        {% capture img %}{% include first-image.html post=post %}{% endcapture %}{% assign img = img | strip %}
        <li>
          <a class="home-post" href="{{ post.url | relative_url }}">
            <span class="home-post-text">
              <span class="home-post-title">{{ post.title }}{% if post.badge %} <span class="home-badge">{{ post.badge }}</span>{% endif %}</span>
              <span class="home-meta home-meta--mono">{{ post.date | date: "%b %Y" }}</span>
            </span>
            {% if img != "" %}<img class="home-post-thumb" src="{{ img }}" alt="" loading="lazy" onerror="this.remove()">{% endif %}
          </a>
        </li>
        {% endfor %}
      </ol>
    </section>

    <div class="home-side">

      {% assign tils = site.data.til | sort: 'date' | reverse %}
      <section class="home-tile home-til" aria-labelledby="home-til-label" data-til>
        <div class="home-label">
          <h2 class="home-label-title" id="home-til-label"><span class="bento-label-dot"></span>Today I learnt</h2>
          <span class="home-til-count" data-til-count>1 / {{ tils.size }}</span>
        </div>
        <ul class="home-til-list" aria-live="polite">
          {% for til in tils %}
          <li class="home-til-item"{% unless forloop.first %} hidden{% endunless %}>
            <div class="home-til-text">{{ til.title | markdownify | remove: '<p>' | remove: '</p>' }}</div>
            <div class="home-til-date">{{ til.date | date: "%b %-d, %Y" }}</div>
          </li>
          {% endfor %}
        </ul>
        <div class="home-til-actions">
          <button type="button" class="home-til-next" data-til-next hidden>Another one &#x21BB;</button>
          <a href="{{ '/til/' | relative_url }}" class="home-view-all">All &rarr;</a>
        </div>
      </section>

      {% assign projects = site.data.projects | sort: 'date' | reverse %}
      <section class="home-tile home-projects" aria-labelledby="home-projects-label">
        <div class="home-label">
          <h2 class="home-label-title" id="home-projects-label"><span class="bento-label-dot"></span>Side projects</h2>
          <a href="{{ '/side-projects/' | relative_url }}" class="home-view-all">All &rarr;</a>
        </div>
        <ul class="home-project-list">
          {% for project in projects %}
          <li>
            <a class="home-project" href="{{ project.url }}">
              <span class="home-project-icon" style="background: {{ project.color | default: '#6F6E69' }}" aria-hidden="true">
                {% if project.icon %}<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="{{ project.icon }}"/></svg>{% else %}{{ project.name | slice: 0 }}{% endif %}
              </span>
              <span class="home-project-text">
                <span class="home-project-head">
                  <span class="home-project-name">{{ project.name }}</span>
                  <span class="home-project-year">{{ project.date | date: "%Y" }}</span>
                </span>
                <span class="home-project-desc">{{ project.tagline | default: project.description }}</span>
              </span>
            </a>
          </li>
          {% endfor %}
        </ul>
      </section>

    </div>
  </div>

  <form class="home-subscribe" id="newsletter-form">
    <label for="newsletter-email">New posts in your inbox:</label>
    <span class="home-subscribe-field">
      <input type="email" id="newsletter-email" name="email" placeholder="your@email.com" required autocomplete="email">
      <button type="submit" id="newsletter-submit">Subscribe &rarr;</button>
    </span>
    <span class="hp-field" aria-hidden="true">
      <label for="newsletter-website">Leave this field empty</label>
      <input type="text" id="newsletter-website" name="website" tabindex="-1" autocomplete="off" value="">
    </span>
    <p class="form-message" id="form-message"></p>
  </form>

</div>
