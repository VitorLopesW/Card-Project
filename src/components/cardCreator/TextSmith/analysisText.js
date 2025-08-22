
import { verbosIrregulares, buscarInformacoesPalavra, conjugarVerboRegular, isVerboIrregular, conjugar } from './analysisTextVar.js';
import pluralize from 'pluralize-ptbr';


const convertInputArrayToAUsableFormat = (inputArray) => {
  return inputArray.map(obj =>
    (obj.items || []).map(item => ({
      type: item.type.toLowerCase(),
      value: item.data.value !== undefined ? item.data.value : { ...item.data }
    }))
  );
};

const italic = (string) => {
  return `<span style="color:grey; !important; font-size: 0.6rem; display:inline-block">(${string})</span>`
}

const explanation = {
  clone: italic('Clones são cópias exatas da carta-alvo. Enquanto estiverem na Linha do Tempo, são tratados como se fossem a carta clonada.'),
  action: italic('Ações são qualquer coisa que desencadeia: cartas, cópias, clones, etc. Se está na linha do tempo, e é desencadeada, é considerada uma ação.'),
  negate: italic('A carta alvo perde todos os seus efeitos. Quando for desencadeada, ignore-a como se não estivesse na Linha do Tempo — nenhum efeito decorrente de seu desencadeamento acontece. Após ser ignorada, ela é considerada como uma carta desencadeada normal para todos os efeitos futuros.'),
  ancora: italic("Esta carta não pode ser movida por efeitos controlados pelo seu oponente."),
  driblar: italic("Mova esta carta X posições para a esquerda na Linha do Tempo."),
  auraHate: italic(`
      Desativa todas as auras ativas na fase de desencadeamento — se uma aura for engatilhada automaticamente pelo desencadeamento desta carta, ela é engatilhada antes da desativação —  efeitos de aura engatilhados por esta carta só ocorrem se o gatilho vier antes da desativação.
    `),
    burn: italic(`O jogador que receber dano de uma carta com queimar ganha X tokens de queimadura. A cada 7 tokens de queimadura, receba 7 de dano e perde 7 tokens de queimadura.`),
    activeAura: (italic('Esta aura permanece ativa até ser desencadeada.')),
    totalProtection: italic('A carta afetada ganha um token de Proteção Total. Se for alvo de qualquer efeito do oponente — positivo ou negativo — o efeito é ignorado.'),
    cairNivelProtecao: (
      italic('Cartas, auras ou tokens com proteção total passam a ter apenas proteção. Cartas, auras ou tokens com proteção perdem esse efeito completamente. Caso uma carta, aura ou token tenha como único efeito conceder proteção, ela é desencadeada normalmente, mas não ativa nenhum efeito.')
    ),
    protection:(
      italic(
       'A carta afetada ganha um token de Proteção. O próximo efeito do oponente — positivo ou negativo — é ignorado, e então o token de proteção é perdido.'
      )
    ),
    copy: `${italic('Cópias são cartas independentes e desaparecem após serem desencadeadas. Se a original estiver na linha do tempo, as cópias são criadas assim que ela for desencadeada com sucesso. O resto das cópias são criadas quando a carta que as copiou termina seu desencadeamento.')}`,




    energize: italic('Gera X tokens de energia, no fim da rodade remova metade dos tokens de energia que você tiver.'),
    instict: italic('Quando esta carta entrar na Linha do Tempo, anuncie imediatamente o alvo desta carta.'),
    diabolicProtection: italic('Qualquer efeito do seu oponente que afetaria esta carta é ignorado, a menos que ele escolha receber 6 de dano'),
    insanity: italic(`Antes de serem desencadeadas, você pode negar outra carta sua. Se não fizer isso, a carta com Psicose é negada. Psicose não se acumula.`),
    puxar: italic('Puxe a carta selecionada para a próxima posição possível de desencadeamento na Linha do Tempo, ignorando a ordem dos jogadores — ela será a próxima carta a ser desencadeada.'),
}



const keyword = (string) => {
  return `<span style="color:REPLACE_COLOR">${string.toUpperCase()}</span>`
} 

const colorMark = (string) => {
  return `<span style="color:REPLACE_COLOR">${string}</span>`
}


const targetCard = (target) => {
  return keyword(`${target}-alvo`)
}
const formatText = (text) => {
  return text
    .replace(/\s+,/g, ',')                 // remove spaces before commas
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());

};

