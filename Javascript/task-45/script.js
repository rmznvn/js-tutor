const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

let acceptedFiles = [];
let validationErrors = [];

function getFileId(file) {
  // The combination distinguishes files better than the name alone.
  return `${file.name}-${file.size}-${file.lastModified ?? 0}`;
}

function addFiles(currentFiles, incomingFiles) {
  const nextFiles = [...currentFiles];
  const errors = [];
  let totalSize = nextFiles.reduce((sum, file) => sum + file.size, 0);

  incomingFiles.forEach((file) => {
    const isDuplicate = nextFiles.some(
      (currentFile) => getFileId(currentFile) === getFileId(file)
    );

    if (isDuplicate) {
      errors.push(`${file.name}: this file is already in the queue.`);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: unsupported file type.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: the file is larger than 2 MB.`);
      return;
    }

    if (totalSize + file.size > MAX_TOTAL_SIZE) {
      errors.push(`${file.name}: adding it would exceed the 5 MB total.`);
      return;
    }

    nextFiles.push(file);
    totalSize += file.size;
  });

  return { files: nextFiles, errors };
}

function formatMegabytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

function render() {
  const fileList = document.querySelector("#file-list");
  const errorList = document.querySelector("#error-list");
  const summary = document.querySelector("#summary");

  fileList.innerHTML = "";
  errorList.innerHTML = "";

  acceptedFiles.forEach((file) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.fileId = getFileId(file);
    button.textContent = `Remove ${file.name}`;
    item.append(`${file.name} — ${formatMegabytes(file.size)} MB `, button);
    fileList.append(item);
  });

  validationErrors.forEach((error) => {
    const item = document.createElement("li");
    item.textContent = error;
    errorList.append(item);
  });

  const totalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
  summary.textContent = `${acceptedFiles.length} file(s), ${formatMegabytes(totalSize)} MB total.`;
}

document.querySelector("#file-input").addEventListener("change", (event) => {
  // FileList is array-like; Array.from provides array methods and predictable iteration.
  const incomingFiles = Array.from(event.target.files);
  const result = addFiles(acceptedFiles, incomingFiles);

  acceptedFiles = result.files;
  validationErrors = result.errors;

  // Resetting allows the same file to trigger change again after removal.
  event.target.value = "";
  render();
});

document.querySelector("#file-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-file-id]");
  if (!button) return;

  acceptedFiles = acceptedFiles.filter(
    (file) => getFileId(file) !== button.dataset.fileId
  );
  validationErrors = [];
  render();
});

render();
