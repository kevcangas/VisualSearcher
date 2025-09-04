import { useState, useEffect, useRef } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { VectorGen, InsertMethod } from "../wailsjs/go/main/Sorter";

function App() {
    const [showChart, setShowChart] = useState(false);        // Controla si se muestra la gráfica
    const [dataVectors, setDataVectors] = useState([]);       // Vector de vectores (para animación)
    const [currentIndex, setCurrentIndex] = useState(0);      // Índice del vector actual
    const [isRunning, setIsRunning] = useState(false);        // Si la animación está activa
    const [staticVector, setStaticVector] = useState([]);     // Vector único de VectorGen
    const intervalRef = useRef(null);                         // Referencia al intervalo

    // Función para mostrar la gráfica estática usando VectorGen
    const showStaticChart = async () => {
        try {
            const result = await VectorGen(10);
            setStaticVector(result);
            setShowChart(true);
            setIsRunning(false);       // Detiene animación si estaba corriendo
            clearInterval(intervalRef.current);
        } catch (err) {
            console.error("Error al obtener vector:", err);
        }
    };

    // Función para iniciar la animación usando InsertMethod
    const startAnimation = async () => {
        try {
            const result = await InsertMethod();  // Devuelve number[][]
            setDataVectors(result);
            setCurrentIndex(0);
            setIsRunning(true);
            setShowChart(true);
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    };

    // Efecto que actualiza el gráfico animado cada segundo
    useEffect(() => {
        if (isRunning && dataVectors.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prevIndex => {
                    if (prevIndex < dataVectors.length - 1) {
                        return prevIndex + 1;
                    } else {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        return prevIndex;
                    }
                });
            }, 1000);

            return () => clearInterval(intervalRef.current);
        }
    }, [isRunning, dataVectors]);

    // Elegimos qué datos mostrar: animados o estáticos
    const currentData = isRunning
        ? dataVectors[currentIndex] || []
        : staticVector;

    return (
        <div>
            <button onClick={showStaticChart}>Mostrar gráfica</button>
            <button onClick={startAnimation} disabled={isRunning}>Iniciar animación</button>

            {showChart && (
                <BarChart
                    xAxis={[{ data: currentData.map((_, i) => `#${i + 1}`) }]}
                    series={[{ data: currentData }]}
                    height={300}
                />
            )}
        </div>
    );
}

export default App;
