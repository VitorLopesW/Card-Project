import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ActionItem from './ActionItem';

const SortableItem = ({ item, onDataChange, onDeleteItem }) => { // Adicionar onDeleteItem aqui
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ActionItem
      ref={setNodeRef}
      style={style}
      id={item.id}
      type={item.type}
      data={item.data}
      onChange={onDataChange}
      isDragging={isDragging}
      onDeleteItem={onDeleteItem} // Passar para ActionItem
      {...attributes}
      {...listeners}
    />
  );
};

export default SortableItem;