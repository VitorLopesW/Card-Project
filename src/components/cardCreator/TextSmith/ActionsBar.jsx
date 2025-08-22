// ActionsBar.jsx
import React, { useState, useMemo } from 'react';
import './ActionsBar.scss'; // We'll create this SASS file next

const ActionsBar = ({ actionTypes, onActionSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Simple proximity search: checks if the action type string includes the search term.
  // For a more advanced search, you could use libraries like Fuse.js.
  const filteredActionTypes = useMemo(() => {
    if (!searchTerm) {
      return Object.values(actionTypes);
    }
    return Object.values(actionTypes).filter(type =>
      type.toLowerCase().includes(searchTerm)
    );
  }, [actionTypes, searchTerm]);

  return (
    <div className="actions-bar-container">
      <h2>Criador de Sequência de Ações</h2>
      <input
        type="text"
        placeholder="Buscar ação..."
        className="actions-search-input"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="actions-buttons-scrollable">
        {filteredActionTypes.length > 0 ? (
          filteredActionTypes.map(type => (
            <button
              key={type}
              onClick={() => onActionSelect(type)}
              className="action-type-button"
            >
              {type}
            </button>
          ))
        ) : (
          <p className="no-actions-found">Nenhuma ação encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default ActionsBar;