import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetch(`https://api.datamuse.com/sug?s=${debouncedQuery}`)
        .then(response => response.json())
        .then(data => {
          const results = data.map(item => item.word);
          setSuggestions(results.length > 0 ? results : ["Ничего не найдено"]);
        })
        .catch(() => setSuggestions(["Ошибка загрузки"]));
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
        className="autocomplete-input"
        placeholder="Start typing..."
      />
      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((word, index) => (
            <li 
              key={index} 
              className={`autocomplete-item ${word === "Ничего не найдено" || word === "Ошибка загрузки" ? "no-results" : ""}`}
            >
              {word}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App
