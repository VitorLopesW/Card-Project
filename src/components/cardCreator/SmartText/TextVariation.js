const palavrasChaveLista = [
    "ATAQUE", "ATAQUE-ALVO", "ATAQUES", "DEFESA", "ALVO", "URGENTE"
];

const frasesChaveLista = [
    "ação imediata requerida", "protocolo de segurança", "nível crítico"
];

// Pré-processamento das listas de palavras-chave e frases-chave
// Feito uma vez, assumindo que as listas são constantes ou gerenciadas externamente
const palavrasChaveOrdenadas = [...new Set((palavrasChaveLista || []).filter(Boolean))]
    .sort((a, b) => b.length - a.length)
    .map(kw => ({ text: kw, lower: kw.toLowerCase() })); // Pré-converter para minúsculas para busca

const frasesChaveOrdenadas = [...new Set((frasesChaveLista || []).filter(Boolean))]
    .sort((a, b) => b.length - a.length);

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/[&<>"']/g, function (match) {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return match;
        }
    });
}

export function formatarString(str, corHexPalavrasChave) {
    if (!str) return "";

    let todasCorrespondencias = [];
    const textoOriginalLower = str.toLowerCase(); // Converter texto original para minúsculas uma vez para buscas case-insensitive

    // 1. Encontrar todas as ocorrências de parênteses
    let indiceBusca = 0;
    while (indiceBusca < str.length) {
        const indiceAbreParentese = str.indexOf('(', indiceBusca);
        if (indiceAbreParentese === -1) break;
        const indiceFechaParentese = str.indexOf(')', indiceAbreParentese + 1);
        if (indiceFechaParentese === -1) break; // Não encontrou fechamento, pode parar de procurar parênteses

        todasCorrespondencias.push({
            startIndex: indiceAbreParentese,
            endIndex: indiceFechaParentese + 1,
            type: 'parenthesis',
            displayText: escapeHtml(str.substring(indiceAbreParentese + 1, indiceFechaParentese)),
            originalText: str.substring(indiceAbreParentese, indiceFechaParentese + 1)
        });
        indiceBusca = indiceFechaParentese + 1;
    }

    // 2. Encontrar todas as frases-chave (case-sensitive)
    for (const frase of frasesChaveOrdenadas) {
        indiceBusca = 0;
        while (indiceBusca < str.length) {
            const indiceFrase = str.indexOf(frase, indiceBusca);
            if (indiceFrase === -1) break;
            todasCorrespondencias.push({
                startIndex: indiceFrase,
                endIndex: indiceFrase + frase.length,
                type: 'phrase',
                displayText: escapeHtml(frase),
                originalText: frase
            });
            indiceBusca = indiceFrase + frase.length; // Avança para depois da frase encontrada para evitar sobreposições da mesma frase
        }
    }

    // 3. Encontrar todas as palavras-chave (case-insensitive)
    for (const palavraInfo of palavrasChaveOrdenadas) {
        indiceBusca = 0;
        while (indiceBusca < textoOriginalLower.length) {
            const indicePalavra = textoOriginalLower.indexOf(palavraInfo.lower, indiceBusca);
            if (indicePalavra === -1) break;
            const originalKeywordText = str.substring(indicePalavra, indicePalavra + palavraInfo.text.length);
            todasCorrespondencias.push({
                startIndex: indicePalavra,
                endIndex: indicePalavra + palavraInfo.text.length,
                type: 'keyword',
                displayText: escapeHtml(originalKeywordText),
                originalText: originalKeywordText
            });
            indiceBusca = indicePalavra + palavraInfo.text.length; // Avança para depois da palavra encontrada
        }
    }

    // Ordenar todas as correspondências:
    // 1. Por startIndex (ascendente)
    // 2. Por precedência de tipo (parenthesis > phrase > keyword) - maior precedência primeiro
    // 3. Por comprimento da correspondência (endIndex - startIndex) (descendente - mais longa primeiro)
    const precedencia = { parenthesis: 3, phrase: 2, keyword: 1 };
    todasCorrespondencias.sort((a, b) => {
        if (a.startIndex !== b.startIndex) {
            return a.startIndex - b.startIndex;
        }
        if (precedencia[a.type] !== precedencia[b.type]) {
            return precedencia[b.type] - precedencia[a.type];
        }
        return (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex);
    });

    // Filtrar sobreposições: manter a primeira (que tem maior precedência/comprimento devido à ordenação)
    let correspondenciasFinais = [];
    let ultimoIndiceProcessado = -1;
    for (const correspondencia of todasCorrespondencias) {
        if (correspondencia.startIndex >= ultimoIndiceProcessado) {
            correspondenciasFinais.push(correspondencia);
            ultimoIndiceProcessado = correspondencia.endIndex;
        }
    }

    // Construir a string HTML
    let htmlString = "";
    let indiceAtual = 0;
    const corFrase = corHexPalavrasChave; // Reutilizando a cor para frases, conforme original
    const corParenteses = 'gray';

    for (const match of correspondenciasFinais) {
        // Adiciona texto simples antes da correspondência
        if (match.startIndex > indiceAtual) {
            htmlString += escapeHtml(str.substring(indiceAtual, match.startIndex));
        }

        // Adiciona a correspondência estilizada
        if (match.type === 'parenthesis') {
            htmlString += `<span style="font-style: italic; color: ${corParenteses}; font-size: ${tamanhoFonteParenteses};">(${match.displayText})</span>`;
        } else if (match.type === 'phrase') {
            htmlString += `<span style="font-weight: bold; color: ${corFrase};">${match.displayText}</span>`;
        } else if (match.type === 'keyword') {
            htmlString += `<span style="color: ${corHexPalavrasChave}; font-style: italic; text-transform: uppercase;">${match.displayText}</span>`;
        }
        indiceAtual = match.endIndex;
    }

    // Adiciona o restante do texto, se houver
    if (indiceAtual < str.length) {
        htmlString += escapeHtml(str.substring(indiceAtual));
    }

    return htmlString;
}

