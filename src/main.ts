import { ImageUploader } from "./ImageUploader.js";
import { TooltipManager } from "./TooltipManager.js";
import './styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const appRoot = document.getElementById("app");

if (appRoot) {
    let imageSrc: string | null = null;
    let dimensions = { width: 800, height: 600 };

    const onImageUpload = (base64Image: string, newDimensions: { width: number; height: number }) => {
        imageSrc = base64Image;
        dimensions = newDimensions;
        renderTooltipManager(imageSrc, dimensions);
    };

    const renderImageUploader = () => {
        const uploaderContainer = document.createElement("div");
        uploaderContainer.id = "uploader-container";
        appRoot.replaceChildren(uploaderContainer);

        try {
            new ImageUploader("uploader-container", onImageUpload);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error initializing ImageUploader:", error.message);
            } else {
                console.error("Unknown error initializing ImageUploader:", error);
            }
        }
    };

    const renderTooltipManager = (imageSrc: string, dimensions: { width: number; height: number }) => {
        const annotationContainer = document.createElement("div");
        annotationContainer.id = "annotation-container";
        appRoot.replaceChildren(annotationContainer);

        try {
            new TooltipManager(annotationContainer, imageSrc, renderImageUploader);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error initializing TooltipManager:", error.message);
            } else {
                console.error("Unknown error initializing TooltipManager:", error);
            }
        }
    };

    renderImageUploader();
}
