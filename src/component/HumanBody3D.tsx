import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export type BodyPart = {
    id: string
    label: string
}

const bodyParts: BodyPart[] = [
    { id: 'head', label: '头部' },
    { id: 'chest', label: '胸部' },
    { id: 'abdomen', label: '腹部' },
    { id: 'leftArm', label: '左上臂' },
    { id: 'rightArm', label: '右上臂' },
    { id: 'leftLeg', label: '左大腿' },
    { id: 'rightLeg', label: '右大腿' },
]

interface HumanBody3DProps {
    onSelectPart: (part: string) => void
    selectedParts: string[]
}

const HumanBody3D = ({ onSelectPart, selectedParts }: HumanBody3DProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const rafRef = useRef<number | null>(null)

    const selectedSet = useMemo(() => new Set(selectedParts), [selectedParts])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#f8fafc')

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
        camera.position.set(0, 1.35, 5.2)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        rendererRef.current = renderer
        container.appendChild(renderer.domElement)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
        scene.add(ambientLight)
        const dirLight = new THREE.DirectionalLight(0xffffff, 2.5)
        dirLight.position.set(2, 4, 5)
        scene.add(dirLight)

        const bodyGroup = new THREE.Group()
        scene.add(bodyGroup)

        const createPart = (geometry: THREE.BufferGeometry, materialColor: number, position: [number, number, number], name: string, scale?: [number, number, number]) => {
            const mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshStandardMaterial({
                    color: selectedSet.has(name) ? 0x0ea5e9 : materialColor,
                    metalness: 0.05,
                    roughness: 0.65,
                }),
            )
            mesh.position.set(position[0], position[1], position[2])
            mesh.name = name
            if (scale) mesh.scale.set(scale[0], scale[1], scale[2])
            bodyGroup.add(mesh)
            return mesh
        }

        const head = createPart(new THREE.SphereGeometry(0.45, 32, 32), 0xf8d7c4, [0, 2.2, 0], 'head')
        const chest = createPart(new THREE.CylinderGeometry(0.72, 0.85, 1.3, 24), 0xcbd5e1, [0, 0.95, 0], 'chest')
        const abdomen = createPart(new THREE.CylinderGeometry(0.64, 0.72, 0.85, 24), 0xdbeafe, [0, 0.05, 0], 'abdomen')
        const leftArm = createPart(new THREE.CylinderGeometry(0.16, 0.16, 1.1, 20), 0xfbcfe8, [-1.1, 1.0, 0], 'leftArm', [1, 1, 1])
        const rightArm = createPart(new THREE.CylinderGeometry(0.16, 0.16, 1.1, 20), 0xfbcfe8, [1.1, 1.0, 0], 'rightArm', [1, 1, 1])
        const leftLeg = createPart(new THREE.CylinderGeometry(0.22, 0.24, 1.4, 20), 0xd9f99d, [-0.35, -1.0, 0], 'leftLeg', [1, 1, 1])
        const rightLeg = createPart(new THREE.CylinderGeometry(0.22, 0.24, 1.4, 20), 0xd9f99d, [0.35, -1.0, 0], 'rightLeg', [1, 1, 1])

        const parts = [head, chest, abdomen, leftArm, rightArm, leftLeg, rightLeg]

        const clickArea = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 6, 3),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        )
        clickArea.position.set(0, 0.3, 0)
        scene.add(clickArea)

        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()

        const animate = () => {
            bodyGroup.rotation.y += 0.004
            renderer.render(scene, camera)
            rafRef.current = window.requestAnimationFrame(animate)
        }

        const updateSize = () => {
            const { clientWidth, clientHeight } = container
            renderer.setSize(clientWidth, clientHeight, false)
            camera.aspect = clientWidth / clientHeight
            camera.updateProjectionMatrix()
        }

        const handleClick = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)

            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(parts, false)
            if (intersects.length > 0) {
                const partName = intersects[0].object.name
                const label = bodyParts.find((part) => part.id === partName)?.label || partName
                onSelectPart(label)
            }
        }

        updateSize()
        animate()
        renderer.domElement.addEventListener('click', handleClick)
        window.addEventListener('resize', updateSize)

        return () => {
            renderer.domElement.removeEventListener('click', handleClick)
            window.removeEventListener('resize', updateSize)
            if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
            parts.forEach((mesh) => mesh.geometry.dispose())
            ;[head, chest, abdomen, leftArm, rightArm, leftLeg, rightLeg].forEach((mesh) => {
                ;(mesh.material as THREE.Material).dispose()
            })
            renderer.dispose()
            renderer.domElement.remove()
        }
    }, [onSelectPart, selectedSet])

    return <div ref={containerRef} className="h-full min-h-[420px] w-full rounded-3xl bg-slate-50" />
}

export default HumanBody3D
