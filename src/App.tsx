import { useState, useMemo } from 'react'
import { RoomDimensions, PlankDimensions, LayoutType } from './types'
import { calculateAll } from './utils/calculations'
import { Scene } from './components/Scene'
import { SettingsPanel } from './components/SettingsPanel'
import styles from './App.module.css'

function App() {
    // Параметры комнаты
    const [dimensions, setDimensions] = useState<RoomDimensions>({
        length: 6,
        width: 5,
        height: 2.8,
    })

    // Параметры плашек паркета
    const [plank, setPlank] = useState<PlankDimensions>({
        length: 600, // мм
        width: 100, // мм
    })

    // Тип раскладки
    const [layoutType, setLayoutType] = useState<LayoutType>(
        LayoutType.HERRINGBONE,
    )

    // Расчеты (мемоизируем для производительности)
    const calculations = useMemo(
        () => calculateAll(dimensions, plank, layoutType),
        [dimensions, plank, layoutType],
    )

    return (
        <div className={styles.container}>
            {/* 3D сцена на весь экран */}
            <Scene
                dimensions={dimensions}
                plank={plank}
                layoutType={layoutType}
            />

            {/* Панель настроек справа */}
            <SettingsPanel
                dimensions={dimensions}
                onDimensionsChange={setDimensions}
                plank={plank}
                onPlankChange={setPlank}
                layoutType={layoutType}
                onLayoutTypeChange={setLayoutType}
                calculations={calculations}
            />
        </div>
    )
}

export default App
