const startBtn = document.getElementById('startBtn');
const instructions = document.getElementById('instructions');
const form = document.getElementById('confessForm');
const previewEl = document.getElementById('preview');
const previewBox = document.getElementById('previewBox');
const previewBtn = document.getElementById('previewBtn');
const editBtn = document.getElementById('editBtn');
const sendFromPreview = document.getElementById('sendFromPreview');
const status = document.getElementById('status');


startBtn.addEventListener('click', () => {
instructions.classList.add('hidden');
form.classList.remove('hidden');
});


function getFormData() {
return {
sender: document.getElementById('sender').value.trim(),
receiver: document.getElementById('receiver').value.trim(),
anonymous: document.getElementById('anonymous').checked,
message: document.getElementById('message').value.trim()
};
}


previewBtn.addEventListener('click', () => {
const data = getFormData();
if (!data.message) { status.textContent = 'Please write a message before previewing.'; return; }
status.textContent = '';
previewBox.textContent = `To: ${data.receiver || '—'}\nFrom: ${data.anonymous ? 'Anonymous' : (data.sender || '—')}\n\n${data.message}`;
form.classList.add('hidden');
previewEl.classList.remove('hidden');
});


editBtn.addEventListener('click', () => {
previewEl.classList.add('hidden');
form.classList.remove('hidden');
});


async function sendConfession(payload) {
// If you set FRONTEND_SECRET in Vercel, set it here as well in a JS constant (inlined) or better: keep the secret only in compiled frontend env (note: Vercel public env var is visible in client). For stronger protection, omit the secret and rely on moderation server-side.
if (window.FRONTEND_SECRET) payload.secret = window.FRONTEND_SECRET;


const res = await fetch('/api/send', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
return res.json().then(x => ({ status: res.status, body: x })).catch(e => ({ status: 0, body: { error: e.message } }));
}


form.addEventListener('submit', async (e) => {
e.preventDefault();
status.textContent = 'Sending...';
const data = getFormData();
if (!data.message) { status.textContent = 'Message is required.'; return; }
