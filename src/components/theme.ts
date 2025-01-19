export function initializeTheme() {
    const toggleThemeButton = document.getElementById("toggleTheme")!;
    const rootElement = document.documentElement;
  
    // Load the saved theme or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    rootElement.setAttribute("data-theme", savedTheme);
    toggleThemeButton.textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";
  
    // Toggle theme on button click
    toggleThemeButton.addEventListener("click", () => {
      const currentTheme = rootElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
  
      rootElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      toggleThemeButton.textContent = newTheme === "dark" ? "Light Mode" : "Dark Mode";
    });
  }
  