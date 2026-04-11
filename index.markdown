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

  <div class="bento-tile">
    <div class="bento-label">
      <span class="bento-label-left">
        <span class="bento-label-dot"></span>
        Writings
      </span>
      <a href="/writings/" class="bento-view-all">View all &rarr;</a>
    </div>
    <ul class="bento-list">
      <li>
        <a href="/writings/png/vercel-plugin-telemetry">The Vercel Plugin on Claude Code wants to read all your prompts!</a>
        <div class="bento-item-date">Apr 2026</div>
      </li>
      <li>
        <a href="/writings/png/how-does-g2-survive">How does G2 survive?</a>
        <div class="bento-item-date">Mar 2026</div>
      </li>
      <li>
        <a href="/writings/png/how-claude-code-chooses">How Claude Code Chooses - A deep dive on email providers</a>
        <div class="bento-item-date">Feb 2026</div>
      </li>
      <li>
        <a href="/writings/life/you-are-average-but-so-are-your-problems">You are average, but so are your problems</a>
        <div class="bento-item-date">Feb 2026</div>
      </li>
      <li>
        <a href="/writings/png/how-to-level-up-with-claude-code">How to level up with Claude Code</a>
        <div class="bento-item-date">Jan 2026</div>
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
        Today I Learnt
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
    <form class="bento-subscribe-form newsletter-form">
      <input type="email" name="email" placeholder="your@email.com" required autocomplete="email">
      <button type="submit">Subscribe</button>
    </form>
    <p class="form-message"></p>
  </div>

</div>
