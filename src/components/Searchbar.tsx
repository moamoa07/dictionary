/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

interface SearchbarProps {
  words: any[];
}

const Searchbar: React.FC<SearchbarProps> = ({ words: initialWords }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState(initialWords);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    if (!searchTerm) {
      setError('Please enter a word to search.');
      return;
    }

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
      );

      if (!response.ok) {
        console.error('Error fetching data');
        setError('Word does not exist, try something else.');
        return;
      }

      const jsonResponse = await response.json();
      console.log(jsonResponse);
      setWords(jsonResponse);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div>
        <input
          type="text"
          placeholder="Search for a word"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: 'none',
            background: '#eed6ff',
            padding: '0.8rem 0.5rem',
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
          }}
        />
        <button
          onClick={handleSearch}
          className="search-button"
          style={{
            border: 'none',
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
            padding: '0.8rem 0.5rem',
          }}
        >
          Search
        </button>
      </div>

      {error && (
        <p data-testid="error" style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </p>
      )}

      {/* Display the first dictionary entry */}
      {words.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ul data-testid="list-word-phonetics">
            <li style={{ listStyle: 'none' }}>
              <h3 style={{ textTransform: 'uppercase', fontSize: '26px' }}>
                {words[0].word}
              </h3>
              <p>Phonetic: {words[0].phonetic}</p>

              {/* Display phonetics */}
              <ul>
                {words[0].phonetics.map(
                  (
                    phonetic: {
                      text:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                      audio: string | undefined;
                    },
                    phoneticIndex: React.Key | null | undefined
                  ) => (
                    <li key={phoneticIndex} style={{ listStyle: 'none' }}>
                      <p>Text: {phonetic.text}</p>
                      {phonetic.audio && (
                        <audio controls>
                          <source
                            src={phonetic.audio}
                            type="audio/mpeg"
                            data-testid="audio"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </li>
                  )
                )}
              </ul>

              {/* Display meanings */}
              <h4>Meanings</h4>
              <ul>
                {words[0].meanings.map(
                  (
                    meaning: {
                      partOfSpeech:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                      definitions: {
                        definition:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | null
                          | undefined;
                      }[];
                    },
                    meaningIndex: React.Key | null | undefined
                  ) => (
                    <li key={meaningIndex} style={{ listStyle: 'none' }}>
                      <p>Part of Speech: {meaning.partOfSpeech}</p>
                      <p>Definition: {meaning.definitions[0].definition}</p>
                      {/* Add more details as needed */}
                    </li>
                  )
                )}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
