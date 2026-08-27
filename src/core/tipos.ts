import type Decimal from "decimal.js";

export type CamposFormulario = {
    descricao: string;
    unidadeDeMedida: string;
    precoUnitario: string;
    quantiaTotal: string;
};

export type ErrosFormulario = Partial<Record<keyof CamposFormulario, string>>;

export type CamposValidados = {
    descricao: string;
    unidadeDeMedida: string;
    precoUnitario: Decimal;
    quantiaTotal: Decimal;
};

export type ResultadoValidacao =
    | { ok: true; campos: CamposValidados }
    | { ok: false; erros: ErrosFormulario };

export type Item = {
    id: string;
    descricao: string;
    unidadeDeMedida: string;
    precoUnitario: Decimal;
    quantiaTotal: Decimal;
    subtotal: Decimal;
};