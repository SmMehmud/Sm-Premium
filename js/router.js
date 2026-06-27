// router.js
const pageStack = ["home"];
history.pushState(null, "", location.href);

window.addEventListener("popstate", (e) => {
  e.preventDefault();
  if (pageStack.length > 1) {
    pageStack.pop();
    const prev = pageStack[pageStack.length - 1];
    navigateTo(prev, false);
  } else {
    history.pushState(null, "", location.href);
  }
});

export function navigateTo(page, push = true) {
  if (push) {
    pageStack.push(page);
    history.pushState({ page }, "", location.href);
  }

  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const target = document.getElementById("page-" + page);
  if (target) {
    target.classList.add("active");
    target.scrollTop = 0;
  }

  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  const navBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add("active");

  // Trigger page load events
  window.dispatchEvent(new CustomEvent("pagechange", { detail: { page } }));
}

window.navigateTo = navigateTo;
