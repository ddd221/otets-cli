import assert from 'assert';
import { formatDate, truncate, formatNumber, stripAnsi } from '../src/utils/formatters.js';
import { parsePost, validatePost, parseSearchQuery } from '../src/utils/parser.js';
import { debounce, throttle, sleep } from '../src/utils/helpers.js';

console.log('Running utils tests...');

// Test 1: formatDate
const now = new Date();
const result = formatDate(now);
assert(result === 'just now', 'Should format current date');
console.log('✓ formatDate test passed');

// Test 2: truncate
const truncated = truncate('This is a very long text that should be truncated', 20);
assert(truncated.endsWith('...'), 'Should add ellipsis');
assert(truncated.length <= 20, 'Should respect length limit');
console.log('✓ truncate test passed');

// Test 3: formatNumber
assert(formatNumber(1000) === '1,000', 'Should format numbers with commas');
console.log('✓ formatNumber test passed');

// Test 4: validatePost
const validPost = { id: '1', content: 'test' };
const invalidPost = {};
assert(validatePost(validPost) === true, 'Should validate correct post');
assert(validatePost(invalidPost) === false, 'Should reject invalid post');
console.log('✓ validatePost test passed');

// Test 5: parseSearchQuery
const tagQuery = parseSearchQuery('tag:news');
assert(tagQuery.type === 'tag', 'Should parse tag query');
console.log('✓ parseSearchQuery test passed');

console.log('\\nAll utils tests passed!');
