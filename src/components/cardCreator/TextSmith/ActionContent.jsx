import React, { useState, useRef, useEffect } from 'react';
import './ActionItem.sass'

const deck = 'deck'
const sideboard = 'sideboard'


const CyclingButton = ({ options = [], data, onChange, field }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    const currentValue = data[field];
    const currentIndex = options.indexOf(currentValue);
    const nextIndex = (currentIndex + 1) % options.length;
    const nextValue = options[nextIndex];
    onChange({ ...data, [field]: nextValue });
  };

  return (
    <button onClick={handleClick} className="cycling-button">
      {data[field]}
    </button>
  );
};

// Componente DrawerSelect
const options = [
  "clone", "negate", 'action', "ancora", "driblar", "auraHate", "burn", "activeAura",
  "totalProtection", "copy", "energize", "instict", "diabolicProtection", "insanity", "cairNivelProtecao", 'protection', 'puxar',
];

function DrawerSelect({ value, onChange, data, field }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 180 }}>
      <button
        type="button"
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #888",
          background: "#181818",
          color: "#fff",
          cursor: "pointer",
          textAlign: "left"
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {value ? value : "Selecione..."}
        <span style={{ float: "right" }}>▼</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            zIndex: 20,
            background: "#232323",
            border: "1px solid #444",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            width: "100%",
            maxHeight: 210,
            overflowY: "auto"
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              style={{
                padding: "10px 14px",
                background: value === option ? "#333" : "transparent",
                color: value === option ? "#57faff" : "#fff",
                cursor: "pointer",
                fontWeight: value === option ? 700 : 400
              }}
              onClick={() => {
                onChange({ ...data, [field]: option });
                setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const ACTION_TYPES = {
  INPUT: 'input',
  ATACAR: 'atacar',
  APENAS_SE_TIVER: 'apenas se tiver',
  TOMOU_DANO: 'tomou dano',
  NEGAR: 'negar',
  QUEIMAR: 'queimar',
  SE_VOCÊ_ULTIMO_VERBO: 'se você [previously]',
  A_PROXIMA_ALGO: 'a próxima algo',
  EXTRA_DANO: 'dano extra', 
  SE: 'se',
  FOR_UM: 'for um',
  MOVER: 'mover',
  ENERGIZAR: 'energizar',
  EMBARALHAR: 'embaralhar',
  PROTEÇÃO_TOTAL: 'proteção total',
  CARTA_ALVO: 'carta alvo',
  ROUBAR_CONTROLE: 'roubar controle',
  PROTEÇÃO_DIABOLICA: 'protecao diabolica',
  INSTINTO: 'instinto',
  INSANIDADE: 'insanidade',
  AO_SER_DESENCADADA: 'ao ser desencadeada',
  REVELAR_MAO: 'revelar mão',
  DESATIVAR_AURA: 'desativar aura',
  PUXAR: 'puxar',
  ANCORA: 'ancora',
  //ALVO_GANHA: 'alvo ganha',
  ESCOLHA: 'escolha',
  AO_SER_COLOCADO_NA_LINHA_DO_TEMPO: 'ao ser colocado na linha do tempo',
  VEZES: 'vezes',
  ATAQUE_COM_DANO_DOBRADO: 'ataque com dano dobrado',
  CLONAR: 'clonar',
  ESTA_RODADA: 'esta rodada',
  ALVO_GANHA_UMA_AURA: 'alvo ganha uma aura',
  SE_TIVER_MAIS: 'se tiver mais',
  SUAS_CARTAS_GANHAM: 'suas cartas ganham',
  COPIAR: 'copiar',
  ATE_O_fINAL_DA_RODADA: 'até o final da rodada',
  O_PROXIMO_QUE_FOR_DESENCADEADO: 'o próximo que for desencadeado', // TODO
  TODA_VEZ_QUE: 'toda vez que',
  TODA_VEZ_QUE_UM_JOGADOR: 'toda vez que um jogador',
  SENDO_X_IGUAL_A: 'sendo x igual a',
  ESTA_CARTA_SO_TEM_EFEITO_SE: 'esta carta só tem efeito se',
  DOBRE_A_QUANTIDADE_DE: 'dobre a quantidade de',
  CURAR: 'curar',
  EXPLANATION: 'explanation',
  APENAS_SE_ELA_TIVER: 'apenas se ela tiver',
  APENAS_SE_SEU_OPONENTE: 'apenas se seu oponente',
  GANHE_TOKEN_DE_MARTELADA: 'ganhe um token de martelada',
  OLHE_SEU_BARALHO: 'olhe seu baralho',
  OLHE_SEU_DESCARTE: 'olhe seu descarte',
  OLHE_SEU_BARALHO_OU_DESCARTE:'olhe seu baralho ou descarte',
  PROCURAR_POR: 'procurar por',
  ESTA_CARTA_VIRA_UM: 'esta carta vira um',
  DE: 'de',
  DE_UM:  'de um',
  DE_UMA: 'de uma',
  ESCOLHA_UMA_CARTA:'escolha uma carta',
  DA_CARTA_ESCOLHIDA:'da carta escolhida',
  RECEBER_DANO: 'receber dano',
  VIRGULA: 'virgula',
  DRIBLAR: 'driblar',
  QUANTIDADE_DE_X: 'quantidade de x',
  NA_SUA_LINHA_DO_TEMPO:'na sua linha do tempo',
  NA_LINHA_DO_TEMPO_DO_SEU_OPONENTE: 'na linha do tempo do seu oponente',
  DO_SEU_OPONENTE:'do seu oponente',
  SUAS: 'suas',
};



const ActionContent = ({ type, data, onChange }) => {
  const currentData = data && typeof data === 'object' ? data : {};
  const internalId = data.id || Math.random().toString(36).substring(7);
  const value = data.value ?? null; // valor genérico
  // Ensure data is an object, provide default if not

  // Helper function to handle input changes, ensuring data is an object
  const handleInputChange = (field, newValue) => {
    onChange({ ...currentData, [field]: newValue });
  };

  switch (type) {
    case ACTION_TYPES.ATACAR:
    case ACTION_TYPES.EXTRA_DANO:
    case ACTION_TYPES.TOMOU_DANO:
    case ACTION_TYPES.QUEIMAR:
    case ACTION_TYPES.ESCOLHA:
    case ACTION_TYPES.ENERGIZAR:
    case ACTION_TYPES.VEZES:
    case ACTION_TYPES.CURAR:
    case ACTION_TYPES.DRIBLAR:
      return (
        <div className="action-content">
          <label htmlFor={`strength-${internalId}`}>Força: </label>
          <input
            type="number"
            id={`strength-${internalId}`}
            value={typeof value === 'number' ? value : 0}
            onChange={(e) =>
              onChange({ ...data, value: parseInt(e.target.value, 10) || 0 })
            }
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      );
    case ACTION_TYPES.REVELAR_MAO:
    case ACTION_TYPES.ATAQUE_COM_DANO_DOBRADO:
      return (
        <div className="action-content">
          <label htmlFor={`strength-${internalId}`}>Força: </label>
          <input
            type="number"
            id={`strength-${internalId}`}
            value={data.str}
            onChange={(e) =>
              onChange({ ...data, ['str']: parseInt(e.target.value, 10) || 0 })
            }
            onClick={(e) => e.stopPropagation()}
          />
          Jogador:
          <CyclingButton
            options={['self', 'enemy', 'any']}
            value={data.targetPlayer}
            onChange={onChange}
            data={data}
            field="targetPlayer"
          />
        </div>
      );

    case ACTION_TYPES.NEGAR:
    case ACTION_TYPES.MOVER:
    case ACTION_TYPES.PUXAR:
    case ACTION_TYPES.A_PROXIMA_ALGO:
    case ACTION_TYPES.ALVO_GANHA:
    case ACTION_TYPES.SE_TIVER_MAIS:
    case ACTION_TYPES.COPIAR:
      return (
        <div className="action-content">
          Jogador:
          <CyclingButton
            options={['self', 'enemy', 'any']}
            value={data.targetPlayer}
            onChange={onChange}
            data={data}
            field="targetPlayer"
          />
          Alvo:
          <CyclingButton
            options={['carta', 'ataque', 'técnica', 'aura', 'nada']}
            value={data.targetCard}
            onChange={onChange}
            data={data}
            field="targetCard"
          />
        </div>
      );
    case ACTION_TYPES.CLONAR:
      return (
        <div className="action-content">
          Jogador:
          <CyclingButton
            options={['self', 'enemy', 'selfCard']}
            value={data.targetPlayer}
            onChange={onChange}
            data={data}
            field="targetPlayer"
          />
          Alvo:
          <CyclingButton
            options={['carta', 'ataque', 'técnica', 'aura', 'nada']}
            value={data.targetCard}
            onChange={onChange}
            data={data}
            field="targetCard"
          />
        </div>
      );
    case ACTION_TYPES.FOR_UM:
    case ACTION_TYPES.CARTA_ALVO:
    case ACTION_TYPES.ROUBAR_CONTROLE:
    case ACTION_TYPES.SUAS_CARTAS_GANHAM:
    case ACTION_TYPES.ESCOLHA_UMA_CARTA:
    case ACTION_TYPES.QUANTIDADE_DE_X:
      return(
        <div className="action-content">
          <CyclingButton
            options={['carta', 'ataque', 'técnica', 'aura']}
            value={data.targetCard}
            onChange={onChange}
            data={data}
            field="targetCard"
          />
        </div>
      )
    case ACTION_TYPES.EXPLANATION:
        return(
          <div className="action-content">
            <DrawerSelect
              value={data.targetCard}
              onChange={onChange}
              data={data}
              field="targetCard"
            />
          </div>
        )
    case ACTION_TYPES.DOBRE_A_QUANTIDADE_DE: 
      return(
        <div className="action-content">
          <CyclingButton
            options={['tokens queimadura', 'tokens energia']}
            value={data.targetCard}
            onChange={onChange}
            data={data}
            field="targetCard"
          />
        </div>
      )
    case ACTION_TYPES.EMBARALHAR:
    case ACTION_TYPES.ALVO_GANHA_UMA_AURA:
      return(
        <div className="action-content">
          <CyclingButton
            options={['self', 'enemy']}
            value={data.targetCard}
            onChange={onChange}
            data={data}
            field="value"
          />
        </div>
      )
      case ACTION_TYPES.INPUT:
        return (
          <div className="action-content">
            <label htmlFor={`input-${internalId}`}>Valor: </label>
            <textarea
              id={`input-${internalId}`}
              value={value}
              onChange={(e) => handleInputChange('value', e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating
              onKeyDown={(e) => {
                // ***************************************************** //
                // ** STOP KEYDOWN PROPAGATION TO PREVENT DND-KIT BUG ** //
                e.stopPropagation();
                // ***************************************************** //
              }}
              rows={3}
              // className="action-textarea" // Optional styling class
            />
          </div>
        );
    case ACTION_TYPES.PROTEÇÃO_TOTAL:
      return(
        <div className="action-content">
          <CyclingButton
            options={['self', 'target', 'none']}
            value={data.targetCard}
            onChange={onChange}
            data={data}
            field="value"
          />
        </div>
      )
    default:
      return (
        <div className="action-content">
          <p className="action-message">Sem configurações adicionais.</p>
        </div>
      );
  }
};

export default ActionContent;
