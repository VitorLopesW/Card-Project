
import Models from './models.jsx'
const { Text, Image } = Models

const CARD_HEIGHT = 1039
const CARD_WIDTH = 744

const cards = [
      [
        new Image({ url: '/images/Azul.png', size: ['100%', '100%'], max: [CARD_WIDTH, CARD_HEIGHT] })
    ],
    
]


const cardsB = [
    [
      new Image({ url: '/images/eu.jpg', size: ['100%', '100%'], max: [CARD_WIDTH, CARD_HEIGHT] }),
      new Text({
        html: "<span style='color:white;font-weight:700'>Meuwfdts Título</span>",
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

export default cards