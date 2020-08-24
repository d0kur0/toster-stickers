import App from "./components/App.svelte";
import StickerPanel from "./components/StickerPanel.svelte";

const injectButton = () => {
  const forms = document.querySelectorAll(".form_answer, .form_comments");
  forms.forEach(form => {
    const panel = form.querySelector(".icons-bar");
    if (!panel) {
      return;
    }

    if (!panel.querySelector(".sticker-button-container")) {
      panel.innerHTML += `<li class="sticker-button-container"></li>`;
      const target = panel.querySelector(".sticker-button-container");

      target &&
        new App({
          target: target,
          props: {},
        });
    }
  });
};

injectButton();

const stickerPanelContainer = document.createElement("div");
stickerPanelContainer.setAttribute("id", "sticker-panel-container");
document.body.appendChild(stickerPanelContainer);

new StickerPanel({
  target: document.getElementById("sticker-panel-container"),
  props: {},
});

let observer = new MutationObserver(mutationRecords => {
  mutationRecords.forEach(record => {
    const isTextareaAdd = [...record.addedNodes].filter(
      (node: HTMLElement) => node.className === "content-list__item",
    );

    isTextareaAdd.length && injectButton();
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterDataOldValue: true,
});
