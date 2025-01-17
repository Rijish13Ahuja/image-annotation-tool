// // src/Tooltip.ts
// export class Tooltip {
//     private id: number;
//     private x: number;
//     private y: number;
//     private text: string;
//     private container: HTMLElement;
//     private isVisible: boolean = false;
//     private isEditing: boolean = false;
//     private position: { x: number; y: number };
//     private editText: string;
  
//     private onEdit: (id: number, newText: string) => void;
//     private onDelete: (id: number) => void;
  
//     constructor(
//       id: number,
//       x: number,
//       y: number,
//       text: string,
//       container: HTMLElement,
//       onEdit: (id: number, newText: string) => void,
//       onDelete: (id: number) => void
//     ) {
//       this.id = id;
//       this.x = x;
//       this.y = y;
//       this.text = text;
//       this.container = container;
//       this.position = { x, y };
//       this.editText = text;
  
//       this.onEdit = onEdit;
//       this.onDelete = onDelete;
  
//       this.render();
//     }
  
//     private render() {
//       // Create tooltip marker
//       const marker = document.createElement("div");
//       marker.className =
//         "w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:scale-110 transition-transform absolute";
//       marker.style.left = `${this.position.x}px`;
//       marker.style.top = `${this.position.y}px`;
//       marker.style.transform = "translate(-50%, -50%)";
  
//       // Add event listeners to toggle tooltip visibility
//       marker.addEventListener("click", (e) => {
//         e.stopPropagation();
//         this.toggleVisibility();
//       });
  
//       // Append marker to the container
//       this.container.appendChild(marker);
  
//       // Create tooltip box
//       const tooltipBox = document.createElement("div");
//       tooltipBox.className =
//         "absolute bg-white text-gray-800 text-sm rounded-lg px-4 py-2 shadow-lg z-50 transition-all";
//       tooltipBox.style.top = "40px"; // Default position below the marker
//       tooltipBox.style.left = "50%";
//       tooltipBox.style.transform = "translateX(-50%)";
//       tooltipBox.style.display = "none"; // Initially hidden
  
//       // Populate tooltip box
//       this.populateTooltipBox(tooltipBox);
  
//       // Append tooltip box to marker
//       marker.appendChild(tooltipBox);
//     }
  
//     private toggleVisibility() {
//       this.isVisible = !this.isVisible;
//       const tooltipBox = this.container.querySelector(
//         `.tooltip-${this.id}`
//       ) as HTMLElement;
//       if (tooltipBox) {
//         tooltipBox.style.display = this.isVisible ? "block" : "none";
//       }
//     }
  
//     private populateTooltipBox(tooltipBox: HTMLElement) {
//       tooltipBox.innerHTML = ""; // Clear existing content
  
//       if (this.isEditing) {
//         // Edit mode content
//         const input = document.createElement("input");
//         input.type = "text";
//         input.value = this.editText;
//         input.className =
//           "border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-400 text-gray-800";
//         input.addEventListener("input", (e) => {
//           this.editText = (e.target as HTMLInputElement).value;
//         });
  
//         const saveButton = document.createElement("button");
//         saveButton.className =
//           "bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-all";
//         saveButton.textContent = "Save";
//         saveButton.addEventListener("click", () => {
//           this.onEdit(this.id, this.editText);
//           this.isEditing = false;
//           this.populateTooltipBox(tooltipBox);
//         });
  
//         const cancelButton = document.createElement("button");
//         cancelButton.className =
//           "bg-gray-300 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-400 transition-all";
//         cancelButton.textContent = "Cancel";
//         cancelButton.addEventListener("click", () => {
//           this.isEditing = false;
//           this.populateTooltipBox(tooltipBox);
//         });
  
//         tooltipBox.appendChild(input);
//         tooltipBox.appendChild(saveButton);
//         tooltipBox.appendChild(cancelButton);
//       } else {
//         // View mode content
//         const textElement = document.createElement("p");
//         textElement.textContent = this.text;
//         textElement.className = "text-sm font-medium mb-2";
  
//         const editButton = document.createElement("button");
//         editButton.className =
//           "flex items-center text-blue-500 hover:text-blue-600 transition-all";
//         editButton.textContent = "Edit";
//         editButton.addEventListener("click", () => {
//           this.isEditing = true;
//           this.populateTooltipBox(tooltipBox);
//         });
  
