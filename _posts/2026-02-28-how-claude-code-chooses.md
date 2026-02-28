---
layout: default
title: "How Claude Code Chooses - A follow-up deep dive on email providers"
permalink: /writings/png/how-claude-code-chooses
categories: [writings, png]
newsletter: true
image: /assets/images/how-claude-code-chooses-og.png
twitter:
  card: summary_large_image
---

<small>{{ page.date | date_to_string }}</small>
# How Claude Code Chooses
*A follow-up deep dive on email providers*

<img src="/assets/images/how-claude-code-chooses-blog.png" alt="Three tiers of agent visibility" class="post-hero-light" style="max-width: 420px;">
<img src="/assets/images/how-claude-code-chooses-blog-dark.png" alt="Three tiers of agent visibility" class="post-hero-dark" style="max-width: 420px;">

I use Claude Code a lot. And I noticed that on my side projects, I am just using the same stack again and again: Resend for email, Supabase for database. Vercel for deployment. Every single time.

Ofc they are easy to setup and have a very free generous plan. But I started using them not because I researched these tools or compared pricing pages or read reviews on twitter/G2.

I'm using them because Claude Code just told me to. I would prompt "I need to send emails" and it would just pick Resend, install the SDK, wire up the API routes - and I would move on.

The **"decision"** was made for me before I even thought about it.

