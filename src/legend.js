/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties : [{
    type: 'string',
    label: 'target',
    name: 'target',
    property: 'target'
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
      }, {
        type: 'number',
        label: 'round',
        name: 'round',
        property: 'round'
      }]
    }
  }]
}

var controlHandler = {

  ondragmove: function(point, index, component) {

    var { left, top, width, height } = component.model
    /*
      * point의 좌표는 부모 레이어 기준의 x, y 값이다.
      * 따라서, 도형의 회전을 감안한 좌표로의 변환이 필요하다.
      * Transcoord시에는 point좌표가 부모까지 transcoord되어있는 상태이므로,
      * 컴포넌트자신에 대한 transcoord만 필요하다.(마지막 파라미터를 false로).
      */
    var transcoorded = component.transcoordP2S(point.x, point.y)
    var round = (transcoorded.x - left) / (width/2) * 100

    round = roundSet(round, width, height)

    component.set({ round })
  }
}

function roundSet(round, width, height){
  var max = width > height ? (height / width) * 100 : 100

  if(round >= max)
    round = max
  else if(round <= 0)
    round = 0

  return round
}

var { Model, Container, RectPath, Shape, LinearHorizontalLayout, LinearVerticalLayout } = scene

export default class Legend extends Container {

  _draw(context) {

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

    if(this.target) {
      if(this.size() !== this.target.model.stockStatus.ranges.length)
        this.rebuildLegendItems(context)
    } else {
      // TODO target이 잘못되거나 안되어있다는 경고 의미로 뭔가 그려라..
      var componentsLength = this.components.length;
      for(var i = componentsLength - 1 ; i >= 0; i-- ) {
        var legendItem = this.components[i]
        this.removeComponent(legendItem)
      }
    }
  }

  get controls() {

    var { left, top, width, round, height } = this.model;
    round = round == undefined ? 0 : roundSet(round, width, height)


    return [{
      x: left + (width/2) * (round/100),
      y: top,
      handler: controlHandler
    }]
  }

  get layout() {
    if(this.model.direction == 'horizontal')
      return LinearHorizontalLayout;
    else
      return LinearVerticalLayout;
  }

  get target() {
    var { target } = this.model
    if(!target)
      return null

    if(!this._target) {
      this._target = this.root.findById(target)
      if(this._target)
        this._target.on('change', this.onTargetChanged, this)
    }

    return this._target
  }

  set target(target) {
    if(this.target)
      this.target.off('change', this.onTargetChanged, this)

    this._target = null
    this.model.target = target
  }

  get nature(){
    return NATURE;
  }

  rebuildLegendItems() {
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
      round = 0,
      italic,
      bold,
      lineWidth = 0
    } = this.model

    var target = this.target
    let children = []

    let status = target.model.stockStatus
    let statusField = status.field
    let statusRanges = status.ranges

    let components = target.components
    let label_height = this.labelHeight

    let componentsLength = this.components.length

    for(var i=componentsLength-1; i>=0; i--) {
      this.removeComponent(this.components[i])
    }

    var lastMax

    var offset = Math.floor(round > 0 ? round / 2 : 0);

    for (let i = 0; i < statusRanges.length; i++) {
      let range = statusRanges[i];

      children.push(Model.compile({
        type: 'legend-item',
        text: `${range.min || lastMax || 0} <= ${statusField} < ${range.max}`,
        boxColor: range.color,
        fontColor: fontColor,
        fontFamily: fontFamily,
        fontSize: fontSize,
        lineHeight: lineHeight,
        italic: italic,
        bold: bold,
        width: width,
        height: height
      }))

      lastMax = range.max;
    }

    this.add(children)

    this.reflow()
  }

  dispose() {
    if(this.target)
      this.target.off('change', this.onTargetChanged, this)

    super.dispose();
  }

  onchange(after, before) {
    if(after.hasOwnProperty("target")){
      this.target = after.target
      this.invalidate()
      return;
    }
  }
}

scene.Component.register('legend', Legend);
