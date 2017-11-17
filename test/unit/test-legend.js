/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import './util'

import { expect } from 'chai'

import '../../bower_components/things-scene-core/things-scene-min'
import { Legend } from '../../src/index'

describe('Legend', function () {

  var board;

  beforeEach(function () {
    board = scene.create({
      model: {
        components: [{
          id: 'legend',
          type: 'legend'
        }]
      }
    })
  });

  it('component should be found by its id.', function () {

    var component = board.findById('legend')

    expect(!!component).not.to.equal(false);
  });
});
