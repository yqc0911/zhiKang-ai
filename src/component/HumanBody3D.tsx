import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export type BodyPart = {
    id: string
    label: string
}

const bodyParts: BodyPart[] = [
    { id: 'head', label: '头部' },
    { id: 'neck', label: '颈部' },
    { id: 'chest', label: '胸部' },
    { id: 'abdomen', label: '腹部' },
    { id: 'leftShoulder', label: '左肩' },
    { id: 'rightShoulder', label: '右肩' },
    { id: 'leftArm', label: '左上臂' },
    { id: 'rightArm', label: '右上臂' },
    { id: 'leftForearm', label: '左前臂' },
    { id: 'rightForearm', label: '右前臂' },
    { id: 'leftHand', label: '左手' },
    { id: 'rightHand', label: '右手' },
    { id: 'pelvis', label: '骨盆' },
    { id: 'leftThigh', label: '左大腿' },
    { id: 'rightThigh', label: '右大腿' },
    { id: 'leftCalf', label: '左小腿' },
    { id: 'rightCalf', label: '右小腿' },
    { id: 'leftFoot', label: '左脚' },
    { id: 'rightFoot', label: '右脚' },
]

interface HumanBody3DProps {
    onSelectPart: (part: string) => void
    selectedParts: string[]
}

