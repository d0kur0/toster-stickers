<script lang="ts">
  import FaRegSmile from 'svelte-icons/fa/FaRegSmile.svelte'
  export let rootForm: HTMLFormElement = undefined;

  console.log(chrome.runtime.getURL('build/packs.json'));
</script>

<template>
  <button class="injected-button">
    <FaRegSmile class="" />
  </button>
</template>

<style global>
  @import "./styles/injectedButton.css";
</style>