Image Annotation Tool This project provides an interactive image
annotation interface that lets users add and manage tooltips on uploaded
images. The application is built using a vanilla TypeScript
implementation and styled with Tailwind CSS. Users can upload images,
resize them, and place tooltips anywhere on the image. These tooltips
can be edited, deleted, and adjusted dynamically as the image or
viewport size changes.

Features Image Upload and Preview: Drag and drop an image file or click
the \"Choose File\" button to upload JPEG or PNG images up to 2MB.
Interactive Tooltips: Click anywhere on the image to create tooltips.
Tooltips can be edited, deleted, and moved. Responsive Resizing: The
tooltips adjust dynamically when the image size changes. Vanilla
TypeScript & Tailwind CSS: No front-end framework is used. The project
relies solely on TypeScript for logic and Tailwind CSS for styling.
Steps to Run the Project Prerequisites Make sure you have the following
tools installed on your system:

Node.js (v14 or higher): Download and install Node.js from nodejs.org.

NPM (Node Package Manager): NPM is bundled with Node.js, so it will be
installed automatically.

Installation and Setup Clone the Repository: Open your terminal or
command prompt and run:

bash Copy git clone
https://github.com/your-username/image-annotation-tool.git cd
image-annotation-tool Install Dependencies: Install the project's
required dependencies by running:

bash Copy npm install Start the Development Server: To start a local
development server, use:

bash Copy npm run dev This will start the application locally and
automatically open it in your default web browser.

Building for Production If you want to prepare a production build of the
project:

Run the build command: bash Copy npm run build The optimized production
files will be output into the dist directory. Serving the Build Once you
have the build files, you can serve them using any static server. For
example, using serve:

Install the serve package globally if you don't already have it: bash
Copy npm install -g serve Serve the dist directory: bash Copy serve dist
This will host the application locally so you can access it at
http://localhost:5000 (or the specified port) in your browser.