//         const deleteButton = document.createElement("button");
//         deleteButton.className =
//           "flex items-center text-red-500 hover:text-red-600 transition-all";
//         deleteButton.textContent = "Delete";
//         deleteButton.addEventListener("click", () => {
//           this.onDelete(this.id);
//           this.container.removeChild(tooltipBox.parentElement!); // Remove marker and tooltip
//         });
  
//         tooltipBox.appendChild(textElement);
//         tooltipBox.appendChild(editButton);
//         tooltipBox.appendChild(deleteButton);
//       }
//     }
//   }
  
export class Tooltip {
    private container: HTMLElement;
    private marker: HTMLElement;
    private tooltipBox: HTMLElement;
    private id: number;
    private x: number;
    private y: number;
    private text: string;
    private editText: string;
    private isVisible: boolean = false;
    private isEditing: boolean = false;
    private containerRect: { width: number; height: number };
    private onEdit: (id: number, newText: string) => void;
    private onDelete: (id: number) => void;
    private onDrag: (id: number, x: number, y: number) => void;
  
    constructor(
      id: number,
      x: number,
      y: number,
      text: string,
      container: HTMLElement,
      onEdit: (id: number, newText: string) => void,
      onDelete: (id: number) => void,
      onDrag: (id: number, x: number, y: number) => void,
      containerRect: { width: number; height: number }
    ) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.text = text;
      this.editText = text;
      this.container = container;
      this.onEdit = onEdit;
      this.onDelete = onDelete;
      this.onDrag = onDrag;
      this.containerRect = containerRect;
  
      this.marker = document.createElement("div");
      this.tooltipBox = document.createElement("div");
  
      this.createMarker();
      this.createTooltipBox();
    }
  
    private createMarker() {
      this.marker.className =
        "w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:scale-110 transition-transform absolute";
      this.marker.style.left = `${this.x}px`;
      this.marker.style.top = `${this.y}px`;
      this.marker.style.transform = "translate(-50%, -50%)";
      this.marker.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleVisibility();
      });
      this.container.appendChild(this.marker);
    }
  
    private createTooltipBox() {
      this.tooltipBox.className =
        "absolute bg-white text-gray-800 text-sm rounded-lg px-4 py-2 shadow-lg z-50 transition-all";
      this.tooltipBox.style.top = "40px";
      this.tooltipBox.style.left = "50%";
      this.tooltipBox.style.transform = "translateX(-50%)";
      this.tooltipBox.style.display = "none";
      this.marker.appendChild(this.tooltipBox);
      this.populateTooltipBox();
    }
  
    private toggleVisibility() {
      this.isVisible = !this.isVisible;
      this.tooltipBox.style.display = this.isVisible ? "block" : "none";
    }
  
    private populateTooltipBox() {
      this.tooltipBox.innerHTML = "";
  
      if (this.isEditing) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = this.editText;
        input.className =
          "border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-400 text-gray-800";
        input.addEventListener("input", (e) => {
          this.editText = (e.target as HTMLInputElement).value;
        });
  
        const saveButton = document.createElement("button");
        saveButton.className =
          "bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-all";
        saveButton.textContent = "Save";
        saveButton.addEventListener("click", () => {
          this.onEdit(this.id, this.editText);
          this.isEditing = false;
          this.populateTooltipBox();
        });
  
        const cancelButton = document.createElement("button");
        cancelButton.className =
          "bg-gray-300 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-400 transition-all";
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", () => {
          this.isEditing = false;
          this.populateTooltipBox();
        });
  
        this.tooltipBox.appendChild(input);
        this.tooltipBox.appendChild(saveButton);
        this.tooltipBox.appendChild(cancelButton);
      } else {
        const textElement = document.createElement("p");
        textElement.textContent = this.text;
        textElement.className = "text-sm font-medium mb-2";
  
        const editButton = document.createElement("button");
        editButton.className =
          "flex items-center text-blue-500 hover:text-blue-600 transition-all";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
          this.isEditing = true;
          this.populateTooltipBox();
        });
  
        const deleteButton = document.createElement("button");
        deleteButton.className =
          "flex items-center text-red-500 hover:text-red-600 transition-all";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          this.onDelete(this.id);
          this.container.removeChild(this.marker);
        });
  
        this.tooltipBox.appendChild(textElement);
        this.tooltipBox.appendChild(editButton);
        this.tooltipBox.appendChild(deleteButton);
      }
    }
  }
  