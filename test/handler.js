/*
 * Copyright (c) 2021, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Handler', () => {
  let subject
  let GitHubHandyman

  beforeAll(() => {
    GitHubHandyman = require('../src/github-handyman')
    jest.mock('../src/github-handyman')
  })

  describe('when handling a schedule event', () => {
    const orgs = 'my-owner'
    const token = 'my-token'

    beforeAll(() => {
      process.env.GITHUB_HANDYMAN_WHITELISTED_ORGS = orgs
      process.env.GITHUB_HANDYMAN_GITHUB_TOKEN = token
    })

    beforeEach(() => {
      subject = require('../src/handler')
    })

    it('should help out with pull requests for both the authenticated user and the org', async () => {
      await subject()

      expect(GitHubHandyman.mock.instances[ 0 ].helpOutWithPullRequests).toHaveBeenCalledTimes(2)
    })
  })
})
