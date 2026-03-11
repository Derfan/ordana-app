import { afterAll, beforeAll } from 'vitest';

// Global test setup for Vitest
// @testing-library/jest-native is intentionally NOT imported here.
// It internally requires 'react-native' via Node's require() before Vite's
// resolver can apply our mock alias, which causes a Flow-syntax crash:
//   SyntaxError: Unexpected token 'typeof' (import typeof * as ...)
//
// Instead, use Vitest's built-in `expect` matchers directly in tests.
// If component tests are added in the future, import jest-native matchers
// inside the individual test file AFTER the react-native alias is active.

const SUPPRESSED_WARNINGS = [
  'Warning: ReactDOM.render is no longer supported',
  'Warning: An update to',
  'Warning: Each child in a list',
  'act(...) is not supported in production',
];

const originalWarn = console.warn.bind(console);
const originalError = console.error.bind(console);

beforeAll(() => {
  console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (SUPPRESSED_WARNINGS.some((w) => msg.includes(w))) return;
    originalWarn(...args);
  };

  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (SUPPRESSED_WARNINGS.some((w) => msg.includes(w))) return;
    originalError(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
