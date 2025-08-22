import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';

/**
 * Componente de texto que ajusta automaticamente o tamanho da fonte
 * para caber em uma única linha dentro do contêiner.
 */
const AutoFitText = ({ text, style, minFontSize = 10, maxFontSize = 200, textStyle = {}, centerText = true }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [fontSize, setFontSize] = useState(maxFontSize);

    useEffect(() => {
        const resizeText = () => {
            const container = containerRef.current;
            const textElement = textRef.current;

            if (!container || !textElement) return;

            let currentFontSize = maxFontSize;
            textElement.style.fontSize = `${currentFontSize}px`;
            textElement.style.whiteSpace = 'nowrap'; 

            while (
                (textElement.scrollWidth > container.clientWidth ||
                 textElement.scrollHeight > container.clientHeight) &&
                currentFontSize > minFontSize
            ) {
                currentFontSize -= 1;
                textElement.style.fontSize = `${currentFontSize}px`;
            }
            setFontSize(currentFontSize);
        };

        resizeText();
        const resizeObserver = new ResizeObserver(resizeText);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        window.addEventListener('resize', resizeText); 

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
            resizeObserver.disconnect();
            window.removeEventListener('resize', resizeText);
        };
    }, [text, minFontSize, maxFontSize, style, textStyle, centerText]); // Adicionado centerText às dependências

    const finalContainerStyle = {
        ...style, 
        overflow: 'hidden', 
        display: 'flex',
    };
    const finalTextSpanStyle = {
        ...textStyle,
        fontSize: `${fontSize}px`,
        whiteSpace: 'nowrap',
    };

    if (centerText) {
        finalContainerStyle.alignItems = 'center';
        finalContainerStyle.justifyContent = 'center';
        finalTextSpanStyle.textAlign = 'center';
    } else {
        finalContainerStyle.alignItems = style && style.alignItems !== undefined ? style.alignItems : 'flex-start';
        finalContainerStyle.justifyContent = style && style.justifyContent !== undefined ? style.justifyContent : 'flex-start';
        finalTextSpanStyle.textAlign = textStyle && textStyle.textAlign !== undefined ? textStyle.textAlign : 'left';
    }

    return (
        <div 
            ref={containerRef} 
            style={finalContainerStyle}
        >
            <span 
                ref={textRef} 
                style={finalTextSpanStyle}
            >
                {text}
            </span>
        </div>
    );
};

/**
 * Componente de texto que ajusta automaticamente o tamanho da fonte
 * para caber em múltiplas linhas dentro do contêiner.
 */
const AutoFitTextMultiLine = ({ children, style, minFontSize = 10, maxFontSize = 200, lineHeight = 1.1, textStyle = {}, centerText = false }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [fontSize, setFontSize] = useState(maxFontSize);
    const textContent = children || '';

    useLayoutEffect(() => {
        const resizeText = () => {
            const container = containerRef.current;
            const textElement = textRef.current;

            if (!container || !textElement || !textContent) return;

            let currentFontSize = maxFontSize;
            textElement.style.lineHeight = `${lineHeight}`;
            textElement.style.fontSize = `${currentFontSize}px`;
            textElement.style.width = '100%'; 
            textElement.style.height = 'auto';
            textElement.style.display = 'block'; // Para medição correta com width 100%
            textElement.style.whiteSpace = 'normal';
            textElement.style.wordBreak = 'break-word';
            // Aplicar textAlign para medição
            if (centerText) {
                textElement.style.textAlign = 'center';
            } else if (textStyle && textStyle.textAlign) {
                textElement.style.textAlign = textStyle.textAlign;
            } else {
                textElement.style.textAlign = 'left';
            }

            while (
                (textElement.scrollWidth > container.clientWidth + 1 || 
                 textElement.scrollHeight > container.clientHeight + 1) && 
                currentFontSize > minFontSize
            ) {
                currentFontSize -= 1;
                textElement.style.fontSize = `${currentFontSize}px`;
            }
            setFontSize(currentFontSize);
        };

        resizeText();
        const resizeObserver = new ResizeObserver(resizeText);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        window.addEventListener('resize', resizeText);

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
            resizeObserver.disconnect();
            window.removeEventListener('resize', resizeText);
        };
    }, [textContent, minFontSize, maxFontSize, lineHeight, style, textStyle, centerText]); // Adicionado centerText

    const finalContainerStyle = {
        ...style, 
        overflow: 'hidden',
        display: 'flex',
    };
    const finalTextDivStyle = {
        ...textStyle,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
    };

    if (centerText) {
        finalContainerStyle.alignItems = 'center';
        finalContainerStyle.justifyContent = 'center';
        finalTextDivStyle.textAlign = 'center';
        finalTextDivStyle.display = 'inline-block'; // Para o bloco ser centralizado
        finalTextDivStyle.width = 'auto';           // Largura intrínseca
        finalTextDivStyle.maxWidth = '100%';      // Não exceder o container
    } else {
        finalContainerStyle.alignItems = style && style.alignItems !== undefined ? style.alignItems : 'center'; // Padrão original era center
        finalContainerStyle.justifyContent = style && style.justifyContent !== undefined ? style.justifyContent : 'flex-start';
        finalTextDivStyle.textAlign = textStyle && textStyle.textAlign !== undefined ? textStyle.textAlign : 'left';
        finalTextDivStyle.display = 'block'; // Comportamento original para ocupar largura
        finalTextDivStyle.width = '100%';
    }

    return (
        <div 
            ref={containerRef} 
            style={finalContainerStyle}
        >
            <div
                ref={textRef}
                style={finalTextDivStyle}
            >
                {children}
            </div>
        </div>
    );
};

