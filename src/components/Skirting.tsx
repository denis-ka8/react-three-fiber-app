import * as THREE from 'three'
import { RoomDimensions } from '../types'

interface SkirtingProps {
    dimensions: RoomDimensions
}

const SKIRTING_HEIGHT = 0.1 // 10 см
const SKIRTING_THICKNESS = 0.015 // 1.5 см
const SKIRTING_COLOR = new THREE.Color(0xd4a574) // цвет под дерево

/**
 * Компонент плинтуса (сирting board)
 */
export function Skirting({ dimensions }: SkirtingProps) {
    const { length, width } = dimensions

    const material = <meshStandardMaterial color={SKIRTING_COLOR} roughness={0.7} metalness={0} />

    return (
        <group>
            {/* Передний плинтус */}
            <mesh position={[0, SKIRTING_HEIGHT / 2, width / 2 - SKIRTING_THICKNESS / 2]}>
                <boxGeometry args={[length, SKIRTING_HEIGHT, SKIRTING_THICKNESS]} />
                {material}
            </mesh>

            {/* Задний плинтус */}
            <mesh position={[0, SKIRTING_HEIGHT / 2, -width / 2 + SKIRTING_THICKNESS / 2]}>
                <boxGeometry args={[length, SKIRTING_HEIGHT, SKIRTING_THICKNESS]} />
                {material}
            </mesh>

            {/* Левый плинтус */}
            <mesh position={[-length / 2 + SKIRTING_THICKNESS / 2, SKIRTING_HEIGHT / 2, 0]}>
                <boxGeometry args={[SKIRTING_THICKNESS, SKIRTING_HEIGHT, width]} />
                {material}
            </mesh>

            {/* Правый плинтус */}
            <mesh position={[length / 2 - SKIRTING_THICKNESS / 2, SKIRTING_HEIGHT / 2, 0]}>
                <boxGeometry args={[SKIRTING_THICKNESS, SKIRTING_HEIGHT, width]} />
                {material}
            </mesh>
        </group>
    )
}
