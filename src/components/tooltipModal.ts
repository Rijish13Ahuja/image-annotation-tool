export function createTooltipModal(
    x: number,
    y: number,
    onSave: (text: string) => void
  ): void {
    const existingModal = document.getElementById("tooltipModal");
    if (existingModal) {
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
  
    tooltipInput.focus();
  
    const modalRect = modal.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;
    const tailSize = 12;
    const padding = 10;
  
    let adjustedX = x;
    let adjustedY = y;
  
    if (x + modalWidth + padding > window.innerWidth) {
      adjustedX = window.innerWidth - modalWidth - padding;
    } else if (x < padding) {
      adjustedX = padding;
    }
  
    if (y + modalHeight + padding > window.innerHeight) {
      adjustedY = window.innerHeight - modalHeight - padding - tailSize;
      modal.querySelector(".tooltip-tail")?.classList.add("tooltip-tail-top");
    } else if (y < padding) {
      adjustedY = padding + tailSize;
      modal.querySelector(".tooltip-tail")?.classList.add("tooltip-tail-bottom");
    }
  
    modal.style.left = `${adjustedX}px`;
    modal.style.top = `${adjustedY}px`;
  
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
  
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cleanupModal();
      }
    };
  
    const cleanupModal = () => {
      modal.classList.add("fade-out");
      setTimeout(() => modal.remove(), 300);
      saveButton.removeEventListener("click", handleSave);
      cancelButton.removeEventListener("click", handleCancel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  
    saveButton.addEventListener("click", handleSave);
    cancelButton.addEventListener("click", handleCancel);
    document.addEventListener("keydown", handleKeyDown);
  
    modal.classList.add("fade-in");
  }
  