const verboAlvoJogador = (item, verb) => {
  const target = item.value.targetPlayer;
  if(item.value.targetCard == 'nada') return `[${verb}]`

  let targetText = '';
  if(target == 'self') {
    targetText = ' que você controla';
  }
  else if(target == 'enemy') {
    targetText = ' que o oponente controla';
  }
  return `[${verb}] ${keyword(`${targetCard(item.value.targetCard)}`)}${targetText}`
}

const formatters = {
    atacar: (item) => item.value === 0 ?  `[causar] ${colorMark(' X de dano')}`: `[causar] ${colorMark(`${item.value} de dano`)}`,
    curar: (item) => item.value === 0 
    ? `[curar] ${colorMark(' X de vida')}` 
    : `[curar] ${colorMark(`${item.value} de vida`)}`,
  
    explanation: (item) => {
      return explanation[item.value.targetCard]
    },
    ['da carta escolhida']: (item) => `da ${keyword('carta')} ${colorMark('escolhida')}`,
    ['quantidade de x']: (item) =>{
      const plural = pluralize(item.value.targetCard);

      return `quantidade de ${keyword(plural)}`
    },
    ['na sua linha do tempo']:(item) => `na sua ${keyword('Linha do Tempo')} `,
    ['na linha do tempo do seu oponente']:(item) => `na ${keyword('Linha do Tempo')} do seu ${keyword('oponente')} `,

    ['olhe seu baralho']: (item) => `olhe seu ${colorMark('baralho')}`,
    ['olhe seu descarte']: (item) => `olhe seu ${colorMark('descarte')}`,
    ['olhe seu baralho ou descarte']: (item) => `olhe seu ${colorMark('baralho')} ou ${colorMark('descarte')}`,
    driblar: (item) => `${keyword('[driblar]')} ${colorMark(item.value === 0 ? 'X' : item.value)}`,
    ['de um']: (item) => 'de um',
    ['procurar por']: (item) => `[procurar] por`,
    ['escolha uma carta']: (item) => {
      console.log(item)
      const pronome = item.value.targetCard === 'ataque' ? 'um' : 'uma'
      
      return `[escolher] ${pronome} ${keyword(item.value.targetCard)}`
    },
    virgula: (item) => ',',
    negar: (item) => {return verboAlvoJogador(item, 'negar')},
    mover: (item) => {return verboAlvoJogador(item, 'mover')},
    ancora: (item) => keyword( 'âncora'),
    vezes: (item) => colorMark(item.value === 0 ? 'X vezes' : `${item.value} vezes`),
    puxar: (item) => {return verboAlvoJogador(item, 'puxar')},
    ['apenas se seu oponente']: (item) => `, apenas se seu oponente`,
    de: (item) => `de`,
    ['de uma']: (item) => `de uma`,
    ['esta carta vira um']: (item) => 'esta carta vira um',
    ['ganhe um token de martelada']: (item) => `[ganhar] um token de ${colorMark('martelada')}`,
    ['proteção total']: (item) => {
      const value = item.value
      if(value === 'self'){
        return `[ganhar] ${keyword('proteção total')}`
      }
      else if(value ==='target'){
        return `${keyword('carta-alvo')} ganha ${keyword('proteção total')}`
      }
      else if(value === 'none'){
        return  `${keyword('proteção total')}`
      }
    },
    ['carta alvo']: (item) => `${targetCard(item.value.targetCard)}`,
    ['do seu oponente']: (item) => `do seu ${keyword('oponente')}`,
    suas: (item) => 'suas',
    ['roubar controle']: (item) => `[roubar] o controle de ${targetCard(item.value.targetCard)}`,
    energizar: (item) => `[energizar] ${colorMark(item.value)}`,
    ['até o final da rodada']: () => `até o ${keyword('final da rodada')}`,
    ['o próximo que for desencadeado']: () => `o próximo que for ${keyword('desencadeado')}`,
    ['toda vez que']: () => 'toda vez que',
    ['receber dano']: () => '[recebar] dano',
    ['toda vez que um jogador']: () => `toda vez que um ${keyword('jogador')}`,
    ['dobre a quantidade de']: (item) =>`[dobrar] a quantidade de ${keyword(item.value.targetCard)}`,
    embaralhar: (item) => {
      return item.value === 'self'
        ? '[embaralhar] seu ' + colorMark('baralho')
        : '[embaralhar] o ' + colorMark('baralho do oponente');
    },
    ['desativar aura']: (item) => `[desativar] todas as ${colorMark('auras')}`,
    copiar: (item) => {
      const target = item.value.targetPlayer;
      const card = item.value.targetCard;
      if (card == 'nada') return `[copiar]`;
      
      const alvo = targetCard(card);
    
      if (target == 'self') {
        return `[copiar] ${alvo} que você controla`;
      } else if (target == 'enemy') {
        return `[copiar] ${alvo} que o oponente controla`;
      } else if (target == 'any') {
        return `[copiar] ${alvo}`;
      }
    },
    clonar: (item) => {
      const target = item.value.targetPlayer;
      const card = item.value.targetCard;
    
      if (card === 'nada') return `${colorMark('[clonar]')}`;
    
      const alvo = targetCard(card);
    
      if (target === 'self') {
        return `[clonar] ${alvo} que você controla`;
      } else if (target === 'enemy') {
        return `[clonar] ${alvo} que o oponente controla`;
      } else if (target === 'selfCard') {
        const pronome = card === 'ataque' ? 'um' : 'uma';
        return `esta carta vira um ${keyword('clone')} de ${pronome} ${keyword(`${targetCard(card)}`)}`;
      }
    },

    'protecao diabolica': (item) => `${keyword('proteção diabólica')}`,
    insanidade: (item) => `[ganhar] ${keyword('insanidade')}`,
    ['apenas se tiver']: () => `, apenas se [ter]`, 
    "tomou dano": (item) =>`[sofrer] pelo menos ${colorMark(`${item.value} de dano`)}`,
    instinto: (item) => keyword('instinto'),
    // TODO SPECIAL CASE: 
    'ao ser desencadeada': () => `ao ser desencadeada:`,
    queimar: (item) =>`[queimar] ${colorMark(item.value)}`,
    ['ao ser colocado na linha do tempo']: () => `ao ser colocado na ${keyword('Linha do Tempo')}`,
    escolha: (item) =>
      item.value > 1
        ? `${colorMark(`escolha ${item.value} ou mais:`)}`
        : colorMark('escolha um:'),
    ['se você [previously]']: (item) => `se você [previously] com sucesso então`,
    ['esta rodada']: (item) =>`esta ${colorMark('rodada')}`,
    ['suas cartas ganham']: (item) => {
      const plural = pluralize(item.value.targetCard);
      if (item.value.targetCard === 'ataque') {
        return `seus ${keyword('ataques')} ganham:`;
      }
      return `, suas ${keyword(plural)} ganham:`;
    },
    ['sendo x igual a']: (item) => `sendo ${colorMark('X')} igual a`,
    ['esta carta só tem efeito se']: (item) =>
      colorMark('esta carta só tem efeito se'),
    ['a próxima algo']: (item) => {
      const target = item.value.targetPlayer;
      let targetText = 'qualquer jogador';
    
      if (target === 'self') {
        targetText = colorMark('você');
      } else if (target === 'enemy') {
        targetText = colorMark('seu oponente');
      } else {
        targetText = colorMark(targetText);
      }
    
      let firstWords = 'a próxima';
    
      return buscarInformacoesPalavra(item.value.targetCard).then((res) => {
        if (res.genero === 'm.') firstWords = 'o próximo';
        const nomeCarta = colorMark(item.value.targetCard);
        return `${firstWords} ${nomeCarta} que ${targetText} desencadear`;
      });
    },
    ['dano extra']: (item) => {
      if (item.value < 0)
        return `[causar] ${colorMark(`${item.value * -1} de dano a menos`)}`;
      else
        return `[causar] ${colorMark(`${item.value} de dano extra`)}`;
    },
    
    ['se tiver mais']: (item) => {
      const target = item.value.targetPlayer;
      let targetText = 'qualquer jogador';
      let lastText = '';
    
      if (target === 'self') {
        targetText = colorMark('você');
        lastText = colorMark('seu oponente');
      } else if (target === 'enemy') {
        targetText = colorMark('seu oponente');
        lastText = colorMark('você');
      }
    
      const carta = colorMark(item.value.targetCard);
    
      return `se ${targetText} tiver mais ${carta} que ${lastText} na ${keyword('Linha do Tempo')}então`;
    },
    
    input: (item) => `${item.value}`,
    
    ['se']: (item) => colorMark('se'),
    
    ['revelar mão']: (item) => {
      const strength = item.value.str;
      const target = item.value.targetPlayer === 'self'
        ? colorMark('sua mão')
        : colorMark('mão do oponente');
    
      if (strength <= 0) return `[revelar] a ${target}`;
    
      const qtd = colorMark(`${strength === 1 ? 'uma' : strength}`);
      const tipo = colorMark(`${strength > 1 ? 'cartas' : 'carta'}`);
    
      return `[revelar] ${qtd} ${tipo} da ${target}`;
    },
    
    ['alvo ganha uma aura']: (item) => {
      const target = item.value === 'self'
        ? colorMark('você')
        : color
    },
};