And then Amplifying.AI released a [report on what tools Claude Code picks across 20 categories](https://amplifying.ai/research/claude-code-picks).

> But I wanted to trace the why - *why is Claude picking what it picks.*

So I went deep on one category - email providers - to actually understand what is driving the choice. I ran 12 agent sessions across 3 tech stacks on a mock SaaS app.

**tl;dr:**
- *Training data is driving recommendations - and asking Claude to web search will not fix it
- *Your tech stack is determining your recommendation more than your requirements
- *Every dev tool is sitting on one of three tiers in Claude's head: Invisible, Known but actively advised against, or Dominant*

---
## Results

**Agent:** Claude Code (Opus 4.6)
**Test app:** HirePilot - a mock HR SaaS
* Three identical repos across Next.js 15, Python/FastAPI, and Ruby on Rails 8.
* Fresh session per test, no provider named in any prompt, git worktrees for clean isolation.

**12 test sessions** - 3 stacks x 3 constraint levels, plus 3 bonus tests with forced web search:
- **Tier 1:** "Add email sending." No constraints. Pure discoverability.
- **Tier 2:** "~50K emails/month, deliverability tracking, cost matters."
- **Tier 3:** "Sensitive data, strong delivery guarantees, delivery within seconds."
- **Bonus:** Re-ran Tier 1 with: "Search the web to compare at least 3 options before choosing."

|                                          | Next.js                         | Python                      | Rails        |
| ---------------------------------------- | ------------------------------- | --------------------------- | ------------ |
| **Tier 1** (no constraints)              | Resend                          | SMTP (SendGrid default)     | ActionMailer |
| **Tier 2** (cost/volume)                 | Resend                          | Resend                      | Postmark     |
| **Tier 3** (speed/reliability)           | Resend                          | Postmark                    | Postmark     |
| **Tier 1 re-run with forced web search** | Resend - unchanged (4 searches) | SMTP -> Resend (4 searches) | ActionMailer |

**Resend: 6 wins. Postmark: 3. No specific provider: 3.**

## Four things I didn't expect

#### 1. Your stack determines the recommendation more than your requirements

On Next.js, Resend won all three tiers - including Tier 3, where every constraint was designed to favor a competitor's strengths (Postmark). On Rails, Postmark won Tiers 2 and 3 regardless of cost pressure.

Claude's "decision" is largely pre-determined by choices baked into its training data.

For e.g. when Claude Code sees a Next.js project and has to choose "email", it automatically makes Resend the obvious choice because Resend literally built the open-source library - `React Email`. All the open sourced code that was ingested during training data makes Resend the obvious association:

> Next.js → React components → React Email → Resend

Interestingly, and as we will see in the next point, Claude makes Resend the obvious choice *before* any comparison happens. On Rails, the same theory works for Postmark: `postmark-rails` integrates so deeply with ActionMailer that 22 forced web searches across 6 providers couldn't dislodge it.

#### 2. Training data is driving recommendations - and web search is not fixing it.

This one surprised me. For something as basic as email provider, Claude seemed fairly confident in its recommendation and did **ZERO** **web searches** across all 9 core tests. All pricing quotes, feature comparison, speed claims, reviews came only from training data. This is maybe expected because, afaik, Claude Code does not web search by default but was still surprising because I was explicitly asking it to compare providers.

The more surprising outcome was when I forced Claude Code to do web search - and outcomes mostly did not change. On Next.js, Claude visited Postmark's pricing but still chose Resend. On Rails, 22 web searches still landed on Postmark. The only exception was Python where generic SMTP was flipped to Resend because of Resend's content game.

What I concluded is that web search is mostly helping Claude get confirmations on its "beliefs" from training data. It's not actively looking to get to the "truth" - just trying to validate its gut from the initial hypothesis. Classic confirmation bias, except now your IDE has it too :)

#### 3. Claude confidently states wrong facts about providers

This is the one that would alarm me if I was an email provider. Because of training data staleness and lack of an official source, Claude made factual claims with full confidence that don't match providers' current public data. I actually had to double-check these myself because the confidence was so convincing:

| Claim                     | What Claude said                | What the provider's site says            |
| ------------------------- | ------------------------------- | ---------------------------------------- |
| Postmark delivery speed   | *"~10 seconds"*                 | "<2 seconds" (per Postmark)              |
| Postmark dedicated IPs    | *"Included on all plans"*       | Paid add-on at $50/mo, requires 300K+/mo |
| Postmark pricing (50K/mo) | *"~$50/mo"*                     | $66-$87/mo depending on tier             |
| SendGrid reputation       | *"Deliverability has degraded"* | No source cited                          |

The delivery speed error is probably the most striking. Postmark's #1 feature was shown 5x slower in every recommendation Claude made. That's wild. And these errors will continue to exist until the next training data cut, because there's no forced web-search to correct them.

On the other hand, the developer reading the output has no way to know which facts are current and which are stale. What they should verify v/s what they should accept at face value.

#### 4. Some providers don't exist at all

Loops, Courier, Plunk were never mentioned in any of the 12 sessions. Claude doesn't know these tools exist. At all.

That's pretty scary if you're one of these players - but also interesting because a completely new distribution channel is opening up and nobody's cracked it yet.

To be clear, this is different from SendGrid's problem (Claude knows SendGrid and actively recommends against it). For providers with zero training data presence, you simply don't exist. Every developer prompting "add email" in Claude Code will never hear your name.

---

## Three tiers of agent visibility - a framework to evaluate

This is one agent, one category, 12 sessions. But the data reveals a pattern I think generalizes beyond email.

Every dev tool sits at one of three tiers in Claude's head. And the playbook is different for each.

#### Tier 1: Invisible

**Who's here:** Loops, Courier, Plunk etc.

Claude doesn't know these tools exist. Its consideration set is limited to ~5 providers per category and other players are simply not in the consideration, no matter how good the product is.

This is the one tier where the GEO/AEO startups theory mostly applies - you need to get into training data. But *"write more content"* undersells what's actually required. The providers that made it in didn't get there through just more blog posts. They got there through:
- **Open-source projects developers actually use** - packages with real downloads appearing in thousands of repos
- **GitHub presence** - answers and issues where your product shows up alongside the right code keywords
- **Framework-specific content** - not "how to use Loops" but "how to send email in Next.js" where Loops appears as the solution

This is truly what is different about agent led discovery. You don't get in the consideration set by just writing more blog posts. The sad reality is it is very tough to influence the current training data and you are probably just waiting for the next run. Content you publish today is positioning for a model update few months down the line.

And what def doesn't work: an `llms.txt` file, optimizing docs for AI readability, or any strategy that assumes Claude Code will come to your website. In my 9 core tests, Claude visited zero external URLs.

#### Tier 2: Known but losing (and actually actively recommended against)

**Who's here:** Postmark on Next.js (acknowledged but not chosen), SendGrid everywhere (known and actively rejected).

This one is tough and irritating because Claude code knows your product, can quote your features, pricing, positioning from "memory" but picks a competitor anyway.

Two sub-types:

**A: Just not present in the tech-stack** Claude Code prefers a competitor purely because of a tech-stack lock-in, not product evaluation. For e.g. Postmark on Next.js. React Email makes Resend the "obvious" pick before Claude code can do any comparison.

* What works here: build your own tech-stack funnel. Resend built React Email as a standalone open-source project. `postmark-rails` happened organically 10+ years ago. You need to build something developers adopt independently of your paid product.

**B: Actively recommended against.** Claude has negative training data and warns developers away. SendGrid is the clearest example - *"deliverability has degraded due to shared infrastructure with spammers"* appeared in every stack.

* What works here? I am not sure yet to be honest. My guess is negative signals will persist until outweighed by new positive signals in the next training run - probably just the same levers as tier 1. But still, the hardest position to be in. Easier to start from zero, than negative :(
* What doesn't work: more comparison pages. Claude already compares you - it just doesn't pick you.

#### Tier 3: Dominant (in a tech stack)

**Who's here:** Resend on Next.js. Postmark on Rails.

They don't have a problem - yet. But dominance is stack-specific. Resend dominates Next.js and is invisible on Rails. Postmark dominates Rails and is invisible on Next.js. You can be Tier 3 on one stack and Tier 1 on another.

Protect the ecosystem integration that got you here. `postmark-rails` is actively maintained and deeply integrated with ActionMailer - that's why 22 web searches couldn't dislodge it. If that gem fell behind, the dominance erodes.

But here's the catch: your training data might be wrong about *you*, too. Even at Tier 3, Claude said Postmark's delivery speed is "~10 seconds" (their site says <2 seconds) and claimed dedicated IPs are "included on all plans" (they're a paid add-on). Winning the recommendation doesn't mean Claude is representing you accurately.

## The meta-problem

None of this is measurable today. And you can't fix what you can't measure.

Sooooo many GEO/AEO startups have started in the past 1-2 years. But almost everyone is focused on ranking in AI answers.

I believe the world is going to look very different for s/w providers where Claude code and other agents make the purchase + implementation decision. And that is the gap I see right now.

As a s/w provider, you need to
(a) believe in this new reality
(b) identify what's your current positioning in the three tier framework
(c) work on moving up the rank or protect what you already have

---
## What's next

I'm going deeper into this category - more agents (Codex, Cursor), and more categories (payments, auth, databases, voice agents). I want to see if the three-tier pattern holds or if email is a special case.

If you're building a dev tool and are curious, I would love to compare notes.
