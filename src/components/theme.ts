export function initializeTheme() {
    const toggleThemeButton = document.getElementById("toggleTheme")!;
    const rootElement = document.documentElement;
      const savedTheme = localStorage.getItem("theme") || "light";
    rootElement.setAttribute("data-theme", savedTheme);
    toggleThemeButton.textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";
  
    toggleThemeButton.addEventListener("click", () => {
      const currentTheme = rootElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
  
      rootElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      toggleThemeButton.textContent = newTheme === "dark" ? "Light Mode" : "Dark Mode";
    });
  }
  