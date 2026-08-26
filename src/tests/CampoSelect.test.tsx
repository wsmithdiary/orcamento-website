import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CampoSelect from "../components/CampoSelect";
import userEvent from "@testing-library/user-event";

describe('Testa o componente "CampoSelet"', () => {
    const opcoes = [
        { valor: "M", rotulo: "m (metro linear)" },
        { valor: "M2", rotulo: "m² (metro quadrado)" },
        { valor: "M3", rotulo: "m³ (metro cúbico)" },
    ];

    it('Deve ter o label correto', () => {
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

    it('Deve selecionar as opções corretamente', async () => {
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
        await userEvent.selectOptions(select, "M2");
        expect(aoMudar).toHaveBeenCalledWith("M2");
    });
})
