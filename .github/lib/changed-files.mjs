export function getChangedFiles(pullListFiles, path) {
  return pullListFiles
    .map((listFile) => listFile.filename)
    .filter((fileName) => fileName.includes(path));
  // if (paths.includes('\n')) {
  //   const splitPath = paths.split('\n');
  //   return changedFileNames
  //     .filter((fileName) => {
  //       const directory = fileName.split('/');
  //       const regx = new RegExp(`(${directory[0]})\/(${directory[1]})(\/?)`);
  //       return splitPath.filter((path) => regx.test(path));
  //     })
  //     .flat();
  // }
  // return changedFileNames.filter((fileName) => {
  //   const directory = fileName.split('/');
  //   const regx = new RegExp(`^(${directory[0]})\/(${directory[1]})(\/?)`);
  //   return regx.test(paths);
  // });
}
