const { Octokit } = require('octokit');
const core = require('@actions/core');
const github = require('@actions/github');

function sortReleases(releases) {
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
}

async function getCommits() {
  try {
    const TOKEN = core.getInput('repo-token');
    const octokit = new Octokit({
      auth: TOKEN,
    });
    const { data: listReleases } = await octokit.rest.repos.listReleases({
      ...github.context.repo,
    });

    // draft 가 false 이면 published 된 릴리즈
    const sortedPublishedReleases = sortReleases(
      listReleases.filter((r) => !r.draft)
    );
    const draftRelease = listReleases.find((r) => r.draft);
    console.log('draftRelease~!!:', draftRelease);
    const lastRelease =
      sortedPublishedReleases[sortedPublishedReleases.length - 2];
    console.log('lastRelease~~~::', lastRelease);

    const { data: listCommits } = await octokit.rest.repos.listCommits({
      ...github.context.repo,
      since: lastRelease ? lastRelease.created_at : undefined,
    });
    console.log('listCommits::', listCommits);

    if (listCommits.length > 0) {
      const commitSha = listCommits.map((list) => list.sha);
      const labelNameList = [];

      for (const sha of commitSha) {
        const { data: listPullRequestWithCommit } =
          await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
            ...github.context.repo,
            commit_sha: sha,
          });

        for (const list of listPullRequestWithCommit) {
          // 배열에 라벨 네임 중복으로 들어가지 않게 new Set
          const labelNames = list.labels.map((label) => label.name);
          labelNameList.push(...labelNames);
        }
      }

      const uniqueLabelNameList = [...new Set(labelNameList)];
      console.log('!!uniqueLabelNameList::', uniqueLabelNameList);

      if (uniqueLabelNameList.length > 1) {
        core.setOutput('label-list', 'ALL');
      } else {
        uniqueLabelNameList[0] === 'common'
          ? core.setOutput('label-name', 'ALL')
          : core.setOutput('label-name', uniqueLabelNameList[0]);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
getCommits();
