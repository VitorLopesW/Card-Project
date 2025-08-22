// CardBase.jsx — Generic Layer-Driven Card Renderer (no Firebase)
// Paradigma 100% por LAYERS: imagem > texto > imagem > máscara, etc.
// Você define uma lista ordenada e o componente renderiza na ordem dada (ou com zIndex opcional).

import React, { useEffect, useRef, forwardRef } from 'react';

// Utilitário: resolve valores que podem ser funções (v = (ctx) => any) ou literais
const resolve = (v, ctx) => (typeof v === 'function' ? v(ctx) : v);

// Canvas para camadas de "máscara + cor" (destination-in)
function CanvasMask({ maskSrc, color = '#000', width, height, zIndex = 1, opacity = 1, crossOrigin = 'anonymous' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !maskSrc || !width || !height) return;

    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;

    img.onload = () => {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(img, 0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };

    img.onerror = () => {
      if (canvas?.style) canvas.style.display = 'none';
    };

    img.src = maskSrc;
  }, [maskSrc, color, width, height, opacity, crossOrigin]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex, pointerEvents: 'none' }}
    />
  );
}

/**
 * CardBase — renderer baseado em um array de layers.
 *
 * Props:
 * - width, height: dimensão fixa do card (px)
 * - layers: Array ordenada de camadas. Cada camada pode ser:
 *   {
 *     id: string,
 *     kind: 'image' | 'mask' | 'color' | 'text',
 *     // comuns
 *     zIndex?: number,
 *     when?: boolean | (ctx) => boolean,          // condicional
 *     pointerEvents?: 'none' | 'auto',
 *     mixBlendMode?: string,                      // ex: 'multiply' (para <img> ou <div> color)
 *     // IMAGE
 *     src?: string | (ctx) => string,
 *     objectFit?: 'cover' | 'contain',
 *     crossOrigin?: 'anonymous' | '',
 *     // MASK (cor * máscara)
 *     maskSrc?: string | (ctx) => string,        // ou usar src
 *     color?: string | (ctx) => string,          // default card.color
 *     opacity?: number | (ctx) => number,        // 0..1
 *     // COLOR (overlay sólido sem máscara)
 *     background?: string | (ctx) => string,
 *     alpha?: number | (ctx) => number,          // 0..1
 *     // TEXT
 *     box?: { x: number, y: number, w: number, h: number } | (ctx) => ({x,y,w,h}),
 *     component?: React.ComponentType<any>,       // ex.: SmartText
 *     props?: object | (ctx) => object,           // props para o component
 *     style?: object | (ctx) => object,           // estilo extra
 *     text?: string | (ctx) => string,            // fallback se component não for passado
 *   }
 * - card: objeto livre com dados da carta
 * - innerBorder?: { px?: number, color?: string, radius?: number }
 * - background?: string (cor/fundo do container)
 */
