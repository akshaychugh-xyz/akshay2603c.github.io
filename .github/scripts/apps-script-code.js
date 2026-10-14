/**
 * Google Apps Script for Newsletter Subscription Management
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Copy this entire file content into the script editor
 * 3. Update the CONFIG section below with your values
 * 4. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL and add it to:
 *    - assets/js/script.js (APPS_SCRIPT_URL constant)
 *    - GitHub Secrets (APPS_SCRIPT_URL)
 */

// ============== CONFIG ==============
const CONFIG = {
  // Your Google Sheet ID (from the URL: docs.google.com/spreadsheets/d/{SHEET_ID}/edit)
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',

  // Your Resend API key (for sending confirmation emails)
  RESEND_API_KEY: 'YOUR_RESEND_API_KEY_HERE',

  // Email settings
  SENDER_EMAIL: 'hi@subscribe.akshaychugh.xyz',
  SENDER_NAME: 'Akshay Chugh',

  // Your website URL
  SITE_URL: 'https://akshaychugh.xyz',

  // This Apps Script deployment URL (fill in after first deployment)
  APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL_HERE',
};
// ====================================

/**
 * Handle GET requests (confirm, unsubscribe)
 */
function doGet(e) {
  const action = e.parameter.action;
  const token = e.parameter.token;

  if (action === 'confirm' && token) {
    return handleConfirm(token);
  } else if (action === 'unsubscribe' && token) {
    return handleUnsubscribe(token);
  }

  return HtmlService.createHtmlOutput('<h1>Invalid request</h1>');
}

/**
 * Handle POST requests (subscribe)
 *
 * Every outcome returns the same generic success body, so a bot can't tell
 * whether it was dropped. Only submissions that pass passesSpamGuard() reach
 * the sheet or trigger a confirmation email.
 */
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const email = String(data.email || '').trim();

    if (!email || !isValidEmail(email)) {
      return genericOk();
    }

    const verdict = passesSpamGuard(data, email.toLowerCase());
    if (!verdict.ok) {
      // Domain + reason only; no full address in logs.
      console.log('Subscribe dropped: ' + verdict.reason + ' (@' + email.split('@').pop() + ')');
      return genericOk();
    }

    handleSubscribe(email);
    return genericOk();
  } catch (error) {
    console.error('Error in doPost:', error);
    return genericOk();
  }
}

// ============== SPAM GUARD (BEGIN) ==============
const SPAM_GUARD = {
  MIN_ELAPSED_MS: 2500,          // humans need > 2.5s to type an email and click
  MAX_ELAPSED_MS: 24 * 60 * 60 * 1000, // ignore absurd values (forged / stale)
  GLOBAL_MAX_PER_WINDOW: 5,      // signups allowed site-wide per window
  GLOBAL_WINDOW_SEC: 600,        // 10 minutes
  PER_EMAIL_WINDOW_SEC: 21600,   // 6h (CacheService max): 1 confirmation mail per address
  MAX_GMAIL_DOTS: 2,             // a.b.c.d@gmail.com = 3 dots = bot pattern
  BLOCKED_DOMAINS: [
    // SMS / MMS email-to-text gateways
    'txt.att.net', 'mms.att.net', 'vtext.com', 'vzwpix.com', 'tmomail.net',
    'messaging.sprintpcs.com', 'pm.sprint.com', 'mymetropcs.com',
    'sms.myboostmobile.com', 'myboostmobile.com', 'sms.cricketwireless.net',
    'mms.cricketwireless.net', 'msg.fi.google.com', 'email.uscc.net',
    'mms.uscc.net', 'vmobl.com', 'text.republicwireless.com',
    'txt.bell.ca', 'pcs.rogers.com', 'msg.telus.com',
  ],
};

