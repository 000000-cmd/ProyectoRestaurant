import { URLs } from "./URL.js";

export async function cargarPedidos() {
    try {
        const response = await fetch(`${URLs}/pedidos/todos-pedidos`);
        const data = await response.json();

        if (data.status !== 'success') {
            console.error('Error al obtener los pedidos:', data.message);
            return [];
        }

        // Desestructurar pedidos para obtener solo id_pedido, mesa y estado_pedido
        return data.data.map(({ id_pedido, estado_pedido, mesa }) => ({
            id_pedido,
            estado_pedido,
            mesa
        }));

    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        return [];
    }
}