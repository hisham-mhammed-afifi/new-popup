import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

// const cssLink = "./popup.css";
const cssLink = "https://hisham-mhammed-afifi.github.io/new-popup/popup.css";

const socket = io("ws://localhost:8080");
let divEl = document.createElement("div");
let ulEl = document.createElement("ul");
let sendEl = document.createElement("div");
let btnEl = document.createElement("button");
let inptEl = document.createElement("input");

let messages = [
  { customerId: window.userId, text: "hello, how r u ?" },
  { customerId: 0, text: "hello, how r u ?" },
];

messages = messages.map((msg) => {
  let cls = msg.customerId ? "right" : "left";
  return `<li class='${cls}'>
    <span>${msg.text}</span>
    </li>`;
});

socket.on("connect", () => {
  console.log(socket.id);
  loadCss(cssLink);
  loadPopup();

  socket.emit("joinCustomers", getUserID());

  socket.on("receive", (message) => {
    console.log(message);
    loadMessage(message);
  });
});

function getUserID() {
  let userId = localStorage.getItem("uniqueID");
  if (!userId) {
    localStorage.setItem("uniqueID", Date.now());
  }
  window.userId = userId;
  return userId;
}

function loadCss(src) {
  let linkEl = document.createElement("link");
  linkEl.rel = "stylesheet";
  linkEl.href = src;
  document.head.insertAdjacentElement("beforeend", linkEl);
}

function loadPopup() {
  getUserID();

  btnEl.innerText = "send";
  divEl.classList.add("popup-container");
  sendEl.classList.add("popup-send");

  sendEl.insertAdjacentElement("afterbegin", inptEl);
  sendEl.insertAdjacentElement("beforeend", btnEl);

  ulEl.innerHTML = messages.join("");
  divEl.insertAdjacentElement("afterbegin", ulEl);
  divEl.insertAdjacentElement("beforeend", sendEl);

  document.body.insertAdjacentElement("afterbegin", divEl);

  btnEl.onclick = function sendMessage() {
    let message = {
      sendTime: formatAMPM(new Date()),
      msg: {
        customerId: window.userId,
        text: inptEl.value,
      },
    };

    socket.emit("help", message);

    loadMessage(message);
  };
}

function formatAMPM(date) {
  let h = date.getHours();
  let m = date.getMinutes();
  let ampm = h >= 12 ? "pm" : "am";
  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? "0" + m : m;
  return h + ":" + m + " " + ampm;
}

function loadMessage(message) {
  let cls = !message.msg.userId ? "right" : "left";
  const newMsg = `<li class='${cls}'>
    <span>${message.msg.text}</span>
    </li>`;
  messages.push(newMsg);
  ulEl.innerHTML = messages.join("");
  inptEl.value = "";
  inptEl.focus();
}