/**
 * Componente que renderiza HTML e ajusta automaticamente o tamanho da fonte
 * para caber em múltiplas linhas dentro do contêiner.
 */
const AutoFitHTMLMultiLine = ({ htmlContent, style, minFontSize = 12, maxFontSize = 62, lineHeight = 1, textStyle = {}, centerText = false }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [fontSize, setFontSize] = useState(maxFontSize);

    useLayoutEffect(() => {
        const resizeText = () => {
            const container = containerRef.current;
            const textElement = textRef.current;

            if (!container || !textElement || !htmlContent) return;

            let currentFontSize = maxFontSize;
            textElement.style.lineHeight = `${lineHeight}`;
            textElement.style.fontSize = `${currentFontSize}px`;
            textElement.style.width = '100%';
            textElement.style.height = 'auto';
            textElement.style.display = 'block';
            textElement.style.whiteSpace = 'normal';
            textElement.style.wordBreak = 'break-word';
            // Aplicar textAlign para medição
            if (centerText) {
                textElement.style.textAlign = 'center';
            } else if (textStyle && textStyle.textAlign) {
                textElement.style.textAlign = textStyle.textAlign;
            } else {
                textElement.style.textAlign = 'left';
            }

            while (
                (textElement.scrollWidth > container.clientWidth + 1 ||
                 textElement.scrollHeight > container.clientHeight + 1) &&
                currentFontSize > minFontSize
            ) {
                currentFontSize -= 1;
                textElement.style.fontSize = `${currentFontSize}px`;
            }
            setFontSize(currentFontSize);
        };

        resizeText();
        const resizeObserver = new ResizeObserver(resizeText);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        window.addEventListener('resize', resizeText);

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
            resizeObserver.disconnect();
            window.removeEventListener('resize', resizeText);
        };
    }, [htmlContent, minFontSize, maxFontSize, lineHeight, style, textStyle, centerText]); // Adicionado centerText

    const finalContainerStyle = {
        ...style, 
        overflow: 'hidden',
        display: 'flex',
    };
    const finalTextDivStyle = {
        ...textStyle,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
    };

    if (centerText) {
        finalContainerStyle.alignItems = 'center';
        finalContainerStyle.justifyContent = 'center';
        finalTextDivStyle.textAlign = 'center';
        finalTextDivStyle.display = 'inline-block';
        finalTextDivStyle.width = 'auto';
        finalTextDivStyle.maxWidth = '100%';
    } else {
        finalContainerStyle.alignItems = style && style.alignItems !== undefined ? style.alignItems : 'center'; // Padrão original era center
        finalContainerStyle.justifyContent = style && style.justifyContent !== undefined ? style.justifyContent : 'flex-start';
        finalTextDivStyle.textAlign = textStyle && textStyle.textAlign !== undefined ? textStyle.textAlign : 'left';
        finalTextDivStyle.display = 'block';
        finalTextDivStyle.width = '100%';
    }

    return (
        <div 
            ref={containerRef} 
            style={finalContainerStyle}
        >
            <div
                ref={textRef}
                style={finalTextDivStyle}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
};


