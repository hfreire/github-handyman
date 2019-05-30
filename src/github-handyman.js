/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const EventEmitter = require('events')

const _ = require('lodash')

const GitHubWrapper = require('@dog-ai/github-wrapper')

const parallel = async (functions, parallelism = 1) => {
  const queue = new Set()

  return functions.map(async (f) => {
    while (queue.size >= parallelism) {
      // eslint-disable-next-line promise/no-native
      await Promise.race(queue)
    }

    const promise = f()
    queue.add(promise)

    await promise

    queue.delete(promise)
  })
}

const isDependabotPull = (pull) => {
  return pull.user.login === 'dependabot-preview[bot]'
}

const isGreenkeeperPull = (pull) => {
  return pull.user.login === 'greenkeeper[bot]' &&
    !!_.find(pull.combinedStatus.statuses, {
      context: 'greenkeeper/verify',
      state: 'success'
    })
}

const isGreenkeeperPullUpdatedByOwner = (pull, owner) => {
  return pull.user.login === owner &&
    !!_.find(pull.labels, { name: 'greenkeeper' })
}

const findGreenkeeperCommentAboutLatestVersion = (comments) => {
  if (_.isEmpty(comments)) {
    return
  }

  const latestComment = _.last(_.filter(comments, { user: { login: 'greenkeeper[bot]' } }))

  if (!latestComment) {
    return
  }

  const encodedHead = _.last(/\.\.\.[\w-]+:(.*)\)/.exec(latestComment.body))
  if (!encodedHead) {
    return
  }

  return decodeURIComponent(encodedHead)
}

const mergeDependabotPullRequest = async function (user, owner, repo, pull) {
  if (!isDependabotPull(pull)) {
    return
  }

  const isSuccess = pull.combinedStatus.state === 'success'

  if (isSuccess) {
    const reviews = await this._github.listPullRequestReviews(owner, repo, pull.number)
    if (!_.find(reviews, { user: { login: user } })) {
      await this._github.requestPullRequestReview(owner, repo, pull.number, [ user ])
      this.emit('pulls:review:request', owner, repo, pull.number, [ user ])

      await this._github.reviewPullRequest(owner, repo, pull.number, pull.head.sha, 'APPROVE')
      this.emit('pulls:review', owner, repo, pull.number, pull.head.sha, 'APPROVE')
    }

    const title = pull.title.replace('chore(deps)', 'fix(deps)')
    await this._github.mergePullRequest(owner, repo, pull.number, pull.head.sha, 'squash', title)
    this.emit('pulls:merge', owner, repo, pull.number, pull.head.sha, 'squash', title)
  }
}

const mergeGreenkeeperPullRequest = async function (user, owner, repo, pull) {
  if (!(isGreenkeeperPull(pull) || isGreenkeeperPullUpdatedByOwner(pull, owner))) {
    return
  }

  const isSuccess = pull.combinedStatus.state === 'success'

  if (isSuccess) {
    await this._github.mergePullRequest(owner, repo, pull.number, pull.head.sha)
    this.emit('pulls:merge', owner, repo, pull.number, pull.head.sha, 'squash')

    return
  }

  if (!isSuccess && isGreenkeeperPull(pull)) {
    const comments = await this._github.getPullRequestComments(owner, repo, pull.number)
    const head = findGreenkeeperCommentAboutLatestVersion(comments)

    if (head) {
      await updateGreenkeeperPullRequestWithLatestVersion.bind(this)(owner, repo, pull.number, head)
    }
  }
}

const mergeRobotPullRequests = async function (user, owner, repos, { repoConcurrency, pullConcurrency }) {
  const handlePull = async (repo, pull) => {
    if (isGreenkeeperPull(pull)) {
      try {
        await mergeGreenkeeperPullRequest.bind(this)(user, owner, repo, pull)
      } catch (error) {
        this.emit('error', error, owner, repo, pull)
      }

      return
    }

    if (isDependabotPull(pull)) {
      try {
        await mergeDependabotPullRequest.bind(this)(user, owner, repo, pull)
      } catch (error) {
        this.emit('error', error, owner, repo, pull)
      }
    }
  }

  const handleRepo = async (repo) => {
    const pulls = await this._github.getRepoPullRequestsByState(owner, repo, 'open')

    const promises = await parallel(pulls.map((pull) => handlePull.bind(this, repo, pull)), pullConcurrency)

    // eslint-disable-next-line promise/no-native
    await Promise.all(promises)
  }

  const promises = await parallel(repos.map((repo) => handleRepo.bind(this, repo)), repoConcurrency)
  // eslint-disable-next-line promise/no-native
  await Promise.all(promises)
}

const updateGreenkeeperPullRequest = async function (owner, repo, title, head, number) {
  const pull = await this._github.createPullRequest(owner, repo, title, head, 'master')
  this.emit('pulls:create', owner, repo, title, head, 'master')

  try {
    await this._github.octokit.issues.addLabels({ owner, repo, issue_number: pull.number, labels: [ 'greenkeeper' ] })
    await this.closePullRequest(owner, repo, number)
    this.emit('pulls:close', owner, repo, number)
  } catch (error) {
    await this.closePullRequest(owner, repo, pull.number)
    this.emit('pulls:close', owner, repo, pull.number)
  }

  return pull
}

const updateGreenkeeperPullRequestWithLatestVersion = async function (owner, repo, number, head) {
  const [ , , dependency, version ] = /(\w+)\/(.*)-(\d.+)/.exec(head)
  const title = `Update ${dependency} to ${version}`

  return updateGreenkeeperPullRequest.bind(this)(owner, repo, title, head, number)
}

const defaultOptions = {
  github: {}
}

class GitHubHandyman extends EventEmitter {
  constructor (options = {}) {
    super()

    this._options = _.defaultsDeep({}, options, defaultOptions)

    this._github = new GitHubWrapper(this._options.github)
  }

  async helpOutWithPullRequests (org, options = { repoConcurrency: 1, pullConcurrency: 1 }) {
    const user = await this._github.getUser()
    const repos = !org ? await this._github.getUserRepos() : await this._github.getOrgRepos(org)
    const owner = !org ? user : org

    await mergeRobotPullRequests.bind(this)(user, owner, repos, options)
  }
}

module.exports = GitHubHandyman
