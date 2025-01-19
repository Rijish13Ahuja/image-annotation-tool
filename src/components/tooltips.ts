export interface Tooltip {
    x: number;
    y: number;
    text: string;
    fontSize?: string;
    backgroundColor?: string;
    textColor?: string;
}

let tooltips: Tooltip[] = [];

// Create a new tooltip
export function createTooltip(x: number, y: number, text: string): void {
    tooltips.push({ x, y, text });
}

// Edit an existing tooltip
export function editTooltip(index: number, newText: string): void {
    if (tooltips[index]) {
        tooltips[index].text = newText;
    }
}

// Delete a tooltip
export function deleteTooltip(index: number): void {
    if (tooltips[index]) {
        tooltips.splice(index, 1);
    }
}

// Customize tooltip styles
export function customizeTooltip(
    index: number,
    options: { fontSize?: string; backgroundColor?: string; textColor?: string }
): void {
    if (tooltips[index]) {
        const tooltip = tooltips[index];
        tooltip.fontSize = options.fontSize || tooltip.fontSize;
        tooltip.backgroundColor = options.backgroundColor || tooltip.backgroundColor;
        tooltip.textColor = options.textColor || tooltip.textColor;
    }
}

// Render all tooltips on the canvas
export function renderTooltips(ctx: CanvasRenderingContext2D, scale: number): void {
    tooltips.forEach(({ x, y, text, fontSize, backgroundColor, textColor }) => {
        const markerRadius = 5 / scale;

        // Draw the marker
        ctx.beginPath();
        ctx.arc(x, y, markerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#FF5555";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2 / scale;
        ctx.stroke();
        ctx.closePath();

        // Draw the background rectangle for the tooltip text
        if (text) {
            ctx.font = `${fontSize || 14 / scale}px Arial`;
            const textWidth = ctx.measureText(text).width;
            const textHeight = parseInt(ctx.font, 10);
            const padding = 5 / scale;

            ctx.fillStyle = backgroundColor || "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(
                x + 10 / scale - padding,
                y - 10 / scale - textHeight - padding,
                textWidth + 2 * padding,
                textHeight + 2 * padding
            );

            // Draw the text
            ctx.fillStyle = textColor || "#FFFFFF";
            ctx.fillText(text, x + 10 / scale, y - 10 / scale);
        }
    });
}

// Export tooltips for external use
export function getTooltips(): Tooltip[] {
    return tooltips;
}

// Set tooltips (e.g., for importing data)
export function setTooltips(newTooltips: Tooltip[]): void {
    tooltips = newTooltips;
}
