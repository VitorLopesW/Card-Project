import React, { useState, useEffect, useRef, useMemo, memo  } from 'react'; // Adicionado useRef
import html2canvas from 'html2canvas'; // Importar html2canvas
import { v4 as uuidv4 } from 'uuid'; // Para actionBoxes


import styles from './CardCreator.module.sass';
import CardFrame from './CardBase.jsx';
import { SmartText } from './SmartText/SmarText.jsx';
import TextSmith from './TextSmith/TextSmith.jsx';
// import { formatarString } from './SmartText/TextVariation.js'; // Se não estiver usando, pode remover
import './cardCreator.scss';
// import { fontWeight } from '@mui/system'; // Se não estiver usando diretamente, pode remover

// Funções do Firebase
import {
    uploadCardImage,
    saveCardDataToFirestore,
    getCardDataFromFirestore
} from '../../firebase.js'; // Ajuste o caminho se necessário

const CardCreatorComponent = () => { // Nome do componente geralmente começa com maiúscula
    const cardDivision = 5;

    const [cardWidth, setCardWidth] = useState(2143 / cardDivision);
    const [cardHeight, setCardHeight] = useState(3000 / cardDivision);
    const [step, setStep] = useState(1);

    // Estado dos dados da carta
    const [textString, setTextString] = useState('');
    const [htmlString, setHtmlString] = useState('');
    const [cardName, setCardName] = useState('');
    const [selectedCardType, setSelectedCardType] = useState('TECNICA');
    const [cardElement, setCardElement] = useState("ÁGUA");
    const [artId, setArtId] = useState(1); // Pode ser um ID ou URL da arte
    const [actionBoxes, setActionBoxes] = useState([{ id: uuidv4(), items: [] }]);
    const [similarCards, setSimilarCards] = useState([]); // Adicionado
    const [tfidfVector, setTfidfVector] = useState({}); // Adicionado
    const [cardSet, setCardSet] = useState('starter_set'); // Adicionado estado para o set
    const [cardFlavor, setCardFlavor] = useState('')

    const cardDisplayRef = useRef(null); // Ref para o div da carta para html2canvas
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importCardName, setImportCardName] = useState(''); // Para o input do nome da carta a importar
    const [importCardSet, setImportCardSet] = useState('starter_set'); // Para o select do set da carta a importar


    const colors = useMemo(() => ({ // useMemo para colors se for usado em dependências de outros useMemo/useEffect
        "ÁGUA": '#3753da',
        'FOGO': '#df2815',
        'RAIO': '#dda203',
        'NEUTRO': '#8c8c8c',
    }), []);

    const cardElementOptions = useMemo(() => [ // useMemo para arrays/objetos estáticos passados como props ou em dependências
        { value: 'ÁGUA', label: 'ÁGUA' },
        { value: 'FOGO', label: 'FOGO' },
        { value: 'RAIO', label: 'RAIO' },
        { value: 'NEUTRO', label: 'NEUTRO' },
    ], []);

    const cardTypeOptions = useMemo(() => [
        { value: 'TECNICA', label: 'TÉCNICA' },
        { value: 'AURA', label: 'AURA' },
        { value: 'ATAQUE', label: 'ATAQUE' },
    ], []);

    const cardSetOptions = useMemo(() => [
        { value: 'starter_set', label: 'Starter Set' },
        { value: 'theia_grei_deck', label: 'Theia Grei Deck' },
    ], []);

    const handleCardTypeChange = (evento) => {
        setSelectedCardType(evento.target.value);
    };

    const handleCardElementChange = (evento) => {
        setCardElement(evento.target.value);
    };

    const handleCardSetChange = (evento) => {
        setCardSet(evento.target.value);
    };

    useEffect(() => {
        setHtmlString(textString.replaceAll('REPLACE_COLOR', colors[cardElement]))
    }, [textString, cardElement, colors]); // Adicionado cardElement e colors às dependências

    const nextStep = () => setStep(prev => prev < 4 ? prev + 1 : 4); // Ajustado limite máximo de steps
    const prevStep = () => setStep(prev => prev > 1 ? prev - 1 : 1);


    const handleExportToFirebase = async () => {
        if (!cardName.trim()) {
            alert("Por favor, defina um nome para a carta antes de exportar.");
            return;
        }
        if (!cardDisplayRef.current) {
            alert("Erro: Referência do display da carta não encontrada.");
            return;
        }

        setIsExporting(true);
        try {
            // 1. Gerar imagem da carta com html2canvas
            const canvas = await html2canvas(cardDisplayRef.current, {
                backgroundColor: null, // Para fundo transparente se o design permitir
                scale: 1, // Pode ajustar a escala para melhor qualidade, mas aumenta o tamanho
                logging: true,
                useCORS: true, // Se estiver usando imagens de outras origens na carta
            });
            const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            if (!imageBlob) {
                throw new Error("Falha ao gerar blob da imagem da carta.");
            }

            // 2. Fazer upload da imagem para o Firebase Storage
            const imageUrl = await uploadCardImage(imageBlob, cardName, cardSet);

            // 3. Preparar dados da carta para o Firestore
            const cardData = {
                name: cardName,
                type: selectedCardType,
                element: cardElement,
                artId: artId, // ou a URL da arte se você estiver usando um seletor de URL
                description: htmlString, // ou textString, dependendo do que você quer salvar
                actionBoxes: actionBoxes,
                similarCards: similarCards, // Preencha conforme necessário
                tfidfVector: tfidfVector,   // Preencha conforme necessário
                imageUrl: imageUrl, // URL da imagem da carta gerada
                flavorText: cardFlavor,
                // cardSet já será adicionado pela função saveCardDataToFirestore
            };

            // 4. Salvar dados no Firestore
            await saveCardDataToFirestore(cardData, cardSet);

            alert(`Carta "${cardName}" exportada com sucesso para o set "${cardSet}"!`);

        } catch (error) {
            console.error("Erro ao exportar para o Firebase:", error);
            alert(`Falha ao exportar a carta: ${error.message}`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportFromFirebase = async () => {
        if (!importCardName.trim()) {
            alert("Por favor, digite o nome da carta para importar.");
            return;
        }
        setIsImporting(true);
        try {
            const sanitizedImportCardName = importCardName.replace(/[^a-zA-Z0-9_-\s]/g, '').replace(/\s+/g, '_');
            const docIdToImport = `${importCardSet}_${sanitizedImportCardName}`;
            const cardData = await getCardDataFromFirestore(docIdToImport);

            if (cardData) {
                setCardName(cardData.name || '');
                setSelectedCardType(cardData.type || 'TECNICA');
                setCardElement(cardData.element || 'ÁGUA');
                setArtId(cardData.artId || 1);
                setHtmlString(cardData.description || ''); // ou setTextString se você salvou textString
                setActionBoxes(cardData.actionBoxes || [{ id: uuidv4(), items: [] }]);
                setSimilarCards(cardData.similarCards || []);
                setTfidfVector(cardData.tfidfVector || {});
                setCardSet(cardData.cardSet || 'starter_set'); // Atualiza o set selecionado
                setCardFlavor(cardData.flavorText)
                // Se você salvou textString e precisa dele para o TextSmith
                // Você pode precisar de uma função para converter htmlString de volta para textString
                // ou salvar ambos. Por simplicidade, aqui estamos apenas carregando htmlString.
                // Se textString é a fonte da verdade para TextSmith, você precisará carregá-lo:
                // setTextString(cardData.rawTextString || ''); // Supondo que você salve rawTextString

                alert(`Carta "${cardData.name}" importada com sucesso!`);
            } else {
                alert(`Carta "${importCardName}" no set "${importCardSet}" não encontrada.`);
            }
        } catch (error) {
            console.error("Erro ao importar do Firebase:", error);
            alert(`Falha ao importar a carta: ${error.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    const cardFlavorStyle = useMemo(() => ({
        position: 'absolute',
        zIndex: 10,
        left: 150 / cardDivision,
        top: 2651 / cardDivision,
        fontWeight: 400,
    }), [cardDivision]);

    const cardNameStyle = useMemo(() => ({
        position: 'absolute',
        zIndex: 10,
        left: 118 / cardDivision,
        top: 182 / cardDivision,
        fontWeight: 400,
    }), [cardDivision]);

    const cardTypeStyle = useMemo(() => ({
        position: 'absolute',
        zIndex: 10,
        left: 156 / cardDivision,
        top: 2398 / cardDivision,
        fontWeight: 700,
    }), [cardDivision]);

    const cardElementTypeStyle = useMemo(() => ({ // Renomeado para evitar conflito com cardElement (estado)
        position: 'absolute',
        zIndex: 10,
        left: 156 / cardDivision,
        top: 2536 / cardDivision,
        fontWeight: 700,
    }), [cardDivision]);

    const descriptionStyle = useMemo(() => ({
        position: 'absolute',
        zIndex: 10,
        left: 600 / cardDivision,
        top: 1942 / cardDivision,
        fontWeight: 400,
    }), [cardDivision]);
    

   
    return (
        <>
            <div className={styles.cardCreator}>
                <div className={styles.controlsContainer}>
                    <h1>Criador de Cartas</h1>

                    {/* Seletor de Set da Coleção */}
                    <div className={styles.formGroup}>
                        <label htmlFor="cardSetSelect">Set da Coleção:</label>
                        <select id="cardSetSelect" value={cardSet} onChange={handleCardSetChange}>
                            {cardSetOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.navigationButtons}>
                        <button onClick={prevStep} disabled={step === 1} className={styles.prevButton}>
                            Anterior
                        </button>
                        <button onClick={nextStep} disabled={step === 4} className={styles.nextButton}>
                            Próximo
                        </button>
                    </div>
                    
                    {step === 1 && (
                        <div className={`${styles.step} ${styles.step1}`}>
                            <hr />
                            <div className={styles.formGroup}>
                                <label htmlFor="importCardSetSelect">Set para Importar:</label>
                                <select
                                    id="importCardSetSelect"
                                    value={importCardSet}
                                    onChange={(e) => setImportCardSet(e.target.value)}
                                >
                                    {cardSetOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="importCardNameInput">Nome da Carta para Importar:</label>
                                <input
                                    type="text"
                                    id="importCardNameInput"
                                    value={importCardName}
                                    onChange={(e) => setImportCardName(e.target.value)}
                                    placeholder="Nome da carta existente"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <button onClick={handleImportFromFirebase} disabled={isImporting || !importCardName.trim()} className={styles.actionButton}>
                                    {isImporting ? 'Importando...' : 'Importar do Firebase'}
                                </button>
                            </div>
                            <hr />
                            <h2>Passo 1: Definições Básicas</h2>
                            <div className={styles.formGroup}>
                                <label htmlFor="cardNameInput">Nome da Carta:</label>
                                <input
                                    type="text"
                                    id="cardNameInput"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                    placeholder="Ex: Dragão Flamejante"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="cardTypeSelect">Tipo da Carta:</label>
                                <select id="cardTypeSelect" value={selectedCardType} onChange={handleCardTypeChange}>
                                    {cardTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="cardElementSelect">Elemento da Carta:</label>
                                <select id="cardElementSelect" value={cardElement} onChange={handleCardElementChange}>
                                    {cardElementOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="cardArtSelect">Arte da Carta (ID/Nome):</label>
                                <input
                                    type="number"
                                    id="cardArtSelect"
                                    value={artId}
                                    onChange={(e) => setArtId(e.target.value)}
                                    placeholder="Ex: dragao_arte_01 ou 1"
                                />
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <TextSmith
                            setTextString={setTextString}
                            actionBoxes={actionBoxes}
                            setActionBoxes={setActionBoxes}
                        />
                    )}
                    {step === 3 && (
                        <div className={`${styles.step} ${styles.step3}`}>
                            <h2>Passo 3: Adicionar Flavor</h2>
                            <div className={styles.formGroup}>
                                <label htmlFor="cardFlavorTextarea">Texto de Flavor (opcional):</label>
                                <textarea
                                    id="cardFlavorTextarea"
                                    className={styles.flavorTextarea}
                                    value={cardFlavor}
                                    onChange={e => setCardFlavor(e.target.value)}
                                    placeholder="Ex: 'Dizem que até o fogo respeita a vontade deste dragão.'"
                                    rows={4}
                                    maxLength={240}
                                />
                                <div className={styles.flavorHelper}>
                                    <small>Dica: Use frases curtas, poéticas ou impactantes. Esse texto aparece na parte inferior da carta.</small>
                                    <small>{cardFlavor.length}/240 caracteres</small>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 4 && (
                        <div className={`${styles.step} ${styles.step4}`}> {/* Corrigido para step4 aqui */}
                            <h2>Passo 4: Exportar</h2> {/* Ajustado título do Passo */}
                            <div className={styles.formGroup}>
                                <button onClick={handleExportToFirebase} disabled={isExporting || !cardName.trim()} className={styles.actionButton}>
                                    {isExporting ? 'Exportando...' : 'Exportar para Firebase'}
                                </button>
                            </div>
                            <hr className={styles.divider} />
                        </div>
                    )}


                </div>

                <div ref={cardDisplayRef} className={styles.art} style={{ width: cardWidth, height: cardHeight, position: 'sticky', top: 50 }}>
                    <CardFrame cardName={artId} width={cardWidth} height={cardHeight} color={colors[cardElement]} selectedCardType={selectedCardType} />

                    {step >= 3 && cardFlavor && ( // Adicionado cardFlavor para não renderizar SmartText se flavor estiver vazio
                        <SmartText text={`
                                <span style="
                                display: block;
                                text-align: center;
                                font-style: italic !important;
                                color: #757575;
                                line-height: 0.8;
                                font-family: serif;
                                ">
                                    “${cardFlavor}”
                                </span>
                            `}
                            width={1850 / cardDivision}
                            height={140 / cardDivision}
                            boldColor={colors[cardElement]}
                            style={cardFlavorStyle} // Usando estilo memoizado
                            minFontSize={8} // Exemplo, ajuste conforme necessário
                            maxFontSize={20} // Exemplo
                             />
                    )}

                    {/* Textos visíveis principalmente no passo 4 para preview final antes do export */}
                    {step >= 0 && (
                        <>
                            <SmartText text={`
                                <span style='color: ${colors[cardElement]}; font-weight: bold'>${cardName}</span>
                                `}
                                width={1913 / cardDivision}
                                height={224 / cardDivision}
                                boldColor={colors[cardElement]}
                                centerText={true}
                                style={cardNameStyle} // Usando estilo memoizado
                                minFontSize={10} // Exemplo
                                maxFontSize={40} // Exemplo
                                />
                            <SmartText text={`<span style='color: white'>${selectedCardType !== 'TECNICA' ? selectedCardType : 'TÉCNICA'}</span>`}
                                width={412 / cardDivision}
                                height={110 / cardDivision}
                                boldColor={colors[cardElement]}
                                centerText={true}
                                style={cardTypeStyle} // Usando estilo memoizado
                                minFontSize={8} // Exemplo
                                maxFontSize={25} // Exemplo
                                />
                            <SmartText text={`<span style='color: white'>${cardElement}</span>`}
                                width={412 / cardDivision}
                                height={110 / cardDivision}
                                boldColor={colors[cardElement]}
                                centerText={true}
                                style={cardElementTypeStyle} // Usando estilo memoizado
                                minFontSize={8} // Exemplo
                                maxFontSize={25} // Exemplo
                                />
                        </>
                    )}

                    {/* Descrição principal visível durante a edição e no preview final */}
                    {/* Pode ser útil mostrar isso a partir do step 2 (edição) ou 3 (flavor) também */}
                    {step >=2 && (
                         <SmartText
                            text={htmlString}
                            width={1416 / cardDivision}
                            height={706 / cardDivision}
                            boldColor={colors[cardElement]}
                            style={descriptionStyle} // Usando estilo memoizado
                            minFontSize={8} // Exemplo
                            maxFontSize={22} // Exemplo
                            lineHeight={1.2} // Exemplo
                            />
                    )}
                </div>
            </div>
        </>
    );
}

// Envolve o componente CardCreator com React.memo
const CardCreator = memo(CardCreatorComponent);

export default CardCreator;