import { RoomDimensions, PlankDimensions, LayoutType, Calculations } from '../types'
import styles from './SettingsPanel.module.css'

interface SettingsPanelProps {
    dimensions: RoomDimensions
    onDimensionsChange: (dimensions: RoomDimensions) => void
    plank: PlankDimensions
    onPlankChange: (plank: PlankDimensions) => void
    layoutType: LayoutType
    onLayoutTypeChange: (type: LayoutType) => void
    calculations: Calculations
}

/**
 * Панель настроек с контролами и расчетами
 */
export function SettingsPanel({
    dimensions,
    onDimensionsChange,
    plank,
    onPlankChange,
    layoutType,
    onLayoutTypeChange,
    calculations,
}: SettingsPanelProps) {
    const handleDimensionChange = (key: keyof RoomDimensions, value: number) => {
        onDimensionsChange({ ...dimensions, [key]: value })
    }

    const handlePlankChange = (key: keyof PlankDimensions, value: number) => {
        onPlankChange({ ...plank, [key]: value })
    }

    const InputField = ({
        label,
        value,
        onChange,
        min = 1,
        max = 20,
        step = 0.1,
    }: {
        label: string
        value: number
        onChange: (value: number) => void
        min?: number
        max?: number
        step?: number
    }) => (
        <div className={styles.inputGroup}>
            <label>{label}</label>
            <div className={styles.sliderContainer}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={e => onChange(parseFloat(e.target.value))}
                    className={styles.slider}
                />
                <input
                    type="number"
                    value={value.toFixed(2)}
                    onChange={e => {
                        const val = parseFloat(e.target.value)
                        if (!isNaN(val)) onChange(val)
                    }}
                    className={styles.numberInput}
                />
            </div>
        </div>
    )

    return (
        <div className={styles.panel}>
            <div className={styles.content}>
                {/* Заголовок */}
                <h1 className={styles.title}>3D Комната</h1>

                {/* Параметры комнаты */}
                <section className={styles.section}>
                    <h2>Параметры комнаты</h2>
                    <InputField
                        label="Длина (м)"
                        value={dimensions.length}
                        onChange={val => handleDimensionChange('length', val)}
                        min={2}
                        max={20}
                        step={0.1}
                    />
                    <InputField
                        label="Ширина (м)"
                        value={dimensions.width}
                        onChange={val => handleDimensionChange('width', val)}
                        min={2}
                        max={20}
                        step={0.1}
                    />
                    <InputField
                        label="Высота (м)"
                        value={dimensions.height}
                        onChange={val => handleDimensionChange('height', val)}
                        min={2}
                        max={5}
                        step={0.1}
                    />
                </section>

                {/* Параметры плашек */}
                <section className={styles.section}>
                    <h2>Плашки паркета</h2>
                    <InputField
                        label="Длина (мм)"
                        value={plank.length}
                        onChange={val => handlePlankChange('length', val)}
                        min={300}
                        max={1000}
                        step={10}
                    />
                    <InputField
                        label="Ширина (мм)"
                        value={plank.width}
                        onChange={val => handlePlankChange('width', val)}
                        min={50}
                        max={200}
                        step={10}
                    />
                </section>

                {/* Тип раскладки */}
                <section className={styles.section}>
                    <h2>Тип раскладки</h2>
                    <div className={styles.layoutButtons}>
                        <button
                            className={`${styles.layoutBtn} ${
                                layoutType === LayoutType.HERRINGBONE ? styles.active : ''
                            }`}
                            onClick={() => onLayoutTypeChange(LayoutType.HERRINGBONE)}
                        >
                            Ёлочка
                        </button>
                        <button
                            className={`${styles.layoutBtn} ${layoutType === LayoutType.STRAIGHT ? styles.active : ''}`}
                            onClick={() => onLayoutTypeChange(LayoutType.STRAIGHT)}
                        >
                            Прямая
                        </button>
                    </div>
                </section>

                {/* Расчеты */}
                <section className={styles.section}>
                    <h2>Расчеты</h2>
                    <div className={styles.calculations}>
                        <div className={styles.calcItem}>
                            <span>Площадь стен:</span>
                            <strong>{calculations.paintArea} м²</strong>
                        </div>
                        <div className={styles.calcItem}>
                            <span>Краска (л):</span>
                            <strong>{calculations.paintVolume} л</strong>
                        </div>
                        <div className={styles.calcItem}>
                            <span>Погонаж плинтуса:</span>
                            <strong>{calculations.skirtingLength} м</strong>
                        </div>
                        <div className={styles.calcItem}>
                            <span>Плашек (базовое):</span>
                            <strong>{calculations.totalPlanks} шт</strong>
                        </div>
                        <div className={styles.calcItem}>
                            <span>Плашек (+5% запас):</span>
                            <strong>{calculations.planksWithMargin} шт</strong>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
