import { Octokit } from 'octokit';
import core from '@actions/core';
import github from '@actions/github';

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

const { data: data3 } = await octokit.rest.pulls.get({
  owner: 'Khyosunny',
  repo: 'monorepo-cicd',
  pull_number: '50',
  mediaType: {
    format: 'diff',
  },
});
// console.log('data3~~~: ', data3.diff_url);

const { data: dd } = await octokit.rest.pulls.listFiles({
  owner: 'Khyosunny',
  repo: 'monorepo-cicd',
  pull_number: '50',
});

console.log(
  'ㅋㅋ',
  dd,
  'gg!',
  dd.map((file) => file.filename)
);
const changedFiles = await octokit.paginate(
  octokit.rest.pulls.listFiles.endpoint.merge(issue),
  (response) => response.data.map((file) => console.log(file.filename))
);
// console.log('changedFiles~~~: ', changedFiles);
// console.log('pulls~~~: ', pulls);
// console.log('files~~~~: ', files);

try {
  // const { data: pulls } = await octokit.request(
  //   'GET /repos/:owner/:repo/pulls',
  //   {
  //     owner: 'Khyosunny',
  //     repo: 'monorepo-cicd',
  //     state: 'closed',
  //     sort: 'updated',
  //   }
  // );
  // const { data: files } = await octokit.request(
  //   'GET /repos/:owner/:repo/pulls/:pull_number/files',
  //   {
  //     owner: 'Khyosunny',
  //     repo: 'monorepo-cicd',
  //     pull_number: '48',
  //   }
  // );
} catch (error) {}
