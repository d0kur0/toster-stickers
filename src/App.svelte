<script lang="ts">
  import FaRegSmile from "svelte-icons/fa/FaRegSmile.svelte";
  import { panelStore } from "./globalStores";
  import StickerPanel from "./StickerPanel.svelte";

  const handleOpenPanel = event => {
    event.preventDefault();
    const { target } = event;
    const rects = target.getClientRects();
    panelStore.openPanel();
  };
</script>

<style global>
  @import "./styles/injectedButton.css";
</style>

<template>
  <button class="injected-button" on:click={handleOpenPanel}>
    <FaRegSmile />
  </button>
</template>