// COMPONENTE SmartText MODIFICADO PARA CENTRALIZAÇÃO
const SmartText = ({
    text,
    boldColor,
    width,
    height,
    minFontSize = 10,
    maxFontSize = 200,
    lineHeight = 1.2,
    centerText = false, // Se true, centraliza o texto horizontal e verticalmente
    style = {},      
    textStyle = {}   
}) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [fontSize, setFontSize] = useState(maxFontSize);
    const [processedHtml, setProcessedHtml] = useState('');

    useEffect(() => {
        if (!text) {
            setProcessedHtml('');
            return;
        }
        const newHtml = boldColor
            ? text.replace(/\*\*(.*?)\*\*/g, `<span style="color: ${boldColor}; font-weight: bold;">$1</span>`)
            : text.replace(/\*\*(.*?)\*\*/g, '$1');
        setProcessedHtml(newHtml);
    }, [text, boldColor]);

    useLayoutEffect(() => {
        const resizeText = () => {
            const container = containerRef.current;
            const textElement = textRef.current;

            if (!container || !textElement || !processedHtml) return;

            let currentFontSize = maxFontSize;
            textElement.style.lineHeight = `${lineHeight}`;
            textElement.style.fontSize = `${currentFontSize}px`;
            
            textElement.style.display = 'block'; 
            textElement.style.width = '100%';    
            textElement.style.height = 'auto';
            textElement.style.whiteSpace = 'normal';
            textElement.style.wordBreak = 'break-word';
            
            if (centerText) {
                textElement.style.textAlign = 'center';
            } else if (textStyle && textStyle.textAlign) {
                textElement.style.textAlign = textStyle.textAlign;
            } else {
                textElement.style.textAlign = 'left';
            }

            while (
                (textElement.scrollWidth > container.clientWidth + 1 ||
                 textElement.scrollHeight > container.clientHeight + 1) &&
                currentFontSize > minFontSize
            ) {
                currentFontSize -= 1;
                textElement.style.fontSize = `${currentFontSize}px`;
            }
            setFontSize(currentFontSize);
        };
        
        const timeoutId = setTimeout(resizeText, 0); 

        const resizeObserver = new ResizeObserver(resizeText);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        window.addEventListener('resize', resizeText);

        return () => {
            clearTimeout(timeoutId);
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
            resizeObserver.disconnect();
            window.removeEventListener('resize', resizeText);
        };
    }, [processedHtml, minFontSize, maxFontSize, lineHeight, width, height, style, textStyle, centerText]);

    const containerStyles = {
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        display: 'flex',
        position: style.position !== undefined ? style.position : 'absolute',
        zIndex: style.zIndex !== undefined ? style.zIndex : 1,
        left: style.left !== undefined ? style.left : '0',
        top: style.top !== undefined ? style.top : '0',
        ...style,
    };

    const actualTextStyle = {
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        ...textStyle,
    };

    if (centerText) {
        containerStyles.alignItems = 'center';
        containerStyles.justifyContent = 'center';
        actualTextStyle.textAlign = 'center';
        actualTextStyle.display = 'inline-block'; 
        actualTextStyle.width = 'auto';          
        actualTextStyle.maxWidth = '100%';
    } else {
        containerStyles.alignItems = style.alignItems || 'flex-start';
        if (style.justifyContent !== undefined) {
            containerStyles.justifyContent = style.justifyContent;
        } else {
            if (textStyle && textStyle.textAlign === 'center') containerStyles.justifyContent = 'center';
            else if (textStyle && textStyle.textAlign === 'right') containerStyles.justifyContent = 'flex-end';
            else containerStyles.justifyContent = 'flex-start';
        }
        
        actualTextStyle.textAlign = textStyle.textAlign || 'left';
        actualTextStyle.display = 'block'; 
        actualTextStyle.width = '100%';
    }
    
    return (
        <div
            ref={containerRef}
            style={containerStyles}
        >
            <div
                ref={textRef}
                style={actualTextStyle}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
        </div>
    );
};


