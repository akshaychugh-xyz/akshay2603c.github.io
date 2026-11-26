---
layout: default
title: "Pay with a Pause"
permalink: /writings/png/pay-with-a-pause
categories: [writings, png]
description: "My agent has to pause and verify the store and the price before it pays. Built on Google data from SearchApi, so it works for any personal agent."
newsletter: true
image: https://akshaychugh.xyz/assets/images/pay-with-a-pause-1.png
twitter:
  card: summary_large_image
---

<small>{{ page.date | date_to_string }}</small>
# Pay with a Pause

Personal agents are the HOTTEST AI consumer category right now. Muse, Instinct, GrokBot, ChatGPT Dots, Claude Duet -- every company wants to win the race of being the only agent you will ever need. And why shouldn't they be. The prize of getting to own the customer relationship at the deepest possible level is worth the race.

The dynamic that gets me excited though is how the payments stack shapes up. Amazon recently blocked Muse and Instinct from shopping on it. eBay had done the same earlier in the year. Shopify actually went the other way. Welcoming all the agents and being THE place agents directly interact with the brands.

So there is a big debate about whether or not to let the agents enter your site. What I am more interested in is what happens where the agent has left my trusted aggregator, with my card and gone out in the wild. This is especially important because this week is the first Black Friday with all personal agents out loose. 

Lets dive right in!

First off. What value did Amazon provide: Apart from product availability ofcourse, I can think of 3 key buckets:

- **Product assurance** - ratings, seller vetting
- **Price assurance** - even though i don't check other marketplaces, there is an inherent comfort that I am almost always getting the best bang for my buck
- **Delivery assurance** - speed of delivery, refunds if needed, just general A+ customer service

So now, if my agent isn't allowed to go to Amazon, how do I trust where it is going? 

And this is not just hypothetical. Even without an agent, I have been burnt in the past. See a random cute something on an Instagram page, lots of followers, think they are legit, go to their store front, pay and then poof. 3 weeks out, no delivery, no customer service, even no Instagram page anymore.

The first way to handle this was to ask my agent to be more careful. plead them to not screw up (or a one-line in their agent.md, if you run your own hermes agent etc.). Just tell them this is important.

But this is just a request, not a rule. and there is so much happening when the agent is making a decision. comparing products, reading pitch, reading reviews, figuring out TnCs. 

So I can’t rely on just my request. 

I am doing what i call -- "pay with a pause".

My agent has to pause and send a verification token that proves they have done some sort of verification to ensure that the store and product is legit. There is literally no way for the agent to side-step this because it has to go in code.

<img src="https://akshaychugh.xyz/assets/images/pay-with-a-pause-1.png" alt="Pay with a pause: the agent checks the store, the price and delivery through SearchApi, gets one of four verdicts, and pay() refuses without a token" style="width: 100%;">

–

So what does “verification” even mean here? 

- It can’t just be the agent saying “please trust me, I have checked”.
- And it can also not come from the store. The store’s page is the seller pitching their product. I can’t trust it. 
- It has to come from outside. 
- And when I do this myself, “outside” basically means a new tab. I google the store. I read reviews on reddit. I check if the same thing is cheaper somewhere else.

