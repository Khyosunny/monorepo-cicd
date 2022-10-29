import { Octokit } from 'octokit';
import core from '@actions/core';
import github from '@actions/github';

try {
  const TOKEN = core.getInput('repo-token');
  const octokit = new Octokit({
    auth: TOKEN,
  });
  const pullNumber = core.getInput('pr-number');
  const { data: status } = octokit.rest.pulls.checkIfMerged({
    ...github.context.repo,
    pull_number: pullNumber,
  });
  console.log('status: ', status);

  const { data } = await octokit.rest.issues.listLabelsOnIssue({
    ...github.context.repo,
    issue_number: pullNumber,
  });
  console.log('data:.:', data);
} catch (error) {
  core.setFailed(error.message);
}
