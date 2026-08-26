'use client'

import { type CSSProperties, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const vert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const frag = `
  #define NUM_OCTAVES 5
  uniform vec4 resolution;
  uniform vec3 color1;
  uniform vec3 color0;
  uniform float time;
  uniform float fillProgress;
  uniform float consumeProgress;
  varying vec3 vNormal;

  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  vec3 rgbcol(float r, float g, float b) { return vec3(r/255.0,g/255.0,b/255.0); }

  float setOpacity(float r, float g, float b) {
    float tone = (r + g + b) / 3.0;
    return smoothstep(0.975, 1.0, tone);
  }

  void main(){
    vec2 uv = normalize(vNormal).xy * 0.5 + 0.5;
    vec2 newUv = uv + vec2(0.0, -time*0.0004);
    float scale = 12.0;
    vec2 p = newUv * scale;
    float n = fbm(p + fbm(p));

    vec4 backColor = vec4(1.0 - uv.y) + vec4(vec3(n*(1.0 - uv.y)), 1.0);
    backColor.a = setOpacity(backColor.r, backColor.g, backColor.b);
    backColor.rgb = rgbcol(color1.r, color1.g, color1.b);

    vec4 frontColor = vec4(1.08 - uv.y) + vec4(vec3(n*(1.0 - uv.y)), 1.0);
    frontColor.a = setOpacity(frontColor.r, frontColor.g, frontColor.b);
    frontColor.rgb = rgbcol(color0.r, color0.g, color0.b);

    // edge
    frontColor.a = frontColor.a - backColor.a;

    vec4 sphereColor = frontColor.a > 0.0 ? frontColor : backColor;
    sphereColor.rgb = mix(sphereColor.rgb, rgbcol(color1.r, color1.g, color1.b), fillProgress);
    sphereColor.a = max(sphereColor.a, fillProgress);
    sphereColor.a *= 1.0 - smoothstep(0.58, 0.92, consumeProgress);

    gl_FragColor = sphereColor;
  }
`

const consumeVert = `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const consumeFrag = `
  #define NUM_OCTAVES 5
  uniform vec4 resolution;
  uniform vec3 color1;
  uniform vec3 color0;
  uniform float time;
  uniform float consumeProgress;
  uniform vec2 sphereCenter;

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(
      mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
      mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
    return res*res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  vec3 rgbcol(float r, float g, float b) {
    return vec3(r/255.0, g/255.0, b/255.0);
  }

  float setOpacity(float r, float g, float b) {
    float tone = (r + g + b) / 3.0;
    return smoothstep(0.975, 1.0, tone);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float slowTime = time * 0.00022;

    float broadNoise = fbm(vec2(uv.x * 5.2 + slowTime * 0.3, slowTime));
    float detailNoise = fbm(vec2(uv.x * 16.0 - slowTime * 0.8, slowTime * 1.7));
    vec2 fromSphere = uv - sphereCenter;
    float horizontalTravel = abs(fromSphere.x) * 0.92;
    float downwardTravel = max(sphereCenter.y - uv.y, 0.0) * 0.18;
    float upwardTravel = max(uv.y - sphereCenter.y, 0.0) * 0.38;
    float radialTravel = length(fromSphere) * 0.08;
    float arrival = horizontalTravel + downwardTravel + upwardTravel + radialTravel;

    float reach = consumeProgress * 1.18;
    float irregularEdge =
      (broadNoise - 0.5) * 0.16
      + (detailNoise - 0.5) * 0.065;
    float distanceBehindFront = reach - arrival + irregularEdge;

    vec2 fireUv = vec2(
      fract(uv.x * 1.15 + 0.18),
      clamp(0.54 - distanceBehindFront * 2.8, 0.0, 1.0)
    );
    vec2 animatedFireUv = fireUv + vec2(0.0, -time * 0.0004);
    vec2 firePoint = animatedFireUv * 12.0;
    float sphereNoise = fbm(firePoint + fbm(firePoint));

    vec4 backColor = vec4(1.0 - fireUv.y)
      + vec4(vec3(sphereNoise * (1.0 - fireUv.y)), 1.0);
    backColor.a = setOpacity(backColor.r, backColor.g, backColor.b);
    backColor.rgb = rgbcol(color1.r, color1.g, color1.b);

    vec4 frontColor = vec4(1.08 - fireUv.y)
      + vec4(vec3(sphereNoise * (1.0 - fireUv.y)), 1.0);
    frontColor.a = setOpacity(frontColor.r, frontColor.g, frontColor.b);
    frontColor.rgb = rgbcol(color0.r, color0.g, color0.b);
    frontColor.a -= backColor.a;

    vec4 sphereFlame = frontColor.a > 0.0 ? frontColor : backColor;
    float flameWindow = 1.0 - smoothstep(0.12, 0.3, abs(distanceBehindFront));
    float flameAlpha = sphereFlame.a * flameWindow;
    float consumedBody = smoothstep(0.075, 0.29, distanceBehindFront);
    float alpha = max(flameAlpha, consumedBody);

    alpha *= smoothstep(0.0, 0.035, consumeProgress);

    vec3 base = rgbcol(color1.r, color1.g, color1.b);
    vec3 fireColor = mix(base, sphereFlame.rgb, flameWindow);

    gl_FragColor = vec4(fireColor, alpha);
  }
`

export type FireSphereProps = {
  /** Bloom intensity (default 1.7) */
  bloomStrength?: number
  /** Bloom radius (default 0.8) */
  bloomRadius?: number
  /** Bloom threshold (default 0) */
  bloomThreshold?: number
  /** Border RGB in 0-255 (default [74,30,0]) */
  color0?: [number, number, number]
  /** Base RGB in 0-255 (default [201,158,72]) */
  color1?: [number, number, number]
  /** Whether to animate (default true) */
  animate?: boolean
  /** Max renderer pixel ratio (default 1.25) */
  maxPixelRatio?: number
  /** Whether to use antialiasing (default false) */
  antialias?: boolean
  /** Sphere segment count (default 32) */
  segments?: number
  /** Internal solid fill progress, 0-1 (default 0) */
  fillProgress?: number
  /** Canvas background fill progress, 0-1 (default 0) */
  canvasFillProgress?: number
  /** Organic shader-driven section consumption progress, 0-1 (default 0) */
  consumeProgress?: number
  /** Normalized origin of the consumption effect, with Y measured from the bottom */
  consumeOrigin?: [number, number]
  /** Whether the original animated sphere mesh is rendered (default true) */
  showSphere?: boolean
  /** Optional extra classes for the wrapper */
  className?: string
  /** Optional inline styles for the wrapper */
  style?: CSSProperties
}

function FireSphere({
  bloomStrength = 1.7,
  bloomRadius = 0.8,
  bloomThreshold = 0.0,
  color0 = [74, 30, 0],
  color1 = [201, 158, 72],
  animate = true,
  maxPixelRatio = 1.25,
  antialias = false,
  segments = 32,
  fillProgress = 0,
  canvasFillProgress = 0,
  consumeProgress = 0,
  consumeOrigin,
  showSphere = true,
  className = '',
  style,
}: FireSphereProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const apiRef = useRef<{
    uniforms?: {
      time: { value: number }
      resolution: { value: THREE.Vector4 }
      color1: { value: THREE.Vector3 }
      color0: { value: THREE.Vector3 }
      fillProgress: { value: number }
      consumeProgress: { value: number }
      sphereCenter: { value: THREE.Vector2 }
    }
    bloomPass?: UnrealBloomPass
    renderer?: THREE.WebGLRenderer
    composer?: EffectComposer
    scene?: THREE.Scene
    camera?: THREE.Camera
    cleanup?: () => void
    clock?: THREE.Clock
    raf?: number
  }>({})

  useEffect(() => {
    if (!mountRef.current) return

    let width = mountRef.current.clientWidth
    let height = mountRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    const shouldUseBloom = bloomStrength > 0

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio))
    renderer.setSize(width, height)
    renderer.setClearColor(new THREE.Color(color1[0] / 255, color1[1] / 255, color1[2] / 255), canvasFillProgress)
    mountRef.current.appendChild(renderer.domElement)

    const composer = shouldUseBloom ? new EffectComposer(renderer) : undefined
    composer?.addPass(new RenderPass(scene, camera))

    const bloomPass = shouldUseBloom
      ? new UnrealBloomPass(new THREE.Vector2(width, height), bloomStrength, bloomRadius, bloomThreshold)
      : undefined
    if (bloomPass) {
      composer?.addPass(bloomPass)
    }

    const drawingBufferSize = new THREE.Vector2()
    renderer.getDrawingBufferSize(drawingBufferSize)

    const uniforms = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector4(drawingBufferSize.x, drawingBufferSize.y, 1, 1) },
      color1: { value: new THREE.Vector3(...color1) },
      color0: { value: new THREE.Vector3(...color0) },
      fillProgress: { value: fillProgress },
      consumeProgress: { value: consumeProgress },
      sphereCenter: { value: new THREE.Vector2(0.75, 0.46) },
    }

    const geometry = new THREE.SphereGeometry(1.7, segments, segments)
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: vert,
      fragmentShader: frag,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.visible = showSphere
    mesh.renderOrder = 1
    scene.add(mesh)

    const consumeGeometry = new THREE.PlaneGeometry(2, 2)
    const consumeMaterial = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertexShader: consumeVert,
      fragmentShader: consumeFrag,
    })
    const consumeMesh = new THREE.Mesh(consumeGeometry, consumeMaterial)
    consumeMesh.frustumCulled = false
    consumeMesh.renderOrder = 0
    scene.add(consumeMesh)

    const positionSphere = () => {
      const visibleHalfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      const visibleHalfWidth = visibleHalfHeight * camera.aspect
      const isMobile = width < 640

      mesh.position.x = showSphere ? 0 : isMobile ? 0 : visibleHalfWidth * 0.5
      mesh.position.y = showSphere ? 0 : isMobile ? -visibleHalfHeight * 0.58 : -visibleHalfHeight * 0.08
      if (consumeOrigin) {
        uniforms.sphereCenter.value.set(...consumeOrigin)
      } else {
        uniforms.sphereCenter.value.set(
          isMobile ? 0.5 : 0.75,
          isMobile ? 0.21 : 0.46,
        )
      }
    }

    positionSphere()

    const onResize = () => {
      if (!mountRef.current) return

      width = mountRef.current.clientWidth
      height = mountRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      composer?.setSize(width, height)
      renderer.getDrawingBufferSize(drawingBufferSize)
      uniforms.resolution.value.set(drawingBufferSize.x, drawingBufferSize.y, 1, 1)
      positionSphere()
    }

    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let isVisible = true
    let raf = 0
    const tick = () => {
      raf = window.requestAnimationFrame(tick)
      if (!isVisible) return

      if (animate) {
        uniforms.time.value = clock.getElapsedTime() * 1000.0
      }
      if (composer) {
        composer.render()
      } else {
        renderer.render(scene, camera)
      }
    }
    tick()

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true
      },
      { threshold: 0.05 },
    )
    observer.observe(mountRef.current)

    const cleanup = () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      geometry.dispose()
      material.dispose()
      consumeGeometry.dispose()
      consumeMaterial.dispose()
      composer?.dispose()
      renderer.dispose()
      scene.clear()
      renderer.domElement.remove()
    }

    apiRef.current = { uniforms, bloomPass, renderer, composer, scene, camera, cleanup, clock, raf }

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const api = apiRef.current
    if (!api.uniforms) return

    api.uniforms.color0.value.set(...color0)
    api.uniforms.color1.value.set(...color1)
  }, [color0, color1])

  useEffect(() => {
    const api = apiRef.current
    if (!api.uniforms) return

    api.uniforms.fillProgress.value = fillProgress
  }, [fillProgress])

  useEffect(() => {
    const api = apiRef.current
    if (!api.uniforms) return

    api.uniforms.consumeProgress.value = consumeProgress
  }, [consumeProgress])

  useEffect(() => {
    const api = apiRef.current
    if (!api.renderer) return

    api.renderer.setClearColor(
      new THREE.Color(color1[0] / 255, color1[1] / 255, color1[2] / 255),
      canvasFillProgress,
    )
  }, [canvasFillProgress, color1])

  useEffect(() => {
    const api = apiRef.current
    if (!api.bloomPass) return

    api.bloomPass.threshold = bloomThreshold
    api.bloomPass.strength = bloomStrength
    api.bloomPass.radius = bloomRadius
  }, [bloomStrength, bloomRadius, bloomThreshold])

  return (
    <div className={`h-full w-full ${className || 'relative'}`} style={style}>
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  )
}

export { FireSphere }
