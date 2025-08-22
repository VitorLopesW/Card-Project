import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import ActionBox from './ActionBox';
import { ACTION_TYPES } from './ActionContent'; // Importar ACTION_TYPES de ActionContent
import ActionItem from './ActionItem'; // Para o DragOverlay
import ActionsBar from './ActionsBar.jsx'; // << IMPORT THE NEW COMPONENT
import './TextSmith.scss'; // Importar o SASS

import { analysis } from './AnalysisText.js';


// Função para dados iniciais, permanece aqui pois TextSmith cria os itens
const initialActionData = (type) => {
  switch (type) {
    case ACTION_TYPES.ATACAR:
    case ACTION_TYPES.TOMOU_DANO:
    case ACTION_TYPES.QUEIMAR:
    case ACTION_TYPES.EXTRA_DANO:
    case ACTION_TYPES.ESCOLHA:
    case ACTION_TYPES.ENERGIZAR:
    case ACTION_TYPES.CURAR:
    case ACTION_TYPES.VEZES:
    case ACTION_TYPES.DRIBLAR:
      return { value: 0 };
    case ACTION_TYPES.NEGAR:
    case ACTION_TYPES.PUXAR:
    case ACTION_TYPES.MOVER:
    case ACTION_TYPES.A_PROXIMA_ALGO:
    case ACTION_TYPES.ALVO_GANHA:
    case ACTION_TYPES.CLONAR:
    case ACTION_TYPES.SE_TIVER_MAIS:
    case ACTION_TYPES.COPIAR:
      return { 
        targetPlayer: 'any',
        targetCard: 'carta',
      };
    case ACTION_TYPES.REVELAR_MAO:
    case ACTION_TYPES.ATAQUE_COM_DANO_DOBRADO:
      return {
        targetPlayer: 'self',
        str: 0,
      }
    case ACTION_TYPES.FOR_UM:
    case ACTION_TYPES.CARTA_ALVO:
    case ACTION_TYPES.ROUBAR_CONTROLE:
    case ACTION_TYPES.SUAS_CARTAS_GANHAM:
    case ACTION_TYPES.ESCOLHA_UMA_CARTA:
    case ACTION_TYPES.QUANTIDADE_DE_X:
      return {
        targetCard: 'carta',
      }
    case ACTION_TYPES.DOBRE_A_QUANTIDADE_DE:
      return {
        targetCard: 'tokens queimadura',
      }
    case ACTION_TYPES.EXPLANATION:
      return{
        targetCard: 'clone'
      }
    case ACTION_TYPES.EMBARALHAR:
    case ACTION_TYPES.ALVO_GANHA_UMA_AURA:
    case ACTION_TYPES.COPIAR:
      return { value: 'self' }; // Exemplo: 'self', 'enemy', 'any'
    default:
      return {value: null}; // Para tipos desconhecidos
  }
};

