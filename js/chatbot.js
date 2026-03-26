import { API_BASE_URL } from './apiConfig.js';

const CHAT_HISTORY_KEY = 'trk_chat_history_v1';
const QUICK_ACTIONS = [
  {
    label: 'Schedule a Meeting',
    intent: 'I want to schedule a meeting about my project. Please ask me for my name, email, company, preferred time, and what I want to discuss.',
  },
  {
    label: 'Request a Quote',
    intent: 'I want a quote for my project. Please ask me for my name, email, company, project scope, timeline, and budget range.',
  },
  {
    label: 'Upload Requirements',
    intent: 'I want to share project requirements and documents. Please ask me what files I have, what the project is, and how you should review them.',
  },
  {
    label: 'Ask TrkElnIt',
    intent: null,
  },
];

function loadPersistedHistory() {
  try {
    const raw = window.localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((msg) => msg && typeof msg.content === 'string' && msg.content.trim())
      .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));
  } catch {
    return [];
  }
}

let conversationHistory = loadPersistedHistory();
const persistHistory = () => {
  try {
    window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversationHistory));
  } catch {
    // ignore storage failures
  }
};

function hydrateFromTranscript(transcript) {
  if (!Array.isArray(transcript) || transcript.length === 0) return false;
  conversationHistory = transcript
    .filter((msg) => msg && typeof msg.content === 'string' && msg.content.trim())
    .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));
  persistHistory();
  return conversationHistory.length > 0;
}

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
    hydrateFromTranscript(data?.transcript);
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
const floatingEl = document.querySelector('.chat-floating');
let greeted = conversationHistory.length > 0;

if (panel && toggleBtn && closeBtn && logEl && inputEl && sendBtn) {
  let hydrated = false;

  const renderHistory = () => {
    if (hydrated || conversationHistory.length === 0) return;
    conversationHistory.forEach((msg) =>
      appendMessage(logEl, msg.role === 'assistant' ? 'bot' : 'user', msg.content)
    );
    hydrated = true;
    greeted = true;
  };

  const openPanel = async () => {
    panel.classList.remove('hidden');
    toggleBtn.classList.add('hidden');
    if (!hydrated) {
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
      renderHistory();
    }
    if (!greeted) {
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
    if (!floatingEl?.querySelector('.chat-action-rail')) {
      toggleBtn.classList.remove('hidden');
    }
  };

  const triggerIntent = async (intent) => {
    await openPanel();
    if (!intent) return;

    if (conversationHistory.length === 0) {
      inputEl.value = intent;
      await handleSend(inputEl, sendBtn, logEl, errorEl);
      return;
    }

    inputEl.value = intent;
    inputEl.focus();
  };

  if (floatingEl) {
    const actionRail = document.createElement('div');
    actionRail.className = 'chat-action-rail';

    QUICK_ACTIONS.forEach((action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = action.intent ? 'chat-action-button' : 'chat-action-button primary';
      button.textContent = action.label;
      button.addEventListener('click', () => {
        triggerIntent(action.intent);
      });
      actionRail.appendChild(button);
    });

    floatingEl.insertBefore(actionRail, toggleBtn);
    toggleBtn.classList.add('hidden');
  }

  toggleBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  sendBtn.addEventListener('click', () =>
    handleSend(inputEl, sendBtn, logEl, errorEl)
  );
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend(inputEl, sendBtn, logEl, errorEl);
  });
}
