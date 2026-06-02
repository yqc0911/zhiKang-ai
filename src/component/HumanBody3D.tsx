import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import humanModelUrl from '../human.glb?url'

export type BodyPart = {
    id: string
    label: string
}

export type PainPoint = {
    part: string
    point: {
        x: number
        y: number
        z: number
    }
}

interface HumanBody3DProps {
    onSelectPart: (part: string, point: PainPoint['point']) => void
    selectedParts: string[]
}

const bodyPartMap: Record<string, string> = {
    head: '头部',
    neck: '颈部',
    chest: '胸部',
    torso: '胸腹部',
    abdomen: '腹部',
    stomach: '腹部',
    pelvis: '骨盆',
    spine: '脊柱',
    shoulder: '肩部',
    arm: '手臂',
    forearm: '前臂',
    hand: '手部',
    thigh: '大腿',
    calf: '小腿',
    foot: '脚部',
    leg: '腿部',
    hip: '髋部',
    elbow: '肘部',
    knee: '膝部',
}

const normalizeAngle = (angle: number) => {
    const twoPi = Math.PI * 2
    return ((angle % twoPi) + twoPi) % twoPi
}

const isBackFacing = (rotationY: number) => {
    const angle = normalizeAngle(rotationY)
    return angle <= Math.PI / 2 || angle >= Math.PI * 1.5
}

const guessPartLabel = (meshName: string, point: THREE.Vector3, bounds?: THREE.Box3 | null, rotationY = 0) => {
    const lower = meshName.toLowerCase()
    for (const [key, label] of Object.entries(bodyPartMap)) {
        if (lower.includes(key)) return isBackFacing(rotationY) && label === '胸腹部' ? '背部' : label
    }

    if (!bounds) return '身体部位'

    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    bounds.getSize(size)
    bounds.getCenter(center)

    const normalizedY = size.y > 0 ? (point.y - bounds.min.y) / size.y : 0.5
    const halfWidth = Math.max(size.x / 2, 0.01)
    const normalizedX = (point.x - center.x) / halfWidth
    const back = isBackFacing(rotationY)

    if (normalizedY >= 0.88) return back ? '后脑/颈后' : '头部'
    if (normalizedY >= 0.78) return back ? '颈后' : '颈部'

    if (normalizedY >= 0.62) {
        if (normalizedX >= 0.48) return '右肩/右上臂'
        if (normalizedX <= -0.48) return '左肩/左上臂'
        return back ? '上背部' : '胸部'
    }

    if (normalizedY >= 0.48) {
        if (normalizedX >= 0.58) return '右肘/右前臂'
        if (normalizedX <= -0.58) return '左肘/左前臂'
        return back ? '中背部' : '上腹部'
    }

    if (normalizedY >= 0.36) {
        if (normalizedX >= 0.62) return '右手/腕部'
        if (normalizedX <= -0.62) return '左手/腕部'
        return back ? '腰背部' : '下腹部'
    }

    if (normalizedY >= 0.28) return back ? '臀部/骶尾部' : '髋部/腹股沟'

    if (normalizedY >= 0.17) {
        if (normalizedX >= 0.08) return back ? '右大腿后侧/右膝后' : '右大腿/右膝'
        return back ? '左大腿后侧/左膝后' : '左大腿/左膝'
    }

    if (normalizedX >= 0.08) return back ? '右小腿后侧/右足跟' : '右小腿/右足部'
    return back ? '左小腿后侧/左足跟' : '左小腿/左足部'
}

const createClickableMaterial = () =>
    new THREE.MeshStandardMaterial({
        color: 0xf8d7c4,
        metalness: 0.04,
        roughness: 0.58,
    })

