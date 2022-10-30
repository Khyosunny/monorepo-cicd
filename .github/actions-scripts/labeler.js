const { Octokit } = require('octokit');
const core = require('@actions/core');
const github = require('@actions/github');
const { getLabelNames } = require('../lib/changed-files');

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
}

createLabel();
