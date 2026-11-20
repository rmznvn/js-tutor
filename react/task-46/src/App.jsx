import { useState } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function getFileId(file) {
  // A combined ID is more reliable than a file name by itself.
  return `${file.name}-${file.size}-${file.lastModified ?? 0}`;
}

function validateAndAddFiles(currentFiles, incomingFiles) {
  const nextFiles = [...currentFiles];
  const errors = [];
  let totalSize = nextFiles.reduce((sum, file) => sum + file.size, 0);

  incomingFiles.forEach((file) => {
    const isDuplicate = nextFiles.some(
      (currentFile) => getFileId(currentFile) === getFileId(file)
    );

    if (isDuplicate) {
      errors.push(`${file.name}: this file is already in the queue.`);
    } else if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: unsupported file type.`);
    } else if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: the file is larger than 2 MB.`);
    } else if (totalSize + file.size > MAX_TOTAL_SIZE) {
      errors.push(`${file.name}: adding it would exceed the 5 MB total.`);
    } else {
      nextFiles.push(file);
      totalSize += file.size;
    }
  });

  return { files: nextFiles, errors };
}

function formatMegabytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

export default function App() {
  // Files and the errors produced by the same selection are updated together.
  const [queue, setQueue] = useState({ files: [], errors: [] });
  const { files, errors } = queue;

  function handleFiles(event) {
    // Convert FileList so the validation function receives a normal array.
    const incomingFiles = Array.from(event.target.files);

    setQueue((currentQueue) =>
      validateAndAddFiles(currentQueue.files, incomingFiles)
    );

    // Permit selecting the same file again after it has been removed.
    event.target.value = "";
  }

  function removeFile(fileId) {
    setQueue((currentQueue) => ({
      files: currentQueue.files.filter(
        (file) => getFileId(file) !== fileId
      ),
      errors: [],
    }));
  }

  // The total is derived from the accepted files and needs no separate state.
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <main>
      <h1>Attach application documents</h1>
      <p>PDF, JPG, or PNG. Maximum 2 MB per file and 5 MB in total.</p>

      <input
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFiles}
      />

      <ul>
        {files.map((file) => {
          const fileId = getFileId(file);

          return (
            <li key={fileId}>
              {file.name} — {formatMegabytes(file.size)} MB
              <button type="button" onClick={() => removeFile(fileId)}>
                Remove {file.name}
              </button>
            </li>
          );
        })}
      </ul>

      <ul aria-live="polite">
        {errors.map((error) => <li key={error}>{error}</li>)}
      </ul>

      <p>{files.length} file(s), {formatMegabytes(totalSize)} MB total.</p>
    </main>
  );
}
