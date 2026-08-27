import type { Item } from "./tipos";

export default function calcularSubtotal(item: Item): number {
    const subtotal = Number(item.quantiaTotal) * Number(item.precoUnitario);
    return subtotal;
}