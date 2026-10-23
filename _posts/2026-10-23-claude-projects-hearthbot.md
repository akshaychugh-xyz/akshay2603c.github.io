---
layout: default
title: "Claude Projects decoded: agents aren’t allowed to type anymore, and a brand new hearthbot MCP"
permalink: /writings/png/claude-projects-hearthbot
categories: [writings, png]
newsletter: true
image: /assets/images/claude-projects-hearthbot-1.jpg
twitter:
  card: summary_large_image
---

<small>{{ page.date | date_to_string }}</small>
# Claude Projects decoded: agents aren’t allowed to type anymore, and a brand new hearthbot MCP

<img src="https://akshaychugh.xyz/assets/images/claude-projects-hearthbot-1.jpg" alt="Hand-drawn illustration of a stone fireplace. A robot sits by the fire with a clipboard checklist while worker robots fly out to the cloud and into a laptop and come back with finished work. Above the fire: a hearthbot nameplate, an (edited) message, a thumbs-up reaction and an A/B/C decision card." style="width: 100%;">

Anthropic recently launched Projects in Claude Code - a way to run multiple tasks on the same repo in parallel. I was trying it out on a fairly complicated repo, and at one point asked Claude:

> *Okay so what do i do now? next steps?*

It came back with 4 steps. Step 1 was to merge a PR. So I merged it.

About 10 seconds later, step 1 got crossed out. Same message, with "(edited)" underneath.

<img src="https://akshaychugh.xyz/assets/images/claude-projects-hearthbot-2.png" alt="Claude's four-step list in a Claude Code project. Step 1, Merge the code, is struck through and marked done. The message is marked (edited)." style="width: 100%; border: 1px solid #ccc; border-radius: 6px;">

We've all been using Claude Code and Codex for a while now, and I had never seen any of these go back and change something it had already said.

So I wanted to go deeper.

> <span style="font-size: 0.85em;"><strong>TL;DR</strong></span>
>
> - **In the newly launched Claude Projects, Claude can’t type plain text anymore.** Every message is a tool call to a new MCP server called `hearthbot` - which is why it can go back and edit.
> - **Projects is not just parallel agents. It's a proper team.** A coordinator that can't do any work itself, workers with their own repo, and a room where all of them report back
> - **This room works a lot like Slack.** Posts, edits, reactions 👍, buttons, threads. Even the Slack etiquette is written down into Claude's instructions.

## Claude doesn't type anymore

In a normal Claude Code session, Claude writes and I read. I think of it like an SMS - once it's sent, it's sent.

In a project, that's not how it works. Whatever Claude types never reaches us.. Before every turn, it gets this note:

> <span style="font-size: 0.85em;"><strong>WHAT CLAUDE IS TOLD</strong></span>
>
> "Text you emit directly is **not delivered** — only mcp\_\_hearthbot\_\_\* tool calls reach the user."

And it's enforced via a hook that checks the end of every turn - if the turn ends in plain text, Claude is sent back: "Plain text does NOT reach the user."

So every message I see in a project is actually a tool call to a new MCP server called `hearthbot` *(very interesting origin story, covered below)*. And every tool call comes back with a receipt - a `message_id`.

Here are the logs from my previous example:

<span style="font-size: 0.85em;"><strong>17 OCT, UTC</strong></span>

<table>
<tbody>
<tr><td>08:42:37</td><td><strong>Claude</strong></td><td><code>reply("In this order: 1. Merge the code…")</code><br>→ <code>{"message_id": "cmsg_…MBV"}</code></td></tr>
<tr><td>08:42:48</td><td><strong>Me</strong></td><td><em>I merge the PR on GitHub</em></td></tr>
<tr><td>08:42:51</td><td><strong>GitHub</strong></td><td>wake-up: <code>pull_request.closed (merged)</code></td></tr>
<tr><td>08:42:58</td><td><strong>Claude</strong></td><td><code>update_message("cmsg_…MBV", "1. ~~Merge the code~~ Done…")</code><br>→ <code>{"message": "Message updated.", "ok": true}</code></td></tr>
</tbody>
</table>

Claude held on to that `message_id` receipt and used it 21 seconds later to edit the message. A message is now a saved thing with an ID that Claude can come back to - like on Slack, and unlike an SMS.

I also checked a normal Claude Code session, both in the cloud and on my Mac. No `hearthbot` there. It only shows up when the session is part of a project. Anthropic built `hearthbot` specifically for Projects.

Which made me wonder - why would Claude need a chat server like MCP of its own?

## Because a project is a team

Running a bunch of agents together today needs 3 things:

- Workers // who actually do the work
- A manager // who hands out the work and keeps track of it
- A room // where everyone reports back

Before Projects, we humans used to be the manager. Our Claude Code session was the worker - it did the work itself, or sent off subagents for side jobs. I used to think of a subagent like an intern I send off in the middle of a meeting. It goes, finds something, comes back with a summary and leaves. It lives inside that one session and I, mostly, never talk to it. If I want 5 things done at once, I opened 5 different sessions (or used the unified Claude agents view) and managed them myself. And there was no room either. Everything went through me.

