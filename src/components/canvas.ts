import { initializeSidebar } from "./sidebar";
import {
  createTooltip,
  renderTooltips,
  getTooltips,
  editTooltip,
  deleteTooltip,
  customizeTooltip,
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
    <div id="dimensionsTooltip" class="dimensions-tooltip" style="display: none;"></div>
    `
  );

  const resizeOutline = document.getElementById("resizeOutline") as HTMLDivElement;
  const dimensionsTooltip = document.getElementById("dimensionsTooltip") as HTMLDivElement;

  function updateSidebar() {
    initializeSidebar(
      getTooltips(),
      (index) => {
        const newText = prompt("Edit tooltip text:", getTooltips()[index].text);
        if (newText) {
          editTooltip(index, newText);
          renderCanvas();
        }
      },
      (index) => {
        deleteTooltip(index);
        renderCanvas();
      },
      (index, customization) => {
        customizeTooltip(index, customization);
        renderCanvas();
      }
    );
  }

  function renderCanvas() {
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
  }

  function resizeAndCenterImage(img: HTMLImageElement) {
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
  }

  function renderImage(img: HTMLImageElement) {
    resizeAndCenterImage(img);
    uploadedImage = img;
    isImageUploaded = true;
    renderCanvas();
  }

  function isInResizeHandle(x: number, y: number) {
    return (
      x >= offsetX + scaledWidth - resizeHandleSize &&
      x <= offsetX + scaledWidth + resizeHandleSize &&
      y >= offsetY + scaledHeight - resizeHandleSize &&
      y <= offsetY + scaledHeight + resizeHandleSize
    );
  }

  function getMouseCoordinates(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x, y };
  }

  canvas.addEventListener("mousedown", (event) => {
    isClicking = true;
    const { x, y } = getMouseCoordinates(event);

    if (isInResizeHandle(x, y)) {
      resizing = true;
      resizingComplete = false;
      return;
    }

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

      const tooltips = getTooltips();
      tooltips[dragIndex].x = x / scale;
      tooltips[dragIndex].y = y / scale;

      renderCanvas();
    }
  });

  canvas.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      dragIndex = null;
      canvas.style.cursor = "default";
    }
  });

  canvas.addEventListener("click", (event) => {
    if (!isClicking || resizingComplete || isDragging) {
        isClicking = false;
        return;
    }
    isClicking = false;

    if (!isImageUploaded) {
        alert("Please upload an image before adding tooltips.");
        return;
    }

    const { x, y } = getMouseCoordinates(event);

    if (
        x >= offsetX / scale &&
        x <= (offsetX + scaledWidth) / scale &&
        y >= offsetY / scale &&
        y <= (offsetY + scaledHeight) / scale
    ) {
        createTooltipModal(x, y, (text) => {
            if (text) {
                createTooltip(x / scale, y / scale, text);
                renderCanvas();
            }
        });
        
    } else {
        alert("Tooltips must be placed within the image boundaries.");
    }
});


  imageUpload.addEventListener("change", (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => renderImage(img);
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
  });

  renderCanvas();
}
