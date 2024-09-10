export async function obtenerReporte(tipo, fecha) {
    try {
        const url = `http://localhost:8080/reportes/${tipo}?fecha=${fecha}`;
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Error al obtener el reporte ${tipo}: ` + response.statusText);
        }

        const data = await response.json();
        console.log(`Reporte ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:`, data);
        return data;
    } catch (error) {
        console.error(`Error al obtener el reporte ${tipo}:`, error);
    }
}