import GSAP from 'gsap'

import { ShaderMaterial, Mesh } from 'three'
import * as THREE from 'three'

import vertex from '@js/shaders/vertex-particles.glsl'
import fragment from '@js/shaders/fragment.glsl'

export default class Canvas2D {
  constructor({ sizes, device, assets }) {
    this.sizes = sizes

    this.device = device

    this.assets = assets

    this.position = []
    this.pointRotation = []
    this.pointSize = []
    this.pointColors = []
    this.pointAlpha = []
    this.speeds = []
    this.sdfSeries = []
    this.resolution = 60
    this.imgAspect = null

    this.create()

    this.injectPosition()
  }

  create() {
    this.img = this.assets.textures[3].source.data

    const resolution = this.resolution

    let imagePixels = Array.from(Array(resolution), () => {
      return new Array(resolution)
    })
    this.assets.imagePixels = imagePixels

    const canvas = document.createElement('canvas')

    const ctx = canvas.getContext('2d')

    canvas.width = resolution
    canvas.height = resolution

    ctx.scale(1, -1)
    ctx.translate(0, -resolution)

    ctx.drawImage(this.img, 0, 0, resolution, resolution)

    // document.body.appendChild(canvas)

    const imageData = ctx.getImageData(0, 0, resolution, resolution)

    this.imgAspect = this.img.width / this.img.height

    for (let i = 0; i < imageData.data.length; i += 4) {
      let x = (i / 4) % resolution //0-100 is gonna set in each row.

      let y = Math.floor(i / 4 / resolution) // until first row is becoming 0, second row is becoming 1, third row is becoming 2, ...

      imagePixels[x][y] = imageData.data[i] //i is 0-255(R from RGBA)

      if (imageData.data[i] < 30) {
        const halfResolution = resolution / 2

        let normalizedX =
          (this.imgAspect * (x - halfResolution)) / halfResolution //(-1 to 1) * aspect

        let normalizedY = (y - halfResolution) / halfResolution // -1 to 1

        this.position.push(normalizedX, normalizedY, 0) // -1 to 1

        this.pointRotation.push(Math.random() * Math.PI)
        this.pointSize.push(Math.random() * 0.5 + 0.5)
        this.pointAlpha.push(Math.random() * 0.5 + 0.5)
        this.speeds.push(Math.random() * 0.5 + 0.1)

        if (Math.random() > 0.7) {
          this.pointColors.push(220 / 255, 155 / 255, 220 / 255)
          this.sdfSeries.push(1)
        } else if (Math.random() > 0.5) {
          this.pointColors.push(255 / 255, 255 / 255, 128 / 255)
          this.sdfSeries.push(2)
        } else if (Math.random() > 0.3) {
          this.pointColors.push(255 / 255, 128 / 255, 128 / 255)
          this.sdfSeries.push(3)
        } else {
          this.pointColors.push(128 / 255, 128 / 255, 128 / 255)
          this.sdfSeries.push(4)
        }
      }
    }
  }

  injectPosition() {
    this.assets.position = this.position
    this.assets.rotation = this.pointRotation
    this.assets.size = this.pointSize
    this.assets.colors = this.pointColors
    this.assets.alpha = this.pointAlpha
    this.assets.speeds = this.speeds
    this.assets.imgAspect = this.imgAspect
    this.assets.resolution = this.resolution
    this.assets.sdfSeries = this.sdfSeries
  }

  onResize(values) {}
}
