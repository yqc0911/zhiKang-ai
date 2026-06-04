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

const normalizeAngle = (angle: number) => {
    const twoPi = Math.PI * 2
    return ((angle % twoPi) + twoPi) % twoPi
}

const isBackFacing = (rotationY: number) => {
    const angle = normalizeAngle(rotationY)
    return angle <= Math.PI / 2 || angle >= Math.PI * 1.5
}

const guessPartLabel = (point: THREE.Vector3, bounds: THREE.Box3 | null, rotationY: number) => {
    if (!bounds) return '身体部位'

    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    bounds.getSize(size)
    bounds.getCenter(center)

    const normalizedY = size.y > 0 ? (point.y - bounds.min.y) / size.y : 0.5
    const normalizedX = size.x > 0 ? (point.x - center.x) / Math.max(size.x / 2, 0.01) : 0
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
    if (normalizedY >= 0.17) return normalizedX >= 0 ? (back ? '右大腿后侧/右膝后' : '右大腿/右膝') : back ? '左大腿后侧/左膝后' : '左大腿/左膝'
    return normalizedX >= 0 ? (back ? '右小腿后侧/右足跟' : '右小腿/右足部') : back ? '左小腿后侧/左足跟' : '左小腿/左足部'
}

const createSkinMaterial = () =>
    new THREE.MeshStandardMaterial({
        color: 0xf8d7c4,
        metalness: 0.04,
        roughness: 0.58,
    })

