import { URLs } from "../URL.js";

export async function obtenerRoles() {
    const response = await fetch(`${URLs}/selects/roles`);
    const data = await response.json();      
    return data.data;
}