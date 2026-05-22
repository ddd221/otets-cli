import assert from 'assert';
import { UI } from '../src/ui/renderer.js';
import { getTheme, THEMES } from '../src/ui/theme.js';
import { config } from '../src/config.js';

console.log('Running UI tests...');

// Test 1: UI initialization
const ui = new UI(config);
assert(ui instanceof UI, 'UI should initialize');
console.log('✓ UI initialization test passed');

// Test 2: Theme retrieval
const synthwaveTheme = getTheme('synthwave');
assert(synthwaveTheme.name === 'synthwave', 'Should get synthwave theme');
console.log('✓ Theme retrieval test passed');

// Test 3: Theme availability
assert(THEMES.synthwave, 'Synthwave theme should exist');
assert(THEMES.retro, 'Retro theme should exist');
assert(THEMES.dark, 'Dark theme should exist');
console.log('✓ Theme availability test passed');

console.log('\\nAll UI tests passed!');
