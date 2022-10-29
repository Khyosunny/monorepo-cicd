export function getChangedFiles(pullListFiles, path) {
  return pullListFiles
    .map((listFile) => listFile.filename)
    .filter((fileName) => fileName.includes(path));
}

export function getLabelNames(pullListFiles, path) {
  const changedFiles = getChangedFiles(pullListFiles, path);
  if (changedFiles.length === 0) throw new Error('No files changed');
  return changedFiles.map((path) => path.split('/')[1]);
}
