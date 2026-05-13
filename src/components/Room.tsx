import * as THREE from 'three'
import { RoomDimensions } from '../types'

interface RoomProps {
    dimensions: RoomDimensions
}

export function Room({ dimensions }: RoomProps) {
    const { length, width, height } = dimensions

    const wallColor = new THREE.Color(0xf5f5f0)
    const wallRoughness = 0.85
    const wallMetalness = 0.0

    const wallMaterial = (
        <meshStandardMaterial
            color={wallColor}
            roughness={wallRoughness}
            metalness={wallMetalness}
        />
    )

    return (
        <group>
            {/* Передняя стена */}
            <mesh
                position={[0, height / 2, width / 2]}
                rotation={[0, Math.PI, 0]}
            >
                <planeGeometry args={[length, height]} />
                {wallMaterial}
            </mesh>

            {/* Задняя стена */}
            <mesh position={[0, height / 2, -width / 2]} rotation={[0, 0, 0]}>
                <planeGeometry args={[length, height]} />
                {wallMaterial}
            </mesh>

            {/* Левая стена */}
            <mesh
                position={[-length / 2, height / 2, 0]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <planeGeometry args={[width, height]} />
                {wallMaterial}
            </mesh>

            {/* Правая стена */}
            <mesh
                position={[length / 2, height / 2, 0]}
                rotation={[0, (Math.PI / 2) * 3, 0]}
            >
                <planeGeometry args={[width, height]} />
                {wallMaterial}
            </mesh>
        </group>
    )
}
