I will give you link to a new post I want to publish in my personal website.
Reference /Users/akshaychugh/GitHub/akshay2603c.github.io/CLAUDE.md for details of this repo
Reference /Users/akshaychugh/GitHub/akshay2603c.github.io/_posts for what past posts like, both naming and jekyll format
You will find some images in the link i give you
The images are always stored in /Users/akshaychugh/Documents/Akshay Chugh/Collateral
You have to copy the images to /Users/akshaychugh/GitHub/akshay2603c.github.io/assets/images and rename them in the format of <post-name-1>, <post-name-2> etc.
Create a new file at /Users/akshaychugh/GitHub/akshay2603c.github.io/_posts
DO NOT change the contents of the post at all!
Before creating the post file, ask the user these questions:
1. "Do you want to send this post to your newsletter subscribers?" If yes, add `newsletter: true` to the frontmatter. If no, do not add the newsletter field.
2. "Do you want to add a post-specific image for Twitter/social sharing? (This will show as a large image card instead of the default small thumbnail)" If yes, ask which image to use (can be one from the post or a new one), add `image: /assets/images/<image-path>` and `twitter:\n  card: summary_large_image` to the frontmatter. If no, the default og-default.png will be used with a small card. 
For a final confirmation, do a diff check between the original link i shared and the new post you have created to ensure no content has been changed in the 2 files.
Once the new file is created at /Users/akshaychugh/GitHub/akshay2603c.github.io/_posts, i want you to open a jekyll local server at <bundle exec jekyll serve> so that I can test the changes. 
Once i give you a go ahead, run <bundle exec jekyll build> and push the new changes to Github.
Also, add the new post to the "Recent Writings" section in index.markdown and remove the last entry so that only five posts remain.