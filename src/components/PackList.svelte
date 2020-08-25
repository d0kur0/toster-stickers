<script>
  import { lastUsedStickersStore, panelStore, rootStore } from "../globalStores";
  import { enableButtons } from "../utils/enableButtons";

  export let images = [];
  export let handleImageLoad = () => {};

  const handleSelectSticker = image => {
    $rootStore.activeTextarea.value += `\n<img src="${image}" />\n`;
    panelStore.closePanel();
    panelStore.clearSelectPack();
    lastUsedStickersStore.add(image);

    enableButtons();
  };
</script>

<template>
  <ul class="sticker-panel__pack-list">
    {#each images as image}
      <li class="sticker-panel__pack-list-item">
        <button
          disabled
          class="sticker-panel__button-loading"
          on:click={() => handleSelectSticker(image)}>
          <img on:load={handleImageLoad} src={image} alt="Sticker" loading="lazy" />
        </button>
      </li>
    {/each}
  </ul>
</template>
