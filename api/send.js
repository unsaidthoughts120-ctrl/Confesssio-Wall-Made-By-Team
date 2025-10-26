// Vercel Serverless Function — forwards confession to Telegram
// Expects environment variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });


try {
const { secret, sender, receiver, anonymous, message } = req.body || {};


// Optional frontend secret to avoid abuse — set FRONTEND_SECRET in Vercel and send from frontend
if (process.env.FRONTEND_SECRET) {
if (!secret || secret !== process.env.FRONTEND_SECRET) {
return res.status(401).json({ error: 'Unauthorized' });
}
}


if (!message || typeof message !== 'string' || message.trim().length === 0) {
return res.status(400).json({ error: 'Message required' });
}


const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;


if (!botToken || !chatId) {
return res.status(500).json({ error: 'Server not configured' });
}


// Build a nicely formatted message for Telegram
const safeSender = anonymous ? 'Anonymous' : (sender || 'Someone');
const safeReceiver = receiver ? `for *${escapeMarkdown(receiver)}*` : '';
const text = `💌 *New Confession*\n${safeReceiver}\n` +
`*From:* ${escapeMarkdown(safeSender)}\n\n` +
`${escapeMarkdown(message.trim())}`;


const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;


const payload = {
chat_id: chatId,
parse_mode: 'Markdown',
text
};


const r = await fetch(tgUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});


const data = await r.json();


if (!r.ok) return res.status(502).json({ error: 'Telegram API error', details: data });


return res.status(200).json({ ok: true });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Internal server error' });
}
}
}