Turns out Google already has all of this. A profile for most online stores - rating, number of reviews, return window, shipping time. And Google Shopping lists the same product across every seller that carries it. The only problem is that Google doesn’t hand this out freely. But thankfully, we can use real-time SERP scraping (search engine results page scraping) tools to codify this. I am using [SearchApi](https://www.searchapi.io/?utm_source=dev&utm_medium=ambassador&utm_campaign=akshaychugh.xyz). It pulls those Google pages and gives them back as JSON. Basically my agent replicating what I would do. 

Now back to the 3 buckets of what Amazon was giving me and how my agent is re-building them via “Pay with a Pause”:

- **Product assurance** - one search pulls the store’s Google profile. // ratings, reviews everything
- **Price assurance** - Google Shopping groups the same product across sellers. // e.g. search across stores for the Airpods Max, compare prices and be rest assured that you are getting the best deal
- **Delivery assurance** - get typical shipping time, return windows, reviews that complain about returns

And the best thing – a full “pause” is just 4-6 searches. That’s less than 2 cents on SearchApi. Even on a $50 purchase, that is absolutely nothing!

Now the way I have built this pause – it results in one of the 4 verdicts below – 

- Allow agent to proceed to pay
- Suggest an alternative
- Ask me for a decision
- Block the payment altogether

A few ground principles that i set - 

- If the “pause” can’t find legitimacy of a store, it asks me for a decision. It just doesn’t believe its a scam, because I am putting new but honest stores at a disadvantage
- Always suggest an alternative, never switches seller automatically. I am very wary of prompt injection so this still helps me take a decision
- Doesn’t do analysis paralysis. No 5 searches for a $10 USB charging cable.
- Auto-block when multiple bad signals compound 

Here’s a real run:

```
$ pause check --url https://www.brandsmartusa.com \
    --item "Sony WH-1000XM5 Wireless Noise Canceling Headphones" --price 399.99

VERDICT SUGGEST SWITCH

Why:
  - Same product is $100.00 (25%) cheaper at Best Buy: $299.99 incl. delivery.
    That store is rated 4.6/5 from 1,669 reviews, 15-day returns.
```

And if the agent tries to pay for anything other than what got checked:

```
Refused: Pause token was issued for a different store, item or amount.
```

The token is bound to one store and one time. It also dies in 10 minutes so the agent can’t re-use it.

<img src="https://akshaychugh.xyz/assets/images/pay-with-a-pause-2.png" alt="No token, no payment: the pause token is tied to one store, one item and one amount" style="width: 100%;">

Under the hood, a “pause” is actually 4 SearchApi calls, plus one extra call for each cheaper seller it has to check. 

- `google_about_this_store` returns the store’s rating, review count, return window and shipping. 
- `google_shopping` finds the listing that matches the item. 
- `google_product` and `google_product_offers` return every seller’s price for that same product, with delivery included.

And then three functions do the actual work: `check_store()`, `find_better_deal()` and `decide()`. 

- `decide()` is plain if/else, so you are not being dependent on an indeterministic model. You get the same answer everytime and every final verdict comes with the explanation attached

Right now, the `pay()` function works if that is the only way my agent can pay. So if you run your own agent (Hermes, Claude Code via Telegram channels etc), you can just point it at the repo. The [AGENTS.md](https://github.com/akshaychugh-xyz/pause-and-pay/blob/main/AGENTS.md) tells the agent how to install the “pause”, and how to integrate each verdict into your real payment function so it refuses without a verification token attached. But if it is a hosted agent (like Instinct, Muse, GrokBot etc), where you can’t really install your own, you can still point it to the [PRINCIPLES.md](https://github.com/akshaychugh-xyz/pause-and-pay/blob/main/PRINCIPLES.md) and get your agent to follow the steps before it pays. And I know that this is back to being a request but it is still far more specific than just “be careful” 

But lets make it more real - 

I wired my “pause” into the [x402](https://www.x402.org) payments protocol (where a website can send back a 402 payment required error message, an agent can pay in stablecoins over HTTP). How it works is that the x402 client has a hook that runs right before it signs a payment and I made the “pause” sit there. So the agent doesn’t need to call the “pause” directly. It can be built as a wrapper over x402 directly. This conceptually works for other payment protocols also. You can just put it on whatever function actually moves the money and the “pause” can sit right inside that call.

Full repo is here: [pause-and-pay](https://github.com/akshaychugh-xyz/pause-and-pay)

Interestingly, Stripe went the other way with Muse - [insurance AFTER the agent pays wrong](https://akshaychugh.xyz/writings/png/meta-muse-payment-insurance). This is the boring part BEFORE the payment. My guess is we will need both. 

Back to the Instagram store that ran away with my money. I can’t run the “pause” on it now but you can – with Black Friday coming over :) A free [SearchApi](https://www.searchapi.io/?utm_source=dev&utm_medium=ambassador&utm_campaign=akshaychugh.xyz) account gives you 100 searches. That’s about 20 pauses. If your agent is going to shop for you this Thanksgiving, you should ask it to run the “pause” first. :)

