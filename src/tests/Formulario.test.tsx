import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Formulario from "../components/Formulario";

const item = {
    id: "1",
    descricao: "Assentamento de piso",
    unidadeDeMedida: "m² (metro quadrado)",
    precoUnitario: "10,59",
    quantiaTotal: "139,94"
};

describe('Formulario E2E', () => {
    const { descricao, unidadeDeMedida, precoUnitario, quantiaTotal } = item;

    test("cria e adiciona um item na lista", async () => {
        render(<Formulario />);

        await userEvent.type(screen.getByLabelText("DESCRIÇÃO DO SERVIÇO:"), descricao);
        await userEvent.selectOptions(screen.getByLabelText("UNIDADE DE MEDIDA:"), unidadeDeMedida);
        await userEvent.type(screen.getByLabelText("PREÇO POR UNIDADE:"), precoUnitario);
        await userEvent.type(screen.getByLabelText("MEDIDA TOTAL:"), quantiaTotal);

        await userEvent.click(screen.getByRole("button", { name: "ADICIONAR" }));

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(screen.getByRole('listitem')).toHaveTextContent(/Assentamento de piso/i);
    });

    test("apos adicionar um item, campos são limpos", async () => {
        render(<Formulario />);

        await userEvent.type(screen.getByLabelText("DESCRIÇÃO DO SERVIÇO:"), descricao);
        await userEvent.selectOptions(screen.getByLabelText("UNIDADE DE MEDIDA:"), unidadeDeMedida);
        await userEvent.type(screen.getByLabelText("PREÇO POR UNIDADE:"), precoUnitario);
        await userEvent.type(screen.getByLabelText("MEDIDA TOTAL:"), quantiaTotal);

        await userEvent.click(screen.getByRole("button", { name: "ADICIONAR" }));

        expect(screen.getByLabelText("DESCRIÇÃO DO SERVIÇO:")).toHaveValue("");
        expect(screen.getByLabelText("UNIDADE DE MEDIDA:")).toHaveValue("");
        expect(screen.getByLabelText("MEDIDA TOTAL:")).toHaveValue("");
        expect(screen.getByLabelText("PREÇO POR UNIDADE:")).toHaveValue("");
    });

    test('não adiciona novo item com campos errados', async () => {
        render(<Formulario />);
        await userEvent.click(screen.getByRole('button', { name: /adicionar/i }));
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
})