import { expect } from 'vitest'

import { PPromise } from './pedro'

function withDone(testFn) {
  return () => new Promise(done => testFn(done))
}

describe('promise', () => {
  describe('instance', () => {
    describe('.then()', () => {
      describe('basics', () => {
        it(
          'should be able to resolve',
          withDone(done => {
            new PPromise(resolve => {
              resolve('success')
            }).then(res => {
              expect(res).toEqual('success')
              done()
            })
          })
        )
        it(
          'should be able to reject',
          withDone(done =>
            new PPromise((_resolve, reject) => {
              reject('fail')
            }).then(console.log, err => {
              expect(err).toEqual('fail')
              done()
            })
          )
        )
      })

      describe('async', () => {
        it(
          'should be support async (like setTimeout) (success-case)',
          withDone(done =>
            new PPromise(resolve => {
              setTimeout(() => {
                resolve('async-success')
              }, 0)
            }).then(res => {
              expect(res).toEqual('async-success')
              done()
            })
          )
        )
        it(
          'should be support async (like setTimeout) (fail-case)',
          withDone(done =>
            new PPromise((_resolve, reject) => {
              setTimeout(() => {
                reject('async-fail')
              }, 0)
            }).then(console.log, err => {
              expect(err).toEqual('async-fail')
              done()
            })
          )
        )
      })

      describe('chaining', () => {
        it(
          'should support multiple thens (success-case)',
          withDone(done =>
            new PPromise(resolve => resolve(5))
              .then(x => x + 5)
              .then(res => {
                expect(res).toEqual(10)
                done()
              })
          )
        )
        it.only(
          'should support multiple thens (fail-case)',
          withDone(done =>
            new PPromise((_resolve, reject) => reject(5))
              .then(undefined, x => x + 5)
              .then(res => {
                expect(res).toEqual(10)
                done()
              })
          )
        )
      })

      describe('inner-promise', () => {
        it.todo('should support having a promise returned within the chain')
      })

      it.todo('should return a promise immediately')
    })

    describe('.catch()', () => {
      it.todo('should handle any error within the chain')
      it.todo('only the next catch executes')
    })

    describe('.finally()', () => {
      it.todo(
        'returns a new promise that is resolved when the original promise is settled'
      )
    })
  })

  describe('statics', () => {
    describe('.resolve()', () => {
      it.todo('should return a successful promise')
    })

    describe('.reject()', () => {
      it.todo('should return a rejected promise')
    })

    describe('.all()', () => {
      it.todo(
        'should accept array of promises, and return when all promises are completed'
      )
      it.todo('should stop and return the 1st rejected promise')
    })

    describe('.race()', () => {
      it.todo(
        'takes array of promises, returns a single promise, and resolves with the first promise to settle (success-case)'
      )
      it.todo(
        'takes array of promises, returns a single promise, and resolves with the first promise to settle (fail-case)'
      )
    })
  })
})
