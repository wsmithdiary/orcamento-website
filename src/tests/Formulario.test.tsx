import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Formulario from "../components/Formulario/Formulario";

const item = {
    descricao: "Assentamento de piso",
    unidadeDeMedida: "m²",
    precoUnitario: "10,59",
    quantiaTotal: "139,94",
};

async function preencherEEnviar() {
    await userEvent.type(screen.getByLabelText("Descrição"), item.descricao);
    await userEvent.selectOptions(screen.getByLabelText("Unidade"), item.unidadeDeMedida);
    await userEvent.type(screen.getByLabelText("Preço unitário"), item.precoUnitario);
    await userEvent.type(screen.getByLabelText("Quantidade"), item.quantiaTotal);
    await userEvent.click(screen.getByRole("button", { name: /adicionar item/i }));
}

describe("Formulario", () => {
    test("emite o item preenchido ao enviar", async () => {
        const onAdicionar = vi.fn();
        render(<Formulario onAdicionar={onAdicionar} />);

        await preencherEEnviar();

        expect(onAdicionar).toHaveBeenCalledTimes(1);
        expect(onAdicionar).toHaveBeenCalledWith(
            expect.objectContaining({
                descricao: "Assentamento de piso",
                unidadeDeMedida: "m²",
            }),
        );
    });

    test("converte a virgula decimal do pt-BR nos campos numericos", async () => {
        const onAdicionar = vi.fn();
        render(<Formulario onAdicionar={onAdicionar} />);

        await preencherEEnviar();

        const emitido = onAdicionar.mock.calls[0][0];
        expect(emitido.precoUnitario.toFixed(2)).toBe("10.59");
        expect(emitido.quantiaTotal.toFixed(2)).toBe("139.94");
    });

    test("limpa os campos apos um envio valido", async () => {
        render(<Formulario onAdicionar={vi.fn()} />);

        await preencherEEnviar();

        expect(screen.getByLabelText("Descrição")).toHaveValue("");
        expect(screen.getByLabelText("Unidade")).toHaveValue("");
        expect(screen.getByLabelText("Preço unitário")).toHaveValue("");
        expect(screen.getByLabelText("Quantidade")).toHaveValue("");
    });

    test("bloqueia o envio quando os campos estao vazios", async () => {
        const onAdicionar = vi.fn();
        render(<Formulario onAdicionar={onAdicionar} />);

        await userEvent.click(screen.getByRole("button", { name: /adicionar item/i }));

        expect(onAdicionar).not.toHaveBeenCalled();
    });

    test("exibe mensagem de erro nos campos invalidos", async () => {
        render(<Formulario onAdicionar={vi.fn()} />);

        await userEvent.click(screen.getByRole("button", { name: /adicionar item/i }));

        expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
    });
});