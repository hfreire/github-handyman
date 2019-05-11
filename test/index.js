/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Module', () => {
  let subject
  let handler

  beforeAll(() => {
    handler = require('../src/handler')
    jest.mock('../src/handler')
  })

  describe('when loading', () => {
    beforeEach(() => {
      subject = require('../src/index')
    })

    it('should export handler', () => {
      expect(subject).toHaveProperty('handler', handler)
    })
  })
})
