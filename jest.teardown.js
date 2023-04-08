const coverage = require('@tact-lang/coverage');
const path = require('path');

module.exports = async () => {
    coverage.completeCoverage([
        path.resolve(__dirname, 'sources', 'output', '*.boc')
    ]);
};