import map from 'lodash/map'
import GSAP from 'gsap'

import { PlaneGeometry } from 'three'

import * as THREE from 'three'

import Buffer from '@js/webgl/Home/object/Buffer'
import Canvas2D from '@js/webgl/Home/object/Canvas2D'

export default class Home {
  constructor({ scene, sizes, device, assets }) {
    this.scene = scene

    this.sizes = sizes

    this.device = device

    this.assets = assets

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.scrollCurrent = {
      //necessary to memolize touchstart position.
      x: 0,
      y: 0
    }

    this.scroll = {
      x: 0,
      y: 0
    }

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.createCanvas2D()

    this.createMesh()

    this.onResize({
      sizes: this.sizes,
      device: this.device
    })

    this.show()
  }

  createCanvas2D() {
    this.canvas2D = new Canvas2D({
      sizes: this.sizes,
      device: this.device,
      assets: this.assets
    })
  }

  createMesh() {
    this.buffer = new Buffer({
      sizes: this.sizes,
      device: this.device,
      assets: this.assets
    })

    this.scene.add(this.buffer.mesh)
  }

  /**
   * animate
   */

  show() {
    // this.buffer.show()
  }

  hide() {
    // this.buffer.hide()
  }

  /**
   * events
   */
  onResize(values) {
    if (this.buffer) {
      this.buffer.onResize(values)
    }

    if (this.canvas2D) {
      this.canvas2D.onResize(values)
    }
  }

  onTouchDown({ x, y }) {
    this.speed.target = 1
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end
    const yDistance = y.start - y.end

    this.x.target = this.scrollCurrent.x - xDistance
    this.y.target = this.scrollCurrent.y - yDistance
  }

  onTouchUp({ x, y }) {
    this.speed.target = 0
  }

  onWheel({ pixelX, pixelY }) {
    this.x.target -= pixelX
    this.y.target -= pixelY
  }

  /**
   * update
   */
  update({ scroll, time, params, flag }) {
    this.buffer?.update({
      scroll: scroll,
      time: time,
      params: params,
      flag: flag
    })
  }

  /**
   * destroy
   */
  destroy() {
    this.scene.remove(this.buffer.mesh)
  }
}
