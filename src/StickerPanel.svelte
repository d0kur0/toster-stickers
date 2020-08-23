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
          <button data-name={pack.name}>
            <img src={pack.images[0]} alt={pack.name} />
          </button>
        </li>
      {/each}
    </ul>
  </div>
</template>
