import pluralize from 'pluralize-ptbr';

export const verbosIrregulares = [
    'abster', 'acudir', 'adequar', 'aderir', 'adjazer', 'advertir', 'advir', 'afazer', 'aferir', 'agredir',
    'ansiar', 'antedar', 'antepor', 'antever', 'apor', 'aprazer', 'apropinquar', 'aspergir', 'assentir', 'ater',
    'atrair', 'atribuir', 'auferir', 'autodestruir', 'avir', 'bem-dizer', 'bem-fazer', 'bem-querer', 'bendizer',
    'benfazer', 'benquerer', 'buir', 'bulir', 'caber', 'cair', 'cerzir', 'circumpor', 'circunver', 'cobrir',
    'compelir', 'competir', 'compor', 'comprazer', 'concernir', 'concluir', 'condizer', 'conferir', 'confugir',
    'conseguir', 'consentir', 'construir', 'consumir', 'conter', 'contradizer', 'contrafazer', 'contrair',
    'contrapor', 'contrapropor', 'contravir', 'convergir', 'convir', 'crer', 'cuspir', 'dar', 'decompor',
    'deferir', 'delinquir', 'denegrir', 'depor', 'desafazer', 'desaguar', 'desapor', 'desaprazer', 'desavir',
    'descaber', 'descobrir', 'descompor', 'descomprazer', 'desconstruir', 'desconvir', 'descrer', 'desdar',
    'desdizer', 'desimpedir', 'desimpor', 'deslinguar', 'desmedir', 'desmentir', 'desmobiliar', 'despedir',
    'despir', 'despolir', 'despor', 'desprazer', 'desprecaver', 'desprover', 'desquerer', 'dessaber', 'destruir',
    'desvaler', 'desver', 'deter', 'devir', 'diferir', 'digerir', 'disferir', 'disperder', 'dispor', 'distrair',
    'divergir', 'divertir', 'dizer', 'dormir', 'embair', 'emergir', 'encobrir', 'engolir', 'entredizer',
    'entrefazer', 'entreouvir', 'entrepor', 'entrequerer', 'entrever', 'entrevir', 'entupir', 'enxaguar',
    'enxerir', 'equivaler', 'escapulir', 'esfazer', 'estar', 'estrear', 'esvair', 'expedir', 'expelir', 'expor',
    'extrapor', 'fazer', 'ferir', 'flectir', 'fletir', 'fotocompor', 'fraguar', 'frigir', 'fugir', 'gelifazer',
    'gerir', 'haver', 'idear', 'imergir', 'impedir', 'impelir', 'impor', 'incendiar', 'indeferir', 'indispor',
    'inferir', 'influir', 'ingerir', 'insatisfazer', 'inserir', 'interdizer', 'intermediar', 'interpor',
    'interver', 'intervir', 'investir', 'ir', 'jazer', 'justapor', 'ler', 'liquefazer', 'maisquerer', 'maldispor',
    'maldizer', 'malfazer', 'malinguar', 'malparir', 'malquerer', 'manter', 'mediar', 'medir', 'mentir', 'minguar',
    'obter', 'obvir', 'odiar', 'opor', 'ouvir', 'parir', 'pedir', 'perder', 'perfazer', 'perseguir', 'persentir',
    'pleitear', 'poder', 'poer', 'polir', 'pospor', 'pôr', 'prazer', 'predispor', 'predizer', 'preferir', 'prepor',
    'pressentir', 'pressupor', 'preterir', 'prevenir', 'prever', 'proferir', 'progredir', 'propor', 'prosseguir',
    'prossupor', 'prover', 'provir', 'pruir', 'puir', 'putrefazer', 'querer', 'raer', 'rarefazer', 'readequar',
    'reaver', 'reavir', 'recobrir', 'recompor', 'reconvir', 'redar', 'redispor', 'redizer', 'reexpedir', 'reexpor',
    'refazer', 'referir', 'refletir', 'refugir', 'regredir', 'reimpor', 'reindispor', 'reinserir', 'reler',
    'remediar', 'remedir', 'reobter', 'reouvir', 'repedir', 'repelir', 'repetir', 'repor', 'repropor', 'requerer',
    'resfolegar', 'ressentir', 'reter', 'retrair', 'retranspor', 'rever', 'revestir', 'revir', 'rir', 'ruir',
    'saber', 'sacudir', 'sair', 'santiguar', 'satisfazer', 'seguir', 'sentir', 'ser', 'servir', 'sobpor',
    'sobre-expor', 'sobreexpor', 'sobrepor', 'sobrestar', 'sobrevir', 'sorrir', 'sortear', 'sortir', 'sotopor',
    'subir', 'submergir', 'subpor', 'subsumir', 'subtrair', 'sugerir', 'sumir', 'superexpor', 'superimpor',
    'superpor', 'supor', 'suster', 'telever', 'ter', 'torrefazer', 'tossir', 'trair', 'transfazer', 'transferir',
    'transfugir', 'transgredir', 'transpor', 'traspor', 'trazer', 'treler', 'tresler', 'trespor', 'tumefazer',
    'valer', 'ver', 'vestir', 'vir'
  ];
  
