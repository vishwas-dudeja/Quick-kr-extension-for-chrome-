/* Save & render quick-links using chrome.storage.sync */
const urlInput  = document.getElementById("url-input");
const nameInput = document.getElementById("name-input");
const listEl    = document.getElementById("links-list");
const form      = document.getElementById("save-form");
// ──────────────────────────────────────────────
// Fetch stored links on load
function loadLinks() {
  chrome.storage.sync.get({ links: [] }, ({ links }) => {
    renderList(links);
  });
}
// ──────────────────────────────────────────────
// Render list to the DOM
function renderList(links) {
  listEl.innerHTML = "";
  links.forEach(({ url, name }, idx) => {
    const li = document.createElement("li");
    // link
    const a  = document.createElement("a");
    a.href   = "#";
    a.textContent = name || url;
    a.addEventListener("click", () => chrome.tabs.create({ url }));
    li.appendChild(a);
   // delete button
const delBtn = document.createElement("button");
Object.assign(delBtn.style, {
  marginLeft: "6px",
  marginTop:"0px",
  width:  "16px",          // ⬅ size matches the icon
  height: "16px",
  padding: "0",            // kill default padding
  border:  "none",
  background: "transparent",
  display: "inline-flex",  // center the icon
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer"
});
const icon = document.createElement("img");
icon.src = chrome.runtime.getURL("icons/cross.webp");
icon.alt = "";
icon.style.width  = "100%"; // fill the button
icon.style.height = "100%";
icon.style.display = "block"; // removes tiny whitespace gap
delBtn.appendChild(icon);
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      links.splice(idx, 1);
      chrome.storage.sync.set({ links }, () => renderList(links));
    });
    li.appendChild(delBtn);
    listEl.appendChild(li);
  });
}
// ──────────────────────────────────────────────
// Save new link
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url  = urlInput.value.trim();
  if (!url) return;
  const name = nameInput.value.trim();
  chrome.storage.sync.get({ links: [] }, ({ links }) => {
    links.push({ url, name });
    chrome.storage.sync.set({ links }, () => {
      urlInput.value = "";
      nameInput.value = "";
      renderList(links);
    });
  });
});
document.addEventListener("DOMContentLoaded", loadLinks);