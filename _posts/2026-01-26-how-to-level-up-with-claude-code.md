---
layout: default
title: "How to level up with Claude Code"
permalink: /writings/png/how-to-level-up-with-claude-code
categories: [writings, png]
newsletter: true
image: /assets/images/claude-code/claude-code-social.jpeg
twitter:
  card: summary_large_image
---
<small>{{ page.date | date_to_string }}</small>

# How to level up with Claude Code

This post is a running log on how I am levelling up my Claude Code usage. A lot of these things will probably be productionized soon by Anthropic and/or other similar products (Codex, Jules, Cursor, Amp etc.)

My goal with this post is to:
1. Find interesting ways to use Claude Code or similar tools (via self exploration, but mostly by lurking on twitter)
2. Experiment in my own setup
3. If I see myself regularly using the "new way of working", it makes to this list with a timestamp
4. Fun reflection at 2026 end (and beyond) on how my personal setup (and this space) has grown

----
#### 26th Jan 2026

(first entry so I will also plug-in all things from 2025)

> *My setup for ref: VS Code with Claude Code running on native terminal (not on the VS Code extension), considering Conductor but not convinced yet*

1. **Interview skill using `AskUserQuestion` tool**

	This is hands-down the BIGGEST value of life upgrade with Claude Code. A simple 3 line skill where you essentially productionize the act of asking clarifying questions with the seamless UX of asking questions natively in CC. The reason this works is because as humans we have two flaws:
	- We rarely have a clear idea of what we want
	- We suck at communicating effectively

	And this hack then solves both of these. It helps you really think about what you actually want. I have ran into interviews session that were easily 60-75 mins+ just because my initial idea was at a very high level and my follow-on answers kept opening more threads. Reminds me of my McKinsey days when asking the right questions was literally the job :)

	This skill also helps me take major decisions by thinking through the pros and cons of the decision with facts. A lot of times, I will just say, "i don't know enough to make a decision" and then it will give me a lot of pros and cons to help make a decision. The UX of chat + interview baked into the same experience is super refreshing.
	![](/assets/images/claude-code/claude-code-1.png)

	h/t Thariq from Claude Code team for [ref](https://x.com/trq212/status/2005315275026260309).

2. **Git Worktree Command *(with local env migration and package json run baked in)***

	The reason why you should use worktrees in Claude Code is just the reason why you should use worktrees in general. It allows you to spin up multiple instances of the same branch and work parallely on features that don't touch each other. You could run up parallel Claude instances on the same branch but there is no way for you to control ship just the changes made by one instance.

	But this point is not just about using worktrees! It's about a simple skill that removes all friction in spinning up a worktree and therefore, exponentially increases my usage of a worktree. Previously, I would ship common features in the same branch just because opening up a worktree was a few commands that I didn't want to get into. Now everything that even barely needs a worktree, gets a worktree. We, humans, are simple like that.

	The skill itself is pretty simple.

   1. Create a worktree from origin or a specified branch ->
   2. Copy the local env file ->
   3. Auto-run the package json file.
   4. Add the worktree on the VSCode side bar so you can manually review files in the new worktree.

   That's it! I still need to close claude and `cd` into the new worktree and then start claude again. The native `add-dir` claude command could work in theory, I just don't get the confidence that I am in the right branch and things won't get messed up. I will probably improve this somehow in the near future.

3. **Multiple terminals split in the same VS-code window**

	h/t [Boris' tweet](https://x.com/bcherny/status/2007179833990885678). Once worktrees is working, you can split different Claude Code instances into different VS Code splits in the same window, such that you can automatically move b/w them with the ⌘+1/2/3 shortcut. Makes multi-tasking so much more easier!

	There is also the `Maximise Group` shortcut that can maximise just your current view if you want to deep focus on just one problem.
	![](/assets/images/claude-code/claude-code-2.png)

4. Additional honorable mentions that will get a deepdive maybe in the future:
	- Enable MacOS notifications for Claude Code to ping you when it's waiting for a response or done
	- Frontend design skill - HUGE!
	- Switch on 'repositories' mode in VSCode's source control tab to see multiple worktree changes
	- Custom `sync-permissions` skill that goes through your past chats, see which permissions you allowed and adds it to your `permissions` list so you never approve the same command twice
	- AI slop removal command after each big coding session
	- Run crob jobs via Claude code + Mac's native cron job scheduler (e.g. send this slack message after analyzing x,y,z on Slack + Snowflake + Linear)
	- VSCode shortcut to open a new terminal + enter Claude so I automatically land into Claude Code with one click - no retyping `Claude` in terminal again
	- Modify Claude Code's `status line config` as per your pref. I personally like seeing the model and branch name.

---
## References


