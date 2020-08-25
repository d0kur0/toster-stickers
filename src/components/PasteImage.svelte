<script>
  import { rootStore } from "../globalStores";
  import { enableButtons } from "../utils/enableButtons";

  const showLoading = target => {
    const loader = document.createElement("div");
    loader.classList.add("paste-loading");
    target.parentNode.appendChild(loader);
  };

  const hideLoading = target => {
    target.parentNode.querySelector(".paste-loading").remove();
  };

  const showError = target => {
    const error = document.createElement("div");
    error.classList.add("paste-error");
    target.parentNode.appendChild(error);

    setTimeout(() => hideError(target), 2000);
  };

  const hideError = target => {
    target.parentNode.querySelector(".paste-error").remove();
  };

  const handlePaste = event => {
    const items = event.clipboardData.items;
    const image = [...items].filter(item => item.type.includes("image")).shift();
    if (!image) return;

    const formData = new FormData();
    formData.append("files", image.getAsFile());

    showLoading(event.target);

    fetch("https://qna.habr.com/upload?profile=fhd", {
      referrer: window.location.href,
      body: formData,
      method: "POST",
    })
      .then(response => response.json())
      .then(response => {
        if (response.files.length) {
          const files = response.files.map(file => `<img src="${file.url}" />`);
          event.target.value += `\n${files.join("\n")}\n`;
          enableButtons();
          hideLoading(event.target);
        } else {
          hideLoading(event.target);
          showError(event.target);
        }
      })
      .catch(() => {
        hideLoading(event.target);
        showError(event.target)
      });
  };
</script>

<template>
  <svelte:body on:paste={handlePaste} />
</template>