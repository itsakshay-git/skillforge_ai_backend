const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const parseFileContent = async (filePath, originalName, mimeType) => {
  console.log("📁 FilePath:", filePath);
  const buffer = fs.readFileSync(filePath);

  const ext = path.extname(originalName).toLowerCase(); // get from original name
  console.log("🧩 Extension:", ext);

  if (ext === '.pdf' || mimeType === 'application/pdf') {
    const data = await pdf(buffer);
    return data.text;
  }

  if (ext === '.docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  return buffer.toString(); // fallback
};

module.exports = { parseFileContent };
