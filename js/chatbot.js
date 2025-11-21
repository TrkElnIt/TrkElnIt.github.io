import { API_BASE_URL } from './apiConfig.js';

let conversationHistory = [];
const persistHistory = () => {
  // no-op: history is kept in-memory only so UI resets when the page reloads
};

let sessionMeta = null;
const sessionMetaPromise = fetch(`${API_BASE_URL}/chat/session`, {
  credentials: 'include',
})
  .then(async (resp) => {
    if (!resp.ok) return null;
    return await resp.json();
  })
  .then((data) => {
    sessionMeta = data;
    return data;
  })
  .catch(() => null);

/* ---------- shared helpers ---------- */
async function sendMessage(message) {
  const resp = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: conversationHistory,
    }),
  });
  if (!resp.ok) throw new Error(`Chatbot error ${resp.status}`);
  return resp.json();
}

function appendMessage(container, role, text) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator(container) {
  const existing = container.querySelector('.chat-msg.bot.typing');
  if (existing) return existing;
  const div = document.createElement('div');
  div.className = 'chat-msg bot typing';
  div.textContent = '… generating';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function removeTypingIndicator(indicator) {
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

async function handleSend(messageInput, sendButton, logEl, errorEl) {
  const message = messageInput.value.trim();
  if (!message) return;

  appendMessage(logEl, 'user', message);
  conversationHistory.push({ role: 'user', content: message });
  persistHistory();
  messageInput.value = '';
  sendButton.disabled = true;
  if (errorEl) errorEl.classList.add('hidden');
  const typing = showTypingIndicator(logEl);

  try {
    const data = await sendMessage(message);
    removeTypingIndicator(typing);
    appendMessage(logEl, 'bot', data.reply);
    conversationHistory.push({ role: 'assistant', content: data.reply });
    persistHistory();
  } catch (err) {
    removeTypingIndicator(typing);
    if (errorEl) {
      errorEl.textContent = err.message || 'Something went wrong.';
      errorEl.classList.remove('hidden');
    } else {
      appendMessage(logEl, 'bot', 'Oops, something went wrong.');
    }
  } finally {
    sendButton.disabled = false;
    messageInput.focus();
  }
}

/* ---------- floating chat panel ---------- */
const panel = document.getElementById('chat-panel');
const toggleBtn = document.getElementById('chat-toggle');
const closeBtn = document.getElementById('chat-close');
const logEl = document.getElementById('chat-log');
const inputEl = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const errorEl = document.getElementById('chat-error');
let greeted = conversationHistory.length > 0;

if (panel && toggleBtn && closeBtn && logEl && inputEl && sendBtn) {
  // hydrate log with stored history
  if (conversationHistory.length > 0) {
    conversationHistory.forEach((msg) =>
      appendMessage(logEl, msg.role === 'assistant' ? 'bot' : 'user', msg.content)
    );
  }

  const openPanel = async () => {
    panel.classList.remove('hidden');
    toggleBtn.classList.add('hidden');
    if (!greeted) {
      let meta = null;
      try {
        meta = await Promise.race([
          sessionMetaPromise,
          new Promise((resolve) => setTimeout(() => resolve(null), 1200)),
        ]);
      } catch (err) {
        meta = null;
      }
      if (meta) {
        sessionMeta = meta;
      }
      if (sessionMeta && sessionMeta.client_name) {
        const topicLine = sessionMeta.topic
          ? ` We last discussed “${sessionMeta.topic}.” Mention it if you'd like to continue.`
          : '';
        appendMessage(
          logEl,
          'bot',
          `Hi ${sessionMeta.client_name}! Would you like to continue where we stopped or start something new?${topicLine}`
        );
      } else {
        appendMessage(
          logEl,
          'bot',
          "Hello! I'm TrkElnIt's assistant. Tell me a bit about your project and I'll help however I can."
        );
      }
      greeted = true;
    }
    inputEl.focus();
  };

  const closePanel = () => {
    panel.classList.add('hidden');
    toggleBtn.classList.remove('hidden');
  };

  toggleBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  sendBtn.addEventListener('click', () =>
    handleSend(inputEl, sendBtn, logEl, errorEl)
  );
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend(inputEl, sendBtn, logEl, errorEl);
  });
}
