import { Resend } from 'resend';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configuration
const SENDER_EMAIL = 'hi@subscribe.akshaychugh.xyz';
const SENDER_NAME = 'Akshay Chugh';
const SITE_URL = 'https://akshaychugh.xyz';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Google Sheets
async function getGoogleSheetsClient() {
  // Handle both raw JSON and base64-encoded credentials
  let credentials;
  const credentialsEnv = process.env.GOOGLE_CREDENTIALS;

  try {
    // First try parsing as raw JSON
    credentials = JSON.parse(credentialsEnv);
  } catch {
    // If that fails, try base64 decoding first
    credentials = JSON.parse(
      Buffer.from(credentialsEnv, 'base64').toString('utf-8')
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Get active subscribers from Google Sheet
async function getActiveSubscribers() {
  const sheets = await getGoogleSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:C', // email, token, status columns
  });

  const rows = response.data.values || [];
  // Skip header row, filter for active subscribers
  return rows
    .slice(1)
    .filter(row => row[2] === 'active')
    .map(row => ({
      email: row[0],
      token: row[1],
    }));
}

// Find the new post file from git diff
async function findNewPost() {
  // Get list of changed files from environment or git
  const changedFiles = process.env.CHANGED_FILES?.split('\n').map(f => f.trim()).filter(f => f) || [];

  // Script runs from .github/scripts/, so go up two levels to repo root
  const repoRoot = path.resolve(process.cwd(), '..', '..');

  console.log(`Looking for posts in: ${repoRoot}`);
  console.log(`Changed files: ${JSON.stringify(changedFiles)}`);

  for (const file of changedFiles) {
    if (file.startsWith('_posts/') && file.endsWith('.md')) {
      const fullPath = path.join(repoRoot, file);
      console.log(`Checking: ${fullPath}`);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
  }

  return null;
}

// Parse post frontmatter and content
function parsePost(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  return {
    title: frontmatter.title,
    permalink: frontmatter.permalink,
    newsletter: frontmatter.newsletter === true,
    content: content,
    categories: frontmatter.categories || [],
  };
}

// Convert markdown to HTML for email
function markdownToHtml(markdownContent) {
  return marked(markdownContent);
}

// Generate email HTML
function generateEmailHtml(post, unsubscribeUrl) {
  const postUrl = `${SITE_URL}${post.permalink}`;
  const htmlContent = markdownToHtml(post.content);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #1C1B1A;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 { font-size: 1.8em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.3em; }
    a { color: #4385BE; }
    pre {
      background-color: #F2F0E5;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
    }
    code {
      background-color: #F2F0E5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Source Code Pro', monospace;
    }
    blockquote {
      border-left: 4px solid #878580;
      margin: 1em 0;
      padding-left: 1em;
      color: #6F6E69;
    }
    img { max-width: 100%; height: auto; }
    hr { border: none; border-top: 1px solid #DAD8CE; margin: 2em 0; }
    .footer {
      margin-top: 3em;
      padding-top: 1em;
      border-top: 1px solid #DAD8CE;
      font-size: 0.9em;
      color: #6F6E69;
    }
    .footer a { color: #6F6E69; }
  </style>
</head>
<body>
  <h1>${post.title}</h1>

  ${htmlContent}

  <hr>

  <p><a href="${postUrl}">Read on the web &rarr;</a></p>

  <div class="footer">
    <p>
      You received this because you subscribed to updates from Akshay's blog.<br>
      <a href="${unsubscribeUrl}">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
`;
}

// Generate plain text version
function generateEmailText(post, unsubscribeUrl) {
  const postUrl = `${SITE_URL}${post.permalink}`;

  return `
${post.title}

${post.content}

---

Read on the web: ${postUrl}

---

You received this because you subscribed to updates from Akshay's blog.
Unsubscribe: ${unsubscribeUrl}
`;
}

// Send newsletter to all subscribers
async function sendNewsletter(post, subscribers) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  console.log(`Sending newsletter: "${post.title}" to ${subscribers.length} subscribers`);

  let successCount = 0;
  let errorCount = 0;

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${appsScriptUrl}?action=unsubscribe&token=${subscriber.token}`;

    try {
      await resend.emails.send({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: subscriber.email,
        subject: `New post: ${post.title}`,
        html: generateEmailHtml(post, unsubscribeUrl),
        text: generateEmailText(post, unsubscribeUrl),
      });

      successCount++;
      console.log(`  Sent to: ${subscriber.email}`);

      // Rate limiting: Resend allows 2 requests/second on free tier
      await new Promise(resolve => setTimeout(resolve, 600));
    } catch (error) {
      errorCount++;
      console.error(`  Failed to send to ${subscriber.email}:`, error.message);
    }
  }

  console.log(`\nNewsletter sent: ${successCount} success, ${errorCount} failed`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('Newsletter Send Script');
  console.log('======================\n');

  // Find the new post
  const postPath = await findNewPost();
  if (!postPath) {
    console.log('No new post found in _posts/');
    return;
  }

  console.log(`Found post: ${postPath}`);

  // Parse the post
  const post = parsePost(postPath);
  console.log(`Title: ${post.title}`);
  console.log(`Newsletter flag: ${post.newsletter}`);

  // Check if newsletter should be sent
  if (!post.newsletter) {
    console.log('\nNewsletter flag is not set to true. Skipping send.');
    return;
  }

  // Get subscribers
  const subscribers = await getActiveSubscribers();
  console.log(`\nActive subscribers: ${subscribers.length}`);

  if (subscribers.length === 0) {
    console.log('No active subscribers. Nothing to send.');
    return;
  }

  // Send the newsletter
  await sendNewsletter(post, subscribers);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
