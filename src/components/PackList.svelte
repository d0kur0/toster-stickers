<script>
  import { lastUsedStickersStore, panelStore, rootStore } from "../globalStores";

  export let images = [];

  const handleSelectSticker = image => {
    $rootStore.activeTextarea.value += `\n<img src="${image}" />\n`;
    panelStore.closePanel();
    panelStore.clearSelectPack();
    lastUsedStickersStore.add(image);

    // fix toster bug, then submit button disabled before insert sticker
    document
      .querySelectorAll("button.btn.btn_outline_green")
      .forEach(button => (button.disabled = false));
  };
</script>

<template>
  <ul class="sticker-panel__pack-list">
    {#each images as image}
      <li class="sticker-panel__pack-list-item">
        <button on:click={() => handleSelectSticker(image)}>
          <img src={image} alt="Sticker" />
        </button>
      </li>
    {/each}
  </ul>
</template>
