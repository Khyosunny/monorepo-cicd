import { Octokit } from 'octokit';
import core from '@actions/core';
import github from '@actions/github';

try {
  const TOKEN = core.getInput('repo-token');
  const octokit = new Octokit({
    auth: TOKEN,
  });

  const pullNumber = core.getInput('pr-number');

  const { data: pullList } = await octokit.rest.pulls.listFiles({
    ...github.context.repo,
    pull_number: pullNumber,
  });

  const fileNames = pullList
    .filter((files) => files.filename.includes('packages/'))
    .map((file) => file.filename);
  console.log('fileNames:: ', fileNames);

  if (fileNames.length === 0) throw new Error('No files changed');
  const labelName = fileNames.map((path) => path.split('/')[1]);
  console.log('labelName:: ', labelName);
  core.setOutput('label-list', labelName);

  const { data } = await octokit.rest.issues.addLabels({
    ...github.context.repo,
    issue_number: pullNumber,
    labels: labelName,
  });
  console.log('d..:', data);
} catch (error) {
  core.setFailed(error.message);
}
