import Decimal from "decimal.js";
import type { Item } from "../components/ItemsList/ItemsList.type";

/** Decisões de arredondamento, explícitas — não herdadas do default da biblioteca. */
export const CASAS_DECIMAIS = 2;
export const MODO_ARREDONDAMENTO = Decimal.ROUND_HALF_UP;

/** Arredonda no subtotal de cada item. O total é a soma exata dos subtotais. */
export function calcularSubtotal(preco: Decimal, quantia: Decimal): Decimal {
    return preco.times(quantia).toDecimalPlaces(CASAS_DECIMAIS, MODO_ARREDONDAMENTO);
}

/** Soma o subtotal de cada item. Subtotal é derivado, não guardado — recalcula na hora. */
export function calcularTotal(items: Item[]): Decimal {
    return items.reduce(
        (acc, item) => acc.plus(calcularSubtotal(item.precoUnitario, item.quantiaTotal)),
        new Decimal(0),
    );
}