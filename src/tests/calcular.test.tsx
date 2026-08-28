import { describe, expect, test } from "vitest";
import Decimal from "decimal.js";
import { calcularSubtotal, calcularTotal } from "../core/calcular";
import type { Item } from "../components/ItemsList/ItemsList.type";

function montarItem(preco: string, quantia: string): Item {
    return {
        id: `${preco}-${quantia}`,
        descricao: "Serviço",
        unidadeDeMedida: "m²",
        precoUnitario: new Decimal(preco),
        quantiaTotal: new Decimal(quantia),
    };
}

describe("calcularSubtotal", () => {
    test("multiplica preço por quantidade", () => {
        const subtotal = calcularSubtotal(new Decimal("10.59"), new Decimal("139.94"));
        expect(subtotal.toFixed(2)).toBe("1481.96");
    });

    test("arredonda o resultado em duas casas", () => {
        const subtotal = calcularSubtotal(new Decimal("10.563234"), new Decimal("133.9354"));
        expect(subtotal.toFixed(2)).toBe("1414.79");
    });

    test("meio centavo sobe", () => {
        const subtotal = calcularSubtotal(new Decimal("0.5"), new Decimal("2.01"));
        expect(subtotal.toFixed(2)).toBe("1.01");
    });
});

describe("calcularTotal", () => {
    test("soma os subtotais dos itens", () => {
        const itens = [montarItem("10.59", "139.94"), montarItem("25", "4")];
        expect(calcularTotal(itens).toFixed(2)).toBe("1581.96");
    });

    test("lista vazia soma zero", () => {
        expect(calcularTotal([]).toFixed(2)).toBe("0.00");
    });
});