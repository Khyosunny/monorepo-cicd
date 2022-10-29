import { Octokit } from 'octokit';
import core from '@actions/core';
import github from '@actions/github';
import { getChangedFiles } from '../lib/changed-files.mjs';

async function createLabel() {
  try {
    const TOKEN = core.getInput('repo-token');
    const octokit = new Octokit({
      auth: TOKEN,
    });
    const pullNumber = core.getInput('pr-number');
    const { data: pullListFiles } = await octokit.rest.pulls.listFiles({
      ...github.context.repo,
      pull_number: pullNumber,
    });

    console.log('pullListFiles::,', pullListFiles);
    const changedFiles = getChangedFiles(pullListFiles);
    console.log('changedFiles::,', changedFiles);

    // const fileNames = pullListFiles
    //   .filter((files) => files.filename.includes('packages/'))
    //   .map((file) => file.filename);
    // console.log('fileNames:: ', fileNames);

    // if (fileNames.length === 0) throw new Error('No files changed');

    if (changedFiles.length === 0) throw new Error('No files changed');
    // const labelName = fileNames.map((path) => path.split('/')[1]);
    // console.log('labelName:: ', labelName);
    // core.setOutput('label-list', labelName);

    // const { data } = await octokit.rest.issues.addLabels({
    //   ...github.context.repo,
    //   issue_number: pullNumber,
    //   labels: labelName,
    // });
    // console.log('d..:', data);
  } catch (error) {
    core.setFailed(error.message);
  }
}

createLabel();
