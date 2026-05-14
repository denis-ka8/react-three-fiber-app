import { useState, useMemo } from 'react'
import { RoomDimensions, PlankDimensions, LayoutType } from './types'
import { calculateAll } from './utils/calculations'
import { generateFloorPattern } from './utils/patterns'
import { Scene } from './components/Scene'
import { SettingsPanel } from './components/SettingsPanel'
import styles from './App.module.css'

function App() {
    const [dimensions, setDimensions] = useState<RoomDimensions>({
        length: 6,
        width: 5,
        height: 2.8,
    })

    const [plank, setPlank] = useState<PlankDimensions>({
        length: 600, // мм
        width: 100, // мм
    })

    const [layoutType, setLayoutType] = useState<LayoutType>(LayoutType.HERRINGBONE)

    const planks = useMemo(() => generateFloorPattern(dimensions, plank, layoutType), [dimensions, plank, layoutType])

    const calculations = useMemo(() => calculateAll(dimensions, planks.length), [dimensions, planks])

    return (
        <div className={styles.container}>
            {/* 3D сцена на весь экран */}
            <Scene dimensions={dimensions} planks={planks} />

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
