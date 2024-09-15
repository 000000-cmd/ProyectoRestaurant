import { obtenerReporte } from "../../SolicitudesAPI/gestionarReportes.js";

// Función para mostrar el reporte en el gráfico
export async function mostrarReporte(tipo, fecha) {
    try {
        const data = await obtenerReporte(tipo, fecha);
        if (!data || data.status !== "success") {
            console.error('No se pudo obtener el reporte o los datos son incorrectos.');
            return;
        }

        const { series, labels } = calcularPorcentajes(data);
        const contenedorGrafico = document.querySelector("#chart");
        if (!contenedorGrafico) {
            console.error('No se encontró el contenedor del gráfico con id #chart.');
            return;
        }

        renderizarChart(contenedorGrafico, series, labels);

    } catch (error) {
        console.error('Error al mostrar el reporte:', error);
    }
}

function calcularPorcentajes(data) {
    const totalRecaudo = data.total_recaudo;

    // Convertir recaudo_por_tipo_plato en un arreglo
    const recaudoPorTipoPlatoArray = Object.entries(data.recaudo_por_tipo_plato).map(([id_plato, total_recaudo]) => {
        // Buscar el plato en platos_mas_vendidos usando el id_plato para obtener el nombre
        const plato = data.platos_mas_vendidos.find(plato => plato.id_plato == id_plato);
        return {
            id_plato: parseInt(id_plato), // Convertir el ID a entero
            nombre_plato: plato ? plato.nombre_plato : `Plato ${id_plato}`, // Obtener el nombre del plato
            total_recaudo: total_recaudo
        };
    });

    const series = recaudoPorTipoPlatoArray.map(plato => {
        return parseFloat(((plato.total_recaudo / totalRecaudo) * 100).toFixed(2));
    });

    const labels = recaudoPorTipoPlatoArray.map(plato => plato.nombre_plato);
    return { series, labels };
}

function renderizarChart(contenedorGrafico, series, labels) {
    console.log(series);

    const options = {
        series: series,
        chart: {
            redrawOnParentResize: true,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function () {
                            return series.reduce((a, b) => a + b, 0).toFixed(2);
                        }
                    }
                }
            }
        },
        labels: labels,
    };

    const chart = new ApexCharts(contenedorGrafico, options);
    chart.render();
}
