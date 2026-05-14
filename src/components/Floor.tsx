import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { FloorPlank } from '../types'
import { plankVS } from '../assets/shaders/plank.vs'
import { plankFS } from '../assets/shaders/plank.fs'

interface FloorProps {
    planks: FloorPlank[]
}

const createInstancedGeometryWithSizes = (planks: FloorPlank[]) => {
    // Базовая геометрия 1×1 (будет масштабироваться через атрибуты)
    const baseGeometry = new THREE.PlaneGeometry(1, 1)

    // Атрибуты для хранения данных по экземплярам
    const sizes = new Float32Array(planks.length * 2)
    const positions = new Float32Array(planks.length * 3)
    const rotations = new Float32Array(planks.length * 4) // кватернион

    planks.forEach((plank, i) => {
        // Размеры (в метрах)
        sizes[i * 2] = plank.size.length / 1000 // длина
        sizes[i * 2 + 1] = plank.size.width / 1000 // ширина

        // Позиции
        positions[i * 3] = plank.position[0]
        positions[i * 3 + 1] = plank.position[1]
        positions[i * 3 + 2] = plank.position[2]

        // Вращения (кватернион)
        const quaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(plank.rotation[0], plank.rotation[1], plank.rotation[2]),
        )
        rotations[i * 4] = quaternion.x
        rotations[i * 4 + 1] = quaternion.y
        rotations[i * 4 + 2] = quaternion.z
        rotations[i * 4 + 3] = quaternion.w
    })

    baseGeometry.setAttribute('instanceSize', new THREE.InstancedBufferAttribute(sizes, 2))
    baseGeometry.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(positions, 3))
    baseGeometry.setAttribute('instanceRotation', new THREE.InstancedBufferAttribute(rotations, 4))

    return baseGeometry
}

/**
 * Компонент пола с ёлочкой или прямой раскладкой
 */
export function Floor({ planks }: FloorProps) {
    const texture = useTexture('assets/textures/floor.png')

    const geometry = useMemo(() => createInstancedGeometryWithSizes(planks), [planks])

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                textureMap: { value: texture },
            },
            vertexShader: plankVS,
            fragmentShader: plankFS,
            transparent: false,
            side: THREE.DoubleSide, // THREE.FrontSide
        })
    }, [texture])

    const instancedMeshRef = useRef<THREE.InstancedMesh>(null)

    useEffect(() => {
        const mesh = instancedMeshRef.current
        if (!mesh || !planks.length) return

        const instanceSizeAttr = mesh.geometry.getAttribute('instanceSize')
        const instancePositionAttr = mesh.geometry.getAttribute('instancePosition')
        const instanceRotationAttr = mesh.geometry.getAttribute('instanceRotation')

        if (instanceSizeAttr && instancePositionAttr && instanceRotationAttr) {
            instanceSizeAttr.needsUpdate = true
            instancePositionAttr.needsUpdate = true
            instanceRotationAttr.needsUpdate = true
        }
    }, [planks])

    return <instancedMesh ref={instancedMeshRef} args={[geometry, material, planks.length]} />
}
