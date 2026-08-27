import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CampoSelect from "../components/CampoSelect";
import userEvent from "@testing-library/user-event";

describe('CampoSelect', () => {
    const opcoes = [
        { valor: "m (metro linear)", rotulo: "m (metro linear)" },
        { valor: "m² (metro quadrado)", rotulo: "m² (metro quadrado)" },
        { valor: "m³ (metro cúbico)", rotulo: "m³ (metro cúbico)" },
    ];

    it('tem o label correto', () => {
        render(
            <CampoSelect
                label="Unidade"
                value=""
                onChange={() => { }}
                opcoes={opcoes}
            />
        );

        expect(screen.getByLabelText("Unidade")).toBeDefined();
    });

    it('opções são renderizadas', async () => {
        const aoMudar = vi.fn();
        render(
            <CampoSelect
                label="Unidade"
                value=""
                onChange={aoMudar}
                opcoes={opcoes}
            />
        )

        const select = screen.getByLabelText("Unidade");
        await userEvent.selectOptions(select, "m² (metro quadrado)");
        expect(aoMudar).toHaveBeenCalledWith("m² (metro quadrado)");
    });
})