const HumanBody3D = ({ onSelectPart }: HumanBody3DProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [status, setStatus] = useState<'loading' | 'ready' | 'fallback' | 'error'>('loading')
    const [debugInfo, setDebugInfo] = useState('正在加载人体模型...')

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        setStatus('loading')
        setDebugInfo(`正在加载：${humanModelUrl}`)

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#f8fafc')

        const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)
        camera.position.set(0, 0.35, 5)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.setClearColor(0xf8fafc, 1)
        renderer.domElement.style.display = 'block'
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        container.appendChild(renderer.domElement)

        scene.add(new THREE.HemisphereLight(0xffffff, 0x94a3b8, 2.8))

        const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
        keyLight.position.set(3, 6, 5)
        scene.add(keyLight)

        const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.8)
        fillLight.position.set(-4, 2, 4)
        scene.add(fillLight)

        const bodyGroup = new THREE.Group()
        scene.add(bodyGroup)

        const selectableMeshes: THREE.Mesh[] = []
        const highlightGroup = new THREE.Group()
        bodyGroup.add(highlightGroup)
        const selectedHighlights = new Map<string, THREE.Mesh>()
        const localHighlightMaterial = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0ea5e9,
            emissiveIntensity: 0.22,
            metalness: 0.02,
            roughness: 0.35,
            transparent: true,
            opacity: 0.62,
            depthWrite: false,
        })

        let modelRoot: THREE.Object3D | null = null
        let modelBounds: THREE.Box3 | null = null
        let animationId = 0
        let frame = 0
        let disposed = false
        let isDragging = false
        let dragStartX = 0
        let dragStartY = 0
        let lastPointerX = 0
        let lastPointerY = 0
        let manualRotationY = 0
        let manualRotationX = 0
        let hasDragged = false

        const fitContainer = () => {
            const width = Math.max(container.clientWidth, 320)
            const height = Math.max(container.clientHeight, 420)
            renderer.setSize(width, height, false)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }

        const syncHighlightOpacity = () => {
            selectedHighlights.forEach((highlight) => {
                const material = highlight.material as THREE.MeshStandardMaterial
                material.opacity = 0.58 + Math.sin(frame * 0.08) * 0.08
            })
        }

        const centerAndScaleModel = (root: THREE.Object3D) => {
            const box = new THREE.Box3().setFromObject(root)
            const size = new THREE.Vector3()
            const center = new THREE.Vector3()
            box.getSize(size)
            box.getCenter(center)

            root.position.sub(center)
            const maxAxis = Math.max(size.x, size.y, size.z)
            const scale = maxAxis > 0 ? 3.2 / maxAxis : 1
            root.scale.multiplyScalar(scale)

            const scaledBox = new THREE.Box3().setFromObject(root)
            const scaledSize = new THREE.Vector3()
            const scaledCenter = new THREE.Vector3()
            scaledBox.getSize(scaledSize)
            scaledBox.getCenter(scaledCenter)
            root.position.sub(scaledCenter)

            bodyGroup.position.x = -0.5
            camera.position.set(0, scaledSize.y * 0.08, Math.max(4.5, scaledSize.y * 1.6))
            camera.lookAt(-0.1, 0, 0)
            camera.updateProjectionMatrix()

            modelBounds = new THREE.Box3().setFromObject(root)

            return { size: scaledSize, scale }
        }

        const addPartMesh = (mesh: THREE.Mesh, label: string, clickId = `${label}-${selectableMeshes.length}`) => {
            mesh.userData.partLabel = label
            mesh.userData.clickId = clickId
            mesh.castShadow = true
            mesh.receiveShadow = true
            selectableMeshes.push(mesh)
            return mesh
        }

        const createFallbackHuman = (reason: string) => {
            if (modelRoot) bodyGroup.remove(modelRoot)
            selectableMeshes.length = 0

            const group = new THREE.Group()
            modelRoot = group

            const skin = createClickableMaterial()
            const head = addPartMesh(new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 24), skin.clone()), '头颈部')
            head.position.set(0, 1.55, 0)
            group.add(head)

            const torso = addPartMesh(new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 0.95, 12, 32), skin.clone()), '胸腹部')
            torso.position.set(0, 0.65, 0)
            group.add(torso)

            const pelvis = addPartMesh(new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 18), skin.clone()), '髋部')
            pelvis.scale.set(1.15, 0.65, 0.9)
            pelvis.position.set(0, -0.18, 0)
            group.add(pelvis)

            const limbMaterial = skin.clone()
            const parts = [
                { label: '左上肢', pos: [-0.7, 0.55, 0], rot: [0, 0, -0.28], geo: new THREE.CapsuleGeometry(0.13, 1.05, 8, 20) },
                { label: '右上肢', pos: [0.7, 0.55, 0], rot: [0, 0, 0.28], geo: new THREE.CapsuleGeometry(0.13, 1.05, 8, 20) },
                { label: '大腿/膝部', pos: [-0.24, -1.05, 0], rot: [0, 0, 0.08], geo: new THREE.CapsuleGeometry(0.16, 1.15, 8, 20) },
                { label: '大腿/膝部', pos: [0.24, -1.05, 0], rot: [0, 0, -0.08], geo: new THREE.CapsuleGeometry(0.16, 1.15, 8, 20) },
                { label: '小腿/足部', pos: [-0.24, -2.05, 0], rot: [0, 0, 0.04], geo: new THREE.CapsuleGeometry(0.13, 0.9, 8, 20) },
                { label: '小腿/足部', pos: [0.24, -2.05, 0], rot: [0, 0, -0.04], geo: new THREE.CapsuleGeometry(0.13, 0.9, 8, 20) },
            ]

            parts.forEach((part) => {
                const mesh = addPartMesh(new THREE.Mesh(part.geo, limbMaterial.clone()), part.label)
                mesh.position.set(part.pos[0], part.pos[1], part.pos[2])
                mesh.rotation.set(part.rot[0], part.rot[1], part.rot[2])
                group.add(mesh)
            })

            bodyGroup.add(group)
            modelBounds = new THREE.Box3().setFromObject(group)
            camera.position.set(0, 0.2, 5)
            camera.lookAt(0, 0, 0)
            setStatus('fallback')
            setDebugInfo(`${reason}，已显示可点击的 3D 人体占位模型`)
        }

        const handleLoadedModel = (gltf: { scene: THREE.Group }) => {
            if (disposed) return

            modelRoot = gltf.scene
            selectableMeshes.length = 0

            modelRoot.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh
                    mesh.castShadow = true
                    mesh.receiveShadow = true

                    if (!mesh.material) mesh.material = createClickableMaterial()
                    mesh.userData.clickId = mesh.uuid
                    selectableMeshes.push(mesh)
                }
            })

            if (selectableMeshes.length === 0) {
                createFallbackHuman('GLB 已加载但没有可点击网格')
                return
            }

            bodyGroup.add(modelRoot)
            const { size, scale } = centerAndScaleModel(modelRoot)
            selectableMeshes.forEach((mesh) => {
                const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3())
                mesh.userData.partLabel = guessPartLabel(mesh.name || 'body', center, modelBounds, manualRotationY)
            })
            setStatus('ready')
            setDebugInfo(`GLB 加载成功：${selectableMeshes.length} 个网格，尺寸 ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}，缩放 ${scale.toFixed(2)}`)
        }

        const loader = new GLTFLoader()
        const modelUrls = Array.from(new Set([humanModelUrl, '/src/human.glb']))

        const loadModel = (index: number) => {
            const url = modelUrls[index]
            if (!url) {
                createFallbackHuman('human.glb 加载失败')
                return
            }

            setDebugInfo(`正在加载：${url}`)
            loader.load(
                url,
                handleLoadedModel,
                (event) => {
                    if (!event.total) return
                    const percent = Math.round((event.loaded / event.total) * 100)
                    setDebugInfo(`人体模型加载中：${percent}% (${url})`)
                },
                () => loadModel(index + 1),
            )
        }

        loadModel(0)

        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()

        const updatePointer = (event: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        }

        const handlePointerDown = (event: PointerEvent) => {
            isDragging = true
            hasDragged = false
            dragStartX = event.clientX
            dragStartY = event.clientY
            lastPointerX = event.clientX
            lastPointerY = event.clientY
            renderer.domElement.setPointerCapture(event.pointerId)
        }

        const handlePointerMove = (event: PointerEvent) => {
            updatePointer(event)
            if (!isDragging) return

            const deltaX = event.clientX - lastPointerX
            const deltaY = event.clientY - lastPointerY
            manualRotationY += deltaX * 0.01
            manualRotationX += deltaY * 0.006
            manualRotationX = Math.max(-0.7, Math.min(0.7, manualRotationX))
            lastPointerX = event.clientX
            lastPointerY = event.clientY

            if (Math.abs(event.clientX - dragStartX) > 4 || Math.abs(event.clientY - dragStartY) > 4) {
                hasDragged = true
            }
        }

        const handlePointerUp = (event: PointerEvent) => {
            if (renderer.domElement.hasPointerCapture(event.pointerId)) {
                renderer.domElement.releasePointerCapture(event.pointerId)
            }
            isDragging = false
        }

        const handleClick = (event: PointerEvent) => {
            if (hasDragged) return
            updatePointer(event)
            if (!modelRoot || selectableMeshes.length === 0) return

            raycaster.setFromCamera(pointer, camera)
            const hits = raycaster.intersectObjects(selectableMeshes, true)
            const hit = hits[0]
            if (!hit) return

            const mesh = hit.object as THREE.Mesh
            const localPoint = bodyGroup.worldToLocal(hit.point.clone())
            const partLabel = guessPartLabel(mesh.name, hit.point, modelBounds, bodyGroup.rotation.y)
            const highlightId = partLabel

            if (selectedHighlights.has(highlightId)) {
                const highlight = selectedHighlights.get(highlightId)
                if (highlight) highlightGroup.remove(highlight)
                selectedHighlights.delete(highlightId)
            } else {
                const isLimb = partLabel.includes('上肢') || partLabel.includes('腿') || partLabel.includes('足') || partLabel.includes('膝')
                const geometry = isLimb ? new THREE.CapsuleGeometry(0.18, 0.75, 8, 24) : new THREE.SphereGeometry(0.34, 32, 20)
                const highlight = new THREE.Mesh(geometry, localHighlightMaterial.clone())
                highlight.position.copy(localPoint)
                highlight.lookAt(camera.position)
                highlight.renderOrder = 10
                highlightGroup.add(highlight)
                selectedHighlights.set(highlightId, highlight)
            }

            onSelectPart(partLabel, {
                x: Number(hit.point.x.toFixed(2)),
                y: Number(hit.point.y.toFixed(2)),
                z: Number(hit.point.z.toFixed(2)),
            })
        }

        const animate = () => {
            frame += 1
            bodyGroup.rotation.y = manualRotationY + Math.sin(frame * 0.008) * 0.04
            bodyGroup.rotation.x = manualRotationX
            bodyGroup.position.y = Math.sin(frame * 0.016) * 0.02
            syncHighlightOpacity()
            renderer.render(scene, camera)
            animationId = window.requestAnimationFrame(animate)
        }

        fitContainer()
        animate()

        renderer.domElement.addEventListener('pointerdown', handlePointerDown)
        renderer.domElement.addEventListener('pointermove', handlePointerMove)
        renderer.domElement.addEventListener('pointerup', handlePointerUp)
        renderer.domElement.addEventListener('pointerleave', handlePointerUp)
        renderer.domElement.addEventListener('click', handleClick)
        window.addEventListener('resize', fitContainer)

        return () => {
            disposed = true
            window.cancelAnimationFrame(animationId)
            renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
            renderer.domElement.removeEventListener('pointermove', handlePointerMove)
            renderer.domElement.removeEventListener('pointerup', handlePointerUp)
            renderer.domElement.removeEventListener('pointerleave', handlePointerUp)
            renderer.domElement.removeEventListener('click', handleClick)
            window.removeEventListener('resize', fitContainer)
            selectedHighlights.clear()
            selectableMeshes.length = 0
            renderer.dispose()
            renderer.domElement.remove()
        }
    }, [onSelectPart])

    return (
        <div className="relative h-full min-h-[560px] w-full cursor-grab overflow-hidden rounded-3xl bg-slate-50 active:cursor-grabbing">
            <div ref={containerRef} className="absolute inset-0" />
            {status === 'loading' && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-50/80 px-6 text-center">
                    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                        <div className="font-semibold text-slate-800">人体模型加载中</div>
                        <div className="mt-2 break-all text-xs text-slate-500">{debugInfo}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HumanBody3D
