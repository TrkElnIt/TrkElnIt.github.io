import { API_BASE_URL } from './apiConfig.js';

const SESSION_STORAGE_KEY = 'trkChatSession';
const HISTORY_STORAGE_KEY = 'trkChatHistory';

let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
}

let conversationHistory = [];
const persistHistory = () => {
  // no-op: history is kept in-memory only so UI resets when the page reloads
};

/* ---------- shared helpers ---------- */
async function sendMessage(message) {
  const resp = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
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

  const openPanel = () => {
    panel.classList.remove('hidden');
    toggleBtn.classList.add('hidden');
    if (!greeted) {
      appendMessage(
        logEl,
        'bot',
        "Hello! I'm TrkElnIt's assistant. Tell me a bit about your project and I'll help however I can."
      );
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
