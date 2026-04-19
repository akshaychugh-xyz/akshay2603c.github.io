---
layout: default
---

<div class="bento-grid">

  <div class="bento-tile bento-tile--intro">
    <div class="bento-intro-wave">&#x1F44B;</div>
    <div class="bento-intro-name">Hi, I am Akshay.</div>
    <div class="bento-intro-bio">Welcome to my little garden on the Internet! I currently lead Product for Coinbase India and am obsessed with Claude Code on the side.</div>
    <div class="bento-github-section">
      <div class="bento-label">
        <span class="bento-label-left">
          <span class="bento-label-dot"></span>
          Proudest about, IYKYK :)
        </span>
        <a href="https://github.com/akshaychugh-xyz" target="_blank" rel="noopener noreferrer" class="bento-view-all">GitHub &rarr;</a>
      </div>
      <img src="https://ghchart.rshah.org/2EA44E/akshaychugh-xyz" alt="GitHub contribution graph" class="bento-github-chart" />
    </div>
  </div>

  {% assign empty_array = "" | split: "," %}
  {% assign writings_posts = empty_array %}
  {% if site.categories.png %}{% assign writings_posts = writings_posts | concat: site.categories.png %}{% endif %}
  {% if site.categories.fitness %}{% assign writings_posts = writings_posts | concat: site.categories.fitness %}{% endif %}
  {% if site.categories.life %}{% assign writings_posts = writings_posts | concat: site.categories.life %}{% endif %}
  {% if site.categories.web3 %}{% assign writings_posts = writings_posts | concat: site.categories.web3 %}{% endif %}
  {% assign writings_posts = writings_posts | sort: 'date' | reverse %}

  <div class="bento-tile bento-tile--scroll">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Writings
      </span>
      <a href="/writings/" class="bento-view-all">View all &rarr;</a>
    </div>
    <ul class="bento-list bento-list--scroll">
      {% for post in writings_posts %}
      <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
        <div class="bento-item-date">{{ post.date | date: "%b %Y" }}</div>
      </li>
      {% endfor %}
    </ul>
  </div>

  <div class="bento-tile bento-tile--scroll">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Side Projects
      </span>
      <a href="/side-projects/" class="bento-view-all">View all &rarr;</a>
    </div>
    <ul class="bento-list bento-list--scroll">
      {% assign projects = site.data.projects | sort: 'date' | reverse %}
      {% for project in projects %}
      <li>
        <a href="{{ project.url }}" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
        <div class="bento-project-desc">{{ project.description }}</div>
      </li>
      {% endfor %}
    </ul>
  </div>

  <div class="bento-tile bento-tile--scroll">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Today I Learnt
      </span>
      <a href="/til/" class="bento-view-all">View all &rarr;</a>
    </div>
    <ul class="bento-list bento-list--scroll bento-list--scroll-sm">
      {% assign tils = site.data.til | sort: 'date' | reverse %}
      {% for til in tils %}
      <li>
        <div class="bento-til-text">{{ til.title | markdownify | remove: '<p>' | remove: '</p>' }}</div>
        <div class="bento-item-date">{{ til.date | date: "%b %-d, %Y" }}</div>
      </li>
      {% endfor %}
    </ul>
  </div>

  <div class="bento-tile bento-tile--subscribe">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Subscribe
      </span>
    </div>
    <div class="bento-subscribe-body">
    <div class="bento-subscribe-text">Get new posts delivered to your inbox. No spam, unsubscribe anytime.</div>
    <form class="bento-subscribe-form" id="newsletter-form">
      <input type="email" id="newsletter-email" name="email" placeholder="your@email.com" required autocomplete="email">
      <button type="submit" id="newsletter-submit">Subscribe</button>
    </form>
    <p class="form-message" id="form-message"></p>
    </div>
  </div>

</div>