But now, Projects hands the manager's job to the Claude orchestrator, gives every worker a desk (repo) of its own, and adds a room where they all report to me.

**The manager.** Anthropic calls it the coordinator. It's the Claude I talk to in the project chat. And interestingly, it has no hands - no shell, no files, no web. All it can do is talk, plan and hand out work. Even its helpers are cut down. A normal session can start a whole bunch of subagents, but the coordinator gets just one kind, called `worker`, for small one-off tasks. It doesn't delegate just because it's told to. It has no other option.

<img src="https://akshaychugh.xyz/assets/images/claude-projects-hearthbot-3.png" alt="A new Claude Code project. The welcome message reads: I coordinate your work. Ask me a question or hand me a task and I'll either answer directly or start threads to work on it in parallel." style="width: 100%; border: 1px solid #ccc; border-radius: 6px;">

The "no hands" thing is strictly enforced. I asked the coordinator for today's top Hacker News story. It can't open a web page on its own, so it handed the job to its one helper, `worker`:

<span style="font-size: 0.85em;"><strong>FROM THE LOGS · 18 OCT, UTC</strong></span>

<table>
<tbody>
<tr><td>03:41:03</td><td><strong>Coordinator</strong></td><td><code>Agent(subagent_type: "worker", "Fetch top HN story")</code></td></tr>
<tr><td>03:41:06</td><td><strong>Coordinator</strong></td><td><code>post_message("On it…")</code></td></tr>
<tr><td>03:41:07</td><td><strong>worker</strong></td><td><code>Bash: curl hacker-news.firebaseio.com…</code> <strong>✗ 403</strong></td></tr>
<tr><td>03:41:12</td><td><strong>worker</strong></td><td><code>WebFetch("news.ycombinator.com")</code> <strong>✓</strong></td></tr>
<tr><td>03:41:21</td><td><strong>worker</strong></td><td><code>SubagentHandback(report)</code></td></tr>
<tr><td>03:41:26</td><td><strong>Coordinator</strong></td><td><code>post_message("Today's top story is…")</code></td></tr>
</tbody>
</table>

**Workers with their own desk.** Each thread is a full Claude Code session of its own - not a helper sitting inside someone else's. That's the big difference from a subagent. A thread can keep going for days, wakes up when a PR merges, and I can open it and talk to it directly. In the project chat, it shows up as its own thread where it posts updates. It also gets its own branch and copy of the repo, so threads don't step on each other's files. And threads can still use subagents for their own side jobs.

|  | Subagent | Project thread |
|---|---|---|
| **What it is** | A helper inside one session | A full Claude Code session of its own |
| **How long it lives** | Until it hands back its summary | Days. Keeps going with my laptop shut |
| **Reports to** | The session that started it | Me, in the project chat |
| **Can I talk to it?** | Yes if I want, but typically not used | Yes. Open the thread and steer it |
| **Wakes up on its own?** | No. It can't schedule a wake-up. Only the session that started it can resume it | Yes. A merged PR, a failing CI run, a message from another thread |
| **Own copy of the repo** | Optional, if set up with its own worktree | Always, on its own branch |
| **Can start subagents?** | Yes, up to 3 levels deep | Yes |

**The room.** With 5 Claudes working at once, they need somewhere to report back without drowning me. In the Claude app, the room has 3 views:

- The project chat // where I talk to the coordinator
- The threads overview // every thread grouped by status, with the ones that need me on top
- Each thread's own chat // I open a thread to steer that worker or act on what it found

None of the Claudes can type into any of these directly. Everything goes through `hearthbot`, the chat server.

Putting it all together, it looks something like this - the 3 views I see on top (my edited next-steps list was in a thread's chat), `hearthbot` in the middle, and the team doing the work at the bottom.

<img src="https://akshaychugh.xyz/assets/images/claude-projects-hearthbot-4.png" alt="Hand-drawn diagram in three layers: the room on top (project chat, threads overview, a thread's chat), the hearthbot MCP chat server in the middle, and the coordinator, its worker helper and the threads at the bottom." style="width: 100%;">

## The room is basically Slack

The new `hearthbot` MCP is all over the logs:

<span style="font-size: 0.85em;"><strong>FROM THE LOGS</strong></span>

<table>
<tbody>
<tr><td><strong>every project session</strong></td><td><code>origin: "claude-in-hearth"</code></td></tr>
<tr><td><strong>the coordinator</strong></td><td><code>hearth-channel-session</code></td></tr>
<tr><td><strong>each thread</strong></td><td><code>hearth-thread</code></td></tr>
<tr><td><strong>my messages</strong></td><td><code>hearth_human</code></td></tr>
<tr><td><strong>Claude's messages</strong></td><td><code>hearth_agent</code></td></tr>
</tbody>
</table>

Going deeper here, I learnt that a hearth is supposedly a fireplace at the center of a home, where everyone gathers. Basically one warm place where all the work comes back to me. Very cool naming :)

