MOCHA_PATH=./node_modules/ts-mocha/bin/ts-mocha
TESTS_PATH=test/a.spec.ts


tests:
	@${MOCHA_PATH} ${TESTS_PATH}
