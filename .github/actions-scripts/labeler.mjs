import { Octokit } from 'octokit';
import core from '@actions/core';
import github from '@actions/github';
import { getLabelNames } from '../lib/changed-files.mjs';

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
  const labelName = getLabelNames(pullListFiles, 'packages/');

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
