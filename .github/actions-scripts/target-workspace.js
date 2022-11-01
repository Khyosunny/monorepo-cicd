const { Octokit } = require('octokit');
const core = require('@actions/core');
const github = require('@actions/github');
const compareVersions = require('compare-versions');

function sortReleases(releases) {
  // 가장 큰 릴리즈 번호를 찾는다.
  // 가장 최근에 병합된
  try {
    return releases.sort((r1, r2) => compareVersions(r1.tag_name, r2.tag_name));
  } catch {
    // tag_name (버전) 이 없어 비교가 안돨 때 created_at 으로 비교
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

    // lastRelease의 created_at 이후에 생성된 커밋들 가져오기
    const { data: listCommits } = await octokit.rest.repos.listCommits({
      ...github.context.repo,
      since: lastRelease ? lastRelease.created_at : undefined,
    });
    console.log('listCommits::', listCommits);
    console.log('lastRelease.created_at::', lastRelease.created_at);

    if (listCommits.length > 0) {
      const commitSha = listCommits.map((list) => list.sha);
      const labelNameList = [];

      for (const sha of commitSha) {
        const { data: listPullRequestWithCommit } =
          await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
            ...github.context.repo,
            commit_sha: sha,
          });

        // 해당 커밋들이 속한 PR의 라벨 네임 추출하기
        for (const list of listPullRequestWithCommit) {
          const labelNames = list.labels.map((label) => label.name);
          labelNameList.push(...labelNames);
        }
      }

      // 배열에 라벨 네임 중복으로 들어가지 않게 new Set
      const uniqueLabelNameList = [...new Set(labelNameList)];
      console.log('!!uniqueLabelNameList::', uniqueLabelNameList);

      // 라벨이 1개고 common 라벨만 있다면 모든 패키지를 빌드하기 위해 ALL
      if (uniqueLabelNameList.includes('common')) {
        core.setOutput('target-workspace-name', 'ALL');
      } else if (uniqueLabelNameList.length === 1) {
        core.setOutput('target-workspace-name', uniqueLabelNameList[0]);
      } else {
        core.setOutput('target-workspace-name', uniqueLabelNameList.join(','));
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
getCommits();
