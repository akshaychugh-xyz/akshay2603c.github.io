---
layout: default
title: "Meta Muse ships with payment insurance"
permalink: /writings/png/meta-muse-payment-insurance
categories: [writings, png]
newsletter: true
---

<small>{{ page.date | date_to_string }}</small>
# Meta Muse ships with payment insurance

Meta's new Muse agent has a built-in insurance if the agent makes a wrong payment.

<img src="https://akshaychugh.xyz/assets/images/meta-muse-payment-insurance-1.png" alt="Tweet from Jeff Weinstein: We use @link by @stripe to generate virtual cards so you never need to share your credit card info. We're the first agent to offer Link Purchase Protection, which means if there's a mistake or issue, Link has your back. — @jrlevine, product lead on @meta muse" style="width: 100%; border: 1px solid #ccc; border-radius: 6px;">

Offered by [Stripe](https://stripe.com) - the [Link Purchase Protection](https://link.com/terms/purchase-protections) is such a fantastic product, i had NO IDEA. It allows Muse to make any payment mistakes. Tried to go deeper into what that actually means:

- The Stripe Link Purchase Protection Policy got a new clause added specifically for Meta Muse.
- The policy already covered (a) damage/theft (b) price drops (c) return fees. First one is insured by AIG, the last two by Stripe LLC itself.
- The new Meta Muse clause adds a "dis-satisfaction / refund guarantee". If you are unhappy and merchant refuses to accept a return, Link will refund upto $1000, 4 times a year.

Interestingly, there is no need to check what the agent got wrong. no need to get observability, no need to prove if there was prompt injection, unclear prompt, wrong action by the agent. Just a subjective "dis-satisfaction".

What's def clear is three things:

1. Stripe is doing this to increase user comfort on agentic payments. With stripe being the underlying payment rails for all major personal agents, increasing the user comfort here, allows stripe to win. growing the market here is the only way to win.
2. This is an exclusive clause named for Meta Muse in Link's policy. Even though Stripe works closely with Instinct and Grokbot, this "insurance" is only for Meta Muse. Great marketing win for Meta. And I would assume Meta has some leverage here to force exclusivity till a certain time.
3. Anti-abuse will probably be restricted by Stripe's anti-fraud model ([Radar](https://stripe.com/radar)).

What is unclear to me - does stripe get any kind of logs in exchange for insurance payouts? to better train models, reduce fraud, improve agentic payments? probably unlikely given all the security architecture we have been seeing on Muse but still curious.
