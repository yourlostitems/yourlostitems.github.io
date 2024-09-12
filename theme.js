function toggleTheme() {
  var currentTheme =
    document.documentElement.getAttribute("data-bs-theme");
  var switchToTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-bs-theme", switchToTheme);
  localStorage.setItem("theme", switchToTheme);
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("theme-toggle-button")
    .addEventListener("click", toggleTheme);

  // Retrieve the theme from local storage
  var storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    document.documentElement.setAttribute("data-bs-theme", storedTheme);
  }
});