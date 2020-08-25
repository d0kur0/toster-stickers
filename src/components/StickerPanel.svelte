<script>
  import { panelStore, rootStore, lastUsedStickersStore } from "../globalStores";
  import FaRegClock from "svelte-icons/fa/FaRegClock.svelte";
  import PackList from "./PackList.svelte";
  import { enableButtons } from "../utils/enableButtons";

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

  const handleImageLoad = ({ target }) => {
    target.parentNode.classList.remove("sticker-panel__button-loading", "sticker-panel__button-loading--mini");
    target.parentNode.removeAttribute("disabled");
  };
</script>

<template>
  <svelte:body on:click={handleBodyClick} />

  <div
    class="sticker-panel"
    style="top: {$panelStore.topOffset}px; left: {$panelStore.leftOffset}px;"
    bind:this={$panelStore.selfElement}
    class:sticker-panel--visible={$panelStore.isOpen} tabindex="0"
  >
    <ul class="sticker-panel__list">
      <li class="sticker-panel__list-item">
        <button on:click={panelStore.clearSelectPack} class="sticker-panel__last-used" data-name="Недавние">
          <FaRegClock />
        </button>
      </li>

      {#each $rootStore.packs as pack}
        <li class="sticker-panel__list-item">
          <button
            disabled
            class="sticker-panel__button-loading sticker-panel__button-loading--mini"
            on:click={() => handleSelectPack(pack.name)}
          >
            <img on:load={handleImageLoad} src={pack.images[0]} alt={pack.name} />
          </button>
        </li>
      {/each}
    </ul>

    <div class="sticker-panel__pack">
      {#if $panelStore.selectedPack}
        <h4 class="sticker-panel__pack-name">{$panelStore.selectedPack}</h4>
        <PackList {handleImageLoad} images={selectedPack.images} />
      {:else}
        <h4 class="sticker-panel__pack-name">Последнее использованное</h4>
        <PackList {handleImageLoad} images={$lastUsedStickersStore} />
      {/if}
    </div>
  </div>
</template>
