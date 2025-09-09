import { useState, useEffect, useRef } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
// Asegúrate de importar Box o Stack de MUI si quieres un layout más prolijo
// import Box from '@mui/material/Box';
import { VectorGen, InsertMethod, GetCurrentValue, ShellMethod, SortBySelectionMethod } from "../wailsjs/go/main/Sorter";

// --- Configuración de Colores ---
const defaultColor = '#1976d2'; // Color azul por defecto de MUI
const highlightColor = '#d32f2f'; // Color rojo para resaltar

function App() {
    const [showChart, setShowChart] = useState(false);
    const [dataVectors, setDataVectors] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [staticVector, setStaticVector] = useState([]);
    const intervalRef = useRef(null);
    const [highlightVectors, setHighlightVectors] = useState([]);

    // Función para mostrar la gráfica estática usando VectorGen
    const showStaticChart = async () => {
        try {
            const result = await VectorGen(100);
            setStaticVector(result);
            setShowChart(true);
            setIsRunning(false);
            setHighlightVectors([]);
            clearInterval(intervalRef.current);
        } catch (err) {
            console.error("Error al obtener vector:", err);
        }
    };

    // Función para iniciar la animación usando InsertMethod
    const insertMethod = async () => {
        try {
            const vectorsData = await InsertMethod();
            const highlightsData = await GetCurrentValue();

            setDataVectors(vectorsData);
            setHighlightVectors(highlightsData);
            setCurrentIndex(0);
            setIsRunning(true);
            setShowChart(true);
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    };

    const shellMethod = async () => {
        try {
            const vectorsData = await ShellMethod();
            const highlightsData = await GetCurrentValue();

            setDataVectors(vectorsData);
            setHighlightVectors(highlightsData);
            setCurrentIndex(0);
            setIsRunning(true);
            setShowChart(true);
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    };

    const sortBySelectionMethod = async () => {
        try {
            const vectorsData = await SortBySelectionMethod();
            const highlightsData = await GetCurrentValue();

            setDataVectors(vectorsData);
            setHighlightVectors(highlightsData);
            setCurrentIndex(0);
            setIsRunning(true);
            setShowChart(true);
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    };

    // Efecto que avanza el cuadro de la animación cada segundo
    useEffect(() => {
        if (isRunning && dataVectors.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prevIndex => {
                    setStaticVector(dataVectors[prevIndex]);
                    if (prevIndex < dataVectors.length - 1) {
                        return prevIndex + 1;
                    } else {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        return prevIndex;
                    }
                });
            }, 10);
            
            return () => clearInterval(intervalRef.current);
        }
    }, [isRunning, dataVectors]);

    // --- Preparación de datos para la GRÁFICA PRINCIPAL ---
    const currentData = isRunning
        ? dataVectors[currentIndex] || []
        : staticVector;

    const currentFrameHighlights = highlightVectors[currentIndex] || [];

    // --- Preparación de datos para la SEGUNDA GRÁFICA (Solo valores resaltados) ---
    // Genera etiquetas para el eje X de la segunda gráfica (ej: "Valor 1", "Valor 2")
    const highlightChartLabels = currentFrameHighlights.map((_, i) => `Elemento ${i + 1}`);

    return (
        // <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}> {/* Opcional: para mejor layout */}
        <div>
            <div> {/* Contenedor de botones */}
                <button onClick={showStaticChart}>Init Array</button>
                <button onClick={insertMethod} disabled={isRunning}>Insert Method</button>
                <button onClick={shellMethod} disabled={isRunning}>Shell Method</button>
                <button onClick={sortBySelectionMethod} disabled={isRunning}>Sort By Selection Method</button>
            </div>

            {/* --- GRÁFICA PRINCIPAL (Animación completa) --- */}
            {showChart && currentData.length > 0 && (
                <div>
                    <h4>Visualización del Array Completo</h4>
                    <BarChart skipAnimation 
                        xAxis={[{
                            data: currentData.map((_, i) => `${i + 1}`),
                            scaleType: 'band'
                        }]}
                        yAxis={[{ max: 100, min: 0 }]}
                        series={[
                            {
                                data: currentData,
                                stack: 'mainStack',
                                color: defaultColor,
                                label: 'Normal' // Etiqueta opcional
                            },
                        ]}
                        height={300}
                        legend={{ hidden: true }} // Oculta la leyenda si prefieres
                    />
                </div>
            )}

            {/* --- SEGUNDA GRÁFICA (Solo valor resaltado) --- */}
            {isRunning && currentFrameHighlights.length > 0 && (
                <div>
                    <h4>Valor(es) en Foco</h4>
                    <BarChart skipAnimation 
                        xAxis={[{
                            data: highlightChartLabels, // Etiquetas para los valores resaltados
                            scaleType: 'band'
                        }]}
                        yAxis={[{ max: 100, min: 0 }]}
                        series={[{
                            data: currentFrameHighlights, // Array solo con los valores resaltados
                            color: highlightColor
                        }]}
                        height={200} // Altura menor para la gráfica secundaria
                        width={Math.min(currentFrameHighlights.length * 100, 400)} // Ajuste dinámico de ancho (opcional)
                        legend={{ hidden: true }}
                    />
                </div>
            )}
        </div>
        // </Box>
    );
}

export default App;