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
    const series = data.recaudo_por_tipo_plato.map(plato => {
        return parseFloat(((plato.total_recaudo / totalRecaudo) * 100).toFixed(2));
    });
    const labels = data.recaudo_por_tipo_plato.map(plato => plato.nombre_plato);
    return { series, labels };
}

function renderizarChart(contenedorGrafico, series, labels) {


    console.log(series);
    
    const options = {
        series: series,
        chart: {
            height: 350,
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
