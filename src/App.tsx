import Header from './components/Header';
import Searchbar from './components/Searchbar';

function App() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Header />
      <Searchbar words={[]} />
    </div>
  );
}

export default App;
