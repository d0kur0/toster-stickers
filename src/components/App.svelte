<script lang="ts">
  import FaRegSmile from "svelte-icons/fa/FaRegSmile.svelte";
  import { panelStore, rootStore } from "../globalStores";

  const handleOpenPanel = event => {
    event.preventDefault();

    const { target } = event;
    const rects = target.getBoundingClientRect();

    const textarea: HTMLTextAreaElement = target?.parentElement?.parentElement?.parentElement?.parentElement?.querySelector(
      "textarea.field__input",
    );

    rootStore.setTextarea(textarea);

    if (rects && $panelStore.selfElement) {
      const topOffset = rects.top + rects.height + 10 + window.scrollY;
      const leftOffset = rects.left - ($panelStore.selfElement.offsetWidth - rects.width / 2) / 2;

      panelStore.setOffsets({ topOffset, leftOffset });
      panelStore.openPanel();
    }
  };

  const handlePaste = event => {
    const items = event.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      console.log(items[i].type);
      if (items[i].type.indexOf("image") === -1) continue;

      const blob: Blob = items[i].getAsFile();
      const formData = new FormData();
      formData.append("files", blob);

      fetch("https://qna.habr.com/upload?profile=fhd", {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer: window.location.href,
        referrerPolicy: "no-referrer-when-downgrade",
        body: formData,
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
    }
  };

  document.addEventListener("paste", handlePaste);
</script>

<style global>
  @import "../styles/injectedButton.css";
  @import "../styles/stickerPanel.css";
</style>

<template>
  <button class="injected-button" on:click={handleOpenPanel}>
    <FaRegSmile />
  </button>
</template>
