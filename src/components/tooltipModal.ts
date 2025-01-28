export function createTooltipModal(
    x: number,
    y: number,
    imageBounds: DOMRect, 
    onSave: (text: string) => void
): void {
    const existingModal = document.getElementById("tooltipModal");
    if (existingModal) {
        console.log("Tooltip modal already exists. Aborting creation.");
        return;
    }

    const modal = document.createElement("div");
    modal.id = "tooltipModal";
    modal.className = "tooltip-modal";

    modal.innerHTML = `
      <div class="tooltip-tail"></div>
      <div class="tooltip-modal-content">
        <textarea id="tooltipInput" placeholder="Enter tooltip text (supports multiline)" rows="4"></textarea>
        <div class="tooltip-modal-actions">
          <button id="saveTooltip" class="tooltip-modal-button save-btn">Save</button>
          <button id="cancelTooltip" class="tooltip-modal-button cancel-btn">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const tooltipInput = document.getElementById("tooltipInput") as HTMLTextAreaElement;
    const saveButton = document.getElementById("saveTooltip")!;
    const cancelButton = document.getElementById("cancelTooltip")!;
    const tail = modal.querySelector(".tooltip-tail") as HTMLDivElement;

    tooltipInput.focus();

    const modalRect = modal.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;
    const tailSize = 12;
    const padding = 10;

    let adjustedX = x;
    let adjustedY = y;
    if (x - modalWidth / 2 < imageBounds.left + padding) {
        adjustedX = imageBounds.left + modalWidth / 2 + padding;
    } else if (x + modalWidth / 2 > imageBounds.right - padding) {
        adjustedX = imageBounds.right - modalWidth / 2 - padding;
    }
    if (y + modalHeight + tailSize > imageBounds.bottom) {
        adjustedY = imageBounds.bottom - modalHeight - tailSize - padding;
        tail.classList.add("tooltip-tail-top");
    } else if (y - tailSize < imageBounds.top) {
        adjustedY = imageBounds.top + tailSize + padding;
        tail.classList.add("tooltip-tail-bottom");
    } else {
        tail.classList.add("tooltip-tail-top");
    }

    modal.style.left = `${adjustedX}px`;
    modal.style.top = `${adjustedY}px`;

    if (tail.classList.contains("tooltip-tail-top")) {
        tail.style.top = "-10px";
    } else {
        tail.style.bottom = "-10px";
    }

    const handleSave = () => {
        const text = tooltipInput.value.trim();
        if (text) {
            onSave(text);
            cleanupModal();
        } else {
            alert("Tooltip text cannot be empty.");
        }
    };

    const handleCancel = () => {
        cleanupModal();
    };

    const cleanupModal = () => {
        modal.remove();
        saveButton.removeEventListener("click", handleSave);
        cancelButton.removeEventListener("click", handleCancel);
    };

    saveButton.addEventListener("click", handleSave);
    cancelButton.addEventListener("click", handleCancel);
}