const HumanBody3D = ({ onSelectPart, selectedParts }: HumanBody3DProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const selectedSet = useMemo(() => new Set(selectedParts), [selectedParts])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#f8fafc')

        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
        camera.position.set(0, 0.9, 12.5)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.setClearColor(0xf8fafc, 1)
        container.appendChild(renderer.domElement)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2.2)
        scene.add(ambientLight)

        const topLight = new THREE.DirectionalLight(0xffffff, 2.8)
        topLight.position.set(2, 5, 6)
        scene.add(topLight)

        const frontLight = new THREE.DirectionalLight(0xcfe8ff, 1.4)
        frontLight.position.set(0, 1.5, 5)
        scene.add(frontLight)

        const bodyGroup = new THREE.Group()
        bodyGroup.position.set(0, 0, 0)
        scene.add(bodyGroup)

        const createMaterial = (name: string, color: number) =>
            new THREE.MeshStandardMaterial({
                color: selectedSet.has(name) ? 0x38bdf8 : color,
                metalness: 0.08,
                roughness: 0.56,
            })

        const createMesh = (
            geometry: THREE.BufferGeometry,
            color: number,
            name: string,
            position: [number, number, number],
            rotation?: [number, number, number],
        ) => {
            const mesh = new THREE.Mesh(geometry, createMaterial(name, color))
            mesh.name = name
            mesh.position.set(position[0], position[1], position[2])
            if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2])
            bodyGroup.add(mesh)
            return mesh
        }

        const head = createMesh(new THREE.SphereGeometry(0.58, 48, 48), 0xf8d7c4, 'head', [0, 4.1, 0])
        const neck = createMesh(new THREE.CylinderGeometry(0.18, 0.22, 0.45, 32), 0xf1c7ad, 'neck', [0, 3.45, 0])
        const chest = createMesh(new THREE.CylinderGeometry(0.95, 1.05, 1.55, 40), 0xdbeafe, 'chest', [0, 2.5, 0])
        const abdomen = createMesh(new THREE.CylinderGeometry(0.82, 0.95, 1.0, 36), 0xe0f2fe, 'abdomen', [0, 1.35, 0])
        const pelvis = createMesh(new THREE.CylinderGeometry(0.78, 0.86, 0.55, 36), 0xbfdbfe, 'pelvis', [0, 0.55, 0])

        const leftShoulder = createMesh(new THREE.SphereGeometry(0.22, 24, 24), 0xfbcfe8, 'leftShoulder', [-1.1, 2.9, 0])
        const rightShoulder = createMesh(new THREE.SphereGeometry(0.22, 24, 24), 0xfbcfe8, 'rightShoulder', [1.1, 2.9, 0])
        const leftArm = createMesh(new THREE.CylinderGeometry(0.18, 0.22, 1.2, 28), 0xf9a8d4, 'leftArm', [-1.95, 2.25, 0], [0, 0, Math.PI / 2])
        const rightArm = createMesh(new THREE.CylinderGeometry(0.18, 0.22, 1.2, 28), 0xf9a8d4, 'rightArm', [1.95, 2.25, 0], [0, 0, Math.PI / 2])
        const leftForearm = createMesh(new THREE.CylinderGeometry(0.16, 0.2, 1.1, 28), 0xf9a8d4, 'leftForearm', [-2.85, 1.85, 0], [0, 0, Math.PI / 2])
        const rightForearm = createMesh(new THREE.CylinderGeometry(0.16, 0.2, 1.1, 28), 0xf9a8d4, 'rightForearm', [2.85, 1.85, 0], [0, 0, Math.PI / 2])
        const leftHand = createMesh(new THREE.SphereGeometry(0.18, 24, 24), 0xf8d7c4, 'leftHand', [-3.55, 1.85, 0])
        const rightHand = createMesh(new THREE.SphereGeometry(0.18, 24, 24), 0xf8d7c4, 'rightHand', [3.55, 1.85, 0])

        const leftThigh = createMesh(new THREE.CylinderGeometry(0.26, 0.3, 1.45, 28), 0xd9f99d, 'leftThigh', [-0.38, -0.65, 0])
        const rightThigh = createMesh(new THREE.CylinderGeometry(0.26, 0.3, 1.45, 28), 0xd9f99d, 'rightThigh', [0.38, -0.65, 0])
        const leftCalf = createMesh(new THREE.CylinderGeometry(0.22, 0.24, 1.4, 28), 0x86efac, 'leftCalf', [-0.38, -1.9, 0])
        const rightCalf = createMesh(new THREE.CylinderGeometry(0.22, 0.24, 1.4, 28), 0x86efac, 'rightCalf', [0.38, -1.9, 0])
        const leftFoot = createMesh(new THREE.BoxGeometry(0.45, 0.2, 0.8), 0x93c5fd, 'leftFoot', [-0.38, -2.75, 0.18])
        const rightFoot = createMesh(new THREE.BoxGeometry(0.45, 0.2, 0.8), 0x93c5fd, 'rightFoot', [0.38, -2.75, 0.18])

        const parts = [
            head,
            neck,
            chest,
            abdomen,
            pelvis,
            leftShoulder,
            rightShoulder,
            leftArm,
            rightArm,
            leftForearm,
            rightForearm,
            leftHand,
            rightHand,
            leftThigh,
            rightThigh,
            leftCalf,
            rightCalf,
            leftFoot,
            rightFoot,
        ]

        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()
        const targetRotation = { x: -0.08, y: 0 }

        const fitContainer = () => {
            const { clientWidth, clientHeight } = container
            renderer.setSize(clientWidth, clientHeight, false)
            camera.aspect = clientWidth / clientHeight
            camera.updateProjectionMatrix()
        }

        const onPointerMove = (event: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        }

        const onClick = () => {
            raycaster.setFromCamera(pointer, camera)
            const hits = raycaster.intersectObjects(parts, false)
            if (hits.length > 0) {
                const partName = hits[0].object.name
                const label = bodyParts.find((part) => part.id === partName)?.label || partName
                onSelectPart(label)
            }
        }

        let frame = 0
        const animate = () => {
            frame += 1
            bodyGroup.rotation.y = Math.sin(frame * 0.01) * 0.08 + targetRotation.y
            bodyGroup.rotation.x = targetRotation.x
            bodyGroup.position.y = 0.55 + Math.sin(frame * 0.018) * 0.02
            renderer.render(scene, camera)
            requestAnimationFrame(animate)
        }

        fitContainer()
        animate()

        renderer.domElement.addEventListener('pointermove', onPointerMove)
        renderer.domElement.addEventListener('click', onClick)
        window.addEventListener('resize', fitContainer)

        return () => {
            renderer.domElement.removeEventListener('pointermove', onPointerMove)
            renderer.domElement.removeEventListener('click', onClick)
            window.removeEventListener('resize', fitContainer)
            parts.forEach((mesh) => {
                mesh.geometry.dispose()
                ;(mesh.material as THREE.Material).dispose()
            })
            renderer.dispose()
            renderer.domElement.remove()
        }
    }, [onSelectPart, selectedSet])

    return <div ref={containerRef} className="h-full min-h-[560px] w-full overflow-hidden rounded-3xl bg-slate-50" />
}

export default HumanBody3D
