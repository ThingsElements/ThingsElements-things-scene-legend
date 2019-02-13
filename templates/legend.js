import icon from '../assets/legend.png';

export default {
  type: 'legend',
  description: 'legend for visualizer',
  group: 'warehouse', /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon,
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
