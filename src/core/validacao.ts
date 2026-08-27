import Decimal from "decimal.js";
import type { CamposFormulario, ErrosFormulario, ResultadoValidacao } from "./tipos";

/** Um separador, vírgula ou ponto, sempre decimal. Milhar não é aceito. */
const FORMATO_NUMERO = /^\d+(?:[,.]\d+)?$/;

const AJUDA_PRECO = "Use apenas números, com vírgula nos centavos. Ex.: 596,50";
const AJUDA_MEDIDA = "Use apenas números, com vírgula nos decimais. Ex.: 139,94";

/** Devolve o número, ou null se o texto não estiver no formato aceito. */
export function parsearValor(texto: string): Decimal | null {
    const limpo = texto.trim();
    if (!FORMATO_NUMERO.test(limpo)) return null;
    return new Decimal(limpo.replace(",", "."));
}

export default function validarFormulario(campos: CamposFormulario): ResultadoValidacao {
    const erros: ErrosFormulario = {};

    const descricao = campos.descricao.trim();
    if (descricao === "") {
        erros.descricao = "Preencha a descrição do serviço.";
    }

    const unidadeDeMedida = campos.unidadeDeMedida.trim();
    if (unidadeDeMedida === "") {
        erros.unidadeDeMedida = "Selecione a unidade de medida.";
    }

    let precoUnitario: Decimal | null = null;
    if (campos.precoUnitario.trim() === "") {
        erros.precoUnitario = "Preencha o preço.";
    } else {
        precoUnitario = parsearValor(campos.precoUnitario);
        if (precoUnitario === null) {
            erros.precoUnitario = AJUDA_PRECO;
        } else if (precoUnitario.lessThanOrEqualTo(0)) {
            erros.precoUnitario = "O preço precisa ser maior que zero.";
        }
    }

    let quantiaTotal: Decimal | null = null;
    if (campos.quantiaTotal.trim() === "") {
        erros.quantiaTotal = "Preencha a medida.";
    } else {
        quantiaTotal = parsearValor(campos.quantiaTotal);
        if (quantiaTotal === null) {
            erros.quantiaTotal = AJUDA_MEDIDA;
        } else if (quantiaTotal.lessThanOrEqualTo(0)) {
            erros.quantiaTotal = "A medida precisa ser maior que zero.";
        }
    }

    if (Object.keys(erros).length > 0 || precoUnitario === null || quantiaTotal === null) {
        return { ok: false, erros };
    }

    return {
        ok: true,
        campos: { descricao, unidadeDeMedida, precoUnitario, quantiaTotal },
    };
}