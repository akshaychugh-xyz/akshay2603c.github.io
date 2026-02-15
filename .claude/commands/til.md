Sync new TIL (Today I Learned) entries from my writing inbox to the website.
Reference /Users/akshaychugh/GitHub/akshay2603c.github.io/CLAUDE.md for details of this repo.

Source file: /Users/akshaychugh/Documents/Akshay_Chugh/1. Writing inbox/TIL.md
Website data: /Users/akshaychugh/GitHub/akshay2603c.github.io/_data/til.yml

Steps:
1. Read the source TIL file from the writing inbox.
2. Read the current _data/til.yml to see what's already on the website.
3. Diff the two — identify any new entries in the writing inbox that aren't yet in til.yml.
4. For each new entry, convert it to the YAML format:
   - Parse the date from the heading (format: DD/Mon/YY) and convert to YYYY-MM-DD.
   - The heading text (after the date and dash) becomes the `title`.
   - Any body text below the heading becomes `details` (optional — skip if empty).
   - Keep titles concise. Clean up formatting but preserve the user's voice.
5. Prepend new entries to the TOP of _data/til.yml (newest first).
6. The homepage (index.markdown) auto-updates via Liquid templating — no manual editing needed.
7. Run `bundle exec jekyll serve` so I can test the changes locally.
8. Once I give a go-ahead, run `bundle exec jekyll build` and push the new changes to Github.
