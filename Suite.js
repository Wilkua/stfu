/**
 * Defines a suite of tests which closely relate in purpose or
 * functionality.
 */
class Suite {
    constructor() {
        this.tests = [];
        this.async_tests = [];
        this.setup_ctx = function () {};
    }

    /**
     * Define a function to run before each test in the suite. This
     * function should mutate the given context object which will be
     * passed to each test function during testing.
     *
     * @param {BeforeEachFunction} fn - Function to run before test
     */
    before_each(fn) {
        this.setup_ctx = fn;
    }

    /**
     * An alias for the |before_each| method.
     *
     * @param {BeforeEachFn} fn - Function to run before test
     */
    be(fn) {
        this.setup_ctx = fn;
    }

    /**
     * Register a test within the suite. The test function will receive
     * the context object constructed in the function supplied to the
     * |before_each| method.
     *
     * @param {string} test_name - Name of the test within the suite
     * @param {TestFn} test_fn - Test function to run for this test
     */
    register(test_name, test_fn) {
        this.tests = [...this.tests, {test_name, test_fn}];
    }

    /**
     * An alias for the |register| method.
     *
     * @param {string} test_name - Name of the test within the suite
     * @param {TestFn} test_fn - Test function to run for this test
     */
    r(test_name, test_fn) {
        this.register(test_name, test_fn);
    }

    /**
     * Register an asynchronous test within the suite. The test function
     * will receive the context object constructed in the function
     * supplied to the |before_each| method. The test function should
     * return a promise which should either resolve if the test is
     * successful or reject if it has failed.
     *
     * @param {string} test_name - Name of the test within the suite
     * @param {AsyncTestFn} test_fn - Test function to run for this test
     */
    register_async(test_name, test_fn) {
        this.async_tests = [...this.async_tests, {test_name, test_fn}];
    }

    /**
     * An alias for the |register_async| method.
     *
     * @param {string} test_name - Name of the test within the suite
     * @param {AsyncTestFn} test_fn - Test function to run for this test
     */
    ra(test_name, test_fn) {
        this.register_async(test_name, test_fn);
    }

    /**
     * Run the suite of tests and report on the results.
     *
     * Each test is run in the order it was registered. In the case of
     * asynchronous tests, the tests are queued in the order they were
     * registered, but a completion order is not guaranteed. Before
     * each test, the function given to the |before_each| method is
     * called to set up the test context. The test context object is
     * then passed to the test function as its first parameter.
     *
     * The object returned by this function contains the results of each
     * test broken down by synchronous and asynchronous. The results are
     * given in the order in which the tests were registered. formatting
     * utilites can be used to given custom output artefacts such as
     * HTML reports, decorated console output, and file output, along
     * with many other options.
     *
     * @returns {SuiteResults} - Results of all tests run
     */
    async run() {
        const results = {'tests': [], 'async_tests': []};
        for (const test of this.tests) {
            let test_start;
            try {
                const ctx = Object.create(null);
                this.setup_ctx(ctx);
                test_start = Date.now();
                test.test_fn.call(null, ctx);
                const test_end = Date.now();
                results.tests.push({test_name: test.test_name, duration: (test_end - test_start), err: undefined});
            } catch (test_err) {
                const test_end = Date.now();
                // We hope the test_err is an Error type
                results.tests.push({test_name: test.test_name, duration: (test_end - test_start), err: test_err});
            }
        }

        for (const test of this.async_tests) {
            let test_start;
            try {
                const ctx = Object.create(null);
                this.setup_ctx(ctx);
                test_start = Date.now();
                await test.test_fn.call(null, ctx);
                const test_end = Date.now();
                results.async_tests.push({test_name: test.test_name, duration: (test_end - test_start), err: undefined});
            } catch (test_err) {
                const test_end = Date.now();
                // We hope the test_err is an Error type
                results.async_tests.push({test_name: test.test_name, duration: (test_end - test_start), err: test_err});
            }
        }

        return results;
    }
}
module.exports = Suite;

