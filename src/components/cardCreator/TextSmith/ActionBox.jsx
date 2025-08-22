import React from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SortableItem from './SortableItem';

const ActionBox = ({ box, onDataChangeInItem, onDeleteItemInBox, onDeleteBox }) => { // Adicionar onDeleteBox
  const {
    attributes,
    listeners,
    setNodeRef: setSortableBoxNodeRef,
    transform: boxTransform,
    transition: boxTransition,
    isDragging: isBoxDragging,
  } = useSortable({ id: box.id });

  const boxClasses = `action-box ${isBoxDragging ? 'dragging' : ''}`;
  const boxStyle = {
    transform: CSS.Transform.toString(boxTransform),
    transition: boxTransition,
  };

  const handleDeleteBox = (e) => {
    e.stopPropagation(); // Impede que o clique acione o drag da caixa pelos listeners do header
    onDeleteBox(box.id);
  };

  return (
    <div ref={setSortableBoxNodeRef} className={boxClasses} style={boxStyle}>
      <div className="action-box-header">
        {/* Envolvemos o título e os listeners do dnd em um span para que o botão de delete não interfira */}
        <span className="action-box-title" {...attributes} {...listeners}>
            Caixa de Ação (ID: {box.id.substring(0, 4)})
        </span>
        <button
            className="action-box-delete-button"
            onClick={handleDeleteBox}
            aria-label={`Deletar caixa de ação ${box.id.substring(0,4)}`}
        >
            Remover Caixa
        </button>
      </div>
      <SortableContext items={box.items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        {box.items.length === 0 && <p className="action-box-empty-message">Arraste ações para cá ou clique nos botões acima.</p>}
        {box.items.map(item => (
          <SortableItem
            key={item.id}
            item={item}
            onDataChange={(itemId, newData) => onDataChangeInItem(box.id, itemId, newData)}
            onDeleteItem={(itemId) => onDeleteItemInBox(box.id, itemId)}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default ActionBox;