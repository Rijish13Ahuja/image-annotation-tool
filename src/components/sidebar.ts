export function initializeSidebar(
    tooltips: { x: number; y: number; text: string; fontSize?: string; bgColor?: string; textColor?: string }[],
    onEdit: (index: number, newText: string) => void,
    onDelete: (index: number) => void,
    onCustomize: (index: number, styles: { fontSize?: string; bgColor?: string; textColor?: string }) => void
  ) {
    const tooltipList = document.getElementById("tooltipList")!;
    const searchInput = document.getElementById("searchTooltips") as HTMLInputElement;
    const exportButton = document.getElementById("exportTooltips")!;
  
    if (!document.getElementById("sortByCreation")) {
      const sortControls = document.createElement("div");
      sortControls.className = "sort-controls";
  
      const sortCreationButton = document.createElement("button");
      sortCreationButton.id = "sortByCreation";
      sortCreationButton.className = "btn-sort";
      sortCreationButton.innerText = "Sort by Creation";
      sortControls.appendChild(sortCreationButton);
  
      const sortPositionButton = document.createElement("button");
      sortPositionButton.id = "sortByPosition";
      sortPositionButton.className = "btn-sort";
      sortPositionButton.innerText = "Sort by Position";
      sortControls.appendChild(sortPositionButton);
  
      tooltipList.parentElement?.insertBefore(sortControls, tooltipList);
  
      sortCreationButton.addEventListener("click", () => {
        const sortedByCreation = [...tooltips];
        renderTooltipList(sortedByCreation);
      });
  
      sortPositionButton.addEventListener("click", () => {
        const sortedByPosition = [...tooltips].sort((a, b) =>
          a.y === b.y ? a.x - b.x : a.y - b.y
        );
        renderTooltipList(sortedByPosition);
      });
    }
  
    function renderTooltipList(filteredTooltips = tooltips) {
      tooltipList.innerHTML = "";
  
      filteredTooltips.forEach((tooltip, index) => {
        const tooltipItem = document.createElement("div");
        tooltipItem.className = "tooltip-item animate-fade-in";
        tooltipItem.innerHTML = `
          <span class="tooltip-text">#${index + 1}: ${tooltip.text}</span>
          <div class="tooltip-actions">
            <button class="btn-edit" data-index="${index}">Edit</button>
            <button class="btn-delete" data-index="${index}">Delete</button>
            <button class="btn-customize" data-index="${index}">Customize</button>
          </div>
          <div class="customize-panel" id="customize-panel-${index}" style="display: none;">
            <label>Font Size: <input type="text" class="font-size-input" data-index="${index}" value="${tooltip.fontSize || "14px"}" /></label>
            <label>Background Color: <input type="color" class="bg-color-input" data-index="${index}" value="${tooltip.bgColor || "#ffffff"}" /></label>
            <label>Text Color: <input type="color" class="text-color-input" data-index="${index}" value="${tooltip.textColor || "#000000"}" /></label>
            <button class="btn-save-customize" data-index="${index}">Save</button>
          </div>
        `;
        tooltipList.appendChild(tooltipItem);
      });
  
      document.querySelectorAll(".btn-edit").forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = parseInt((event.target as HTMLElement).dataset.index!);
          const tooltip = tooltips[index];
  
          const editModal = document.createElement("div");
          editModal.className = "modal";
          editModal.innerHTML = `
            <div class="modal-content">
              <h3>Edit Tooltip</h3>
              <label>
                Tooltip Text:
                <input type="text" id="editTooltipInput" value="${tooltip.text}" />
              </label>
              <div class="modal-actions">
                <button id="saveEditTooltip">Save</button>
                <button id="cancelEditTooltip">Cancel</button>
              </div>
            </div>
          `;
          document.body.appendChild(editModal);
  
          const saveButton = document.getElementById("saveEditTooltip") as HTMLButtonElement;
          const cancelButton = document.getElementById("cancelEditTooltip") as HTMLButtonElement;
  
          saveButton.addEventListener("click", () => {
            const input = document.getElementById("editTooltipInput") as HTMLInputElement;
            const newText = input.value.trim();
            if (newText) {
              onEdit(index, newText);
              renderTooltipList();
              editModal.remove();
            }
          });
  
          cancelButton.addEventListener("click", () => {
            editModal.remove();
          });
        });
      });
  
      document.querySelectorAll(".btn-delete").forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = parseInt((event.target as HTMLElement).dataset.index!);
  
          const deleteModal = document.createElement("div");
          deleteModal.className = "modal";
          deleteModal.innerHTML = `
            <div class="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this tooltip?</p>
              <div class="modal-actions">
                <button id="confirmDelete">Delete</button>
                <button id="cancelDelete">Cancel</button>
              </div>
            </div>
          `;
          document.body.appendChild(deleteModal);
  
          const confirmButton = document.getElementById("confirmDelete") as HTMLButtonElement;
          const cancelButton = document.getElementById("cancelDelete") as HTMLButtonElement;
  
          confirmButton.addEventListener("click", () => {
            onDelete(index);
            renderTooltipList();
            deleteModal.remove();
          });
  
          cancelButton.addEventListener("click", () => {
            deleteModal.remove();
          });
        });
      });
  
      document.querySelectorAll(".btn-customize").forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = parseInt((event.target as HTMLElement).dataset.index!);
          const panel = document.getElementById(`customize-panel-${index}`) as HTMLDivElement;
          panel.style.display = panel.style.display === "none" ? "block" : "none";
        });
      });
  
      document.querySelectorAll(".btn-save-customize").forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = parseInt((event.target as HTMLElement).dataset.index!);
          const fontSizeInput = document.querySelector(`.font-size-input[data-index="${index}"]`) as HTMLInputElement;
          const bgColorInput = document.querySelector(`.bg-color-input[data-index="${index}"]`) as HTMLInputElement;
          const textColorInput = document.querySelector(`.text-color-input[data-index="${index}"]`) as HTMLInputElement;
  
          const styles = {
            fontSize: fontSizeInput.value,
            bgColor: bgColorInput.value,
            textColor: textColorInput.value,
          };
  
          onCustomize(index, styles);
        });
      });
    }
      searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredTooltips = tooltips.filter((tooltip) =>
        tooltip.text.toLowerCase().includes(searchTerm)
      );
      renderTooltipList(filteredTooltips);
    });
      exportButton.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tooltips));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "tooltips.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  
    renderTooltipList();
  }
  