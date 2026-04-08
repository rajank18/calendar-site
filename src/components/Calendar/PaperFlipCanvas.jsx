import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'

function createPaperTexture() {
  const textureCanvas = document.createElement('canvas')
  textureCanvas.width = 1024
  textureCanvas.height = 1024
  const context = textureCanvas.getContext('2d')

  if (!context) {
    return null
  }

  const gradient = context.createLinearGradient(0, 0, 1024, 1024)
  gradient.addColorStop(0, '#f9f4e7')
  gradient.addColorStop(1, '#f1e6cd')
  context.fillStyle = gradient
  context.fillRect(0, 0, 1024, 1024)

  context.globalAlpha = 0.18
  for (let index = 0; index < 2800; index += 1) {
    const tone = 226 + Math.floor(Math.random() * 18)
    context.fillStyle = `rgb(${tone}, ${tone - 4}, ${tone - 12})`
    context.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2)
  }

  context.globalAlpha = 0.12
  context.strokeStyle = '#b79f76'
  context.lineWidth = 2
  for (let y = 140; y < 1024; y += 120) {
    context.beginPath()
    context.moveTo(0, y)
    context.quadraticCurveTo(520, y + 20, 1024, y - 2)
    context.stroke()
  }

  return new THREE.CanvasTexture(textureCanvas)
}

export default function PaperFlipCanvas({
  direction,
  onDone,
  mode = 'auto',
  progress = 0,
  fromProgress = 0,
  toProgress = 1,
}) {
  const mountRef = useRef(null)
  const stateRef = useRef({ progress: 0, bend: 0.08 })
  const updateSheetRef = useRef(() => {})
  const timelineRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) {
      return undefined
    }

    const width = mount.clientWidth
    const height = mount.clientHeight
    const aspect = width / Math.max(height, 1)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100)
    camera.position.set(0, 0.1, 3.1)

    const paperTexture = createPaperTexture()
    const planeWidth = 2.3
    const planeHeight = planeWidth / aspect
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 38, 42)
    const basePositions = Float32Array.from(geometry.attributes.position.array)

    const material = new THREE.MeshPhongMaterial({
      color: '#f8f1df',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.98,
      map: paperTexture,
      shininess: 4,
    })

    const sheet = new THREE.Mesh(geometry, material)
    scene.add(sheet)

    const ambient = new THREE.AmbientLight('#fff8ec', 0.72)
    const keyLight = new THREE.DirectionalLight('#ffe7bf', 0.95)
    keyLight.position.set(1.4, 1.7, 2)
    const fillLight = new THREE.DirectionalLight('#e9d5b4', 0.45)
    fillLight.position.set(-1.5, -0.2, 1.2)
    scene.add(ambient, keyLight, fillLight)

    const state = stateRef.current
    state.progress = fromProgress
    state.bend = 0.08
    const directionSign = direction === 'next' ? 1 : -1

    const updateSheet = () => {
      const positions = geometry.attributes.position.array
      const maxWave = state.bend * (1 - Math.abs(0.5 - state.progress) * 2)

      for (let index = 0; index < positions.length; index += 3) {
        const x = basePositions[index]
        const y = basePositions[index + 1]
        const yUnit = (y + planeHeight / 2) / planeHeight
        const hingeFactor = 1 - yUnit

        positions[index] =
          x +
          directionSign * Math.sin(yUnit * Math.PI) * maxWave * 0.22 +
          directionSign * Math.sin((yUnit + state.progress) * Math.PI) * 0.018

        positions[index + 1] = y
        positions[index + 2] =
          basePositions[index + 2] +
          Math.sin(yUnit * Math.PI) * maxWave * 0.95 +
          hingeFactor * maxWave * 0.35
      }

      geometry.attributes.position.needsUpdate = true
      geometry.computeVertexNormals()

      sheet.rotation.x = -state.progress * Math.PI * 0.92
      sheet.rotation.y = directionSign * (1 - state.progress) * 0.14
      sheet.position.y = state.progress * 0.06
      material.opacity = 0.98 - state.progress * 0.25
    }

    updateSheet()

    updateSheetRef.current = updateSheet

    if (mode === 'auto') {
      const duration = Math.max(0.22, Math.abs(toProgress - fromProgress) * 0.95)
      const timeline = gsap.timeline({ onComplete: onDone })
      timelineRef.current = timeline
      timeline.to(state, {
        progress: toProgress,
        duration,
        ease: 'power2.inOut',
        onUpdate: updateSheet,
      })
      timeline.to(
        state,
        {
          bend: 0.24,
          duration: Math.max(0.18, duration * 0.5),
          ease: 'power1.out',
          yoyo: true,
          repeat: 1,
          onUpdate: updateSheet,
        },
        0,
      )
    }

    let frameId = 0
    const renderLoop = () => {
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(renderLoop)
    }
    renderLoop()

    const onResize = () => {
      const nextWidth = mount.clientWidth
      const nextHeight = mount.clientHeight
      renderer.setSize(nextWidth, nextHeight)
      camera.aspect = nextWidth / Math.max(nextHeight, 1)
      camera.updateProjectionMatrix()
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frameId)
      timelineRef.current?.kill()
      timelineRef.current = null
      geometry.dispose()
      material.dispose()
      paperTexture?.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [direction, fromProgress, mode, onDone, toProgress])

  useEffect(() => {
    if (mode !== 'controlled') {
      return
    }

    const state = stateRef.current
    state.progress = Math.max(0, Math.min(1, progress))
    state.bend = 0.08 + Math.sin(state.progress * Math.PI) * 0.16
    updateSheetRef.current()
  }, [mode, progress])

  return <div className="paper-flip-overlay" ref={mountRef} aria-hidden="true" />
}
