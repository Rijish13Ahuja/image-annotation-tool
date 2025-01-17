import { Tooltip } from "./Tooltip";

type TooltipData = {
  id: number;
  x: number;
  y: number;
  text: string;
};

export class TooltipManager {
  private container: HTMLElement;
  private tooltips: TooltipData[] = [];
  private currentTooltip: { x: number; y: number } | null = null;
  private tooltipText: string = "";
  private dimensions = { width: 800, height: 600 };
  private originalDimensions = { width: 800, height: 600 };
  private imageContainer: HTMLElement;
  private imageElement: HTMLImageElement;
  private onUpload: () => void;

  constructor(container: HTMLElement, imageSrc: string, onUpload: () => void) {
    this.container = container;
    this.onUpload = onUpload;

    this.container.innerHTML = "";
    this.container.className = "bg-gradient-to-br from-gray-100 via-blue-50 to-blue-200 min-h-screen flex flex-col";
    this.imageElement = this.createImageElement(imageSrc);
    this.imageContainer = this.createImageContainer();
    this.container.appendChild(this.createHeader());
    this.container.appendChild(this.createAnnotationArea());
    this.addResizeListener();
  }

  private createHeader(): HTMLElement {
    const header = document.createElement("header");
    header.className =
      "fixed top-0 left-0 w-full p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex justify-between items-center shadow-lg z-50 rounded-b-lg";

    const title = document.createElement("h1");
    title.textContent = "Image Annotation Tool";
    title.className = "text-3xl font-bold tracking-wide";

    const replaceButton = document.createElement("button");
    replaceButton.textContent = "Replace Image";
    replaceButton.className =
      "bg-white text-blue-800 font-medium py-2 px-6 rounded-full shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-300";
    replaceButton.addEventListener("click", this.onUpload);

    header.appendChild(title);
    header.appendChild(replaceButton);

    return header;
  }

  private createAnnotationArea(): HTMLElement {
    const annotationArea = document.createElement("div");
    annotationArea.className =
      "flex flex-col items-center justify-center mt-24 space-y-8 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-md";

    const canvasTitle = document.createElement("h2");
    canvasTitle.textContent = "Annotation Canvas";
    canvasTitle.className = "text-2xl font-semibold text-gray-800 tracking-wide";
    annotationArea.appendChild(canvasTitle);

    annotationArea.appendChild(this.imageContainer);

    return annotationArea;
  }

  private createImageContainer(): HTMLElement {
    const canvasContainer = document.createElement("div");
    canvasContainer.className =
      "relative border-4 border-dashed border-blue-400 rounded-lg p-4 bg-white shadow-2xl transition-all hover:shadow-xl hover:scale-105";
    canvasContainer.style.width = `${this.dimensions.width}px`;
    canvasContainer.style.height = `${this.dimensions.height}px`;

    canvasContainer.addEventListener("click", (e) => this.handleImageClick(e));

    canvasContainer.appendChild(this.imageElement);
    return canvasContainer;
  }

  private createImageElement(imageSrc: string): HTMLImageElement {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "Annotated";
    img.className = "w-full h-auto rounded-lg";
    img.style.width = `${this.dimensions.width}px`;
    img.style.height = `${this.dimensions.height}px`;
    return img;
  }

  private addResizeListener() {
    window.addEventListener("resize", () => {
      const rect = this.container.getBoundingClientRect();
      this.dimensions = { width: rect.width, height: rect.height };
      this.scaleTooltips();
    });
  }

  private scaleTooltips() {
    const scaleX = this.dimensions.width / this.originalDimensions.width;
    const scaleY = this.dimensions.height / this.originalDimensions.height;

    this.tooltips = this.tooltips.map((tooltip) => ({
      ...tooltip,
      x: tooltip.x * scaleX,
      y: tooltip.y * scaleY,
    }));
    this.originalDimensions = { ...this.dimensions };
    this.renderTooltips();
  }

  private handleImageClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest(".tooltip-input-container")) {
      return;
    }

    const rect = this.imageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.currentTooltip = { x, y };
    this.createTooltipInput();
  }

  private createTooltipInput() {
    const inputContainer = document.createElement("div");
    inputContainer.className =
      "absolute bg-white p-6 rounded-lg shadow-xl w-full max-w-md transition-all duration-300 flex flex-col items-center z-50 tooltip-input-container";

    const title = document.createElement("h3");
    title.textContent = "Add Tooltip";
    title.className = "text-xl font-semibold text-gray-900 mb-4 tracking-wide";
    inputContainer.appendChild(title);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter tooltip text";
    input.className =
      "w-full border-2 border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm";
    input.addEventListener("input", (e) => {
      this.tooltipText = (e.target as HTMLInputElement).value;
    });
    inputContainer.appendChild(input);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-between w-full space-x-4";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className =
      "bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 hover:scale-105 transition-all duration-300";
    cancelButton.addEventListener("click", () => {
      this.imageContainer.removeChild(inputContainer);
    });
    buttonContainer.appendChild(cancelButton);

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.className =
      "bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 hover:scale-105 transition-all duration-300";
    addButton.addEventListener("click", () => {
      if (this.currentTooltip && this.tooltipText.trim()) {
        this.tooltips.push({
          id: Date.now(),
          x: this.currentTooltip.x,
          y: this.currentTooltip.y,
          text: this.tooltipText.trim(),
        });
        this.renderTooltips();
      }
      this.imageContainer.removeChild(inputContainer);
    });
    buttonContainer.appendChild(addButton);

    inputContainer.appendChild(buttonContainer);

    this.imageContainer.appendChild(inputContainer);

    const imageRect = this.imageElement.getBoundingClientRect();
    inputContainer.style.top = `${imageRect.height + 20}px`;
    inputContainer.style.left = "50%";
    inputContainer.style.transform = "translateX(-50%)";
  }

  private renderTooltips() {
    this.container.querySelectorAll(".tooltip-marker").forEach((el) => el.remove());
    this.tooltips.forEach((tooltip) => {
      const relativeX = (tooltip.x / this.dimensions.width) * this.imageElement.clientWidth;
      const relativeY = (tooltip.y / this.dimensions.height) * this.imageElement.clientHeight;

      new Tooltip(
        tooltip.id,
        relativeX,
        relativeY,
        tooltip.text,
        this.imageContainer,
        this.handleEditTooltip.bind(this),
        this.handleDeleteTooltip.bind(this),
        this.handleDragTooltip.bind(this),
        this.dimensions
      );
    });
  }

  private handleEditTooltip(id: number, newText: string) {
    this.tooltips = this.tooltips.map((tooltip) =>
      tooltip.id === id ? { ...tooltip, text: newText } : tooltip
    );
    this.renderTooltips();
  }

  private handleDeleteTooltip(id: number) {
    this.tooltips = this.tooltips.filter((tooltip) => tooltip.id !== id);
    this.renderTooltips();
  }

  private handleDragTooltip(id: number, x: number, y: number) {
    this.tooltips = this.tooltips.map((tooltip) =>
      tooltip.id === id ? { ...tooltip, x, y } : tooltip
    );
    this.renderTooltips();
  }
}
