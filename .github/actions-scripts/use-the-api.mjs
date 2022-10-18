import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

const {
  data: { data },
} = await octokit.rest.pulls.listFiles();
console.log('data: ', data);

try {
  const { data: pulls } = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls',
    {
      owner: 'Khyosunny',
      repo: 'monorepo-cicd',
      state: 'closed',
      sort: 'updated',
    }
  );
  console.log('pulls: ', pulls);

  const { data: files } = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
    {
      owner: 'Khyosunny',
      repo: 'monorepo-cicd',
      pull_number: '48',
    }
  );
  console.log('files: ', files);
} catch (error) {}
