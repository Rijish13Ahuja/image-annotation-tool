export class ImageUploader {
    private container: HTMLElement;
    private uploadedImage: string | null = null;
    private isDragging: boolean = false;
    private uploadError: string | null = null;
    private dimensions = { width: 800, height: 600 }; // Default dimensions
    private onUpload: (base64Image: string, dimensions: { width: number; height: number }) => void;
  
    constructor(
      containerId: string,
      onUploadCallback: (base64Image: string, dimensions: { width: number; height: number }) => void
    ) {
      const container = document.getElementById(containerId);
      console.log("Container ID:", containerId, "Found:", !!container);
      if (!container) {
        throw new Error(`Container with ID '${containerId}' not found.`);
      }
      this.container = container;
      this.onUpload = onUploadCallback;
      this.render();
    }
  
    private render(): void {
      this.container.innerHTML = `
        <div class="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700">
          <header class="w-full p-4 bg-blue-700 text-white shadow-md flex justify-between items-center">
            <h1 class="text-2xl font-bold">Image Annotation Tool</h1>
            <button id="replace-btn" class="bg-white text-blue-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
              Replace Image
            </button>
          </header>
          <main class="w-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md mt-8">
            <div id="upload-section" class="text-center">
              <div
                id="drag-area"
                class="border-4 border-dashed border-gray-300 p-6 rounded-md transition-all duration-300 ${this.isDragging ? 'bg-blue-100 border-blue-500' : ''}"
              >
                <h2 class="text-xl font-bold mb-4">Upload Your Image</h2>
                <label for="file-upload" class="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                  Choose File
                </label>
                <input id="file-upload" type="file" accept="image/*" class="hidden" />
                <p class="mt-2 text-sm text-gray-500">Supports .jpg, .png (Max: 2MB)</p>
                <p class="text-red-500 text-sm mt-2" id="upload-error">${this.uploadError || ''}</p>
                <p class="text-gray-500 text-sm">Or drag and drop your image here</p>
              </div>
            </div>
            <div id="preview-section" class="hidden text-center">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Uploaded Image</h2>
              <div id="image-preview" class="border-2 border-gray-300 rounded-md overflow-hidden shadow"></div>
              <div class="mt-4 flex space-x-4">
                <label class="block">
                  <span class="block text-gray-700">Width:</span>
                  <input id="width-input" type="number" value="${this.dimensions.width}" class="border border-gray-300 rounded-md px-2 py-1" />
                </label>
                <label class="block">
                  <span class="block text-gray-700">Height:</span>
                  <input id="height-input" type="number" value="${this.dimensions.height}" class="border border-gray-300 rounded-md px-2 py-1" />
                </label>
              </div>
              <button id="save-btn" class="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600">
                Save Resized Image
              </button>
              <p class="text-green-500 mt-4">Image uploaded successfully!</p>
            </div>
          </main>
        </div>
      `;
  
      this.addEventListeners();
    }
  
    private addEventListeners(): void {
      const fileInput = this.getElement<HTMLInputElement>("file-upload");
      const dragArea = this.getElement<HTMLElement>("drag-area");
      const previewSection = this.getElement<HTMLElement>("preview-section");
      const imagePreview = this.getElement<HTMLElement>("image-preview");
      const widthInput = this.getElement<HTMLInputElement>("width-input");
      const heightInput = this.getElement<HTMLInputElement>("height-input");
      const saveBtn = this.getElement<HTMLElement>("save-btn");
      const replaceBtn = this.getElement<HTMLElement>("replace-btn");
      const errorElement = this.getElement<HTMLElement>("upload-error");
  
      fileInput.addEventListener("change", (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        this.uploadImage(file, previewSection, imagePreview, errorElement, dragArea);
      });
  
      dragArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        this.isDragging = true;
        dragArea.classList.add("bg-blue-100", "border-blue-500");
      });
  
      dragArea.addEventListener("dragleave", () => {
        this.isDragging = false;
        dragArea.classList.remove("bg-blue-100", "border-blue-500");
      });
  
      dragArea.addEventListener("drop", (event) => {
        event.preventDefault();
        this.isDragging = false;
        dragArea.classList.remove("bg-blue-100", "border-blue-500");
        const file = event.dataTransfer?.files[0];
        this.uploadImage(file, previewSection, imagePreview, errorElement, dragArea);
      });
  
      widthInput.addEventListener("input", (event) => {
        this.dimensions.width = parseInt((event.target as HTMLInputElement).value, 10) || 0;
        this.updateImagePreview(imagePreview);
      });
  
      heightInput.addEventListener("input", (event) => {
        this.dimensions.height = parseInt((event.target as HTMLInputElement).value, 10) || 0;
        this.updateImagePreview(imagePreview);
      });
  
      saveBtn.addEventListener("click", () => {
        if (this.uploadedImage) {
          this.onUpload(this.uploadedImage, this.dimensions);
        }
      });
  
      replaceBtn.addEventListener("click", () => {
        this.uploadedImage = null;
        this.dimensions = { width: 800, height: 600 };
        previewSection.style.display = "none";
        dragArea.style.display = "block";
      });
    }
  
    private uploadImage(
      file: File | undefined,
      previewSection: HTMLElement,
      imagePreview: HTMLElement,
      errorElement: HTMLElement,
      dragArea: HTMLElement
    ): void {
      if (file) {
        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
          errorElement.textContent = "Unsupported file format. Please upload a JPG or PNG image.";
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          errorElement.textContent = "File size exceeds 2MB. Please upload a smaller image.";
          return;
        }
        errorElement.textContent = "";
        const reader = new FileReader();
        reader.onload = () => {
          this.uploadedImage = reader.result as string;
          imagePreview.innerHTML = `<img src="${this.uploadedImage}" class="max-w-full h-auto" style="width: ${this.dimensions.width}px; height: ${this.dimensions.height}px;" />`;
          previewSection.style.display = "block";
          dragArea.style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    }
  
    private updateImagePreview(imagePreview: HTMLElement): void {
      if (this.uploadedImage) {
        imagePreview.innerHTML = `<img src="${this.uploadedImage}" class="max-w-full h-auto" style="width: ${this.dimensions.width}px; height: ${this.dimensions.height}px;" />`;
      }
    }
  
    private getElement<T extends HTMLElement>(id: string): T {
      const element = document.getElementById(id) as T | null;
      if (!element) {
        throw new Error(`Element with ID '${id}' not found.`);
      }
      return element;
    }
  }
  