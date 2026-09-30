---
layout: default
title: "Apple Pay is finally live in India - but what was the hold up?"
permalink: /writings/png/apple-pay-india
categories: [writings, png]
newsletter: true
image: https://akshaychugh.xyz/assets/images/apple-pay-india-four-yeses.jpg
twitter:
  card: summary_large_image
---

<small>{{ page.date | date_to_string }}</small>
# Apple Pay is finally live in India - but what was the hold up?

With Apple Pay going live in India today, good time to share my rabbit hole from last month, when I realised:

- GPay on Android allows Visa tap & pay, but GPay on iPhone doesn't.
- US-issued Brex cards worked via Apple Pay on Indian POS terminals. But Apple Pay didn't accept Indian cards.
- My Garmin watch wallet still doesn't accept Indian cards.

The timing is interesting too. UPI MDR kicking in 15 days and a potential tailwind for card tap & pay.

Anyway, here's how it actually works, to the best of my knowledge. Every tap & pay needs 4 yes from different players in the ecosystem:

1. The phone maker allowing NFC access to the wallet app // Apple, Google, Samsung, Garmin.
2. The card network issuing a token for the card // Visa, Mastercard, RuPay, Diners
3. Your bank agreeing to put the card in the wallet. // and pays the wallet a fee for it.
4. The regulator accepting how authentication happens. // in India, RBI's two-factor rules.

![Apple Pay in India: why every tap needs four yeses](https://akshaychugh.xyz/assets/images/apple-pay-india-four-yeses.jpg)

So when I add a card to my wallet, Visa/Mastercard etc gives the phone a token, with my bank's approval. When I tap, the phone sends the token plus a one-time code via the PoS. The network maps the token back to my real card and asks my bank to approve.

Interestingly, Apple keeps all of this in a dedicated security chip on the iPhone and only allowed Apple Wallet access to this till iOS 26 opened it up to 3rd party apps in India. Google does it in software, which is how Google Pay can run tap-to-pay on any cheap NFC Android phone.

Now for years, three of the four yes-es were already in place in India. Apple Pay gets NFC access. Visa and Mastercard have supported tokens in India for a while on Android. RBI acceptance already allowed contactless cards and foreign wallets to work in India.

The missing piece was that no Indian bank had agreed to put its cards in Apple Wallet. HDFC and ICICI are still holding back because Apple is asking a fee of 20 basis points vs 15bps. Axis meanwhile gets all the PR for the bank at launch.
