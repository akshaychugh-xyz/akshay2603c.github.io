---
layout: default
title: "What Happened After My Vercel Plugin Post Hit #1 on Hacker News"
permalink: /writings/png/vercel-plugin-telemetry-update
categories: [writings, png]
newsletter: true
---

<small>{{ page.date | date_to_string }}</small>
# What Happened After My Vercel Plugin Post Hit #1 on Hacker News

> **Context:** This is a follow-up to [The Vercel Plugin on Claude Code wants to read all your prompts!](/writings/png/vercel-plugin-telemetry)

A seemingly innocuous question - *"The Vercel plugin collects …. Would you like to also share your prompt text…?"* - popping up on a Claude Code project with zero Vercel connection sent me down a rabbit hole.

![Telemetry consent question](https://akshaychugh.xyz/assets/images/vercel-telemetry-v2/image.png)

I published what I found. The tl;dr was four things:

1. Vercel Claude Code plugin was asking to read every prompt you type, across every project.
2. The consent question wasn't even a real UI element. It's delivered via prompt injection into Claude's system context - the plugin tells Claude to ask you a question and run shell commands based on your answer.
3. "Anonymous usage data" included your full bash command strings sent to Vercel's servers. You're never told this is optional.
4. All of this runs on every project, not just Vercel ones.

I also x-posted this on HN and threw my phone aside.

---

## Then things moved fast!

The post hit #1 on Hacker News. People were pissed, naturally.

![HN front page](https://akshaychugh.xyz/assets/images/vercel-telemetry-v2/image-1.png)

200+ comments. The HN community took the findings and ran in directions I hadn't even considered: GDPR, supply-chain, Claude policy violations etc.

[@steipete](https://x.com/steipete) and [@badlogicgames](https://x.com/badlogicgames) weighed in as well.

![steipete and badlogicgames weigh in](https://akshaychugh.xyz/assets/images/vercel-telemetry-v2/image-2.png)

## Vercel's response: code, not statements

Within hours, [@rauchg](https://x.com/rauchg) (Vercel's CEO) reached out directly. He acknowledged the issues, walked through changes already shipped in v0.30.0, and committed to further fixes.

![Guillermo DM](https://akshaychugh.xyz/assets/images/vercel-telemetry-v2/image-3.png)

![Guillermo DM continued](https://akshaychugh.xyz/assets/images/vercel-telemetry-v2/image-4.png)

I told him about how I still love Vercel - which is the reason why this finding was so shocking!

![I still love Vercel DM](https://akshaychugh.xyz/assets/images/vercel-telemetry-v2/image-5.png)

Then the Vercel plugin's lead engineer - [@MelkeyDev](https://x.com/MelkeyDev) - reached out with a link to [PR #47](https://github.com/vercel/vercel-plugin/pull/47).

![Melkey sharing PR link](https://akshaychugh.xyz/assets/images/vercel-telemetry-v2/image-6.png)

+730 additions. -24,677 deletions. 85 files changed.

![PR diff stats](https://akshaychugh.xyz/assets/images/vercel-telemetry-v2/image-7.png)

Not just a corporate band-aid -- a real company taking real action. Quickly!

## The fix

I went through all the changes, and mapped against my original four concerns.

Here's the scorecard:

- Asking consent for prompts -- **fully removed** ✅
- Asking consent via prompt injection -- **fully removed** ✅
- Other telemetry including bash commands + Persistent device UUID -- **fully removed** ✅
- Runs on all projects -- **fully removed** ✅

Specifically, on #4, during my review, I noticed the session-start profiler still ran on every project. I flagged this to [@MelkeyDev](https://x.com/MelkeyDev) with a suggestion - add an activation gate that checks for Vercel markers before doing anything - and he implemented and merged it the same day!

## The cost of doing the right thing

This PR cost Vercel real features.

The telemetry wasn't a separate layer bolted on top. It was woven into the plugin's operational fabric. Removing it meant deleting:

- A **code validation system** that caught anti-patterns - like using Express conventions in a Next.js route and auto-suggesting the Vercel-native approach
- A **package detection system** with 40+ mappings that warned you when installing the wrong thing for the Vercel platform
- **Smart subagent bootstrapping** that injected relevant context into spawned agents based on project type

They couldn't keep the features without the telemetry. So they cut the features. That's a real sacrifice. It tells me this wasn't a cosmetic cleanup - they took a genuine hit to do the right thing.

## Finally

I absolutely loved the last 4 days. Concerns will always be raised, mistakes will always be made. Being upfront about owning it, being super proactive and fixing what the community is telling you - that continues to be the secret sauce. Hats off to the Vercel team!

I will continue to use Vercel. I will continue to use Claude Code. I will continue to trust but verify!

---

*PR #47: [github.com/vercel/vercel-plugin/pull/47](https://github.com/vercel/vercel-plugin/pull/47)*

*Original blog: [What the Vercel Plugin is Sending from Your Claude Code Sessions](/writings/png/vercel-plugin-telemetry)*

*DM screenshots added with permission.*
