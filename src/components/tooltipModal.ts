export function createTooltipModal(
    x: number,
    y: number,
    onSave: (text: string) => void
  ): void {
    // Check if a modal already exists
    const existingModal = document.getElementById("tooltipModal");
    if (existingModal) {
      return; // Exit early to avoid duplicate initialization
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
  
    // Get modal dimensions after adding it to the DOM
    const modalRect = modal.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;
    const tailSize = 12; // Size of the tooltip tail
    const padding = 10; // Padding to prevent overflow
  
    let adjustedX = x;
    let adjustedY = y;
  
    // Adjust horizontally
    if (x + modalWidth + padding > window.innerWidth) {
      adjustedX = window.innerWidth - modalWidth - padding;
    } else if (x < padding) {
      adjustedX = padding;
    }
  
    // Adjust vertically
    if (y + modalHeight + padding > window.innerHeight) {
      adjustedY = window.innerHeight - modalHeight - padding - tailSize;
      modal.querySelector(".tooltip-tail")?.classList.add("tooltip-tail-top");
    } else if (y < padding) {
      adjustedY = padding + tailSize;
      modal.querySelector(".tooltip-tail")?.classList.add("tooltip-tail-bottom");
    }
  
    modal.style.left = `${adjustedX}px`;
    modal.style.top = `${adjustedY}px`;
  
    // Save action
    const handleSave = () => {
      const text = tooltipInput.value.trim();
      if (text) {
        onSave(text); // Invoke the callback with the entered text
        cleanupModal();
      } else {
        alert("Tooltip text cannot be empty.");
      }
    };
  
    // Cancel action
    const handleCancel = () => {
      cleanupModal();
    };
  
    // Keydown handler for 'Escape'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cleanupModal();
      }
    };
  
    // Cleanup modal with fade-out effect
    const cleanupModal = () => {
      modal.classList.add("fade-out"); // Add fade-out animation class
      setTimeout(() => modal.remove(), 300); // Remove modal after animation
      saveButton.removeEventListener("click", handleSave);
      cancelButton.removeEventListener("click", handleCancel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  
    saveButton.addEventListener("click", handleSave);
    cancelButton.addEventListener("click", handleCancel);
    document.addEventListener("keydown", handleKeyDown);
  
    // Add fade-in animation
    modal.classList.add("fade-in");
  }
  