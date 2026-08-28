import Decimal from "decimal.js";

export type Item = {
    id: string;
    descricao: string;
    unidadeDeMedida: string;
    precoUnitario: Decimal;
    quantiaTotal: Decimal;
};