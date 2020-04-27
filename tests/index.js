const { run_test, run_async_test, Suite } = require('../');

run_tests();

async function run_tests() {
    const s1 = new Suite();
    s1.register('success', () => {
        // really doesn't need to do anything
    });
    s1.register('fail', () => {
        throw new Error('Fail');
    });
    s1.register_async('success', async () => {
    });
    s1.register_async('fail', async () => {
        throw new Error('fail');
    });
    s1.register_async('success_with_promise', () => {
        return new Promise((resolve) => {
            resolve();
        });
    });
    s1.register_async('fail_with_promise', () => {
        return new Promise((_, reject) => {
            reject(new Error('Fail'));
        });
    });

    const { tests, async_tests } = await s1.run();
    try {
        assert_answer(tests[0].test_name === 'success', 'Tests out of order', `${tests[0].test_name} !== "success"`);
        assert_answer(tests[1].test_name === 'fail', 'Tests out of order', `${tests[1].test_name} !== "fail"`);
        assert_answer(async_tests[0].test_name === 'success', 'Tests out of order', `${async_tests[0].test_name} !== "success"`);
        assert_answer(async_tests[1].test_name === 'fail', 'Tests out of order', `${async_tests[1].test_name} !== "fail"`);

        assert_answer(tests[0].err === undefined, 's1#tests->success failed', tests[0]);
        assert_answer(tests[1].err instanceof Error, 's1#tests->fail failed', tests[1]);

        assert_answer(async_tests[0].err === undefined, 's1#async_tests->success failed', async_tests[0]);
        assert_answer(async_tests[1].err instanceof Error, 's1#async_tests->fail failed', async_tests[1]);
        assert_answer(async_tests[2].err === undefined, 's1#async_tests->success_with_promise failed', async_tests[2]);
        assert_answer(async_tests[3].err instanceof Error, 's1#async_tests->fail_with_promise failed', async_tests[3]);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    const { tests: q_tests } = await run_test(() => {});
    const { async_tests: q_async_tests } = await run_async_test(async () => {});
    try {
        assert_answer(q_tests.err === undefined, 'run_test failed', q_tests);
        assert_answer(q_async_tests.err === undefined, 'run_async_test failed', q_async_tests);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    console.info('All tests passed');
}

function assert_answer(expr, errStr, ...args) {
    if (!expr) {
        const argStr = args.map(JSON.stringify).join(', ');
        throw new Error(errStr + ': ' +  argStr);
    }
}
