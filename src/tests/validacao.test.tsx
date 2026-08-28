import { describe, expect, test } from "vitest";
import Decimal from "decimal.js";
import validarFormulario from "../core/validacao";
import type { CamposFormulario, ErrosFormulario } from "../components/Formulario/Formulario.types";
const camposValidos: CamposFormulario = {
    descricao: "Assentamento de piso",
    unidadeDeMedida: "m²",
    precoUnitario: "34,54",
    quantiaTotal: "100",
};

/** Falha o teste se a validação passar quando era para reprovar. */
function errosDe(campos: CamposFormulario): ErrosFormulario {
    const resultado = validarFormulario(campos);
    if (resultado.ok) throw new Error("esperava reprovar, mas a validação aprovou");
    return resultado.erros;
}

describe("validarFormulario — aprovação", () => {
    test("aprova e converte campos válidos", () => {
        const resultado = validarFormulario(camposValidos);

        expect(resultado.ok).toBe(true);
        if (!resultado.ok) return;

        expect(resultado.campos.precoUnitario).toBeInstanceOf(Decimal);
        expect(resultado.campos.precoUnitario.toFixed(2)).toBe("34.54");
        expect(resultado.campos.quantiaTotal.toFixed(2)).toBe("100.00");
    });

    test("aceita vírgula e ponto como separador decimal", () => {
        const comPonto = validarFormulario({ ...camposValidos, precoUnitario: "34.54" });

        expect(comPonto.ok).toBe(true);
        if (!comPonto.ok) return;
        expect(comPonto.campos.precoUnitario.toFixed(2)).toBe("34.54");
    });
});

describe("validarFormulario — reprovação", () => {
    test("reprova preço vazio", () => {
        expect(errosDe({ ...camposValidos, precoUnitario: "" }).precoUnitario).toBeDefined();
    });

    test("reprova descrição vazia sem acusar os outros campos", () => {
        const erros = errosDe({ ...camposValidos, descricao: "   " });
        expect(erros.descricao).toBeDefined();
        expect(erros.precoUnitario).toBeUndefined();
        expect(erros.quantiaTotal).toBeUndefined();
    });

    test("reprova preço não numérico", () => {
        expect(errosDe({ ...camposValidos, precoUnitario: "abc" }).precoUnitario).toBeDefined();
    });

    test("reprova preço zerado", () => {
        expect(errosDe({ ...camposValidos, precoUnitario: "0" }).precoUnitario).toBeDefined();
    });

    test("reprova separador de milhar", () => {
        expect(errosDe({ ...camposValidos, precoUnitario: "1.000,50" }).precoUnitario).toBeDefined();
    });
});