function aplicarConjugacoes(texto, conjugar) {
  return texto.replace(/\[([^\]]+)\]/g, (match, verbo, offset) => {

    if(verbo === 'previously') {
      const lastVerb = capturarUltimoVerboAntesDePreviously(texto);
      const verbo = lastVerb
      const conjugacoes = conjugar(verbo);
      return conjugacoes.indicativo.preterito.ele; // causa → cause
    }


    const conjugacoes = conjugar(verbo);

    const isUpperCaseVerb = verbo === verbo.toUpperCase()

    // Verifica se o verbo está no início da string ou após pontuação
    const anterior = texto.slice(0, offset).replace(/<[^>]*>/g, '').trim().trim();
    const isInicioFrase = anterior === '' || /[.!?:]\s*$/.test(anterior);

    const isDepoisDeSe = /se\s*$/.test(anterior);
    const isDepoisDeEntao = /então\s*$/.test(anterior);

    const isDepoisDeDesencadear = /desencadear\s*$/.test(anterior);
    const isDepoisDeSeSeuOponente = /se seu oponente\s*$/.test(anterior);
    const isDepoisDeJogador = /jogador\s*$/.test(anterior);
    const isDepoisDeSeVerbo = /se\s+\[[^\]]+\]\s*$/.test(anterior);
    const isDepoisDeQue = /que\s*$/.test(anterior);
    const isDepoisDeVerbo = /\[\s*[^\]]+\s*\]\s*$/.test(anterior);
    const isDepoisDeAlvo = /[^\s]+\s*-alvo\s+.+$/.test(anterior);
    const isVerboDepoisDeOutroVerbo = /\[\s*[^\]]+\s*\]\s*(,\s*)?(e\s+)?\[\s*[^\]]+\s*\]\s*$/.test(anterior);

    let result 

    switch (true) {
      case isInicioFrase:
        console.log(verbo + " → Conjugando como início de frase (subjuntivo presente - eu)");
        result = conjugacoes.subjuntivo.presente.eu; // Ex: causar → cause
        break
      case isDepoisDeEntao:
        console.log(verbo + " → Conjugando após 'então' (subjuntivo presente - eu)");
        result = conjugacoes.subjuntivo.presente.eu;
        break
      case isDepoisDeDesencadear:
        console.log(verbo + " → Conjugando após 'desencadear' (indicativo futuro - ele)");
        result = conjugacoes.indicativo.futuro.ele; // Ex: causar → causará
        break
      case isDepoisDeSe:
      case isDepoisDeJogador:
      case isDepoisDeQue:
        console.log(verbo + " → Conjugando após 'se' (subjuntivo futuro - eu)");
        result = conjugacoes.subjuntivo.futuro.eu; // Ex: tomar → tomar
        break
      case isDepoisDeAlvo:
        console.log(verbo + " → Conjugando após 'alvo' (indicativo presente - ele)");
        result = conjugacoes.indicativo.presente.ele; // Ex: tomar → ganha
        break
      case isDepoisDeVerbo:
      
        console.log(verbo + " → Conjugando após outro verbo (particípio)");
        result = conjugacoes.formasNominais.particípio; // Ex: tomar → tomado
        break
      case isVerboDepoisDeOutroVerbo:        
        console.log(verbo + " → Verbo depois de outro verbo (particípio)");
        result = conjugacoes.formasNominais.particípio;
        break
      case isDepoisDeSeSeuOponente:
        console.log(verbo + " → Verbo depois de se seu oponente (preterito)");
        result = conjugacoes.indicativo.preterito.ele // Ex: tomar- tomou
        break
      default:
        console.log(verbo + " → Caso padrão (fallback para subjuntivo presente - eu)");
        result = conjugacoes.subjuntivo.presente.eu;
        break
    }

    return isUpperCaseVerb ? result.toUpperCase() : result;
    
  });
}

