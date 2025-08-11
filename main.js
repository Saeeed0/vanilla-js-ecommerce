function loadComponent(selector, file) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
    });
}

// استدعاء في كل صفحة
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#navbar", "../shared/navbar.html");
  loadComponent("#footer", "../shared/footer.html");
});
