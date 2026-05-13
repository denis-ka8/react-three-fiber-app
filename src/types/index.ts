export enum LayoutType {
    HERRINGBONE = 'herringbone',
    STRAIGHT = 'straight',
}

export interface RoomDimensions {
    length: number // м
    width: number // м
    height: number // м
}

export interface PlankDimensions {
    length: number // мм
    width: number // мм
}

export interface Calculations {
    paintArea: number // м²
    skirtingLength: number // м (погонаж)
    totalPlanks: number // количество плашек
    planksWithMargin: number // с запасом 5%
    paintVolume: number // л (при расходе 0.1л/м²)
}

export interface FloorPlank {
    position: [number, number, number]
    rotation: [number, number, number]
    size: PlankDimensions
}
