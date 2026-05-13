import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { RoomDimensions, PlankDimensions, LayoutType, FloorPlank } from '../types'
import { generateFloorPattern } from '../utils/patterns'

interface FloorProps {
    dimensions: RoomDimensions
    plank: PlankDimensions
    layoutType: LayoutType
}

/**
 * Компонент пола с ёлочкой или прямой раскладкой
 */
export function Floor({ dimensions, plank, layoutType }: FloorProps) {
    const plankLengthM = plank.length / 1000
    const plankWidthM = plank.width / 1000

    const planks = useMemo<FloorPlank[]>(
        () => generateFloorPattern(dimensions, plank, layoutType),
        [dimensions, plank, layoutType],
    )

    const texture = useTexture('assets/textures/floor.png')

    const geometry = useMemo(() => new THREE.PlaneGeometry(plankLengthM, plankWidthM), [plankLengthM, plankWidthM])

    const material = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            roughness: 0.7,
            metalness: 0,
            map: texture,
            side: THREE.FrontSide,
        })
    }, [])

    const instancedMeshRef = useRef<THREE.InstancedMesh>(null)

    useEffect(() => {
        const mesh = instancedMeshRef.current
        if (!mesh || !planks.length) return

        console.log('Количество плашек:', planks.length)

        const matrix = new THREE.Matrix4()

        planks.forEach((plank, index) => {
            matrix.identity()

            if (plank.rotation[0] !== 0) matrix.makeRotationX(plank.rotation[0])

            if (plank.rotation[2] !== 0) {
                const rotationZ = new THREE.Matrix4().makeRotationZ(-plank.rotation[2])
                matrix.multiply(rotationZ)
            }

            matrix.setPosition(plank.position[0], plank.position[1], plank.position[2])

            mesh.setMatrixAt(index, matrix)
        })

        mesh.instanceMatrix.needsUpdate = true
    }, [planks])

    return <instancedMesh ref={instancedMeshRef} args={[geometry, material, planks.length]} />
}
