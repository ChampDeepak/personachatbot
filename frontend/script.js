const PERSON_LABELS = {
  kshitij: "Kshitij",
  anshuman: "Anshuman",
  abhimanyu: "Abhimanyu",
};

const DEFAULT_API_URL = "https://personachatbot-s2su.onrender.com";

const $messages = document.getElementById("messages");
const $form = document.getElementById("form");
const $query = document.getElementById("query");
const $send = document.getElementById("send");
// const $apiUrl = document.getElementById("apiUrl");

// const savedApiUrl = localStorage.getItem("apiUrl") || DEFAULT_API_URL;
// $apiUrl.value = savedApiUrl;
// $apiUrl.addEventListener("change", () => {
//   localStorage.setItem("apiUrl", $apiUrl.value.trim() || DEFAULT_API_URL);
// });

function getApiBase() {
  return  DEFAULT_API_URL.replace(/\/+$/, "");
}

function getSelectedPerson() {
  const checked = document.querySelector('input[name="person"]:checked');
  return checked ? checked.value : "kshitij";
}

let currentPerson = getSelectedPerson();
document.querySelectorAll('input[name="person"]').forEach((el) => {
  el.addEventListener("change", () => {
    const next = getSelectedPerson();
    if (next === currentPerson) return;
    currentPerson = next;
    $messages.innerHTML = "";
    appendMessage("bot", `Switched to ${PERSON_LABELS[next]}. Ask a fresh question.`, {
      who: PERSON_LABELS[next],
    });
  });
});

function appendMessage(role, text, opts = {}) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  if (opts.error) div.classList.add("error");
  if (opts.loading) div.classList.add("loading");

  if (role === "bot" && opts.who) {
    const who = document.createElement("span");
    who.className = "who";
    who.textContent = opts.who;
    div.appendChild(who);
  }
  const body = document.createElement("span");
  body.textContent = text;
  div.appendChild(body);

  $messages.appendChild(div);
  $messages.scrollTop = $messages.scrollHeight;
  return div;
}

async function sendQuery(person, message) {
  const res = await fetch(`${getApiBase()}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ person, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = $query.value.trim();
  if (!message) return;

  const person = getSelectedPerson();
  appendMessage("user", message);
  $query.value = "";
  $send.disabled = true;

  const loadingNode = appendMessage("bot", "Thinking…", {
    loading: true,
    who: PERSON_LABELS[person],
  });

  try {
    const data = await sendQuery(person, message);
    loadingNode.remove();
    appendMessage("bot", data.reply ?? "(empty response)", {
      who: data.label || PERSON_LABELS[person],
    });
  } catch (err) {
    loadingNode.remove();
    appendMessage("bot", `Error: ${err.message}`, { error: true });
  } finally {
    $send.disabled = false;
    $query.focus();
  }
});

$query.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    $form.requestSubmit();
  }
});
