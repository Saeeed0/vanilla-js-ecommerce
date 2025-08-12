function loadComponent(selector, file) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
    });
}

// استدعاء في كل صفحة
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#nav", "shared/navbar/navbar.html");
  loadComponent("#footer", "shared/footer/footer.html");
});
