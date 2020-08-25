// fix toster bug, then submit button disabled before insert sticker
export const enableButtons = () => {
  document
    .querySelectorAll("button.btn.btn_outline_green")
    .forEach((button: HTMLButtonElement) => (button.disabled = false));
};
