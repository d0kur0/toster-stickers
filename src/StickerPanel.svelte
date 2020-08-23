<script>
  import { panelStore, rootStore } from "./globalStores";
</script>

<style>
  @import "./styles/stickerPanel.css";
</style>

<template>
  <div class="sticker-panel">
    <ul class="sticker-panel__list">
      {#each $rootStore.packs as pack}
        <li class="sticker-panel__list-item">
          <img src={pack.images[0]} />
        </li>
      {/each}
    </ul>
  </div>
</template>
