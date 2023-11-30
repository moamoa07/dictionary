import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

test('should check if dictionary header exists', () => {
  render(<Header />);

  const dictionaryHeader = screen.getByText('Dictionary');

  expect(dictionaryHeader).toBeInTheDocument();
});
