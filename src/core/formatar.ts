import type Decimal from "decimal.js";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const quantidade = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
});

export function formatarMoeda(valor: Decimal): string {
    return moeda.format(valor.toNumber());
}

export function formatarQuantidade(valor: Decimal): string {
    return quantidade.format(valor.toNumber());
}