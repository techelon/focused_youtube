function enforce(ev) {
    ev.preventDefault();
    const data = new FormData(ev.target);
    const mins = Number.parseInt(data.get("hours")) * 60 + Number.parseInt(data.get("minutes"));
    const newUnblock = new Date().getTime() + mins * 60000;
    if (newUnblock > unblock) {
        localStorage.unblock = newUnblock;
        chrome.storage.local.set({ unblock: newUnblock });
    } else
        alert("A lockout is already running!");
    showEnd();
}


let unblock;
function showEnd() {
    unblock = Number.parseInt(localStorage.unblock || 0);
    if (new Date().getTime() < unblock)
        document.getElementById("unblock").innerText = "Will unblock at " + new Date(unblock).toLocaleTimeString();
}


document.getElementById("form").onsubmit = enforce;
const clearMe = ev => ev.target.value = '';
for (const input of document.getElementsByTagName("input"))
    input.onclick = clearMe;
showEnd();
