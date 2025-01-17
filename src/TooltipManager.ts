// import { Tooltip } from "./Tooltip";

// interface TooltipData {
//   id: number;
//   x: number;
//   y: number;
//   text: string;
// }

// export class TooltipManager {
//   private container: HTMLElement;
//   private tooltips: TooltipData[] = [];
//   private currentTooltip: { x: number; y: number } | null = null;
//   private tooltipText: string = "";
//   private dimensions = { width: 800, height: 600 };
//   private originalDimensions = { width: 800, height: 600 };
//   private imageElement: HTMLImageElement;
//   private onUpload: () => void;

//   constructor(container: HTMLElement, imageSrc: string, onUpload: () => void) {
//     this.container = container;
//     this.onUpload = onUpload;

//     this.container.innerHTML = "";
//     this.imageElement = this.createImageElement(imageSrc);
//     this.container.appendChild(this.createHeader());
//     this.container.appendChild(this.createAnnotationArea());
//     this.addResizeListener();
//   }

//   private createHeader(): HTMLElement {
//     const header = document.createElement("header");
//     header.className =
//       "fixed top-0 left-0 w-full p-4 bg-blue-800 text-white flex justify-between items-center shadow-md z-50";

//     const title = document.createElement("h1");
//     title.textContent = "Image Annotation Tool";
//     title.className = "text-3xl font-bold";

//     const replaceButton = document.createElement("button");
//     replaceButton.textContent = "Replace Image";
//     replaceButton.className =
//       "bg-white text-blue-800 font-medium py-2 px-6 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300";
//     replaceButton.addEventListener("click", this.onUpload);

//     header.appendChild(title);
//     header.appendChild(replaceButton);

//     return header;
//   }

//   private createAnnotationArea(): HTMLElement {
//     const annotationArea = document.createElement("div");
//     annotationArea.className =
//       "flex flex-col items-center justify-center mt-20 space-y-6";

//     const canvasTitle = document.createElement("h2");
//     canvasTitle.textContent = "Annotation Canvas";
//     canvasTitle.className = "text-xl font-semibold text-white";
//     annotationArea.appendChild(canvasTitle);

//     const canvasContainer = document.createElement("div");
//     canvasContainer.className =
//       "relative border-4 border-dashed border-blue-300 rounded-lg p-4 bg-white shadow-xl transition-all hover:shadow-2xl";
//     canvasContainer.style.width = `${this.dimensions.width}px`;
//     canvasContainer.style.height = `${this.dimensions.height}px`;

//     canvasContainer.addEventListener("click", (e) =>
//       this.handleImageClick(e, canvasContainer)
//     );

//     canvasContainer.appendChild(this.imageElement);
//     annotationArea.appendChild(canvasContainer);

//     return annotationArea;
//   }

//   private createImageElement(imageSrc: string): HTMLImageElement {
//     const img = document.createElement("img");
//     img.src = imageSrc;
//     img.alt = "Annotated";
//     img.className = "w-full h-auto rounded-lg";
//     img.style.width = `${this.dimensions.width}px`;
//     img.style.height = `${this.dimensions.height}px`;
//     return img;
//   }

//   private addResizeListener() {
//     window.addEventListener("resize", () => {
//       const rect = this.container.getBoundingClientRect();
//       this.dimensions = { width: rect.width, height: rect.height };
//       this.scaleTooltips();
//     });
//   }

//   private scaleTooltips() {
//     const scaleX = this.dimensions.width / this.originalDimensions.width;
//     const scaleY = this.dimensions.height / this.originalDimensions.height;

//     this.tooltips = this.tooltips.map((tooltip) => ({
//       ...tooltip,
//       x: tooltip.x * scaleX,
//       y: tooltip.y * scaleY,
//     }));
//     this.originalDimensions = { ...this.dimensions };
//     this.renderTooltips();
//   }

//   private handleImageClick(
//     e: MouseEvent,
//     container: HTMLElement
//   ) {
//     const rect = container.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     this.currentTooltip = { x, y };
//     this.createTooltipInput(container);
//   }

//   private createTooltipInput(container: HTMLElement) {
//     // Remove any existing input container before creating a new one
//     const existingInputContainer = container.querySelector(".tooltip-input-container");
//     if (existingInputContainer) {
//       container.removeChild(existingInputContainer);
//     }

//     const inputContainer = document.createElement("div");
//     inputContainer.className =
//       "tooltip-input-container bg-white p-6 rounded-lg shadow-xl w-full max-w-md transition-all duration-300";

//     const title = document.createElement("h3");
//     title.textContent = "Add Tooltip";
//     title.className = "text-2xl font-bold text-gray-800 mb-4";
//     inputContainer.appendChild(title);

