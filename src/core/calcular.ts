import Decimal from "decimal.js";
import type { Item } from "./tipos";

/** Decisões de arredondamento, explícitas — não herdadas do default da biblioteca. */
export const CASAS_DECIMAIS = 2;
export const MODO_ARREDONDAMENTO = Decimal.ROUND_HALF_UP;

/** Arredonda no subtotal de cada item. O total é a soma exata dos subtotais. */
export default function calcularSubtotal(preco: Decimal, quantia: Decimal): Decimal {
    return preco.times(quantia).toDecimalPlaces(CASAS_DECIMAIS, MODO_ARREDONDAMENTO);
}

export function calcularTotal(items: Item[]): Decimal {
    return items.reduce((acc, item) => acc.plus(item.subtotal), new Decimal(0));
}