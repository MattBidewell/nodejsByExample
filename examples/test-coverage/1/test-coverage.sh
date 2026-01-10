// Run tests with coverage reporting
$ node --test --experimental-test-coverage test-coverage.js
# ✔ Calculator (1ms)
# ✔ Categorize (0.5ms)
# ✔ processArray (0.3ms)
# ...
# ℹ start of coverage report
# ℹ -------------------------------|---------|----------|---------|---------|
# ℹ File                           | % Stmts | % Branch | % Funcs | % Lines |
# ℹ -------------------------------|---------|----------|---------|---------|
# ℹ All files                      |   95.00 |    90.00 |  100.00 |   95.00 |
# ℹ  test-coverage.js              |   95.00 |    90.00 |  100.00 |   95.00 |
# ℹ -------------------------------|---------|----------|---------|---------|
# ℹ end of coverage report


// Generate detailed coverage report
$ node --test --experimental-test-coverage --test-reporter=lcov test-coverage.js > coverage.lcov
