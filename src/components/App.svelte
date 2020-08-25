<script lang="ts">
  import FaRegSmile from "svelte-icons/fa/FaRegSmile.svelte";
  import { panelStore, rootStore } from "../globalStores";

  const handleOpenPanel = event => {
    event.preventDefault();

    const { target } = event;
    const rects = target.getBoundingClientRect();

    const textarea: HTMLTextAreaElement = target?.parentElement?.parentElement?.parentElement?.parentElement?.querySelector(
      "textarea",
    );

    rootStore.setTextarea(textarea);

    if (rects && $panelStore.selfElement) {
      const topOffset = rects.top + rects.height + 10 + window.scrollY;
      const leftOffset = rects.left - ($panelStore.selfElement.offsetWidth - rects.width / 2) / 2;

      panelStore.setOffsets({ topOffset, leftOffset });
      panelStore.openPanel();
    }
  };
</script>

<style global>
  @import "../styles/injectedButton.css";
  @import "../styles/stickerPanel.css";
  @import "../styles/pasteImage.css";
</style>

<template>
  <button class="injected-button" on:click={handleOpenPanel}>
    <FaRegSmile />
  </button>
</template>
