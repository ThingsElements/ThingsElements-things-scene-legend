/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import { Model, Component, RectPath, Shape } from '@hatiolab/things-scene'

const NATURE = {
  mutable: false,
  resizable: false,
  rotatable: false,
  properties: []
}

export default class LegendItem extends RectPath(Shape) {

  _draw(context) {
    var {
      left,
      top,
      height,
      color
    } = this.model

    context.beginPath();

    var c = height / 2
    var r = c / 2

    context.save()

    context.fillStyle = color
    context.ellipse(left + c, top + c, r, r, 0, 0, Math.PI * 2, true)
    context.shadowColor = 'rgba(0,0,0,0.15)';
    context.shadowBlur = 2;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 2;
    context.fill()

    context.restore()
  }

  onchange(after) {
    if (after.hasOwnProperty('height'))
      this.set('paddingLeft', after.height)
  }

  get stuck() {
    return true;
  }

  get capturable() {
    return false
  }

  get nature() {
    return NATURE;
  }
}

Component.register('legend-item', LegendItem);
