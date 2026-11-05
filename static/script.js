const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chips = document.getElementById("chips");

// If you embed this on another site, set this to your deployed backend URL, e.g. "https://your-app.onrender.com"
const API_BASE = "";

const history = [];

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Tiny, safe markdown: **bold**, links, "- " bullets, line breaks
function formatReply(text) {
  const lines = escapeHtml(text).split("\n");
  let html = "";
  let inList = false;
  for (const line of lines) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    if (bullet) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(bullet[1])}</li>`;
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      if (line.trim()) html += `<p>${inline(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

function inline(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

function addMessage(text, who, isError = false) {
  const div = document.createElement("div");
  div.className = `msg ${who}${isError ? " error" : ""}`;
  if (who === "bot" && !isError) div.innerHTML = formatReply(text);
  else div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.innerHTML = "<span></span><span></span><span></span>";
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

async function sendMessage(text) {
  text = text.trim();
  if (!text) return;

  chips.style.display = "none";
  addMessage(text, "user");
  history.push({ role: "user", content: text });
  input.value = "";
  sendBtn.disabled = true;
  input.disabled = true;

  const typing = showTyping();
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    typing.remove();
    if (!res.ok) {
      addMessage(data.error || "Something went wrong.", "bot", true);
      history.pop();
    } else {
      addMessage(data.reply, "bot");
      history.push({ role: "assistant", content: data.reply });
    }
  } catch (err) {
    typing.remove();
    addMessage("Cannot reach the server. Is the Flask app running?", "bot", true);
    history.pop();
  } finally {
    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage(input.value);
});

chips.querySelectorAll(".chip").forEach((chip) =>
  chip.addEventListener("click", () => sendMessage(chip.textContent))
);

addMessage(
  "Hi! I'm 🐝 ChatBee, Haseeba Maqsood's portfolio assistant. Ask me about her skills, projects, experience, or education!",
  "bot"
);