export const CardBase = forwardRef(function CardBase(
  { width = 744, height = 1039, layers = [], card = {}, innerBorder, background, style, className },
  ref
) {
  const ctx = { card, width, height };

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', width, height, overflow: 'hidden', background: background || 'transparent', borderRadius: innerBorder?.radius ?? 0, ...style }}
    >
      {layers.map((layer, i) => {
        if (!layer) return null;
        const show = resolve(layer.when ?? true, ctx);
        if (!show) return null;
        const z = layer.zIndex ?? i + 1;
        const pe = layer.pointerEvents || 'none';
        const blend = layer.mixBlendMode;

        // IMAGE
        if (layer.kind === 'image') {
            console.log('aqui')
          const src = resolve(layer.src, ctx);
          if (!src) return null;
          const objectFit = layer.objectFit || 'cover';
          const crossOrigin = layer.crossOrigin ?? 'anonymous';
          return (
            <img
              key={layer.id || i}
              src={src}
              alt={layer.id || 'image-layer'}
              crossOrigin={crossOrigin || undefined}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit, zIndex: z, pointerEvents: pe, mixBlendMode: blend }}
            />
          );
        }

        // MASK (color * mask)
        if (layer.kind === 'mask') {
          const maskSrc = resolve(layer.maskSrc ?? layer.src, ctx);
          if (!maskSrc) return null;
          const color = resolve(layer.color ?? card.color ?? '#000', ctx);
          const opacity = resolve(layer.opacity ?? 1, ctx);
          return (
            <CanvasMask
              key={layer.id || i}
              maskSrc={maskSrc}
              color={color}
              width={width}
              height={height}
              zIndex={z}
              opacity={opacity}
            />
          );
        }

        // COLOR overlay sólido
        if (layer.kind === 'color') {
          const bg = resolve(layer.background, ctx) ?? '#000';
          const alpha = resolve(layer.alpha ?? 1, ctx);
          return (
            <div
              key={layer.id || i}
              style={{ position: 'absolute', inset: 0, zIndex: z, pointerEvents: pe, background: bg, opacity: alpha, mixBlendMode: blend }}
            />
          );
        }

        // TEXT
        if (layer.kind === 'text') {
          const box = resolve(layer.box, ctx) || { x: 0, y: 0, w: width, h: height };
          const Comp = layer.component || 'div';
          const layerProps = resolve(layer.props, ctx) || {};
          const extraStyle = resolve(layer.style, ctx) || {};
          const baseStyle = { position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, zIndex: z, pointerEvents: pe, mixBlendMode: blend };

          // Se o componente for SmartText, injeta width/height padrão se não vierem nos props
          const maybeSmartProps = { ...layerProps };
          if (layer.component && (maybeSmartProps.width == null || maybeSmartProps.height == null)) {
            maybeSmartProps.width = maybeSmartProps.width ?? box.w;
            maybeSmartProps.height = maybeSmartProps.height ?? box.h;
          }

          // Se for um elemento simples, usa `text` como children
          if (Comp === 'div') {
            const txt = resolve(layer.text, ctx) ?? '';
            return (
              <div key={layer.id || i} style={{ ...baseStyle, ...extraStyle }}>
                {txt}
              </div>
            );
          }

          return (
            <Comp key={layer.id || i} {...maybeSmartProps} style={{ ...baseStyle, ...(maybeSmartProps.style || {}), ...extraStyle }} />
          );
        }

        return null;
      })}

      {innerBorder?.px ? (
        <div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999, boxSizing: 'border-box', border: `${innerBorder.px}px solid ${innerBorder.color || '#fff'}`, borderRadius: innerBorder.radius ?? 'inherit' }}
        />
      ) : null}
    </div>
  );
});

export default CardBase;

// ---------------------------------------------------
// App.jsx — Exemplo de uso com LAYERS (imagem > máscara > imagem > texto)
// Observação: SmartText/TextSmith ficam fora deste arquivo. Você só importa e usa.

/*
import React from 'react';
import CardBase from './components/cardCreator/CardBase.jsx';
import { SmartText } from './components/cardCreator/SmartText/SmarText.jsx';

const layers = [
  // Arte de fundo
  { id: 'artA', kind: 'image', src: ({ card }) => card.artA, objectFit: 'cover' },

  // Máscara colorida por baixo do frame
  { id: 'underColor', kind: 'mask', src: '/frames/WB_CARD_V2_UNDER_COLOR.png', color: ({ card }) => card.color, opacity: 1 },

  // Frame branco por cima
  { id: 'frameWhite', kind: 'image', src: '/frames/WB_CARD_V2_WHITE.png', objectFit: 'contain' },

  // Ícone por tipo (condicional via `when`)
  { id: 'iconAttack', kind: 'mask', src: '/frames/WB_CARD_V2_ICON_ATTACK.png', when: ({ card }) => card.type === 'ATAQUE', color: ({ card }) => card.color },
  { id: 'iconSkill',  kind: 'mask', src: '/frames/WB_CARD_V2_ICON_SKILL.png',  when: ({ card }) => card.type === 'TECNICA', color: ({ card }) => card.color },
  { id: 'iconAura',   kind: 'mask', src: '/frames/WB_CARD_V2_ICON_AURA.png',   when: ({ card }) => card.type === 'AURA',   color: ({ card }) => card.color },

  // Arte por cima (glow, efeitos, etc.)
  { id: 'artO', kind: 'image', src: ({ card }) => card.artO, objectFit: 'cover', zIndex: 90 },

  // Título (SmartText), com caixa de layout (box)
  {
    id: 'title',
    kind: 'text',
    box: ({ width }) => ({ x: 28, y: 22, w: width - 56, h: 42 }),
    component: SmartText,
    props: ({ card }) => ({
      text: card.name,
      minFontSize: 12,
      maxFontSize: 36,
      lineHeight: 1.05,
      centerText: true,
      textStyle: { fontWeight: 800, textTransform: 'uppercase' },
    }),
    zIndex: 95,
  },
];

const card = {
  name: 'Fire Nova',
  type: 'ATAQUE',
  color: '#ff3a00',
  artA: '/images/eu.jpg',
  artO: '/images/eu.jpg',
};

export default function App() {
  return (
    <CardBase
      width={744}
      height={1039}
      card={card}
      layers={layers}
      innerBorder={{ px: 12, color: '#fff', radius: 28 }}
      background="transparent"
    />
  );
}
*/