function capturarUltimoVerboAntesDePreviously(texto) {
  const index = texto.indexOf('[previously]');
  if (index === -1) return null;

  const antes = texto.slice(0, index);
  const verbos = [...antes.matchAll(/\[([^\]]+)\]/g)].map(match => match[1]);

  return verbos.length > 0 ? verbos[verbos.length - 1] : null;
}


export const analysis = async (array, setTextString) => {

  const effects = convertInputArrayToAUsableFormat(array);

  let result = [];

  for (const effectsGroup of effects) {
    let text = '';
    for (const item of effectsGroup) {
      const formatter = formatters[item.type];
      if (!formatter) {
        console.warn(`Tipo "${item.type}" não reconhecido.`);
        continue;
      }
      const part = formatter(item);
      // Se retornar uma Promise (async), aguardamos
      const space = item.type === 'explanation' ? '' : ' '
      text += space + (part instanceof Promise ? await part : part);
    }
  
    // check if the last character is a :
    if (!text.replace(/<[^>]*>/g, '').trim().endsWith(':') && !text.replace(/<[^>]*>/g, '').trim().endsWith(')')) text += '.</br></br>';
    if(text.replace(/<[^>]*>/g, '').trim().endsWith(':')){
      text+='</br>'
    }


    function adicionarPontoAntesSpanCinzaTodasOcorrenciasJS_Generico(textoHtml) {
      // Padrão regex para o conteúdo do span cinza:
      // \(  -> Corresponde a um parêntese de abertura literal
      // [^)]* -> Corresponde a qualquer caractere EXCEÇÃO a um parêntese de fechamento, zero ou mais vezes
      // \)  -> Corresponde a um parêntese de fechamento literal
      const conteudoGenericoSpanCinza = '\\([^)]*\\)'; 
      
      // Constrói a regex para o span cinza completo, com o conteúdo genérico e a flag 'g' para todas as ocorrências.
      const spanRegex = new RegExp(`(<span style="color:grey; !important; font-size: 0.6rem; display:inline-block">${conteudoGenericoSpanCinza}</span>)`, 'g');
  
      const textoHtmlModificado = textoHtml.replace(spanRegex, (fullMatch, capturedSpan, offset, originalString) => {
          const textoAntesDoSpanAtual = originalString.substring(0, offset);
          const textoVisivelAntes = textoAntesDoSpanAtual.replace(/<[^>]*>/g, '').trim();
          
          if (textoVisivelAntes.length > 0 && !textoVisivelAntes.endsWith('.')) {
              return '.' + capturedSpan + '</br>';
          } else {
              return capturedSpan + '</br>';
          }
      });
  
      return textoHtmlModificado;
  }

    text = adicionarPontoAntesSpanCinzaTodasOcorrenciasJS_Generico(text)

    // Check if result[0] exist 
    if(result[0] && result[0].replace(/<[^>]*>/g, '').trim().endsWith(':')){
      text = `<ul><li style="margin-left: 1em;">● ${text}</li></ul>`;
    }

    function substituirTags(texto) {
      // Substitui <cor>...</cor> por colorMark('...')
      texto = texto.replace(/<cor>(.*?)<\/cor>/g, (match, p1) => {
        return colorMark(p1);
      });
    
      // Substitui <especial>...</especial> por keyword('...')
      texto = texto.replace(/<especial>(.*?)<\/especial>/g, (match, p1) => {
        return keyword(p1);
      });

      // Substitui <especial>...</especial> por keyword('...')
      texto = texto.replace(/<i>(.*?)<\/i>/g, (match, p1) => {
        return italic(p1);
      });
    
      return texto;
    }

    text = substituirTags(text)


    text = aplicarConjugacoes(text, conjugar);

    result.push(formatText(text));
  }
  
    // LIMPA OS <br> APENAS DA ÚLTIMA FRASE
    if (result.length > 0) {
      result[result.length - 1] = result[result.length - 1].replace(/(<br\s*\/?>|<\/br>)+\s*$/gi, '');
    }


    
  // Adiciona o resultado ao estado
  setTextString(result.join(' '));
  
};
