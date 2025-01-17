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
            "w-4 h-4 bg-blue-600 rounded-full cursor-pointer hover:scale-110 transition-transform absolute shadow-md";
        this.marker.style.left = `${this.x}px`;
        this.marker.style.top = `${this.y}px`;
        this.marker.style.transform = "translate(-50%, -50%)";
        this.marker.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!this.isEditing) {
                this.toggleVisibility();
            }
        });
        this.container.appendChild(this.marker);
    }

    private createTooltipBox() {
        this.tooltipBox.className =
            "absolute bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-lg z-50 transition-all";
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
                "w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

            input.addEventListener("input", (e) => {
                this.editText = (e.target as HTMLInputElement).value;
            });

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "flex justify-between space-x-4";

            const saveButton = document.createElement("button");
            saveButton.className =
                "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all flex items-center";
            saveButton.innerHTML = `<i class="fas fa-check mr-2"></i>Save`;
            saveButton.addEventListener("click", () => {
                this.onEdit(this.id, this.editText);
                this.text = this.editText; 
                this.isEditing = false;
                this.populateTooltipBox();
            });

            const cancelButton = document.createElement("button");
            cancelButton.className =
                "bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-all flex items-center";
            cancelButton.innerHTML = `<i class="fas fa-times mr-2"></i>Cancel`;
            cancelButton.addEventListener("click", () => {
                this.isEditing = false;
                this.populateTooltipBox();
            });

            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(cancelButton);

            this.tooltipBox.appendChild(input);
            this.tooltipBox.appendChild(buttonContainer);
        } else {
            const textElement = document.createElement("p");
            textElement.textContent = this.text;
            textElement.className =
                "text-gray-900 text-sm font-medium bg-gray-100 px-3 py-2 rounded-md shadow-inner mb-3";

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "flex justify-between space-x-4";

            const editButton = document.createElement("button");
            editButton.className =
                "text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-all flex items-center";
            editButton.innerHTML = `<i class="fas fa-edit mr-2"></i>Edit`;
            editButton.addEventListener("click", () => {
                this.isEditing = true;
                this.populateTooltipBox();
            });

            const deleteButton = document.createElement("button");
            deleteButton.className =
                "text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-all flex items-center";
            deleteButton.innerHTML = `<i class="fas fa-trash-alt mr-2"></i>Delete`;
            deleteButton.addEventListener("click", () => {
                this.onDelete(this.id);
                this.container.removeChild(this.marker);
            });

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            this.tooltipBox.appendChild(textElement);
            this.tooltipBox.appendChild(buttonContainer);
        }
    }
}
