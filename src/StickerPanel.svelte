<script>
  import { panelStore, rootStore } from "./globalStores";
  import FaRegClock from "svelte-icons/fa/FaRegClock.svelte";

  let selectedPack;

  $: selectedPack = $rootStore.packs
    .filter(({ name }) => name === $panelStore.selectedPack)
    .shift();

  const handleSelectPack = packName => {
    panelStore.selectPack(packName);
    selectedPack = undefined;

    const firstSticker = document.querySelector(".sticker-panel__pack-list-item button");
    firstSticker && firstSticker.focus();
  };

  const handleBodyClick = ({ target }) => {
    if (!target.closest(".sticker-panel, .injected-button")) panelStore.closePanel();
  };

  const handleBodyScroll = () => panelStore.closePanel();

  const handleSelectSticker = image => {
    $rootStore.activeTextarea.value += `\n<img src="${image}" />\n`;
    panelStore.closePanel();
  };
</script>

<template>
  <svelte:body on:scroll={handleBodyScroll} on:click={handleBodyClick} />

  <div
    class="sticker-panel"
    style="top: {$panelStore.topOffset}px; left: {$panelStore.leftOffset}px;"
    bind:this={$panelStore.selfElement}
    class:sticker-panel--visible={$panelStore.isOpen} tabindex="0"
  >
    <ul class="sticker-panel__list">
      <li class="sticker-panel__list-item">
        <button class="sticker-panel__last-used" data-name="Недавние">
          <FaRegClock />
        </button>
      </li>

      {#each $rootStore.packs as pack}
        <li class="sticker-panel__list-item">
          <button data-name={pack.name} on:click={() => handleSelectPack(pack.name)}>
            <img src={pack.images[0]} alt={pack.name} />
          </button>
        </li>
      {/each}
    </ul>

    <div class="sticker-panel__pack">
      {#if $panelStore.selectedPack}
        <ul class="sticker-panel__pack-list">
          {#each selectedPack.images as image}
            <li class="sticker-panel__pack-list-item">
              <button on:click={() => handleSelectSticker(image)}>
                <img src={image} alt="Sticker" />
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</template>
