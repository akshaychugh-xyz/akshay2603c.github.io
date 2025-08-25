---
layout: default
title: "Scratch your own itches with Claude code"
permalink: /writings/life/scratch-your-itches
categories: [writings, life]
---

<small>{{ page.date | date_to_string }}</small>
# Scratch your own itches with Claude code

The best thing about getting some technical powers with Claude Code / Cursor is that you realize how you can just do a lot of *software-y* things that you just didn't know were possible.

For e.g. i [wrote](https://x.com/akshaychugh_xyz/status/1947622271272554803) about how i realized very late that you could just "make up" loading screens and the 0 -> 100% timer did not always tell you the actual status of something.

This Friday I had a very satisfying unravelling! At Coinbase, we have to fill a `Rolling Intake` form on Jira to raise dependency requests to other teams as part of quarterly OKR sessions (e.g. I as India Lead need our Payments platform to build something for me). It's a big form that starts something like this ⤵️

![Jira Rolling Intake Form](/assets/images/scratch-your-own-itches-1.png)

My minor but wildly irritating itch: this form didn't have my `team`, `sub-team` and `name` pre-filled when I open it. 🤯
 
Pretty basic ask so I just shoot a DM to team (last quarter this time) and get a *yeah, good idea, adding to backlog!*
![Slack conversation about form improvement](/assets/images/scratch-your-own-itches-2.png)

One quarter down, 12 hours to the rolling intake deadline and I am doing the exact same thing, so I  remember this slack post. Checked in if anything happened and ofcourse, **rightfully so**, it was a minor request that never got prioritised.
![Follow-up Slack conversation](/assets/images/scratch-your-own-itches-3.png)

So with the deadline looming in, I ofcourse drop everything, and start brainstorming with Claude Code on how I can fix this. A few chats later, I have learnt how to inspect a Jira form, identify master fields and objects, and voila!

> I have created a sweet quick Javascript query that can be run as a bookmark to auto-fill my relevant fields!

And don't get me wrong - I understand that this is not a technically complex task. It will probably save me only 30 mins over the next year. That's it! 

But this feeling to be able to scratch my own itch is truly magical. And this was just not possible before. Having a very unique itch, that only I care about as much, and having the ability to go ahead and solve it. The next step therefore is to actually be more curious, aware and on the lookout for more itches you can solve!

This realization is beautiful. The future is truly millions of personalized softwares for an audience of 1.

This one was not just me though. Every weird itch has a niche audience!

![Twitter response about shared experience](/assets/images/scratch-your-own-itches-4.png)
