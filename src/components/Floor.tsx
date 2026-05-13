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

const vertexShader = `
    attribute vec2 instanceSize;
    attribute vec3 instancePosition;
    attribute vec4 instanceRotation;

    varying vec2 vUv;

    // Функция для преобразования кватерниона в матрицу вращения
    mat3 fromQuat(vec4 q) {
        float x2 = q.x * q.x;
        float y2 = q.y * q.y;
        float z2 = q.z * q.z;
        float xy = q.x * q.y;
        float xz = q.x * q.z;
        float yz = q.y * q.z;
        float wx = q.w * q.x;
        float wy = q.w * q.y;
        float wz = q.w * q.z;

        return mat3(
            1.0 - 2.0 * (y2 + z2), 2.0 * (xy - wz), 2.0 * (xz + wy),
            2.0 * (xy + wz), 1.0 - 2.0 * (x2 + z2), 2.0 * (yz - wx),
            2.0 * (xz - wy), 2.0 * (yz + wx), 1.0 - 2.0 * (x2 + y2)
        );
    }

    void main() {
        vUv = uv;

        // Масштабируем вершину по размерам плашки
        vec3 transformed = position * vec3(instanceSize.x, instanceSize.y, 1.0);

        // Применяем вращение через кватернион
        mat3 rotationMatrix = fromQuat(instanceRotation);
        transformed = rotationMatrix * transformed;

        // Перемещаем в позицию
        transformed += instancePosition;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`

const fragmentShader = `
    uniform sampler2D textureMap;
    varying vec2 vUv;

    void main() {
        gl_FragColor = texture2D(textureMap, vUv);
    }`

/**
 * Компонент пола с ёлочкой или прямой раскладкой
 */
export function Floor({ dimensions, plank, layoutType }: FloorProps) {
    // const plankLengthM = plank.length / 1000
    // const plankWidthM = plank.width / 1000

    const planks = useMemo<FloorPlank[]>(
        () => generateFloorPattern(dimensions, plank, layoutType),
        [dimensions, plank, layoutType],
    )

    const texture = useTexture('assets/textures/floor.png')

    // const geometry = useMemo(() => new THREE.PlaneGeometry(plankLengthM, plankWidthM), [plankLengthM, plankWidthM])
    const geometry = useMemo(() => createInstancedGeometryWithSizes(planks), [planks])

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                textureMap: { value: texture },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: false,
            side: THREE.DoubleSide, // THREE.FrontSide
        })
    }, [texture])

    // const material = useMemo(() => {
    //     return new THREE.MeshStandardMaterial({
    //         roughness: 0.7,
    //         metalness: 0,
    //         map: texture,
    //         side: THREE.FrontSide,
    //     })
    // }, [])

    const instancedMeshRef = useRef<THREE.InstancedMesh>(null)

    useEffect(() => {
        const mesh = instancedMeshRef.current
        if (!mesh || !planks.length) return

        console.log('Количество плашек:', planks.length)

        const instanceSizeAttr = mesh.geometry.getAttribute('instanceSize')
        const instancePositionAttr = mesh.geometry.getAttribute('instancePosition')
        const instanceRotationAttr = mesh.geometry.getAttribute('instanceRotation')

        if (instanceSizeAttr && instancePositionAttr && instanceRotationAttr) {
            instanceSizeAttr.needsUpdate = true
            instancePositionAttr.needsUpdate = true
            instanceRotationAttr.needsUpdate = true
        }
        /*
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
        */
    }, [planks])

    return <instancedMesh ref={instancedMeshRef} args={[geometry, material, planks.length]} />
}
