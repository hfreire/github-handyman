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
    //jest.mock('@dog-ai/github-wrapper')
  })

  describe('when handling a schedule event', () => {
    const token = 'my-token'
    const orgs = 'my-owner'
    let mergeGreenkeeperPullRequests

    beforeAll(() => {
      //process.env.GH_TOKEN = token
      //process.env.GH_ORGS = orgs

      mergeGreenkeeperPullRequests = jest.fn().mockImplementation(() => {
        return {}
      })
    })

    beforeEach(() => {
      //GitHubWrapper.mockImplementation(() => {
      //  return { mergeGreenkeeperPullRequests }
      //})

      subject = require('../src/handler')
    })

    it('should call merge greenkeeper pull requests', async () => {
      jest.setTimeout(400000)
      await subject()

      expect(mergeGreenkeeperPullRequests).toHaveBeenCalledTimes(2)
    })
  })
})
