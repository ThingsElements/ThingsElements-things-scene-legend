/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

const NATURE = {
  mutable: false,
  resizable: false,
  rotatable: false
}

var { Model, Container, RectPath, Shape } = scene

export default class LegendItem extends Container {

  _post_draw(context) {
    super._post_draw(context);

    if (this.model.text && this.size() === 0) {
      this.initialize();
    }
  }

  initialize() {

    var {
      text,
      fillStyle,
      strokeStyle,
      fontFamily,
      lineWidth = 0,
      boxColor
    } = this.model;

    var {
      left,
      top,
      width,
      height
    } = this.bounds;

    var children = [];

    var minSize = Math.min(width, height)
    children.push(Model.compile({
      type: 'rect',
      fillStyle: boxColor,
      // strokeStyle: strokeStyle,
      left: lineWidth * 0.5 + minSize * 0.3 * 0.5,
      top: lineWidth * 0.5 + minSize * 0.3 * 0.5,
      width: minSize * 0.7,
      height: minSize * 0.7,
      locked: true
    }))

    children.push(Model.compile({
      type: 'text',
      text: text,
      left: minSize * 0.15 + minSize + lineWidth,
      top: minSize * 0.15 + lineWidth,
      width: width - minSize - minSize * 0.3 - lineWidth * 2,
      height: height - minSize * 0.3 - lineWidth * 2,
      textAlign: 'left',
      textWrap: true,
      fontFamily,
      locked: true
    }))

    this.add(children)
  }

  reinitialize() {
    this.remove(this.components);

    this.initialize();
  }

  get stuck() {
    return true;
  }

  get controls() {}

  get nature(){
    return NATURE;
  }

  onchange(after, before) {
    this.reinitialize();
  }

}

scene.Component.register('legend-item', LegendItem);
