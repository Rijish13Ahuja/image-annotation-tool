import { initializeSidebar } from "./sidebar";
import {
  createTooltip,
  renderTooltips,
  getTooltips,
  editTooltip,
  deleteTooltip,
  customizeTooltip,
  setTooltips,
} from "./tooltips";
import { createTooltipModal } from "./tooltipModal";

export function initializeCanvas() {
  const canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const imageUpload = document.getElementById("imageUpload") as HTMLInputElement;
  const zoomInButton = document.getElementById("zoomIn")!;
  const zoomOutButton = document.getElementById("zoomOut")!;
  const resetButton = document.getElementById("resetCanvas")!;

  let uploadedImage: HTMLImageElement | null = null;
  let isImageUploaded = false;
  let isDragging = false;
  let dragIndex: number | null = null;
  let isClicking = false;
  let resizing = false;
  let resizingComplete = false;

  const resizeHandleSize = 12;
  let aspectRatioLocked = true;

  let scale = 1;
  const zoomStep = 0.1;
  const maxZoom = 3;
  const minZoom = 0.5;

  let scaledWidth = 0;
  let scaledHeight = 0;
  let offsetX = 0;
  let offsetY = 0;

  canvas.parentElement?.insertAdjacentHTML(
    "beforeend",
    `
    <div id="resizeOutline" class="resize-outline" style="display: none;"></div>
    <div id="canvasAlertModal" class="canvas-alert-modal"></div>
    `
  );

  const resizeOutline = document.getElementById("resizeOutline") as HTMLDivElement;
  const alertModal = document.getElementById("canvasAlertModal") as HTMLDivElement;

  const updateSidebar = () => {
    initializeSidebar(
      getTooltips(),
      (index, newText) => {
        console.log("Editing tooltip at index:", index, "with text:", newText);
        editTooltip(index, newText);
        renderCanvas();
      },
      (index) => {
        console.log("Deleting tooltip at index:", index);
        deleteTooltip(index);
        renderCanvas();
      },
      (index, customization) => {
        console.log("Customizing tooltip at index:", index, "with options:", customization);
        customizeTooltip(index, customization);
        renderCanvas();
      }
    );
  };

  const renderCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);

    if (isImageUploaded && uploadedImage) {
      ctx.drawImage(uploadedImage, offsetX, offsetY, scaledWidth, scaledHeight);
      ctx.fillStyle = "rgba(255, 85, 85, 0.8)";
      ctx.beginPath();
      ctx.arc(
        offsetX + scaledWidth,
        offsetY + scaledHeight,
        resizeHandleSize / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.font = `${16 / scale}px Arial`;
      ctx.fillStyle = "#666";
      ctx.textAlign = "center";
      ctx.fillText(
        "Upload an image to start adding tooltips.",
        canvas.width / (2 * scale),
        canvas.height / (2 * scale)
      );
    }

    renderTooltips(ctx, scale);
    ctx.restore();
    updateSidebar();
  };

  const resizeAndCenterImage = (img: HTMLImageElement) => {
    const container = canvas.parentElement!;
    const maxWidth = container.clientWidth;
    const maxHeight = container.clientHeight;
    const aspectRatio = img.width / img.height;

    if (aspectRatio > maxWidth / maxHeight) {
      scaledWidth = maxWidth;
      scaledHeight = maxWidth / aspectRatio;
    } else {
      scaledHeight = maxHeight;
      scaledWidth = maxHeight * aspectRatio;
    }

    offsetX = (maxWidth - scaledWidth) / 2;
    offsetY = (maxHeight - scaledHeight) / 2;

    canvas.width = maxWidth;
    canvas.height = maxHeight;
  };

  const renderImage = (img: HTMLImageElement) => {
    resizeAndCenterImage(img);
    uploadedImage = img;
    isImageUploaded = true;
    renderCanvas();
    canvas.style.cursor = "crosshair"; 
  };

  const getMouseCoordinates = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const showCanvasMessage = (message: string) => {
    alertModal.innerText = message;
    alertModal.classList.add("active");
    setTimeout(() => {
      alertModal.classList.remove("active");
    }, 3000);
  };

  canvas.addEventListener("mousedown", (event) => {
    isClicking = true;
    const { x, y } = getMouseCoordinates(event);

    dragIndex = getTooltips().findIndex(
      ({ x: tooltipX, y: tooltipY }) => Math.hypot(tooltipX - x, tooltipY - y) <= 10
    );

    if (dragIndex !== -1) {
      canvas.style.cursor = "grabbing";
      isDragging = true;
      return;
    }

    isDragging = false;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (isDragging && dragIndex !== null) {
      isClicking = false;
      const { x, y } = getMouseCoordinates(event);
      getTooltips()[dragIndex] = { ...getTooltips()[dragIndex], x: x / scale, y: y / scale };
      renderCanvas();
    }
  });

  canvas.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      dragIndex = null;
      canvas.style.cursor = "crosshair";
    }
  });

  canvas.addEventListener("click", (event) => {
    if (!isClicking || resizingComplete || isDragging) {
      isClicking = false;
      return;
    }

    if (!isImageUploaded) {
      showCanvasMessage("Please upload an image before adding tooltips.");
      return;
    }

    const { x, y } = getMouseCoordinates(event);

    if (
      x >= offsetX / scale &&
      x <= (offsetX + scaledWidth) / scale &&
      y >= offsetY / scale &&
      y <= (offsetY + scaledHeight) / scale
    ) {
      const imageBounds = canvas.getBoundingClientRect();

      createTooltipModal(x, y, imageBounds, (text) => {
        createTooltip(x / scale, y / scale, text);
        renderCanvas();
      });
    } else {
      showCanvasMessage("Tooltips must be placed within the image boundaries.");
    }

    isClicking = false;
  });

  imageUpload.addEventListener("change", (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          setTooltips([]); 
          updateSidebar(); 
          renderImage(img); 
        };
      };
      reader.readAsDataURL(file);
    }
  });

  zoomInButton.addEventListener("click", () => {
    if (scale < maxZoom) {
      scale += zoomStep;
      renderCanvas();
    }
  });

  zoomOutButton.addEventListener("click", () => {
    if (scale > minZoom) {
      scale -= zoomStep;
      renderCanvas();
    }
  });

  resetButton.addEventListener("click", () => {
    scale = 1;
    renderCanvas();
    canvas.style.cursor = isImageUploaded ? "crosshair" : "default";
  });

  renderCanvas();
}
