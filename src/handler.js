/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const GH_TOKEN = process.env.GH_TOKEN
const GH_ORGS = process.env.GH_ORGS

const _ = require('lodash')

const GitHubWrapper = require('@dog-ai/github-wrapper')

const github = new GitHubWrapper({ octokit: { auth: GH_TOKEN } })

const orgs = _.words(GH_ORGS, /[^, ]+/g) || []
const owners = [ undefined ].concat(orgs)

github.on('error', (error, owner, repo, { url }) => console.warn(`Failed to merge Greenkeeper pull request ${url} because of ${error.message}`))
github.on('pulls:create', (owner, repo, title) => console.info(`Created pull request ${owner}/${repo} ${title}`))
github.on('pulls:merge', (owner, repo, number) => console.info(`Merged pull request ${owner}/${repo} ${number}`))
github.on('pulls:close', (owner, repo, number) => console.info(`Closed pull request ${owner}/${repo} ${number}`))

module.exports = async () => {
  for (const owner of owners) {
    try {
      await github.mergeGreenkeeperPullRequests(owner, { repoConcurrency: 10, pullConcurrency: 5 })
    } catch (error) {
      console.error(error)
    }
  }
}
