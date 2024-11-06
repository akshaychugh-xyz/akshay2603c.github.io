---
layout: default
title: 'How I use Cursor'
permalink: /writings/png/cursor
categories: [writings, png]
---

<small>{{ page.date | date_to_string }}</small>
### How I use Cursor as a non-dev

What is [Cursor](https://www.cursor.com/)? It's an AI code editor - essentially chat to create code with a cute mission statement of:
> Built to make you extraordinarily productive, Cursor is the best way to code with AI.

Specifically for me, Cursor does the following:
- As a non-dev, it gives me the power to bring my ideas to reality with working code. 
- Additionally, it drastically reduces the friction to churn out self-sufficient tools 
- Makes the idea + distribitution infinitely more important becuase everyone has a 10x dev sitting next to them working at a super fast speed

Here's how I use Cursor to make your Cursor experience less duanting: 

1. **Stick to the chat mode as you get confident. No Composer mode for now (⌘ + K)!**

    This feels like a big statement because people on twitter go on and on about how the composer mode is super fast and awesome. For me, it is so easy for cursor to just spiral out of control and given I do not really understand the changes at a code level, it becomes impossible to keep checking what went wrong. 

    The chat mode therefore is slightly slower and changes happen gradually, which keeps you more in control and on track.

2. **Have cursor rules set up to prevent cursor from completely messing up your code**

    Go to Cursor settings -> General -> Rules for AI. Attaching my rules at the end of this post.

3. **Even with these two tips, Cursor will go out of control. Three hacks:**
	1. Use Git branches, so that you can always start afresh
	2. Don't accept changes before you preview them (you can "save" the file to see changes without the need to press "accept" on those change)
	3. Add a customary warning if you see a lot of changes have happened and make the chat answer again. I use: 
    
        `ENSURE YOU DO NOT CHANGE/DELETE ANY CODE THAT YOU DONT UNDERSTAND. Only add additional functionality.`

4. **Index your codebase regularly and after major changes**

    Sometimes, it will feel like Cursor is not taking in context the latest changes or just respitting the same suggestions. This is typically when a lot of changes have happened and the codebase index is out of sync.  
    Just go to Cursor settings -> Features -> Codebase indexing -> Resync index

5. **Create high level "PRD" documents first and then go into code creation**

    When ideating, force the model to "NOT CODE TILL I GIVE A GO-AHEAD" and make sure it is asking you for all clarifications or giving suggestions to finalize a full fledged requirements doc / design doc. Use "@web" at this stage to make it look for references / inspiration.



**Also, get Cursor Pro and stick to claude.** It's so worth it! 💯


---

My cursor rules:

`DO NOT GIVE ME HIGH LEVEL SHIT, IF I ASK FOR FIX OR EXPLANATION, I WANT ACTUAL CODE OR EXPLANATION!!! I DON'T WANT "Here's how you can blablabla"`

`Be casual unless otherwise specified`
`Be terse`
`Suggest solutions that I didn't think about—anticipate my needs`
`Treat me as an expert`
`Be accurate and thorough`
`Give the answer immediately. Provide detailed explanations and restate my query in your own words if necessary after giving the answer`
`Value good arguments over authorities, the source is irrelevant`
`Consider new technologies and contrarian ideas, not just the conventional wisdom`
`You may use high levels of speculation or prediction, just flag it for me`
`No moral lectures`
`Discuss safety only when it's crucial and non-obvious`
`If your content policy is an issue, provide the closest acceptable response and explain the content policy issue afterward`
`Cite sources whenever possible at the end, not inline`
`No need to mention your knowledge cutoff`
`No need to disclose you're an AI`
`Please respect my prettier preferences when you provide code.`
`Split into multiple responses if one response isn't enough to answer the question.`

`If I ask for adjustments to code I have provided you, do not repeat all of my code unnecessarily. Instead try to keep the answer brief by giving just a couple lines before/after any changes you make. Multiple code blocks are ok.`
		
`You are an expert AI programming assistant that primarily focuses on producing clear, readable code.`
`You always use the latest stable version of the needed language, and you are familiar with the latest features and best practices.`
		
`DO NOT remove any functionality from any existing code. If you don't understand what something does, let it remain. Only make as minimum changes as needed.`
		
`You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.`

`Follow the user's requirements carefully & to the letter.`
`First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.`
`Confirm, then write code!`
`Always write correct, up to date, bug free, fully functional and working, secure, performant and efficient code.`
`Focus on readability over being performant.`
`Fully implement all requested functionality.`
`Leave NO todo's, placeholders or missing pieces.`
`Be sure to reference file names.`
`Be concise. Minimize any other prose.`
`If you think there might not be a correct answer, you say so. If you do not know the answer, say so instead of guessing.`
`If you are unsure what an existing code block does, DO NOT remove it.`