<img src="https://akshaychugh.xyz/assets/images/claude-projects-hearthbot-1.jpg" alt="Hand-drawn illustration of a stone fireplace. A robot sits by the fire with a clipboard checklist while worker robots fly out to the cloud and into a laptop and come back with finished work. Above the fire: a hearthbot nameplate, an (edited) message, a thumbs-up reaction and an A/B/C decision card." style="width: 100%;">

So `hearthbot` is basically the bot that lets Claude act in that room. Out of curiosity, I lined up its tools against Slack's. It's almost one-to-one:

| I see | In Slack | In a project |
|---|---|---|
| A channel | Channel | Project, `chan_…` |
| A thread | Replies under a message's `ts` | A message with its own Claude session, keyed by `ts` |
| A new message | `chat.postMessage` | `post_message` / `reply` |
| "(edited)" | `chat.update` | `update_message` |
| 👍 | `reactions.add` | `react` |
| Buttons | Block Kit | `ask_decision` |
| The bot wakes up | Events API | Wake reasons: `mention`, `external-event`… |

Even the etiquette is written down. The coordinator's setup instructions literally say:

> <span style="font-size: 0.85em;"><strong>WHAT CLAUDE IS TOLD</strong></span>
>
> "Post it once, then edit it instead of posting new text, **so the user reads one story.** Never edit a card."

And the end-of-turn hook adds: "silent in-place edits do not notify anyone."

So the rule is simple: edit to keep things current, post when I need to know. And I saw this play out. When I wrote "i set the expiry to 60 days for now. will fix later.", Claude didn't reply. It just reacted with a 👍. When there was a choice for me to make, it gave me buttons. And when 3 threads finished back to back, it stayed quiet twice and posted one summary at the end.

<img src="https://akshaychugh.xyz/assets/images/claude-projects-hearthbot-5.png" alt="A user message with a thumbs-up reaction from Claude, and below it a Decision card with options, answered in chat." style="width: 100%; border: 1px solid #ccc; border-radius: 6px;">

Small thing, but I really like this. Way less noise in the chat.

## Where the team works

The coordinator can only live in the cloud. Threads do too, by default. My read: Anthropic really wants to hook us on "cloud" sessions. That's how they build the moat.

But a thread can work on my own computer. The coordinator calls `list_devices`, then `start_rc_session` with a folder, and I click Allow once.

That thread gets a restricted badge though. It can read every other thread, but can only write in its own thread and to the coordinator:

> <span style="font-size: 0.85em;"><strong>WHAT THE LAPTOP THREAD HEARS BACK</strong></span>
>
> "a remote-control session may send messages only to the conversation session that started it"

## The meta-point

Everyone's talking about Projects as parallel agents. I think there are 2 bigger shifts here.

**Claude moved one level up.** Until now, I was the manager. I opened the sessions, handed out the work and stitched it all together. Now the coordinator does that, and I just read the channel.

**I see less of what Claude writes - on purpose.** Remember when everyone was excited to watch DeepSeek's chain of thought? This goes the other way. Claude's plain text never reaches me. All I see is a reply, a 👍 or an edited message. The work still happens, I just don't have to read all of it. Fewer walls of text, and I move faster.

*I use Claude Code daily. I like where this is going.*

---

## Backup

### All of hearthbot's tools

The coordinator has 40 `hearthbot` tools, each thread has 31. Roughly grouped:

| Purpose | Tools |
|---|---|
| Posting | `post_message` (coordinator), `reply` (threads), `update_message`, `no_reply_needed` |
| Reactions | `react`, `unreact` |
| Decisions | `ask_decision`, `close_decision` |
| Progress | `update_status` (the ✓ / ○ checklist), `update_status_page`, `post_widget` |
| Managing threads | `start_thread_session`, `message_thread`, `rename_thread`, `set_thread_resolved` |
| Memory | `read_memory`, `update_memory` |
| My computer | `list_devices`, `start_rc_session`, `stop_rc_session` |
| Settings | `switch_model`, `set_effort_level` |

And yes, Claude has tools to change its own model and effort level. I didn't see it use them though.

### What wakes a session up

Sessions don't just sit in a loop waiting. They get woken up by events, and each wake-up tells Claude why:

| Wake reason | Trigger |
|---|---|
| `mention` | I wrote something |
| `thread-activity` | A thread posted |
| `external-event` | GitHub, e.g. a PR merged or CI failed |
| `spawn` | A new thread starting |
| `remote-control-session-status` | A thread started on my computer |

Each wake-up also tells Claude where the conversation stands, e.g. "Thread state: the user last wrote 6m ago. Claude has posted 1 message since then." Which is exactly what it needs to decide whether to edit its last message or post a new one.

### Smaller things

- **There's even a style guide for Claude's messages:** "keep sentences &lt;25 words with no em-dash, semicolon, internal id, snake\_case name, flag or aside in parentheses."
- **Smaller context.** Project sessions show a 500k-token limit. Normal sessions show 1M.
- **PRs get a hidden signature:** a <code>&lt;!-- claude-projects-attribution: … --&gt;</code> comment and a "Requested by …" line.
- **Checklists are also messages.** The ✓ / ○ block is stored as a message with `{"kind":"status", …}`.
