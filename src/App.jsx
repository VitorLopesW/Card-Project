import { useState, useMemo, useRef } from 'react'
import './App.css'
import CardRenderer from './components/CardRenderer/CardRenderer.jsx'
import Models from './models/models.jsx'

// libs de exportação
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const { Text, Image } = Models

const CARD_HEIGHT = 1039
const CARD_WIDTH = 744

export default function App() {
  const cards = [
    [
      new Image({ url: '/images/eu.jpg', size: ['100%', '100%'], max: [CARD_WIDTH, CARD_HEIGHT] }),
      new Text({
        html: "<span style='color:white;font-weight:700'>Meuw Título</span>",
        size: ['80%', 120],
        max: [CARD_WIDTH, CARD_HEIGHT],
        pos: [0, 0],
        smartProps: { centerText: true, minFontSize: 10, maxFontSize: 40 }
      }),
    ].reverse(),
    [
      new Image({ url: '/images/eu.jpg', size: ['100%', '100%'], max: [CARD_WIDTH, CARD_HEIGHT] }),
      new Text({
        html: "<span style='color:white;font-weight:700'>Meu Título 22222</span>",
        size: ['80%', 120],
        max: [CARD_WIDTH, CARD_HEIGHT],
        pos: [0, 0],
        smartProps: { centerText: true, minFontSize: 10, maxFontSize: 40 }
      }),
    ],
    [
      new Image({ url: '/images/eu.jpg', size: ['100%', '100%'], max: [CARD_WIDTH, CARD_HEIGHT] }),
      new Text({
        html: "<span style='color:white;font-weight:700'>Meu Títul2o 22222</span>",
        size: ['80%', 120],
        max: [CARD_WIDTH, CARD_HEIGHT],
        pos: [0, 0],
        smartProps: { centerText: true, minFontSize: 10, maxFontSize: 40 }
      }),
    ]
  ]

  // ---- estado
  const [index, setIndex] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const cardRef = useRef(null)

  const nextCard = () => setIndex(i => (i + 1) % cards.length)
  const prevCard = () => setIndex(i => (i - 1 + cards.length) % cards.length)

  // helper para injetar um índice visível na carta
  const makeIndexedLayers = (layers, i) => {
    const base = layers?.slice() ?? []
    base.push(
      new Text({
        html: `<span style='color:white;font-weight:600;background:rgba(0,0,0,0.5);padding:6px 10px;border-radius:8px'>
                ${i + 1} / ${cards.length}
              </span>`,
        size: [180, 40],
        max: [CARD_WIDTH, CARD_HEIGHT],
        pos: [0, 200], // ajustável
        smartProps: { centerText: true, minFontSize: 10, maxFontSize: 22 }
      })
    )
    return base
  }

  // carta atual com índice
  const layersWithIndex = useMemo(
    () => makeIndexedLayers(cards[index], index),
    [cards, index]
  )

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  const exportAllAsZip = async () => {
    if (exporting) return
    setExporting(true)
    setProgress(0)

    const zip = new JSZip()

    for (let i = 0; i < cards.length; i++) {
      // mostra a carta i na tela
      setIndex(i)

      // aguarda 4s para garantir imagem/fontes/smartText renderizados
      await sleep(4000)

      const node = cardRef.current
      if (!node) continue

      // captura em alta resolução e com fundo transparente
      const canvas = await html2canvas(node, {
        useCORS: true,           // importante se usar imagens externas
        backgroundColor: null,   // PNG com transparência
        scale: 2,                // dobra a resolução do DOM (opcional)
        logging: false
      })

      const dataUrl = canvas.toDataURL('image/png')
      const base64 = dataUrl.split(',')[1]
      const filename = `card_${String(i + 1).padStart(2, '0')}.png`

      zip.file(filename, base64, { base64: true })
      setProgress(i + 1)
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'cards.zip')
    setExporting(false)
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <button onClick={prevCard}>◀ Anterior</button>
        <button onClick={nextCard}>Próximo ▶</button>
        <span style={{ marginLeft: 8 }}>Índice atual: {index} (0-based)</span>

        <button
          onClick={exportAllAsZip}
          disabled={exporting}
          style={{ marginLeft: 'auto' }}
          title="Exporta cada carta com 4s de intervalo e baixa um .zip"
        >
          {exporting ? `Exportando ${progress}/${cards.length}…` : 'Exportar PNGs (ZIP)'}
        </button>
      </div>

      {/* Wrapper com ref para o html2canvas capturar exatamente a carta */}
      <div
        ref={cardRef}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          position: 'relative',
          // opcional: visual de fundo quadriculado para inspeção (não sai no PNG porque backgroundColor=null)
          // backgroundImage: 'repeating-linear-gradient(45deg, #eee 0 10px, #fff 10px 20px)'
        }}
      >
        <CardRenderer width={CARD_WIDTH} height={CARD_HEIGHT} layers={layersWithIndex} />
      </div>
    </div>
  )
}
