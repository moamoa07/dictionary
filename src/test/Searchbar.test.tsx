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

test('should display searched word after submission via click', async () => {
  render(<App />);
  const user = userEvent.setup();

  const input = screen.getByRole('textbox');
  await user.type(input, 'cat');
  const searchBtn = screen.getByText('Search');
  await user.click(searchBtn);

  const list = await screen.findByTestId('list-word-phonetics');
  // check if searched word is there
  expect(within(list).getByText('cat')).toBeInTheDocument();
  // check if phonetic is there
  expect(within(list).getByText('/kat/')).toBeInTheDocument();
  // check if part of speech is there (noun)
  expect(within(list).getByText('noun')).toBeInTheDocument();
  // check if defintion is there
  expect(
    within(list).getByText('An animal of the family Felidae:')
  ).toBeInTheDocument();
  // check if synonym is there
  expect(within(list).getByText('Synonyms:')).toBeInTheDocument();
  // check if part of speech is there (verb)
  expect(within(list).getByText('verb')).toBeInTheDocument();
  // check if defintion is there
  expect(
    within(list).getByText('To go wandering at night.')
  ).toBeInTheDocument();
});

test('should display searched word after submission via enter', async () => {
  render(<App />);
  const user = userEvent.setup();

  const input = screen.getByRole('textbox');
  await user.type(input, 'cat');
  await user.type(input, '{enter}');

  const list = await screen.findByTestId('list-word-phonetics');
  // check if searched word is there
  expect(within(list).getByText('cat')).toBeInTheDocument();
  // check if phonetic is there
  expect(within(list).getByText('/kat/')).toBeInTheDocument();
  // check if part of speech is there (noun)
  expect(within(list).getByText('noun')).toBeInTheDocument();
  // check if defintion is there
  expect(
    within(list).getByText('An animal of the family Felidae:')
  ).toBeInTheDocument();
  // check if synonym is there
  expect(within(list).getByText('Synonyms:')).toBeInTheDocument();
  // check if part of speech is there (verb)
  expect(within(list).getByText('verb')).toBeInTheDocument();
  // check if defintion is there
  expect(
    within(list).getByText('To go wandering at night.')
  ).toBeInTheDocument();
});

test('should see if an error displays if you search with empty field', async () => {
  render(<Searchbar words={[]} />);
  const user = userEvent.setup();

  const searchBtn = screen.getByText('Search');
  await user.click(searchBtn);

  const errorElement = await screen.findByTestId('error');
  // using within to check if the text is in the element that looks
  expect(
    within(errorElement).getByText('Please enter a word to search.')
  ).toBeInTheDocument();
});

test('should see if an error displays if you search with word that does not exist', async () => {
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

test('should check if there is an audio element', async () => {
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
