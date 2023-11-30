import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import Searchbar from '../components/Searchbar';

test('should see if searchfield exists', () => {
  render(<Searchbar words={[]} />);
});

test('should accept a user typing', async () => {
  render(<Searchbar words={[]} />);
  const user = userEvent.setup();
  const input = screen.getByRole('textbox');

  await user.type(input, 'hej');

  expect(input).toHaveValue('hej');
});

test('should display word after submission via click', async () => {
  render(<App />);
  const user = userEvent.setup();

  const input = screen.getByRole('textbox');
  await user.type(input, 'cat');
  const searchBtn = screen.getByText('Search');
  await user.click(searchBtn);

  const list = await screen.findByTestId('list-word-phonetics');
  expect(within(list).getByText('cat')).toBeInTheDocument();
  expect(within(list).getByText('/kat/')).toBeInTheDocument();
  expect(within(list).getByText('noun'));
  //utöka med fler grejer här
});

test('should see if an error displays if search with empty field', async () => {
  render(<Searchbar words={[]} />);
  const user = userEvent.setup();

  const searchBtn = screen.getByText('Search');
  await user.click(searchBtn);

  const errorElement = await screen.findByTestId('error');
  expect(
    within(errorElement).getByText('Please enter a word to search.')
  ).toBeInTheDocument();
});

test('should see if an error displays if search with word that does not exist', async () => {
  render(<Searchbar words={[]} />);
  const user = userEvent.setup();

  const input = screen.getByRole('textbox');
  await user.type(input, 'hej');
  const searchBtn = screen.getByText('Search');
  await user.click(searchBtn);

  const list = await screen.findByTestId('error');
  expect(
    within(list).getByText('Word does not exist, try something else.')
  ).toBeInTheDocument();
});

test('should see if there is an audio element', async () => {
  render(<Searchbar words={[]} />);
  const user = userEvent.setup();

  const input = screen.getByRole('textbox');
  await user.type(input, 'cat');
  const searchBtn = screen.getByText('Search');
  await user.click(searchBtn);

  const list = await screen.findByTestId('list-word-phonetics');
  const audioBtn = screen.getByText('volume_up');
  await user.click(audioBtn);
  const audioElements = within(list).getAllByTestId('audio');
  expect(audioElements[0]).toHaveAttribute(
    'src',
    'https://api.dictionaryapi.dev/media/pronunciations/en/cat-uk.mp3'
  );
});
