const { Octokit } = require('octokit');
const core = require('@actions/core');

// function getRelease () {

// }

const sortReleases = (releases) => {
  // 가장 큰 릴리즈 번호를 찾는다.
  // 가장 최근에 병합된
  try {
    return releases.sort((r1, r2) => compareVersions(r1.tag_name, r2.tag_name));
  } catch {
    // tag_name 이 없어 비교가 안돨 때 created_at 으로 비교
    return releases.sort(
      (r1, r2) => new Date(r1.created_at) - new Date(r2.created_at)
    );
  }
};

try {
  const TOKEN = core.getInput('repo-token');
  const octokit = new Octokit({
    auth: TOKEN,
  });
  const { data: listReleases } = await octokit.rest.repos.listReleases({
    // ...repo,
    repo: 'monorepo-cicd',
    owner: 'Khyosunny',
  });

  // draft 가 false 이면 published 된 릴리즈
  const sortedPublishedReleases = sortReleases(
    listReleases.filter((r) => !r.draft)
  );
  const draftRelease = listReleases.find((r) => r.draft);
  const lastRelease =
    sortedPublishedReleases[sortedPublishedReleases.length - 1];

  const { data: listCommits } = await octokit.rest.repos.listCommits({
    repo: 'monorepo-cicd',
    owner: 'Khyosunny',
    since: lastRelease ? lastRelease.created_at : '',
  });
} catch (error) {
  core.setFailed(error.message);
}
