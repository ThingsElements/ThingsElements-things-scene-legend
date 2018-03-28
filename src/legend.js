/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
    type: 'number',
    label: 'rows',
    name: 'rows'
  }, {
    type: 'number',
    label: 'columns',
    name: 'columns'
  }, {
    type: 'select',
    label: 'direction',
    name: 'direction',
    property: {
      options: [{
        display: 'Horizontal',
        value: 'horizontal'
      }, {
        display: 'Vertical',
        value: 'vertical'
      }]
    }
  }, {
    type: 'number',
    label: 'round',
    name: 'round'
  }, {
    type: 'legend-status',
    label: '',
    name: 'status'
  }]
}

var controlHandler = {

  ondragmove: function (point, index, component) {

    var { left, top, width, height } = component.model
    /*
      * point의 좌표는 부모 레이어 기준의 x, y 값이다.
      * 따라서, 도형의 회전을 감안한 좌표로의 변환이 필요하다.
      * Transcoord시에는 point좌표가 부모까지 transcoord되어있는 상태이므로,
      * 컴포넌트자신에 대한 transcoord만 필요하다.(마지막 파라미터를 false로).
      */
    var transcoorded = component.transcoordP2S(point.x, point.y)
    var round = (transcoorded.x - left) / (width / 2) * 100

    round = roundSet(round, width, height)

    component.set({ round })
  }
}

function roundSet(round, width, height) {
  var max = width > height ? (height / width) * 100 : 100

  if (round >= max)
    round = max
  else if (round <= 0)
    round = 0

  return round
}

var { Model, Container, TableLayout } = scene

export default class Legend extends Container {

  ready() {
    this.rebuildLegendItems()
  }

  get showMoveHandle() {
    return false;
  }

  render(context) {

    var {
      round = 0
    } = this.model

    var {
      left,
      top,
      width,
      height
    } = this.bounds

    // 박스 그리기
    context.beginPath();

    round = roundSet(round, width, height)

    if (round > 0) {
      var radius = (round / 100) * (width / 2)

      context.moveTo(left + radius, top);
      context.lineTo(left + width - radius, top);
      context.quadraticCurveTo(left + width, top, left + width, top + radius);
      context.lineTo(left + width, top + height - radius);
      context.quadraticCurveTo(left + width, top + height, left + width - radius, top + height);
      context.lineTo(left + radius, top + height);
      context.quadraticCurveTo(left, top + height, left, top + height - radius);
      context.lineTo(left, top + radius);
      context.quadraticCurveTo(left, top, left + radius, top);

      this.model.padding = {
        top: round / 2,
        left: round / 2,
        right: round / 2,
        bottom: round / 2
      }

    } else {
      context.rect(left, top, width, height);
    }

    this.drawFill(context);
    this.drawStroke(context);
  }

  get controls() {

    var { left, top, width, round, height } = this.model;
    round = round == undefined ? 0 : roundSet(round, width, height)

    return [{
      x: left + (width / 2) * (round / 100),
      y: top,
      handler: controlHandler
    }]
  }

  get layout() {
    return TableLayout
  }

  get nature() {
    return NATURE;
  }

  rebuildLegendItems() {

    if(this.components.length)
      this.components.slice().forEach(m => m.dispose())

    var {
      left,
      top,
      width,
      height,
      fillStyle,
      strokeStyle,
      fontColor,
      fontFamily,
      fontSize,
      lineHeight,
      textAlign = 'left',
      round = 0,
      italic,
      bold,
      lineWidth = 0,
      rows,
      columns,
      status = {}
    } = this.model

    let statusRanges = status.ranges || []

    var count = statusRanges.length

    this.add(statusRanges.map(range => Model.compile({
      type: 'legend-item',
      text: range.description || `${range.min || ''} ~ ${range.max || ''}`,
      width: 1,
      height: 1,
      color: range.color,
      fontColor,
      fontFamily,
      fontSize,
      lineHeight,
      italic,
      bold,
      textAlign
    })))

    var rows, columns

    if(!columns && !rows) {
      rows = count
      columns = 1
    } else if(columns && !rows) {
      rows = Math.ceil(count / Number(columns))
    } else if(rows && !columns) {
      columns = Math.ceil(count / Number(rows))
    }

    this.set({
      layoutConfig: {
        rows, columns
      }
    })
  }

  get hasTextProperty() {
    return true
  }

  get textHidden() {
    return true
  }

  onchange(after, before) {

    this.rebuildLegendItems()
  }
}

scene.Component.register('legend', Legend);
