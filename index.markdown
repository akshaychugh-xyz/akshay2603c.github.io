---
layout: default
---

<div class="bento-grid">

  <div class="bento-tile bento-tile--intro">
    <div class="bento-intro-wave">&#x1F44B;</div>
    <div class="bento-intro-name">Hi, I am Akshay.</div>
    <div class="bento-intro-bio">Welcome to my little garden on the Internet! I currently lead Product for Coinbase India and am obsessed with Claude Code on the side.</div>
  </div>

  <div class="bento-tile">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Recent Writings
      </span>
      <a href="/writings/" class="bento-view-all">View all &rarr;</a>
    </div>
    <ul class="bento-list">
      <li>
        <a href="/writings/life/you-are-average-but-so-are-your-problems">You are average, but so are your problems</a>
        <div class="bento-item-date">Feb 2026</div>
      </li>
      <li>
        <a href="/writings/png/how-to-level-up-with-claude-code">How to level up with Claude Code</a>
        <div class="bento-item-date">Jan 2026</div>
      </li>
      <li>
        <a href="/writings/png/instapaper">How I fixed a (small) bug in an app I use daily</a>
        <div class="bento-item-date">Jan 2026</div>
      </li>
      <li>
        <a href="/writings/life/scratch-your-itches">Scratch your own itches with Claude Code</a>
        <div class="bento-item-date">Aug 2025</div>
      </li>
      <li>
        <a href="/writings/life/difficult-yet-simple">Difficult yet Simple</a>
        <div class="bento-item-date">Aug 2025</div>
      </li>
    </ul>
  </div>

  <div class="bento-tile">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Side Projects
      </span>
      <a href="/side-projects/" class="bento-view-all">View all &rarr;</a>
    </div>
    <ul class="bento-list">
      <li>
        <a href="https://fourplay.fun" target="_blank" rel="noopener noreferrer">FourPlay</a>
        <div class="bento-project-desc">Wordle meets numbers - multiplayer guessing game, specially fun for couples :).</div>
      </li>
      <li>
        <a href="https://blunderbuddy.pro/" target="_blank" rel="noopener noreferrer">BlunderBuddy</a>
        <div class="bento-project-desc">AI-powered personalized chess insights that actually make sense.</div>
      </li>
      <li>
        <a href="https://simpleeval.com/" target="_blank" rel="noopener noreferrer">Simple Eval</a>
        <div class="bento-project-desc">Connect your vibecoded app & get auto-suggest evals to improve performance.</div>
      </li>
    </ul>
  </div>

  <div class="bento-tile">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Recent TILs
      </span>
      <a href="/til/" class="bento-view-all">View all &rarr;</a>
    </div>
    <ul class="bento-list">
      {% for til in site.data.til limit:2 %}
      <li>
        <div class="bento-til-text">{{ til.title | markdownify | remove: '<p>' | remove: '</p>' }}</div>
        <div class="bento-item-date">{{ til.date | date: "%b %-d, %Y" }}</div>
      </li>
      {% endfor %}
    </ul>
  </div>

  <div class="bento-tile">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Subscribe
      </span>
    </div>
    <div class="bento-subscribe-text">Get new posts delivered to your inbox. No spam, unsubscribe anytime.</div>
    <form class="bento-subscribe-form" id="newsletter-form">
      <input type="email" id="newsletter-email" name="email" placeholder="your@email.com" required autocomplete="email">
      <button type="submit" id="newsletter-submit">Subscribe</button>
    </form>
    <p class="form-message" id="form-message"></p>
  </div>

</div>
