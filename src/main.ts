import App from "./App.svelte";
import StickerPanel from "./StickerPanel.svelte";

const forms = document.querySelectorAll(".form_answer, .form_comments");
forms.forEach(form => {
  const panel = form.querySelector(".icons-bar");
  if (!panel) {
    return;
  }

  panel.innerHTML += `<li class="sticker-button-container"></li>`;
  const target = panel.querySelector(".sticker-button-container");

  target &&
    new App({
      target: target,
      props: {},
    });
});

const stickerPanelContainer = document.createElement("div");
stickerPanelContainer.setAttribute("id", "sticker-panel-container");
document.body.appendChild(stickerPanelContainer);

new StickerPanel({
  target: document.getElementById("sticker-panel-container"),
  props: {},
});
