---
layout: default
title: "calm-tv"
permalink: /side-projects/calm-tv/
description: "An ad-free, fast home screen for Android TV. Built in one evening with Claude Code."
image: /assets/images/calm-tv/before-after.jpg
---

<small>17 Oct 2026</small>
# calm-tv

Our OnePlus TV showed a sponsored ad before you could even get to Netflix. That was the itch. One evening with Claude Code later, the TV looks like this.

<img src="{{ '/assets/images/calm-tv/before-after.jpg' | relative_url }}" alt="Before: the Google TV home screen with a sponsored Hero banner and a Sponsored by JioHotstar row. After: a dark dusk-mountain wallpaper with Netflix, YouTube, Prime Video and Spotify in a rail on the left, the time at the top right and the weather at the bottom right." style="width: 100%; border: 1px solid #ccc; border-radius: 6px;">

No ads. The Google TV launcher is gone, and in its place is a tiny home screen we built from scratch: 4 apps in a rail, everything else one click away. Time and inputs up top, weather in the corner. Nothing else on screen.

It's faster too. The home screen went from 313 MB of RAM to 43 MB, and the TV now squeezes memory about half as much as before. 5 bloat services are off. Nothing rooted, everything reversible.

<img src="{{ '/assets/images/calm-tv/all-apps.jpg' | relative_url }}" alt="The All apps page: an On Home row with Netflix, YouTube, Prime Video and Spotify, then a grid of every other app." style="width: 100%; border: 1px solid #ccc; border-radius: 6px;">

Hold OK on any app to move it. Drop it into "On Home" and it's on the rail.

<img src="{{ '/assets/images/calm-tv/moving.jpg' | relative_url }}" alt="Moving Apple TV into the first slot of the On Home row, outlined in cream with the hint OK to drop." style="width: 100%; border: 1px solid #ccc; border-radius: 6px;">

The small things I loved: the glow behind the focused app takes that app's colour (red for Netflix, blue for Prime). The wallpaper is generated in Python, so no stock photo. The whole app is 160 KB.

I also went down the rabbit hole of how that ad got there. Brands book the banner from Google per 1,000 impressions, and the TV counts an impression the moment it switches on and draws it. Nobody has to look at it. Which makes the ad less of an ad and more of a toll on switching on your own TV.

Code and steps are on [GitHub](https://github.com/akshaychugh-xyz/calm-tv). Should work on most Android TV / Google TV sets (tested on one OnePlus). Inspired by Gathin's [tv-vibehack](https://github.com/Gathin23/tv-vibehack).
