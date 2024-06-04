import GSAP from 'gsap'

import { ShaderMaterial, Mesh } from 'three'
import * as THREE from 'three'

import vertex from '@js/shaders/vertex-particles.glsl'
import fragment from '@js/shaders/fragment.glsl'

export default class Buffer {
  constructor({ sizes, device, assets }) {
    this.sizes = sizes

    this.device = device

    this.assets = assets

    this.createTexture()

    this.cretateGeometry()

    this.createMaterial()

    this.createMesh()

    this.calculateBounds({
      sizes: this.sizes,
      device: this.device
    })

    this.updateScale(this.device)
  }

  createTexture() {
    // this.texture = this.assets.textures[0]
  }

  cretateGeometry() {
    this.geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.assets.position)
    const colors = new Float32Array(this.assets.colors)
    const alpha = new Float32Array(this.assets.alpha)
    const rotation = new Float32Array(this.assets.rotation)
    const size = new Float32Array(this.assets.size)
    const sdfSeries = new Float32Array(this.assets.sdfSeries)

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )

    this.geometry.setAttribute('colors', new THREE.BufferAttribute(colors, 3))

    this.geometry.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1))

    this.geometry.setAttribute(
      'rotation',
      new THREE.BufferAttribute(rotation, 1)
    )

    this.geometry.setAttribute('size', new THREE.BufferAttribute(size, 1))

    this.geometry.setAttribute(
      'sdfSeries',
      new THREE.BufferAttribute(sdfSeries, 1)
    )
  }

  createMaterial() {
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        // uTexture: { value: this.texture },
        uAlpha: { value: 0 },
        uTime: { value: 0 },
        uPointSize: { value: 0 },
        uResolution: {
          value: this.sizes.width / this.sizes.height
        }
      }
    })
  }

  createMesh() {
    this.mesh = new THREE.Points(this.geometry, this.material)
  }

  calculateBounds({ sizes, device }) {
    this.sizes = sizes

    this.device = device

    this.updateX()

    this.updateY()
  }

  /**
   * Animations
   */
  show() {
    GSAP.fromTo(
      this.mesh.material.uniforms.uAlpha,
      {
        value: 0
      },
      {
        value: 1
      }
    )
  }

  hide() {
    GSAP.to(this.mesh.material.uniforms.uAlpha, {
      value: 0
    })
  }

  /**
   * animate
   */
  moveTriangles() {
    const position = this.geometry.attributes.position
    const rotation = this.geometry.attributes.rotation
    const speeds = this.assets.speeds

    const positionArray = position.array
    const rotationArray = rotation.array

    for (let i = 0; i < positionArray.length; i += 3) {
      const speed = speeds[i / 3]

      let x = positionArray[i]
      let y = positionArray[i + 1]
      let r = rotationArray[i / 3]

      const resolution = this.assets.resolution
      const halfResolution = resolution / 2
      const imgAspect = this.assets.imgAspect
      const imagePixels = this.assets.imagePixels

      const tx = (x * halfResolution) / imgAspect + halfResolution

      const ty = y * halfResolution + halfResolution

      if (tx <= 0 || tx > resolution || ty <= 0 || ty >= resolution) {
        r += Math.PI
      } else {
        const pixelColor = imagePixels[Math.floor(tx)][Math.floor(ty)]

        if (pixelColor > 50) {
          r += Math.PI
        }
      }

      x = x + Math.cos(r) * speed * 0.01
      y = y + Math.sin(r) * speed * 0.01

      positionArray[i] = x
      positionArray[i + 1] = y
      rotationArray[i / 3] = r
    }

    position.needsUpdate = true
  }

  /**
   * events
   */
  onResize(value) {
    this.calculateBounds(value)

    this.updateScale(this.device)
  }

  /**
   * update
   */

  updateScale() {
    this.mesh.material.uniforms.uResolution.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    )

    const scale = this.sizes.width / 6.15

    this.mesh.material.uniforms.uPointSize.value = scale

    let calculatedScale

    if (this.device == 'pc') {
      calculatedScale = scale * 1
    } else {
      calculatedScale = scale * 1.5
    }

    this.mesh.scale.set(calculatedScale, calculatedScale, 1)
  }

  updateX(x = 0) {}

  updateY(y = 0) {}

  update({ scroll, time, params, flag }) {
    if (!flag) return

    this.updateX(scroll.x)

    this.updateY(scroll.y)

    this.material.uniforms.uTime.value = time.current

    this.mesh.material.uniforms.uAlpha.value = params.alpha

    this.moveTriangles()
  }
}