function passesSpamGuard(data, email) {
  // 1. Honeypot: hidden field humans never see. Anything in it = bot.
  if (data.website) return { ok: false, reason: 'honeypot' };

  // 2. Must come from the current form (v2 sends elapsed_ms). Direct POSTs of
  //    just {email} to this public URL fail here.
  if (data.v !== 2) return { ok: false, reason: 'missing-form-fields' };
  const elapsed = Number(data.elapsed_ms);
  if (!isFinite(elapsed) || elapsed < SPAM_GUARD.MIN_ELAPSED_MS || elapsed > SPAM_GUARD.MAX_ELAPSED_MS) {
    return { ok: false, reason: 'timing' };
  }

  // 3. Address patterns bots use.
  const at = email.lastIndexOf('@');
  const local = email.slice(0, at).split('+')[0];
  const domain = email.slice(at + 1);
  if ((domain === 'gmail.com' || domain === 'googlemail.com') &&
      (local.match(/\./g) || []).length > SPAM_GUARD.MAX_GMAIL_DOTS) {
    return { ok: false, reason: 'dotted-gmail' };
  }
  if (SPAM_GUARD.BLOCKED_DOMAINS.indexOf(domain) !== -1) {
    return { ok: false, reason: 'sms-gateway' };
  }

  // 4. Rate limits (CacheService; best effort, no lock needed at this volume).
  const cache = CacheService.getScriptCache();
  const emailKey = 'sub:' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email)
  ).slice(0, 40);
  if (cache.get(emailKey)) return { ok: false, reason: 'per-email-rate' };

  const bucket = Math.floor(Date.now() / (SPAM_GUARD.GLOBAL_WINDOW_SEC * 1000));
  const globalKey = 'subs:' + bucket;
  const count = Number(cache.get(globalKey) || 0);
  if (count >= SPAM_GUARD.GLOBAL_MAX_PER_WINDOW) return { ok: false, reason: 'global-rate' };

  cache.put(globalKey, String(count + 1), SPAM_GUARD.GLOBAL_WINDOW_SEC);
  cache.put(emailKey, '1', SPAM_GUARD.PER_EMAIL_WINDOW_SEC);
  return { ok: true };
}

function genericOk() {
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: 'Check your inbox to confirm.' })
  ).setMimeType(ContentService.MimeType.JSON);
}
// ============== SPAM GUARD (END) ==============

/**
 * Handle new subscription
 */
function handleSubscribe(email) {
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // Check if email already exists
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      const status = data[i][2];
      if (status === 'active') {
        return { success: true, message: 'Already subscribed' };
      } else if (status === 'pending') {
        // Resend confirmation email
        const token = data[i][1];
        sendConfirmationEmail(email, token);
        return { success: true, message: 'Confirmation email resent' };
      } else if (status === 'unsubscribed') {
        // Resubscribe: generate new token, set to pending
        const newToken = generateToken();
        sheet.getRange(i + 1, 2).setValue(newToken); // token
        sheet.getRange(i + 1, 3).setValue('pending'); // status
        sheet.getRange(i + 1, 4).setValue(new Date().toISOString()); // subscribed_at
        sheet.getRange(i + 1, 5).setValue(''); // confirmed_at
        sheet.getRange(i + 1, 6).setValue(''); // unsubscribed_at
        sendConfirmationEmail(email, newToken);
        return { success: true, message: 'Confirmation email sent' };
      }
    }
  }

  // New subscriber
  const token = generateToken();
  sheet.appendRow([email, token, 'pending', new Date().toISOString(), '']);

  // Send confirmation email
  sendConfirmationEmail(email, token);

  return { success: true, message: 'Confirmation email sent' };
}

/**
 * Handle email confirmation
 */
function handleConfirm(token) {
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === token) {
      if (data[i][2] === 'active') {
        return createHtmlPage(
          'Already Confirmed',
          "You're already subscribed! Thanks for being a reader.",
          true
        );
      }

      // Update status to active
      sheet.getRange(i + 1, 3).setValue('active');
      sheet.getRange(i + 1, 5).setValue(new Date().toISOString());

      return createHtmlPage(
        'Subscription Confirmed!',
        "You're now subscribed. You'll receive an email whenever I publish something new.",
        true
      );
    }
  }

  return createHtmlPage('Invalid Link', 'This confirmation link is invalid or has expired.', false);
}

