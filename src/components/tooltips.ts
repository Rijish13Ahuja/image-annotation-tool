export interface Tooltip {
  x: number;
  y: number;
  text: string;
  fontSize?: string;
  backgroundColor?: string;
  textColor?: string;
}

let tooltips: Tooltip[] = [];

export function createTooltip(x: number, y: number, text: string): void {
  const duplicate = tooltips.find(
    (tooltip) => tooltip.x === x && tooltip.y === y && tooltip.text === text
  );

  if (!duplicate) {
    tooltips.push({
      x,
      y,
      text,
      backgroundColor: "#ffffff", 
      textColor: "#000000", 
    });
  } else {
    console.warn(
      "Tooltip already exists at the given coordinates with the same text."
    );
  }
}

export function editTooltip(index: number, newText: string): void {
  if (tooltips[index]) {
    tooltips[index].text = newText;
  }
}

export function deleteTooltip(index: number): void {
  if (tooltips[index]) {
    tooltips.splice(index, 1);
  }
}

export function customizeTooltip(
  index: number,
  options: { fontSize?: string; backgroundColor?: string; textColor?: string }
): void {
  if (tooltips[index]) {
    const tooltip = tooltips[index];
    tooltip.fontSize = options.fontSize || tooltip.fontSize;
    tooltip.backgroundColor =
      options.backgroundColor !== undefined
        ? options.backgroundColor
        : tooltip.backgroundColor; 
    tooltip.textColor = options.textColor || tooltip.textColor;

    console.log(`Customized tooltip: ${JSON.stringify(tooltip)}`); 
  }
}

export function renderTooltips(ctx: CanvasRenderingContext2D, scale: number): void {
  tooltips.forEach(({ x, y, text, fontSize, backgroundColor, textColor }) => {
    const markerRadius = 5 / scale;

    ctx.beginPath();
    ctx.arc(x, y, markerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#FF5555";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2 / scale;
    ctx.stroke();
    ctx.closePath();

    if (text) {
      const fontSizePx = fontSize ? parseInt(fontSize, 10) : 14 / scale;
      ctx.font = `${fontSizePx}px Arial`;
      const textWidth = ctx.measureText(text).width;
      const textHeight = fontSizePx; 
      const padding = 5 / scale;

      ctx.fillStyle = backgroundColor || "#ffffff"; 
      ctx.fillRect(
        x + 10 / scale - padding,
        y - 10 / scale - textHeight - padding,
        textWidth + 2 * padding,
        textHeight + 2 * padding
      );

      ctx.fillStyle = textColor || "#000000"; 
      ctx.fillText(text, x + 10 / scale, y - 10 / scale);
    }
  });
}

export function getTooltips(): Tooltip[] {
  return tooltips;
}

export function setTooltips(newTooltips: Tooltip[]): void {
  tooltips = newTooltips;
}
export function resetTooltips(): void {
  console.log("Resetting tooltips array.");
  tooltips = [];
}
