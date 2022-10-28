const { Octokit } = require('octokit');
const core = require('@actions/core');
const github = require('@actions/github');

function getChangedFiles(pullListFiles, paths) {
  const changedFileNames = pullListFiles.map((listFile) => listFile.filename);
  return changedFileNames.filter((fileName) => {
    const directory = fileName.split('/');
    const regx = new RegExp(`^(${directory[0]})\/(${directory[1]})(\/?)`);
    return regx.test(paths);
  });

  // paths.forEach((path) => {
  //   // directory = path.split('/');
  //   const regx = new RegExp(`^(${directory[0]})\/(${directory[1]})(\/?)`);
  //   fileNames.filter((file) => regx.test(file));
  // });
}
