import {
    Calculations,
    RoomDimensions,
    PlankDimensions,
    LayoutType,
} from '../types'

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
 * Вычисляет количество плашек для прямой раскладки
 */
export const calculatePlanksForStraightLayout = (
    room: RoomDimensions,
    plank: PlankDimensions,
): number => {
    const floorArea = room.length * room.width
    const plankArea = (plank.length / 1000) * (plank.width / 1000) // переводим в м²
    return Math.ceil(floorArea / plankArea)
}

/**
 * Вычисляет количество плашек для ёлочки
 * Площадь покрытия примерно такая же, но с учетом подрезки материал идёт с запасом
 */
export const calculatePlanksForHerringbone = (
    room: RoomDimensions,
    plank: PlankDimensions,
): number => {
    const floorArea = room.length * room.width
    const plankArea = (plank.length / 1000) * (plank.width / 1000)
    // При ёлочке обычно требуется на 5-10% больше материала из-за подрезки
    return Math.ceil((floorArea / plankArea) * 1.08)
}

/**
 * Основной расчет всех параметров
 */
export const calculateAll = (
    room: RoomDimensions,
    plank: PlankDimensions,
    layoutType: LayoutType,
): Calculations => {
    const wallArea = calculateWallArea(room)
    const skirtingLength = calculatePerimeter(room)

    const totalPlanks =
        layoutType === LayoutType.HERRINGBONE
            ? calculatePlanksForHerringbone(room, plank)
            : calculatePlanksForStraightLayout(room, plank)

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
