import { describe, expect, test } from "vitest";
import Decimal from "decimal.js";
import { calcularComBdi } from "../core/documento";
import { BDI_PADRAO } from "../core/constantes";

// ============================================================
// So o calculo do BDI e testado aqui.
// A montagem do documento em si e estrutura de layout: testar cada margem
// travaria qualquer ajuste visual sem pegar bug de verdade.
// ============================================================

describe("calcularComBdi", () => {
    test("aplica o percentual informado sobre o custo", () => {
        const { margem, total } = calcularComBdi(new Decimal("1000"), "10");
        expect(margem.toFixed(2)).toBe("100.00");
        expect(total.toFixed(2)).toBe("1100.00");
    });

    test("aceita virgula decimal no percentual", () => {
        const { margem } = calcularComBdi(new Decimal("1000"), "12,5");
        expect(margem.toFixed(2)).toBe("125.00");
    });

    test("usa o padrao quando o campo esta vazio", () => {
        const { percentual } = calcularComBdi(new Decimal("1000"), "");
        expect(percentual.toNumber()).toBe(BDI_PADRAO);
    });

    test("usa o padrao quando o texto nao e numero", () => {
        const { percentual } = calcularComBdi(new Decimal("1000"), "abc");
        expect(percentual.toNumber()).toBe(BDI_PADRAO);
    });

    test("usa o padrao quando o percentual e negativo", () => {
        const { percentual } = calcularComBdi(new Decimal("1000"), "-5");
        expect(percentual.toNumber()).toBe(BDI_PADRAO);
    });

    test("aceita BDI zero", () => {
        const { percentual, total } = calcularComBdi(new Decimal("1000"), "0");
        expect(percentual.toNumber()).toBe(0);
        expect(total.toFixed(2)).toBe("1000.00");
    });

    test("arredonda a margem em duas casas", () => {
        const { margem } = calcularComBdi(new Decimal("333.33"), "22");
        expect(margem.toFixed(2)).toBe("73.33");
    });
});