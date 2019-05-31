/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('GitHubHandman', () => {
  let subject
  let GitHubWrapper

  beforeAll(() => {
    GitHubWrapper = require('@dog-ai/github-wrapper')
    jest.mock('@dog-ai/github-wrapper')
  })

  describe('when helping out pull requests', () => {
    const repos = []

    beforeEach(() => {
      const GitHubHandyman = require('../src/github-handyman')
      subject = new GitHubHandyman()

      GitHubWrapper.mock.instances[ 0 ].getUserRepos.mockImplementation(() => repos)
    })

    it('should get user repos', async () => {
      await subject.helpOutWithPullRequests()

      expect(GitHubWrapper.mock.instances[ 0 ].getUserRepos).toHaveBeenCalledTimes(1)
    })
  })
})
