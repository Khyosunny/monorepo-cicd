import { Octokit } from 'octokit';
import core from '@actions/core';
// import github from '@actions/github';

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

try {
  const pullNumber = core.getInput('pr-number');
  console.log('pullNumber..:', pullNumber);
  // const { data: allList } = await octokit.rest.pulls.list({
  //   owner: 'Khyosunny',
  //   repo: 'monorepo-cicd',
  //   state: 'open',
  //   sort: 'created',
  //   direction: 'desc',
  //   page: 1,
  //   per_page: 1,
  // });
  // console.log('allList: ', allList);

  // if (allList.length > 0) {
  // const pullNumber = allList[0].number;
  // console.log('pullNumber: ', pullNumber);

  const { data: pullList } = await octokit.rest.pulls.listFiles({
    owner: 'Khyosunny',
    repo: 'monorepo-cicd',
    pull_number: pullNumber,
  });

  const fileNames = pullList
    .filter((file) => file.filename.includes('packages/'))
    .map((files) => files.filename);
  console.log('fileNames:: ', fileNames);

  if (fileNames.length === 0) throw new Error('No files changed');
  const labelName = fileNames.map((path) => path.split('/')[1]);
  console.log('labelName:: ', labelName);
  core.setOutput('label-list', labelName);

  const { data } = await octokit.rest.issues.addLabels({
    owner: 'Khyosunny',
    repo: 'monorepo-cicd',
    issue_number: pullNumber,
    labels: labelName,
  });
  console.log('d..:', data);
} catch (error) {
  core.setFailed(error.message);
}

// try {
//   // const { data: pulls } = await octokit.request(
//   //   'GET /repos/:owner/:repo/pulls',
//   //   {
//   //     owner: 'Khyosunny',
//   //     repo: 'monorepo-cicd',
//   //     state: 'closed',
//   //     sort: 'updated',
//   //   }
//   // );
//   // const { data: files } = await octokit.request(
//   //   'GET /repos/:owner/:repo/pulls/:pull_number/files',
//   //   {
//   //     owner: 'Khyosunny',
//   //     repo: 'monorepo-cicd',
//   //     pull_number: '48',
//   //   }
//   // );
// } catch (error) {}
