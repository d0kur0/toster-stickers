import App from "./App.svelte";

const forms = document.querySelectorAll(".form_answer, .form_comments");
forms.forEach(form => {
  const panel = form.querySelector(".icons-bar");
  if (!panel) {
    return;
  }

  panel.innerHTML += `<li class="sticker-panel"></li>`;
  const target = panel.querySelector(".sticker-panel");

  target &&
    new App({
      target: target,
      props: {
        rootForm: form,
      },
    });
});