/**
 * Handle unsubscribe
 */
function handleUnsubscribe(token) {
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === token) {
      if (data[i][2] === 'unsubscribed') {
        return createHtmlPage(
          'Already Unsubscribed',
          "You've already been unsubscribed from the newsletter.",
          true
        );
      }

      // Update status to unsubscribed
      sheet.getRange(i + 1, 3).setValue('unsubscribed');
      sheet.getRange(i + 1, 6).setValue(new Date().toISOString());

      return createHtmlPage(
        'Unsubscribed',
        "You've been unsubscribed. Sorry to see you go!",
        true
      );
    }
  }

  return createHtmlPage('Invalid Link', 'This unsubscribe link is invalid.', false);
}

/**
 * Send confirmation email via Resend
 */
function sendConfirmationEmail(email, token) {
  const confirmUrl = `${CONFIG.APPS_SCRIPT_URL}?action=confirm&token=${token}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      color: #1C1B1A;
      max-width: 480px;
      margin: 0 auto;
      padding: 20px;
      font-size: 16px;
    }
    p { margin: 0 0 16px; }
    .btn {
      display: inline-block;
      background-color: #DA702C;
      color: #FFFFFF !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 8px 0 20px;
    }
    .muted {
      color: #878580;
      font-size: 14px;
    }
    .link { color: #4385BE; word-break: break-all; }
  </style>
</head>
<body>
  <p>Hey there!</p>

  <p>Just one quick click to confirm you want to hear from me when I publish new writing:</p>

  <a href="${confirmUrl}" class="btn">Yes, I'm in</a>

  <p class="muted">Or paste this link: <span class="link">${confirmUrl}</span></p>

  <p>Thanks for the interest — looking forward to sharing with you.</p>

  <p>Akshay</p>

  <p class="muted" style="margin-top: 30px;">Didn't request this? Just ignore it, nothing will happen.</p>
</body>
</html>
`;

  const textBody = `Hey there!

Just one quick click to confirm you want to hear from me when I publish new writing:

${confirmUrl}

Thanks for the interest — looking forward to sharing with you.

Akshay

---
Didn't request this? Just ignore it, nothing will happen.`;

  const payload = {
    from: `${CONFIG.SENDER_NAME} <${CONFIG.SENDER_EMAIL}>`,
    to: email,
    subject: "Quick confirm?",
    html: htmlBody,
    text: textBody,
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${CONFIG.RESEND_API_KEY}`,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch('https://api.resend.com/emails', options);
    const result = JSON.parse(response.getContentText());
    console.log('Confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

/**
 * Generate a random token
 */
function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Create HTML response page
 */
function createHtmlPage(title, message, success) {
  const iconBg = success ? '#E8F5E9' : '#FFEBEE';
  const iconColor = success ? '#DA702C' : '#D14D41';
  const icon = success ? '&#10003;' : '&#10007;';

  return HtmlService.createHtmlOutput(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #FFFCF0 0%, #F2F0E5 100%);
      color: #1C1B1A;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #FFFFFF;
      padding: 48px 40px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      text-align: center;
      max-width: 380px;
      width: 100%;
    }
    .icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background-color: ${iconBg};
      color: ${iconColor};
      font-size: 36px;
      line-height: 72px;
      margin: 0 auto 24px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 1.6em;
      font-weight: 600;
      color: #1C1B1A;
    }
    p {
      color: #6F6E69;
      margin: 0 0 28px;
      font-size: 1em;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      background-color: #DA702C;
      color: #FFFFFF;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95em;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(218, 112, 44, 0.3);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${CONFIG.SITE_URL}" class="btn">Back to blog</a>
  </div>
</body>
</html>
`);
}
