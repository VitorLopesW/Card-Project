import React from 'react';
import ActionContent from './ActionContent';

const ActionItem = React.forwardRef(
  ({ id, type, data, onChange, isDragging, style, onDeleteItem, ...props }, ref) => {
    const itemClasses = `action-item ${isDragging ? 'dragging' : ''}`;

    const handleDelete = (e) => {
      e.stopPropagation(); // Impede que o drag do item seja iniciado
      onDeleteItem(id); // Chama a função de deletar passada por props
    };

    return (
      <div ref={ref} className={itemClasses} style={style} {...props}>
        <button className="action-item-delete-button" onClick={handleDelete} aria-label={`Deletar ação ${type}`}>
        D
        </button>
        <strong className="action-item-type">{type}</strong>
        <ActionContent type={type} data={{ ...data, id: id }} onChange={(newData) => onChange(id, newData)} />
      </div>
    );
  }
);

export default ActionItem;