const verbosIrregularesDefinidos = {
  ter: {
    indicativo: {
      presente: {
        eu: 'tenho', tu: 'tens', ele: 'tem', ela: 'tem',
        'a gente': 'temos', nós: 'temos', vós: 'tendes',
        eles: 'têm', elas: 'têm'
      },
      preterito: {
        eu: 'tive', tu: 'tiveste', ele: 'teve', ela: 'teve',
        'a gente': 'tivemos', nós: 'tivemos', vós: 'tivestes',
        eles: 'tiveram', elas: 'tiveram'
      },
      imperfeito: {
        eu: 'tinha', tu: 'tinhas', ele: 'tinha', ela: 'tinha',
        'a gente': 'tínhamos', nós: 'tínhamos', vós: 'tínheis',
        eles: 'tinham', elas: 'tinham'
      },
      futuro: {
        eu: 'terei', tu: 'terás', ele: 'terá', ela: 'terá',
        'a gente': 'teremos', nós: 'teremos', vós: 'tereis',
        eles: 'terão', elas: 'terão'
      },
      futuroPret: {
        eu: 'teria', tu: 'terias', ele: 'teria', ela: 'teria',
        'a gente': 'teríamos', nós: 'teríamos', vós: 'teríeis',
        eles: 'teriam', elas: 'teriam'
      }
    },
    subjuntivo: {
      presente: {
        eu: 'tenha', tu: 'tenhas', ele: 'tenha', ela: 'tenha',
        'a gente': 'tenhamos', nós: 'tenhamos', vós: 'tenhais',
        eles: 'tenham', elas: 'tenham'
      },
      imperfeito: {
        eu: 'tivesse', tu: 'tivesses', ele: 'tivesse', ela: 'tivesse',
        'a gente': 'tivéssemos', nós: 'tivéssemos', vós: 'tivésseis',
        eles: 'tivessem', elas: 'tivessem'
      },
      futuro: {
        eu: 'tiver', tu: 'tiveres', ele: 'tiver', ela: 'tiver',
        'a gente': 'tivermos', nós: 'tivermos', vós: 'tiverdes',
        eles: 'tiverem', elas: 'tiverem'
      }
    },
    imperativo: {
      afirmativo: {
        tu: 'tem', ele: 'tenha', ela: 'tenha', nós: 'tenhamos',
        vós: 'tende', eles: 'tenham', elas: 'tenham'
      },
      negativo: {
        tu: 'não tenhas', ele: 'não tenha', ela: 'não tenha', nós: 'não tenhamos',
        vós: 'não tenhais', eles: 'não tenham', elas: 'não tenham'
      }
    },
    formasNominais: {
      infinitivoImpessoal: 'ter',
      infinitivoPessoal: {
        eu: 'ter', tu: 'teres', ele: 'ter', ela: 'ter',
        nós: 'termos', vós: 'terdes', eles: 'terem', elas: 'terem'
      },
      gerundio: 'tendo',
      particípio: 'tido'
    }
  }
};
  

  /**
 * Fetches and processes linguistic information for a given Portuguese word from Dicionário Aberto API.
 * 
 * @async
 * @function buscarInformacoesPalavra
 * @param {string} palavra - The Portuguese word to search for information.
 * @returns {Promise<Object>} An object containing the word's information:
 *   @returns {string} palavra - The formal orthography of the word.
 *   @returns {string} classeGramatical - The grammatical class of the word.
 *   @returns {string} definicao - The definition of the word.
 *   @returns {string} etimologia - The etymology information of the word.
 *   @returns {string} plural - The plural form of the word.
 *   @returns {string} [erro] - Error message if the operation failed.
 * @throws Will return an object with an error message if the API request fails.
 */
