import { Calculations, RoomDimensions } from '../types'

const WALL_PAINT_COVERAGE = 0.1 // л/м²

/**
 * Вычисляет площадь стен для расчета краски
 */
export const calculateWallArea = (room: RoomDimensions): number => {
    const { length, width, height } = room
    return 2 * (length + width) * height
}

/**
 * Вычисляет периметр комнаты для плинтуса
 */
export const calculatePerimeter = (room: RoomDimensions): number => {
    return 2 * (room.length + room.width)
}

/**
 * Основной расчет всех параметров
 */
export const calculateAll = (room: RoomDimensions, totalPlanks: number): Calculations => {
    const wallArea = calculateWallArea(room)
    const skirtingLength = calculatePerimeter(room)

    const planksWithMargin = Math.ceil(totalPlanks * 1.05)
    const paintVolume = Math.ceil(wallArea * WALL_PAINT_COVERAGE)

    return {
        paintArea: Math.round(wallArea * 100) / 100,
        skirtingLength: Math.round(skirtingLength * 100) / 100,
        totalPlanks,
        planksWithMargin,
        paintVolume,
    }
}