const TextSmith = ({setTextString, actionBoxes,setActionBoxes }) => {
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeDragType, setActiveDragType] = useState(null);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDataUpdate = useCallback((updatedData) => {
    analysis(updatedData, setTextString)
  }, []);

  const updateStateAndNotify = (newBoxes) => {
    setActionBoxes(newBoxes);
    onDataUpdate(newBoxes);
  };

  const addNewActionBox = () => {
    const newBox = { id: uuidv4(), items: [] };
    updateStateAndNotify([...actionBoxes, newBox]);
  };

  const addActionItemToBox = (itemType) => {
    if (actionBoxes.length === 0) {
      const newBoxId = uuidv4();
      const newItem = { id: uuidv4(), type: itemType, data: initialActionData(itemType) };
      updateStateAndNotify([{ id: newBoxId, items: [newItem] }]);
    } else {
      const targetBoxIndex = actionBoxes.length - 1;
      const newItem = { id: uuidv4(), type: itemType, data: initialActionData(itemType) };
      const newBoxes = actionBoxes.map((box, index) => {
        if (index === targetBoxIndex) {
          return { ...box, items: [...box.items, newItem] };
        }
        return box;
      });
      updateStateAndNotify(newBoxes);
    }
  };

  const handleItemDataChange = (boxId, itemId, newData) => {
    const newBoxes = actionBoxes.map(box => {
      if (box.id === boxId) {
        return {
          ...box,
          items: box.items.map(item =>
            item.id === itemId ? { ...item, data: newData } : item
          ),
        };
      }
      return box;
    });
    updateStateAndNotify(newBoxes);
  };

  const findBoxContainingItem = (itemId) => {
    return actionBoxes.find(box => box.items.some(item => item.id === itemId));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDragId(active.id);
    if (actionBoxes.some(box => box.id === active.id)) {
      setActiveDragType('box');
    } else {
      setActiveDragType('item');
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || !active.id || !over.id || active.id === over.id) return;
  
    const isActiveAnItem = activeDragType === 'item';
  
    if (!isActiveAnItem) return; // Só manipula o drag over de itens para caixas por enquanto
  
    const sourceBox = findBoxContainingItem(active.id);
    const overIsBox = actionBoxes.some(box => box.id === over.id);
  
    if (sourceBox && overIsBox && sourceBox.id !== over.id) {
      setActionBoxes(prevBoxes => {
        const currentSourceBox = prevBoxes.find(b => b.id === sourceBox.id);
        const currentOverBox = prevBoxes.find(b => b.id === over.id);
  
        if (currentSourceBox && currentOverBox && !currentOverBox.items.some(item => item.id === active.id)) {
          const activeItemIndex = currentSourceBox.items.findIndex(i => i.id === active.id);
          if (activeItemIndex > -1) {
            const [movedItem] = currentSourceBox.items.splice(activeItemIndex, 1);
            currentOverBox.items.push(movedItem); // Adiciona ao final para o preview
            return [...prevBoxes.map(b => {
                if (b.id === currentSourceBox.id) return {...currentSourceBox};
                if (b.id === currentOverBox.id) return {...currentOverBox};
                return b;
            })];
          }
        }
        return prevBoxes;
      });
    }
  };
  

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || !active.id) {
        setActiveDragId(null);
        setActiveDragType(null);
        return;
    }

    if (activeDragType === 'box' && actionBoxes.some(box => box.id === over.id) && active.id !== over.id) {
      const oldIndex = actionBoxes.findIndex(box => box.id === active.id);
      const newIndex = actionBoxes.findIndex(box => box.id === over.id);
      updateStateAndNotify(arrayMove(actionBoxes, oldIndex, newIndex));
    } else if (activeDragType === 'item') {
      const sourceBox = findBoxContainingItem(active.id);
      const destinationBoxCandidate = actionBoxes.find(b => b.id === over.id);
      const destinationBoxIfOverItem = findBoxContainingItem(over.id);
      const destinationBox = destinationBoxCandidate || destinationBoxIfOverItem;

      if (!sourceBox || !destinationBox) {
        setActiveDragId(null);
        setActiveDragType(null);
        return;
      }

      const activeItemIndex = sourceBox.items.findIndex(item => item.id === active.id);
      const activeItem = sourceBox.items[activeItemIndex];

      if (!activeItem) {
        setActiveDragId(null);
        setActiveDragType(null);
        return;
      }
      
      let newBoxes = JSON.parse(JSON.stringify(actionBoxes)); // Deep copy para manipulação segura
      const sourceBoxInNew = newBoxes.find(b => b.id === sourceBox.id);
      const destBoxInNew = newBoxes.find(b => b.id === destinationBox.id);

      // Remover o item da origem (se ainda estiver lá após o dragOver)
      const currentActiveItemIndex = sourceBoxInNew.items.findIndex(item => item.id === active.id);
      if (currentActiveItemIndex > -1) {
        sourceBoxInNew.items.splice(currentActiveItemIndex, 1);
      }
      // Se a caixa de origem for diferente da de destino, precisamos garantir que o item não está duplicado na caixa de destino
      // devido à lógica do dragOver. Isso é um pouco rudimentar, uma abordagem mais robusta para dragOver seria
      // usar um estado de "placeholder" em vez de mover o item real.
      if (sourceBox.id !== destinationBox.id) {
        destBoxInNew.items = destBoxInNew.items.filter(item => item.id !== active.id);
      }


      if (sourceBox.id === destinationBox.id) { // Mesma Caixa
        const overItemIndex = destBoxInNew.items.findIndex(item => item.id === over.id);
        if (overItemIndex !== -1) {
          destBoxInNew.items.splice(overItemIndex, 0, activeItem);
        } else { // Soltou na área da caixa, mas não sobre um item específico (ou o item foi removido)
          destBoxInNew.items.push(activeItem);
        }
      } else { // Caixas Diferentes
        const overIsDirectlyBox = actionBoxes.some(b => b.id === over.id);
        let targetItemIndexInDest = -1;
        if (!overIsDirectlyBox) { // Se soltou sobre um item na caixa de destino
            targetItemIndexInDest = destBoxInNew.items.findIndex(item => item.id === over.id);
        }

        if (targetItemIndexInDest !== -1) {
          destBoxInNew.items.splice(targetItemIndexInDest, 0, activeItem);
        } else { // Soltou na área da caixa de destino ou sobre um item que não existe mais
          destBoxInNew.items.push(activeItem);
        }
      }
      updateStateAndNotify(newBoxes);
    }
    setActiveDragId(null);
    setActiveDragType(null);
  };

  const getDraggedItem = () => {
    if (!activeDragId || activeDragType !== 'item') return null;
    for (const box of actionBoxes) {
      const item = box.items.find(i => i.id === activeDragId);
      if (item) return item;
    }
    return null;
  };
  const draggedItem = getDraggedItem();

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  };


  const deleteActionItem = (boxId, itemId) => {
    const newBoxes = actionBoxes.map(box => {
      if (box.id === boxId) {
        // Filtra o item a ser deletado
        const updatedItems = box.items.filter(item => item.id !== itemId);
        return { ...box, items: updatedItems };
      }
      return box;
    });
    updateStateAndNotify(newBoxes);
  };


  const deleteActionBox = (boxIdToDelete) => {
    const newBoxes = actionBoxes.filter(box => box.id !== boxIdToDelete);
    updateStateAndNotify(newBoxes);
  };


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="text-smith-container">
        {/* vvv REPLACE THE OLD DIV WITH THE NEW COMPONENT vvv */}
        <ActionsBar
          actionTypes={ACTION_TYPES}
          onActionSelect={addActionItemToBox}
        />
        {/* ^^^ REPLACE THE OLD DIV WITH THE NEW COMPONENT ^^^ */}


        <SortableContext items={actionBoxes.map(box => box.id)} strategy={verticalListSortingStrategy}>
          {actionBoxes.map(box => (
            <ActionBox
              key={box.id}
              box={box}
              onDataChangeInItem={handleItemDataChange}
              onDeleteItemInBox={deleteActionItem}
              onDeleteBox={deleteActionBox} // Passar a função para deletar a caixa
            />
          ))}
        </SortableContext>

        <button
          onClick={addNewActionBox}
          className="add-new-box-button"
        >
          Adicionar Nova Caixa de Ação
        </button>
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeDragId && activeDragType === 'item' && draggedItem ? (
          <ActionItem
            id={draggedItem.id}
            type={draggedItem.type}
            data={draggedItem.data}
            onChange={() => {}}
            isDragging={true}
            className="drag-overlay-item-display" // Classe específica para o overlay
          />
        ) : null}
        {activeDragId && activeDragType === 'box' ? (
          <div className="drag-overlay-box-display">
            Movendo Caixa (ID: {activeDragId.substring(0, 4)})
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TextSmith;