const HumanBody3D = ({ onSelectPart }: HumanBody3DProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [status, setStatus] = useState<'loading' | 'ready'>('loading')

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#f8fafc')

        const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)
        camera.position.set(0, 0.2, 6)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.setClearColor(0xf8fafc, 1)
        renderer.domElement.style.display = 'block'
        renderer.domElement.style.height = '100%'
        renderer.domElement.style.width = '100%'
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

        const modelHolder = new THREE.Group()
        bodyGroup.add(modelHolder)

        const selectableMeshes: THREE.Mesh[] = []
        const selectedMeshIds = new Set<string>()
        const originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>()
        const highlightMaterial = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0ea5e9,
            emissiveIntensity: 0.18,
            metalness: 0.04,
            roughness: 0.38,
        })

        let modelBounds: THREE.Box3 | null = null
        let currentModel: THREE.Object3D | null = null
        let animationId = 0
        let frame = 0
        let isDragging = false
        let hasDragged = false
        let dragStartX = 0
        let dragStartY = 0
        let lastPointerX = 0
        let lastPointerY = 0
        let manualRotationY = 0
        let manualRotationX = 0
        let disposed = false

        const clearModel = () => {
            if (currentModel) modelHolder.remove(currentModel)
            selectableMeshes.forEach((mesh) => {
                const material = originalMaterials.get(mesh)
                if (material) mesh.material = material
            })
            selectableMeshes.length = 0
            selectedMeshIds.clear()
            originalMaterials.clear()
            currentModel = null
        }

        const addSelectable = (mesh: THREE.Mesh, label?: string) => {
            mesh.castShadow = true
            mesh.receiveShadow = true
            if (!mesh.material) mesh.material = createSkinMaterial()
            if (label) mesh.userData.partLabel = label
            mesh.userData.clickId = mesh.uuid
            originalMaterials.set(mesh, mesh.material)
            selectableMeshes.push(mesh)
            return mesh
        }

        const syncMeshHighlights = () => {
            selectableMeshes.forEach((mesh) => {
                const clickId = mesh.userData.clickId as string | undefined
                const shouldHighlight = clickId ? selectedMeshIds.has(clickId) : false
                mesh.material = shouldHighlight ? highlightMaterial : originalMaterials.get(mesh) || mesh.material
            })
        }

        const fitCameraToObject = (root: THREE.Object3D) => {
            const box = new THREE.Box3().setFromObject(root)
            const size = new THREE.Vector3()
            const center = new THREE.Vector3()
            box.getSize(size)
            box.getCenter(center)

            root.position.sub(center)
            const maxAxis = Math.max(size.x, size.y, size.z)
            const scale = maxAxis > 0 ? 3.2 / maxAxis : 1
            root.scale.setScalar(scale)

            const fittedBox = new THREE.Box3().setFromObject(root)
            const fittedCenter = new THREE.Vector3()
            const fittedSize = new THREE.Vector3()
            fittedBox.getCenter(fittedCenter)
            fittedBox.getSize(fittedSize)
            root.position.sub(fittedCenter)
            modelBounds = new THREE.Box3().setFromObject(root)

            camera.position.set(0, fittedSize.y * 0.08, Math.max(5.2, fittedSize.y * 1.9))
            camera.lookAt(0, 0, 0)
            camera.updateProjectionMatrix()
        }

        const createFallbackHuman = () => {
            clearModel()
            const group = new THREE.Group()
            const skin = createSkinMaterial()

            const head = addSelectable(new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 24), skin.clone()), '头部')
            head.position.set(0, 1.55, 0)
            group.add(head)

            const neck = addSelectable(new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.18, 8, 16), skin.clone()), '颈部')
            neck.position.set(0, 1.22, 0)
            group.add(neck)

            const torso = addSelectable(new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 0.95, 12, 32), skin.clone()), '胸腹部')
            torso.position.set(0, 0.58, 0)
            group.add(torso)

            const pelvis = addSelectable(new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 18), skin.clone()), '髋部')
            pelvis.scale.set(1.15, 0.65, 0.9)
            pelvis.position.set(0, -0.22, 0)
            group.add(pelvis)

            const parts = [
                { label: '左上肢', pos: [-0.72, 0.62, 0], rot: [0, 0, -0.28], geo: new THREE.CapsuleGeometry(0.13, 1.05, 8, 20) },
                { label: '右上肢', pos: [0.72, 0.62, 0], rot: [0, 0, 0.28], geo: new THREE.CapsuleGeometry(0.13, 1.05, 8, 20) },
                { label: '左大腿/左膝', pos: [-0.24, -1.05, 0], rot: [0, 0, 0.08], geo: new THREE.CapsuleGeometry(0.16, 1.15, 8, 20) },
                { label: '右大腿/右膝', pos: [0.24, -1.05, 0], rot: [0, 0, -0.08], geo: new THREE.CapsuleGeometry(0.16, 1.15, 8, 20) },
                { label: '左小腿/左足部', pos: [-0.24, -2.05, 0], rot: [0, 0, 0.04], geo: new THREE.CapsuleGeometry(0.13, 0.9, 8, 20) },
                { label: '右小腿/右足部', pos: [0.24, -2.05, 0], rot: [0, 0, -0.04], geo: new THREE.CapsuleGeometry(0.13, 0.9, 8, 20) },
            ]

            parts.forEach((part) => {
                const mesh = addSelectable(new THREE.Mesh(part.geo, skin.clone()), part.label)
                mesh.position.set(part.pos[0], part.pos[1], part.pos[2])
                mesh.rotation.set(part.rot[0], part.rot[1], part.rot[2])
                group.add(mesh)
            })

            modelHolder.add(group)
            currentModel = group
            fitCameraToObject(group)
            setStatus('ready')
        }

        const useLoadedModel = (root: THREE.Object3D) => {
            clearModel()
            const meshNames: string[] = []
            root.traverse((child: THREE.Object3D) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh
                    addSelectable(mesh)
                    meshNames.push(mesh.name || mesh.uuid)
                }
            })

            console.info('[HumanBody3D] human.glb mesh count:', meshNames.length, meshNames)

            if (selectableMeshes.length === 0) {
                createFallbackHuman()
                return
            }

            modelHolder.add(root)
            currentModel = root
            fitCameraToObject(root)
            setStatus('ready')
        }

        createFallbackHuman()

        const loader = new GLTFLoader()
        const modelUrls = Array.from(new Set([humanModelUrl, '/src/human.glb']))
        const loadModel = (index: number) => {
            const url = modelUrls[index]
            if (!url || disposed) return

            loader.load(
                url,
                (gltf: { scene: THREE.Object3D }) => {
                    if (!disposed) useLoadedModel(gltf.scene)
                },
                undefined,
                () => loadModel(index + 1),
            )
        }
        loadModel(0)

        const fitContainer = () => {
            const width = Math.max(container.clientWidth, 320)
            const height = Math.max(container.clientHeight, 420)
            renderer.setSize(width, height, false)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }

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
            if (Math.abs(event.clientX - dragStartX) > 4 || Math.abs(event.clientY - dragStartY) > 4) hasDragged = true
        }

        const handlePointerUp = (event: PointerEvent) => {
            if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId)
            isDragging = false
        }

        const handleClick = (event: PointerEvent) => {
            if (hasDragged || selectableMeshes.length === 0) return
            updatePointer(event)
            raycaster.setFromCamera(pointer, camera)
            const hit = raycaster.intersectObjects(selectableMeshes, true)[0]
            if (!hit) return

            const mesh = hit.object as THREE.Mesh
            const partLabel = (mesh.userData.partLabel as string | undefined) || guessPartLabel(hit.point, modelBounds, bodyGroup.rotation.y)
            const clickId = (mesh.userData.clickId as string | undefined) || mesh.uuid

            if (selectedMeshIds.has(clickId)) {
                selectedMeshIds.delete(clickId)
            } else {
                selectedMeshIds.add(clickId)
            }
            syncMeshHighlights()

            if (selectableMeshes.length <= 2) {
                console.warn('[HumanBody3D] 当前 human.glb 可点击 mesh 数量很少，若点击后全身变色，说明模型没有按身体部位拆分，无法实现真实局部高亮。', selectableMeshes.map((item) => item.name || item.uuid))
            }

            onSelectPart(partLabel, {
                x: Number(hit.point.x.toFixed(2)),
                y: Number(hit.point.y.toFixed(2)),
                z: Number(hit.point.z.toFixed(2)),
            })
        }

        const animate = () => {
            frame += 1
            bodyGroup.rotation.y = manualRotationY
            bodyGroup.rotation.x = manualRotationX
            syncMeshHighlights()
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
                    </div>
                </div>
            )}
        </div>
    )
}

export default HumanBody3D
