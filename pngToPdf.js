import path from "path";
import fs from "fs";
import { createWorker } from "tesseract.js";
import { fileURLToPath } from "url";

// Ensure the PNG file path is provided as a command-line argument
const imagePath = process.argv[2];

if (!imagePath) {
  console.error(
    "Please provide the path to the PNG file as the first argument."
  );
  process.exit(1);
}

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const image = path.resolve(__dirname, imagePath);

console.log(`Recognizing ${image}`);

(async () => {
  const worker = await createWorker();

  // Generate the PDF title based on the input file name
  const inputFileName = path.basename(image, path.extname(image));
  const pdfTitle = `${inputFileName} PDF`;

  const {
    data: { text, pdf },
  } = await worker.recognize(image, { pdfTitle }, { pdf: true });

  // Ensure the output directory exists
  const outputDir = "output";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Generate the output file path
  const outputFileName = `${inputFileName}_result.pdf`;
  const outputPath = path.join(outputDir, outputFileName);

  fs.writeFileSync(outputPath, Buffer.from(pdf));
  console.log(`Generate PDF: ${outputPath}`);

  await worker.terminate();
})();