export async function buscarInformacoesPalavra(palavra) {
    const endpoint = `https://api.dicionario-aberto.net/word/${encodeURIComponent(palavra)}`;
    try {
      const resposta = await fetch(endpoint);
      if (!resposta.ok) throw new Error('Erro na requisição');
  
      const dados = await resposta.json();
      if (!dados.length) return { erro: 'Palavra não encontrada' };
  
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dados[0].xml, 'application/xml');
  
      const grafia = xmlDoc.querySelector('orth')?.textContent || '';
      const genero = xmlDoc.querySelector('gramGrp')?.textContent || '';
      const definicao = xmlDoc.querySelector('def')?.textContent || '';
      const etimologia = xmlDoc.querySelector('etym')?.textContent || '';
  
      // Gerar plural usando a biblioteca
      let plural = '';
      try {
        plural = pluralize(grafia);
      } catch (e) {
        plural = ''; // fallback se erro
        console.warn(`Erro ao pluralizar "${grafia}": ${e.message}`);
      }
  
      return {
        palavra: grafia,
        genero,
        definicao,
        etimologia,
        plural,
        //conjugacoes: conjugar(palavra)
      };
    } catch (erro) {
      return { erro: erro.message };
    }
  }

/*
export function conjugarVerboRegular(verbo) {
  const radical = verbo.slice(0, -2);
  const terminacao = verbo.slice(-2);

  const conjIndicativo = {
    ar: {
      presente:       ['o',    'as',   'a',    'amos',  'ais',   'am'],
      preterito:      ['ei',   'aste', 'ou',   'amos',  'astes', 'aram'],
      imperfeito:     ['ava',  'avas', 'ava',  'ávamos','áveis', 'avam'],
      futuro:         ['arei', 'arás', 'ará',  'aremos','areis', 'arão'],
      futuroPret:     ['aria', 'arias','aria', 'aríamos','aríeis','ariam'],
    },
    er: {
      presente:       ['o',    'es',   'e',    'emos',  'eis',   'em'],
      preterito:      ['i',    'este', 'eu',   'emos',  'estes', 'eram'],
      imperfeito:     ['ia',   'ias',  'ia',   'íamos', 'íeis',  'iam'],
      futuro:         ['erei', 'erás', 'erá',  'eremos','ereis', 'erão'],
      futuroPret:     ['eria', 'erias','eria', 'eríamos','eríeis','eriam'],
    },
    ir: {
      presente:       ['o',    'es',   'e',    'imos',  'is',    'em'],
      preterito:      ['i',    'iste', 'iu',   'imos',  'istes', 'iram'],
      imperfeito:     ['ia',   'ias',  'ia',   'íamos', 'íeis',  'iam'],
      futuro:         ['irei', 'irás', 'irá',  'iremos','ireis', 'irão'],
      futuroPret:     ['iria', 'irias','iria', 'iríamos','iríeis','iriam'],
    }
  };

  const conjSubjuntivo = {
    ar: {
      presente:       ['e',    'es',   'e',    'emos',  'eis',   'em'],
      imperfeito:     ['asse', 'asses','asse', 'ássemos','ásseis','assem'],
      futuro:         ['ar',   'ares', 'ar',   'armos', 'ardes', 'arem'],
    },
    er: {
      presente:       ['a',    'as',   'a',    'amos',  'ais',   'am'],
      imperfeito:     ['esse', 'esses','esse', 'êssemos','êsseis','essem'],
      futuro:         ['er',   'eres', 'er',   'ermos', 'erdes', 'erem'],
    },
    ir: {
      presente:       ['a',    'as',   'a',    'amos',  'ais',   'am'],
      imperfeito:     ['isse', 'isses','isse', 'íssemos','ísseis','issem'],
      futuro:         ['ir',   'ires', 'ir',   'irmos', 'irdes', 'irem'],
    }
  };

  const conjImperativo = {
    ar: {
      afirmativo: {
        tu:    radical + 'a',
        ele:   radical + 'e',
        nós:   radical + 'emos',
        vós:   radical + 'ai',
        eles:  radical + 'em',
      },
      negativo: {
        tu:    'não ' + radical + 'es',
        ele:   'não ' + radical + 'e',
        nós:   'não ' + radical + 'emos',
        vós:   'não ' + radical + 'eis',
        eles:  'não ' + radical + 'em',
      }
    },
    er: {
      afirmativo: {
        tu:    radical + 'e',
        ele:   radical + 'a',
        nós:   radical + 'amos',
        vós:   radical + 'ei',
        eles:  radical + 'am',
      },
      negativo: {
        tu:    'não ' + radical + 'as',
        ele:   'não ' + radical + 'a',
        nós:   'não ' + radical + 'amos',
        vós:   'não ' + radical + 'ais',
        eles:  'não ' + radical + 'am',
      }
    },
    ir: {
      afirmativo: {
        tu:    radical + 'e',
        ele:   radical + 'a',
        nós:   radical + 'amos',
        vós:   radical + 'i',
        eles:  radical + 'am',
      },
      negativo: {
        tu:    'não ' + radical + 'as',
        ele:   'não ' + radical + 'a',
        nós:   'não ' + radical + 'amos',
        vós:   'não ' + radical + 'ais',
        eles:  'não ' + radical + 'am',
      }
    }
  };

  const formasNominais = {
    infinitivoImpessoal: verbo,
    infinitivoPessoal: {
      eu:    verbo,
      tu:    verbo + 'es',
      ele:   verbo,
      ela:   verbo,
      nós:   verbo + 'mos',
      vós:   verbo + 'des',
      eles:  verbo + 'em',
      elas:  verbo + 'em',
    },
    gerundio:
    terminacao === 'ar'
      ? radical + 'ando'
      : terminacao === 'er'
      ? radical + 'endo'
      : radical + 'indo',
    particípio: radical + (terminacao === 'ar' ? 'ado' : 'ido')
  };

  const pronomes = ['eu', 'tu', 'ele', 'nós', 'vós', 'eles'];

  function construirModo(tabela) {
    const resultado = {};
    for (const [tempo, sufixos] of Object.entries(tabela)) {
      const conjugado = {};
      pronomes.forEach((pronome, i) => {
        conjugado[pronome] = radical + sufixos[i];
      });
      conjugado['ela'] = conjugado['ele'];
      conjugado['elas'] = conjugado['eles'];
      if (tempo === 'presente') conjugado['a gente'] = conjugado['nós'];
      resultado[tempo] = conjugado;
    }
    return resultado;
  }

  const grupoIndicativo = conjIndicativo[terminacao];
  const grupoSubjuntivo = conjSubjuntivo[terminacao];
  const grupoImperativo = conjImperativo[terminacao];

  if (!grupoIndicativo || !grupoSubjuntivo || !grupoImperativo) {
    throw new Error(`Terminação verbal "${terminacao}" não suportada.`);
  }

  return {
    indicativo: construirModo(grupoIndicativo),
    subjuntivo: construirModo(grupoSubjuntivo),
    imperativo: {
      afirmativo: {
        ...grupoImperativo.afirmativo,
        ela: grupoImperativo.afirmativo.ele,
        elas: grupoImperativo.afirmativo.eles,
      },
      negativo: {
        ...grupoImperativo.negativo,
        ela: grupoImperativo.negativo.ele,
        elas: grupoImperativo.negativo.eles,
      }
    },
    formasNominais
  };
}
*/
export function conjugarVerboRegular(verbo) {
  const radicalBruto = verbo.slice(0, -2);
  const terminacao = verbo.slice(-2);

  function ajustarRadical(radical, sufixo) {
    if ((radical.endsWith('c') && /^[e,i]/.test(sufixo))) {
      return radical.slice(0, -1) + 'qu';
    }
    if ((radical.endsWith('g') && /^[e,i]/.test(sufixo))) {
      return radical.slice(0, -1) + 'gu';
    }
    return radical;
  }

  const conjIndicativo = {
    ar: {
      presente:       ['o',    'as',   'a',    'amos',  'ais',   'am'],
      preterito:      ['ei',   'aste', 'ou',   'amos',  'astes', 'aram'],
      imperfeito:     ['ava',  'avas', 'ava',  'ávamos','áveis', 'avam'],
      futuro:         ['arei', 'arás', 'ará',  'aremos','areis', 'arão'],
      futuroPret:     ['aria', 'arias','aria', 'aríamos','aríeis','ariam'],
    },
    er: {
      presente:       ['o',    'es',   'e',    'emos',  'eis',   'em'],
      preterito:      ['i',    'este', 'eu',   'emos',  'estes', 'eram'],
      imperfeito:     ['ia',   'ias',  'ia',   'íamos', 'íeis',  'iam'],
      futuro:         ['erei', 'erás', 'erá',  'eremos','ereis', 'erão'],
      futuroPret:     ['eria', 'erias','eria', 'eríamos','eríeis','eriam'],
    },
    ir: {
      presente:       ['o',    'es',   'e',    'imos',  'is',    'em'],
      preterito:      ['i',    'iste', 'iu',   'imos',  'istes', 'iram'],
      imperfeito:     ['ia',   'ias',  'ia',   'íamos', 'íeis',  'iam'],
      futuro:         ['irei', 'irás', 'irá',  'iremos','ireis', 'irão'],
      futuroPret:     ['iria', 'irias','iria', 'iríamos','iríeis','iriam'],
    }
  };

  const conjSubjuntivo = {
    ar: {
      presente:       ['e',    'es',   'e',    'emos',  'eis',   'em'],
      imperfeito:     ['asse', 'asses','asse', 'ássemos','ásseis','assem'],
      futuro:         ['ar',   'ares', 'ar',   'armos', 'ardes', 'arem'],
    },
    er: {
      presente:       ['a',    'as',   'a',    'amos',  'ais',   'am'],
      imperfeito:     ['esse', 'esses','esse', 'êssemos','êsseis','essem'],
      futuro:         ['er',   'eres', 'er',   'ermos', 'erdes', 'erem'],
    },
    ir: {
      presente:       ['a',    'as',   'a',    'amos',  'ais',   'am'],
      imperfeito:     ['isse', 'isses','isse', 'íssemos','ísseis','issem'],
      futuro:         ['ir',   'ires', 'ir',   'irmos', 'irdes', 'irem'],
    }
  };

  const conjImperativo = {
    ar: {
      afirmativo: ['a', 'e', 'emos', 'ai', 'em'],
      negativo:   ['es', 'e', 'emos', 'eis', 'em'],
    },
    er: {
      afirmativo: ['e', 'a', 'amos', 'ei', 'am'],
      negativo:   ['as', 'a', 'amos', 'ais', 'am'],
    },
    ir: {
      afirmativo: ['e', 'a', 'amos', 'i', 'am'],
      negativo:   ['as', 'a', 'amos', 'ais', 'am'],
    }
  };

  const formasNominais = {
    infinitivoImpessoal: verbo,
    infinitivoPessoal: {
      eu:    verbo,
      tu:    verbo + 'es',
      ele:   verbo,
      ela:   verbo,
      nós:   verbo + 'mos',
      vós:   verbo + 'des',
      eles:  verbo + 'em',
      elas:  verbo + 'em',
    },
    gerundio:
      terminacao === 'ar' ? radicalBruto + 'ando'
      : terminacao === 'er' ? radicalBruto + 'endo'
      : radicalBruto + 'indo',
    particípio: radicalBruto + (terminacao === 'ar' ? 'ado' : 'ido')
  };

  const pronomes = ['eu', 'tu', 'ele', 'nós', 'vós', 'eles'];

  function construirModo(tabela, aplicarAjuste = false) {
    const resultado = {};
    for (const [tempo, sufixos] of Object.entries(tabela)) {
      const conjugado = {};
      pronomes.forEach((pronome, i) => {
        const sufixo = sufixos[i];
        const base = aplicarAjuste ? ajustarRadical(radicalBruto, sufixo) : radicalBruto;
        conjugado[pronome] = base + sufixo;
      });
      conjugado['ela'] = conjugado['ele'];
      conjugado['elas'] = conjugado['eles'];
      if (tempo === 'presente') conjugado['a gente'] = conjugado['nós'];
      resultado[tempo] = conjugado;
    }
    return resultado;
  }

  const grupoIndicativo = conjIndicativo[terminacao];
  const grupoSubjuntivo = conjSubjuntivo[terminacao];
  const grupoImperativoSufixos = conjImperativo[terminacao];

  if (!grupoIndicativo || !grupoSubjuntivo || !grupoImperativoSufixos) {
    throw new Error(`Terminação verbal "${terminacao}" não suportada.`);
  }

  const imperativoAfirma = {};
  const imperativoNegativo = {};
  const imperativoPronomes = ['tu', 'ele', 'nós', 'vós', 'eles'];

  imperativoPronomes.forEach((pronome, i) => {
    const sufixoAff = grupoImperativoSufixos.afirmativo[i];
    const sufixoNeg = grupoImperativoSufixos.negativo[i];
    const baseAff = ajustarRadical(radicalBruto, sufixoAff);
    const baseNeg = ajustarRadical(radicalBruto, sufixoNeg);
    imperativoAfirma[pronome] = baseAff + sufixoAff;
    imperativoNegativo[pronome] = 'não ' + baseNeg + sufixoNeg;
  });

  imperativoAfirma['ela'] = imperativoAfirma['ele'];
  imperativoAfirma['elas'] = imperativoAfirma['eles'];
  imperativoNegativo['ela'] = imperativoNegativo['ele'];
  imperativoNegativo['elas'] = imperativoNegativo['eles'];

  return {
    indicativo: construirModo(grupoIndicativo),
    subjuntivo: construirModo(grupoSubjuntivo, true), // <- aplicar correção ortográfica
    imperativo: {
      afirmativo: imperativoAfirma,
      negativo: imperativoNegativo
    },
    formasNominais
  };
}

  

export function isVerboIrregular(verbo) {
    return verbosIrregulares.includes(verbo.toLowerCase());
}

export function conjugar(verbo) {
  const verboLower = verbo.toLowerCase();

  if (verbosIrregularesDefinidos[verboLower]) {
    return verbosIrregularesDefinidos[verboLower];
  }

  if (isVerboIrregular(verboLower)) {
    throw new Error(`O verbo "${verbo}" é irregular e ainda não foi implementado.`);
  }

  return conjugarVerboRegular(verboLower);
}


  