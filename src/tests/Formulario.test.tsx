import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Formulario from "../components/Formulario";

describe('E2E do comportamento do formulario', () => {

    test("adiciona servico a lista e limpa os campos", async () => {
        render(<Formulario />)

        await userEvent.type(screen.getByLabelText("DESCRIÇÃO DO SERVIÇO:"), "Pintura");
        await userEvent.selectOptions(screen.getByLabelText("UNIDADE DE MEDIDA:"), "M2");
        await userEvent.type(screen.getByLabelText("PREÇO POR UNIDADE:"), "10.5");
        await userEvent.type(screen.getByLabelText("MEDIDA TOTAL:"), "100.6");
        await userEvent.click(screen.getByRole("button", { name: "ADICIONAR" }));

        expect(screen.getAllByRole('listitem')).toHaveLength(1)
        expect(screen.getByRole('listitem')).toHaveTextContent(/pintura/i)
        expect(screen.getByLabelText("DESCRIÇÃO DO SERVIÇO:")).toHaveValue("");
        expect(screen.getByLabelText("UNIDADE DE MEDIDA:")).toHaveValue("");
        expect(screen.getByLabelText("MEDIDA TOTAL:")).toHaveValue("");
        expect(screen.getByLabelText("PREÇO POR UNIDADE:")).toHaveValue("");
    });

    test('não adiciona servico quando campos estão inválidos', async () => {
        render(<Formulario />)
        await userEvent.click(screen.getByRole('button', { name: /adicionar/i }))
        expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    });
})