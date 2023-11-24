import { render } from '@testing-library/react';
import App from '../App';

test('testing suite works', () => {
  render(<App />);
  expect(true).toBe(true);
});
