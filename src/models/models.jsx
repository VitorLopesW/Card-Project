import  { SmartText } from '../components/cardCreator/SmartText/SmarText.jsx'


class Dimension {
  constructor(value, max, name) {
    this.value = this.parse(value, max, name);
  }

  parse(value, max, name) {
    let result;

    if (typeof value === "number") {
      result = value;
    } else if (typeof value === "string" && value.endsWith("%")) {
      const percentage = parseFloat(value);
      if (isNaN(percentage)) {
        throw new Error(`Invalid ${name} percentage: ${value}`);
      }
      result = (percentage / 100) * max;
    } else {
      throw new Error(`Invalid ${name} value: ${value}`);
    }

    if (result > max) {
      console.warn(`⚠️ ${name} ${result} is larger than max (${max}).`);
    }
    return result;
  }
}

class Width extends Dimension {
  constructor(value, max) {
    super(value, max, "width");
  }
}

class Height extends Dimension {
  constructor(value, max) {
    super(value,max, "height");
  }
}

/**
 * Represents a visual layer in the card system.
 * 
 * @class
 * @param {string} type - The type of the layer (e.g., 'image', 'text').
 * @param {*} content - The content of the layer (could be a string, image source, etc.).
 * @param {number} width - The width of the layer.
 * @param {number} height - The height of the layer.
 * @param {number} [pos_x=0] - The x-position factor for the layer.
 * @param {number} [pos_y=0] - The y-position factor for the layer.
 * 
 * @property {string} type - The type of the layer.
 * @property {*} content - The content of the layer.
 * @property {number} width - The width of the layer.
 * @property {number} height - The height of the layer.
 * @property {number} pos_x - The computed x-position of the layer.
 * @property {number} pos_y - The computed y-position of the layer.
 */
class Layer {
    constructor({type, content, size = [0,0], max, pos= [0,0]}) {
      if (max === undefined) {
        throw new Error("Max dimensions must be provided for Layer.");
      }

      const [w, h] = size;
      const [maxW, maxH] = max;
      const [dx, dy] = pos;
      
      this.type = type;
      this.content = content;
      this.width  = new Width(w,  maxW).value;
      this.height = new Height(h, maxH).value;

      this.pos_x = (maxW - this.width)  / 2 + dx;
      this.pos_y = (maxH - this.height) / 2 + dy;
    }
}

class Image extends Layer {
  constructor({url, ...rest}) {
    super({
      type: 'image',
      content: url,
      ...rest
    });
  }
}

// === SmartText como Layer normalizado (pos_x/pos_y no layer) ===
class SmartTextLayer extends Layer {
  /**
   * @param {object} params
   * @param {string} params.html
   * @param {[number|string, number|string]} [params.size=[0,0]]    // [w,h]
   * @param {[number, number]}                params.max            // [maxW,maxH] (obrigatório como no Layer)
   * @param {[number, number]}               [params.pos=[0,0]]     // [dx,dy] offset do centro
   * @param {object}                         [params.smartProps={}] // props extras do SmartText
   */
  constructor({
    html,
    size = [0, 0],
    max,                 // obrigatório, igual ao Layer
    pos = [0, 0],
    smartProps = {},
  }) {
    // type 'span' para manter compat com seu renderer
    super({ type: 'span', content: null, size, max, pos });

    // Conteúdo SEM posicionamento; tamanho vai pelo wrapper do renderer
    this.content = (
      <SmartText
        text={html}
        width={this.width}
        height={this.height}
        {...smartProps}
        style={{background: 'teal'}}
      />
    );
  }
}
// === alias "Text": mesma API, nome mais curto/semântico ===
class Text extends SmartTextLayer {
  constructor({ html, ...rest }) {
    super({ html, ...rest });
  }
}

export default {Text, Image};