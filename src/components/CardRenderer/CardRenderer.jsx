import React from "react";

/**
 * CardRenderer
 * - Renderiza camadas em ordem.
 * - Cada layer pode ser:
 *   { type: "image", url, width, height, pos_x, pos_y }
 *   { type: "span", span, pos_x, pos_y }
 */

const backgroundInSquares = {
  backgroundColor: '#c5c5c5',
  backgroundImage:
    'repeating-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff),' +
    'repeating-linear-gradient(45deg, #ffffff 25%, #c5c5c5 25%, #c5c5c5 75%, #ffffff 75%, #ffffff)',
  backgroundPosition: '0 0, 15px 15px',
  backgroundSize: '30px 30px'
};

export default function CardRenderer({ width = 744, height = 1039, layers = [] }) {
    if(layers === null) {
        return <div style={{ width, height, ...backgroundInSquares, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#75302f", fontSize: '55px'}}>No layers to render</span>
        </div>;
    }
    return (
        <div style={{ position: "relative", width, height, ...backgroundInSquares, overflow: "hidden" }}>
        {layers.map((layer, i) => {
            const commonStyle = {
            position: "absolute",
            left: layer.pos_x || 0,
            top: layer.pos_y || 0,
            };

            if (layer.type === "image") {
            return (
                <img
                key={i}
                src={layer.content}
                alt=""
                style={{ ...commonStyle, width: layer.width, height: layer.height }}
                />
            );
            }

            if (layer.type === "span") {
            return (
                <div key={i} style={commonStyle}>
                {layer.content}
                </div>
            );
            }

            return null;
        })}
        </div>
    );
}   
