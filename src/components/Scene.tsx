import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { RoomDimensions, FloorPlank } from '../types'
import { Room } from './Room'
import { Floor } from './Floor'
import { Skirting } from './Skirting'

interface SceneProps {
    dimensions: RoomDimensions
    planks: FloorPlank[]
}

/**
 * Компонент сцены с канвасом
 */
export function Scene({ dimensions, planks }: SceneProps) {
    const cameraDistance = Math.max(dimensions.length, dimensions.width) * 0.8

    return (
        <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{
                position: [cameraDistance * 0.5, dimensions.height * 1.2, cameraDistance * 0.5],
                fov: 75,
                near: 0.1,
                far: 1000,
            }}
            gl={{ antialias: true }}
        >
            {/* Освещение */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 15, 10]}
                intensity={0.8}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                castShadow
            />

            {/* Комната */}
            <Room dimensions={dimensions} />

            {/* Пол */}
            <Floor planks={planks} />

            {/* Плинтус */}
            <Skirting dimensions={dimensions} />

            {/* Управление камерой */}
            <OrbitControls
                autoRotate={false}
                autoRotateSpeed={2}
                enableDamping
                dampingFactor={0.05}
                minDistance={0.1}
                maxDistance={Math.max(dimensions.length, dimensions.width) * 2}
            />
        </Canvas>
    )
}
