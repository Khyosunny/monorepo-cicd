import { Octokit } from 'octokit';
import core from '@actions/core';
import github from '@actions/github';

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

// const { data: data3 } = await octokit.rest.pulls.get({
//   owner: 'Khyosunny',
//   repo: 'monorepo-cicd',
//   pull_number: '50',
//   mediaType: {
//     format: 'diff',
//   },
// });
// console.log('data3~~~: ', data3);
try {
  //
  const pullNumber = core.getInput('number');
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

  console.log(
    'pulls - list files',
    pullList,
    'get list path: ',
    pullList
      .map((file) => file.filename)
      .filter((path) => path.startsWith('packages/'))
  );
  const fileNames = pullList.map((file) => file.filename.includes('packages/'));
  const labelList = fileNames.filter((path) => path.split('/')[1]);
  core.setOutput('label-list', labelList);

  const { data } = await octokit.rest.issues.addLabels({
    owner: 'Khyosunny',
    repo: 'monorepo-cicd',
    issue_number: pullNumber,
    labels: labelList,
  });
  console.log('d', data);
  // }
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