// COMPONENTE TextsPart (EXEMPLO DE USO)
const TextsPart = ({ texts, mainColor }) => {
    if (!texts) return null;

    const titleHeight = 50;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {texts.title && (
                <SmartText
                    text={texts.title}
                    width={250} 
                    height={titleHeight}
                    minFontSize={10}
                    maxFontSize={30}
                    centerText={true} // USANDO A NOVA PROP PARA CENTRALIZAR
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        backgroundColor: 'red',
                    }}
                    textStyle={{
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                    }}
                />
            )}

            {texts.descriptionHTML && (
                 <AutoFitHTMLMultiLine
                    htmlContent={texts.descriptionHTML.replace(/<span>(.*?)<\/span>/g, `<span style="color: ${mainColor}; font-weight: bold;">$1</span>`)}
                    minFontSize={10}
                    maxFontSize={22}
                    lineHeight={1.3}
                    // centerText={true} // Exemplo: descomente para centralizar a descrição
                    style={{
                        position: 'absolute',
                        top: '80px',
                        left: '20px',
                        right: '20px', 
                        height: '150px',
                        zIndex: 10,
                        color: '#333333',
                    }}
                    textStyle={{
                        // textAlign: 'justify', // Se centerText=true, isso será sobrescrito para 'center'
                                             // Se centerText=false (padrão), 'justify' será usado.
                    }}
                />
            )}

            {texts.type && (
                <AutoFitText // AutoFitText centraliza por padrão (centerText=true)
                    text={texts.type}
                    minFontSize={10}
                    maxFontSize={20}
                    // centerText={false} // Exemplo: descomente para alinhar à esquerda
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        left: '20px',
                        width: '150px',
                        height: '30px',
                        zIndex: 10,
                        color: '#555555',
                    }}
                    textStyle={{
                        fontWeight: '500',
                        // textAlign: 'left' // Se centerText=false, pode definir aqui
                    }}
                />
            )}

             {texts.classType && (
                <AutoFitText // AutoFitText centraliza por padrão (centerText=true)
                    text={texts.classType}
                    minFontSize={10}
                    maxFontSize={20}
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        right: '20px',
                        width: '150px',
                        height: '30px',
                        zIndex: 10,
                        color: '#555555',
                    }}
                    textStyle={{
                        fontWeight: '500',
                    }}
                />
            )}

            {texts.flavor && (
                <SmartText
                    text={texts.flavor}
                    boldColor={mainColor} 
                    width={360}  
                    height={60}   
                    minFontSize={9}
                    maxFontSize={18}
                    lineHeight={1.2}
                    centerText={true} // USANDO A NOVA PROP PARA CENTRALIZAR
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                    }}
                    textStyle={{
                        fontStyle: 'italic',
                        color: '#666666', 
                    }}
                />
            )}
        </div>
    );
};

// Exemplo de uso em um App
const AppExample = () => {
    const sampleCardTexts = {
        title: "TEMPESTADE AEREA",
        descriptionHTML: "Uma <span>criatura lendária</span> que habita o oceano mais profundo. Rumores dizem que seu rugido causa maremotos.",
        flavor: "O mar guarda segredos.",
        type: "Criatura Lendária",
        classType: "Ar / Poder"
    };
    const cardElementColor = '#007bff';

    return (
        <div style={{
            width: '400px', 
            height: '600px', 
            border: '1px solid #ccc',
            borderRadius: '10px',
            margin: '20px auto',
            position: 'relative', 
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            backgroundImage: 'url("caminho_para_sua_imagem_de_fundo_do_card.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div style={{width: '100%', height: '100%', position: 'relative'}}>
                 <TextsPart texts={sampleCardTexts} mainColor={cardElementColor} />
            </div>
        </div>
    );
};


const MemoAutoFitTextMultiline = React.memo(AutoFitTextMultiLine);
const MemoAutoFitHTMLMultiline = React.memo(AutoFitHTMLMultiLine);
const MemoSmartText = React.memo(SmartText);
const MemoTextsPart = React.memo(TextsPart);

export {
    AutoFitText,
    MemoAutoFitTextMultiline as AutoFitTextMultiline,
    MemoAutoFitHTMLMultiline as AutoFitHTMLMultiline,
    MemoSmartText as SmartText,
    MemoTextsPart as TextsPart,
    AppExample
};
