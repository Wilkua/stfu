/**
 * Simple Test Framework Utility - STFU
 *
 * Copyright (c) 2020 William Drescher
 *
 * A simple and fast test framework.
 */

const Suite = require('./Suite.js');

/**
 * A utility function to quickly run a test within an arbitrary suite.
 *
 * @param {TestFn} test_fn - Test function to run
 * @returns {SuiteResults} - Results of the test given as full suite results
 */
async function run_test(test_fn) {
    const _s = new Suite();
    _s.register('test', test_fn);

    return _s.run();
}

/**
 * A utility function to quickly run an asynchronous test within an
 * arbitrary suite.
 *
 * @param {AsyncTestFn} test_fn - Test function to run
 * @returns {SuiteResults} - Results of the test given as full suite results
 */
async function run_async_test(test_fn) {
    const _s = new Suite();
    _s.register_async('test', test_fn);

    return _s.run();
}

module.exports = {run_test, run_async_test, Suite};

