/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const GH_TOKEN = process.env.GH_TOKEN
const GH_OWNERS = process.env.GH_OWNERS

const _ = require('lodash')

const GitHubWrapper = require('@dog-ai/github-wrapper')

const owners = _.words(GH_OWNERS, /[^, ]+/g) || []
const github = new GitHubWrapper({ github: { type: 'token', token: GH_TOKEN } })

module.exports = async () => {
  const mergedGreenkeeperPullRequests = []

  for (const owner of owners) {
    try {
      mergedGreenkeeperPullRequests.concat(await github.mergeGreenkeeperPullRequests(owner))
    } catch (error) {
      console.error(error)
    } finally {
      console.log(`Merged ${mergedGreenkeeperPullRequests.length} Greenkeeper Pull Requests: ${mergedGreenkeeperPullRequests}`)
    }
  }
}
