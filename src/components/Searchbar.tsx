/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

interface SearchbarProps {
  words: any[];
}

const Searchbar: React.FC<SearchbarProps> = ({ words: initialWords }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState(initialWords);
  const [error, setError] = useState<string>('');
  const [isAudioListVisible, setIsAudioListVisible] = useState<boolean>(false);

  const toggleAudioListVisibility = () => {
    setIsAudioListVisible((prevVisibility) => !prevVisibility);
  };

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
        marginTop: '1rem',
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
            background: '#fff',
            padding: '0.8rem 0.5rem',
            fontFamily: 'Montserrat',
          }}
        />
        <button
          onClick={handleSearch}
          className="search-button"
          style={{
            border: 'none',
            padding: '0.8rem 0.5rem',
            color: 'white',
            fontFamily: 'Montserrat',
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

      {words.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: '1rem',
            margin: '2rem',
            maxWidth: '800px',
            minWidth: '600px',
          }}
        >
          <ul data-testid="list-word-phonetics">
            <li style={{ listStyle: 'none' }}>
              <h3 style={{ textTransform: 'uppercase', fontSize: '26px' }}>
                {words[0].word}
              </h3>
              <p>{words[0].phonetic}</p>

              {words[0].meanings.map(
                (
                  meaning: {
                    partOfSpeech: string;
                    definitions: {
                      definition: string;
                      synonyms?: string[];
                      antonyms?: string[];
                      example?: string;
                    }[];
                    synonyms: string[];
                    antonyms?: string[];
                  },
                  meaningIndex: number
                ) => (
                  <div key={meaningIndex} style={{ marginTop: '1rem' }}>
                    <h4>{meaning.partOfSpeech}</h4>
                    <ol>
                      {meaning.definitions.slice(0, 5).map(
                        (
                          definition: {
                            definition: string;
                            synonyms?: string[];
                            antonyms?: string[];
                            example?: string;
                          },
                          definitionIndex: number
                        ) => (
                          <li
                            key={definitionIndex}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              marginTop: '0.2rem',
                            }}
                          >
                            <p
                              style={{
                                fontWeight: '500',
                              }}
                            >
                              {definition.definition}
                            </p>

                            {definition.example && (
                              <>
                                <p style={{ fontSize: '14px' }}>
                                  Example: {definition.example}
                                </p>
                              </>
                            )}
                          </li>
                        )
                      )}
                    </ol>
                    {meaning.synonyms && meaning.synonyms.length > 0 && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          gap: '0.3rem',
                        }}
                      >
                        <p>Synonyms:</p>
                        <ul style={{ display: 'flex', gap: '0.3rem' }}>
                          {meaning.synonyms
                            .slice(0, 5)
                            .map((synonym, index) => (
                              <li
                                key={index}
                                style={{
                                  listStyle: 'none',
                                }}
                              >
                                {synonym},
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    {meaning.antonyms && meaning.antonyms.length > 0 && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          gap: '0.3rem',
                        }}
                      >
                        <p>Antonyms:</p>
                        <ul style={{ display: 'flex', gap: '0.3rem' }}>
                          {meaning.antonyms
                            .slice(0, 5)
                            .map((antonym, index) => (
                              <li key={index} style={{ listStyle: 'none' }}>
                                {antonym},
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              )}

              <button
                style={{
                  marginTop: '0.8rem',
                  fontWeight: '500',
                  border: 'none',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                }}
                onClick={toggleAudioListVisibility}
              >
                <span
                  style={{ fontSize: '30px' }}
                  className="material-symbols-sharp"
                >
                  volume_up
                </span>
              </button>
              {isAudioListVisible && (
                <ul>
                  {words[0].phonetics.map(
                    (
                      phonetic: {
                        text: string;
                        audio: string | undefined;
                      },
                      phoneticIndex: number
                    ) => (
                      <li key={phoneticIndex} style={{ listStyle: 'none' }}>
                        {phonetic.audio && (
                          <div>
                            <audio controls>
                              <source
                                src={phonetic.audio}
                                type="audio/mpeg"
                                data-testid="audio"
                              />
                              Your browser does not support the audio element.
                            </audio>
                            <p>{phonetic.text}</p>
                          </div>
                        )}
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
