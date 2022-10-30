const { Octokit } = require('octokit');
const core = require('@actions/core');

// function getRelease () {

// }

try {
  const TOKEN = core.getInput('repo-token');
  const pullNumber = core.getInput('pr-number');
  const octokit = new Octokit({
    auth: TOKEN,
  });
  const { data: listReleases } = await octokit.rest.repos.listReleases({
    // ...repo,
    repo: 'monorepo-cicd',
    owner: 'Khyosunny',
  });
  // draft 가 false 이면 published 된 릴리즈
  const draftRelease = listReleases.find((r) => r.draft);
} catch (error) {
  core.setFailed(error.message);
}
