import { initializeCanvas } from "./components/canvas";
import { initializeTheme } from "./components/theme";

document.addEventListener("DOMContentLoaded", () => {
  console.log("App Initialized!");

  // Initialize canvas functionality
  initializeCanvas();
  initializeTheme();

  // Set up drag-and-drop functionality
  setupDragAndDrop();
});

function setupDragAndDrop(): void {
  const canvasContainer = document.getElementById("canvasContainer") as HTMLElement;
  const canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  if (!canvasContainer || !canvas || !ctx) {
    console.error("Canvas container or canvas element not found.");
    return;
  }

  // Add drag-and-drop event listeners
  canvasContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
    canvasContainer.classList.add("drag-over"); // Optional: Add a visual effect
  });

  canvasContainer.addEventListener("dragleave", () => {
    canvasContainer.classList.remove("drag-over"); // Optional: Remove visual effect
  });

  canvasContainer.addEventListener("drop", (event) => {
    event.preventDefault();
    canvasContainer.classList.remove("drag-over"); // Optional: Remove visual effect

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) {
      alert("No file detected. Please drop a valid image file.");
      return;
    }

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Only image files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (readEvent: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        // Resize canvas to match the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = readEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
