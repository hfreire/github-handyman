/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const GH_ORGS = process.env.GH_ORGS
const GH_TOKEN = process.env.GH_TOKEN

const _ = require('lodash')

const GitHubHandyman = require('./github-handyman')

const orgs = _.words(GH_ORGS, /[^, ]+/g) || []
const owners = [ undefined ].concat(orgs)

const handyman = new GitHubHandyman({ github: { octokit: { auth: GH_TOKEN } } })
handyman.on('error', (error, owner, repo, { url }) => console.warn(`Failed to help out with pull request ${url} because of ${error.message}`))
handyman.on('pulls:create', (owner, repo, title) => console.info(`Created pull request ${owner}/${repo} ${title}`))
handyman.on('pulls:merge', (owner, repo, number) => console.info(`Merged pull request ${owner}/${repo} ${number}`))
handyman.on('pulls:close', (owner, repo, number) => console.info(`Closed pull request ${owner}/${repo} ${number}`))

module.exports = async () => {
  for (const owner of owners) {
    try {
      await handyman.helpOutWithPullRequests(owner, { repoConcurrency: 10, pullConcurrency: 5 })
    } catch (error) {
      console.error(error)
    }
  }
}