//     const input = document.createElement("input");
//     input.type = "text";
//     input.placeholder = "Enter tooltip text";
//     input.className =
//       "w-full border-2 border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring focus:ring-blue-500";
//     input.addEventListener("input", (e) => {
//       this.tooltipText = (e.target as HTMLInputElement).value;
//     });
//     inputContainer.appendChild(input);

//     const addButton = document.createElement("button");
//     addButton.textContent = "Add";
//     addButton.className =
//       "bg-blue-500 text-white py-3 px-6 rounded-full hover:bg-blue-600 transition-all duration-300";
//     addButton.addEventListener("click", () => {
//       if (this.currentTooltip && this.tooltipText.trim()) {
//         this.tooltips.push({
//           id: Date.now(),
//           x: this.currentTooltip.x,
//           y: this.currentTooltip.y,
//           text: this.tooltipText.trim(),
//         });
//         this.renderTooltips();
//       }
//       container.removeChild(inputContainer);
//     });

//     container.appendChild(inputContainer);
//   }

//   private renderTooltips() {
//     this.container.querySelectorAll(".tooltip-marker").forEach((el) => el.remove());
//     this.tooltips.forEach((tooltip) => {
//       new Tooltip(
//         tooltip.id,
//         tooltip.x,
//         tooltip.y,
//         tooltip.text,
//         this.container,
//         this.handleEditTooltip.bind(this),
//         this.handleDeleteTooltip.bind(this)
//       );
//     });
//   }

//   private handleEditTooltip(id: number, newText: string) {
//     this.tooltips = this.tooltips.map((tooltip) =>
//       tooltip.id === id ? { ...tooltip, text: newText } : tooltip
//     );
//     this.renderTooltips();
//   }

//   private handleDeleteTooltip(id: number) {
//     this.tooltips = this.tooltips.filter((tooltip) => tooltip.id !== id);
//     this.renderTooltips();
//   }
// }
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
    this.imageElement = this.createImageElement(imageSrc);
    this.imageContainer = this.createImageContainer();
    this.container.appendChild(this.createHeader());
    this.container.appendChild(this.createAnnotationArea());
    this.addResizeListener();
  }

  private createHeader(): HTMLElement {
    const header = document.createElement("header");
    header.className =
      "fixed top-0 left-0 w-full p-4 bg-blue-800 text-white flex justify-between items-center shadow-md z-50";

    const title = document.createElement("h1");
    title.textContent = "Image Annotation Tool";
    title.className = "text-3xl font-bold";

    const replaceButton = document.createElement("button");
    replaceButton.textContent = "Replace Image";
    replaceButton.className =
      "bg-white text-blue-800 font-medium py-2 px-6 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300";
    replaceButton.addEventListener("click", this.onUpload);

    header.appendChild(title);
    header.appendChild(replaceButton);

    return header;
  }

  private createAnnotationArea(): HTMLElement {
    const annotationArea = document.createElement("div");
    annotationArea.className =
      "flex flex-col items-center justify-center mt-20 space-y-6";

    const canvasTitle = document.createElement("h2");
    canvasTitle.textContent = "Annotation Canvas";
    canvasTitle.className = "text-xl font-semibold text-white";
    annotationArea.appendChild(canvasTitle);

    annotationArea.appendChild(this.imageContainer);

    return annotationArea;
  }

  private createImageContainer(): HTMLElement {
    const canvasContainer = document.createElement("div");
    canvasContainer.className =
      "relative border-4 border-dashed border-blue-300 rounded-lg p-4 bg-white shadow-xl transition-all hover:shadow-2xl";
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
    const rect = this.imageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.currentTooltip = { x, y };
    this.createTooltipInput();
  }

  private createTooltipInput() {
    const inputContainer = document.createElement("div");
    inputContainer.className =
      "bg-white p-6 rounded-lg shadow-xl w-full max-w-md transition-all duration-300";

    const title = document.createElement("h3");
    title.textContent = "Add Tooltip";
    title.className = "text-2xl font-bold text-gray-800 mb-4";
    inputContainer.appendChild(title);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter tooltip text";
    input.className =
      "w-full border-2 border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring focus:ring-blue-500";
    input.addEventListener("input", (e) => {
      this.tooltipText = (e.target as HTMLInputElement).value;
    });
    inputContainer.appendChild(input);

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.className =
      "bg-blue-500 text-white py-3 px-6 rounded-full hover:bg-blue-600 transition-all duration-300";
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
      this.container.removeChild(inputContainer);
    });

    inputContainer.appendChild(addButton);
    this.container.appendChild(inputContainer);
  }

  private renderTooltips() {
    this.container.querySelectorAll(".tooltip-marker").forEach((el) => el.remove());
    this.tooltips.forEach((tooltip) => {
      new Tooltip(
        tooltip.id,
        tooltip.x,
        tooltip.y,
        tooltip.text,
        this.container,
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
