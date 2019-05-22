/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Handler', () => {
  let subject
  let GitHubWrapper

  beforeAll(() => {
    GitHubWrapper = require('@dog-ai/github-wrapper')
    jest.mock('@dog-ai/github-wrapper')
  })

  describe('when handling a schedule event', () => {
    const token = 'my-token'
    const orgs = 'my-owner'

    beforeAll(() => {
      process.env.GH_TOKEN = token
      process.env.GH_ORGS = orgs
    })

    beforeEach(() => {
      subject = require('../src/handler')
    })

    it('should merge greenkeeper pull requests for both the authenticated user and the org', async () => {
      await subject()

      expect(GitHubWrapper.mock.instances[ 0 ].mergeGreenkeeperPullRequests).toHaveBeenCalledTimes(2)
    })
  })
})
