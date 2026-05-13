import { FloorPlank, RoomDimensions, PlankDimensions, LayoutType } from '../types'

const JOINT_GAP = 0.002 // 2 мм зазор между плашками

const _placeHerringboneHorizontal = (
    planks: FloorPlank[],
    current,
    rotation,
    room: RoomDimensions,
    plank: PlankDimensions,
) => {
    const plankLengthM = plank.length / 1000
    const plankWidthM = plank.width / 1000

    let count = 0
    // horizontal to bottom left
    while (current.x > -(room.length / 2 + plankLengthM)) {
        if (current.x > room.length / 2 || current.z > room.width / 2) {
            current.x -= plankWidthM + JOINT_GAP
            current.z += plankWidthM + JOINT_GAP
            continue
        }

        planks.push({
            position: [current.x + plankLengthM / 2, 0, current.z + plankWidthM / 2],
            rotation: rotation,
        })

        current.x -= plankWidthM + JOINT_GAP
        current.z += plankWidthM + JOINT_GAP
        count++
    }

    current.x += plankLengthM + JOINT_GAP
    return count
}

const _placeHerringboneVertical = (
    planks: FloorPlank[],
    current,
    rotation,
    room: RoomDimensions,
    plank: PlankDimensions,
) => {
    const plankLengthM = plank.length / 1000
    const plankWidthM = plank.width / 1000

    let count = 0
    // vertical to top right
    while (current.z > -(room.width / 2 + plankLengthM)) {
        if (current.z > room.width / 2 || current.x > room.length / 2) {
            current.x += plankWidthM + JOINT_GAP
            current.z -= plankWidthM + JOINT_GAP
            continue
        }

        planks.push({
            position: [current.x + plankWidthM / 2, 0, current.z + plankLengthM / 2],
            rotation: rotation,
        })

        current.x += plankWidthM + JOINT_GAP
        current.z -= plankWidthM + JOINT_GAP
        count++
    }

    current.z += plankLengthM + JOINT_GAP
    current.x += plankWidthM - plankWidthM
    return count
}

/**
 * Генерирует позиции плашек для ёлочки
 */
export const generateHerringbonePattern = (room: RoomDimensions, plank: PlankDimensions): FloorPlank[] => {
    const planks: FloorPlank[] = []

    // Начальная позиция — левый нижний угол комнаты
    const startX = -room.length / 2
    const startZ = -room.width / 2

    const current = {
        x: startX,
        z: startZ,
    }

    const rotation: [number, number, number] = [-Math.PI / 2, 0, 0]
    const rotation90: [number, number, number] = [-Math.PI / 2, 0, Math.PI / 2]

    let horizontalCount = 1
    let verticalCount = 0
    while (horizontalCount > 0 || verticalCount > 0) {
        horizontalCount = _placeHerringboneHorizontal(planks, current, rotation, room, plank)
        verticalCount = _placeHerringboneVertical(planks, current, rotation90, room, plank)
    }

    return planks
}

/**
 * Генерирует позиции плашек для прямой раскладки
 */
export const generateStraightPattern = (room: RoomDimensions, plank: PlankDimensions): FloorPlank[] => {
    const planks: FloorPlank[] = []
    const plankLengthM = plank.length / 1000
    const plankWidthM = plank.width / 1000

    const startX = -room.length / 2
    const startZ = -room.width / 2

    let currentZ = startZ
    let odd = false
    const rotation: [number, number, number] = [-Math.PI / 2, 0, 0]

    while (currentZ < room.width / 2) {
        let currentX = startX
        odd = !odd
        if (!odd) currentX -= plankLengthM / 2

        while (currentX < room.length / 2) {
            planks.push({
                position: [currentX + plankLengthM / 2, 0, currentZ + plankWidthM / 2],
                rotation: rotation,
            })

            currentX += plankLengthM + JOINT_GAP
        }

        currentZ += plankWidthM + JOINT_GAP
    }

    return planks
}

/**
 * Генерирует паттерн плашек в зависимости от типа раскладки
 */
export const generateFloorPattern = (
    room: RoomDimensions,
    plank: PlankDimensions,
    layoutType: LayoutType,
): FloorPlank[] => {
    return layoutType === LayoutType.HERRINGBONE
        ? generateHerringbonePattern(room, plank)
        : generateStraightPattern(room, plank)
}
