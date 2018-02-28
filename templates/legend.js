export default {
  name: 'legend',
    /* 다국어 키 표현을 어떻게.. */
  description: '...',
  /* 다국어 키 표현을 어떻게.. */
  group: 'warehouse',
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon: '../',
  /* 또는, Object */
  template: {
    type: 'legend',
    model: {
      type: 'legend',
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fillStyle: '#efefef',
      direction: 'vertical',
      strokeStyle: 'rgba(0, 0, 0, 0.3)',
      lineWidth: 1
    }
  }
}
