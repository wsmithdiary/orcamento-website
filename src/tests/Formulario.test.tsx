import Formulario from "../components/Formulario";
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

test("adiciona servico a lista e limpa os campos", async () => {
    render(<Formulario />)

    await userEvent.type(screen.getByLabelText("Serviço"), "Pintura");
    await userEvent.selectOptions(screen.getByLabelText("Unidade de medida"), "M2");
    await userEvent.type(screen.getByLabelText("Preço unitário"), "10.5");
    await userEvent.type(screen.getByLabelText("Quantidade"), "100");

    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Pintura — 100 M2 × R$ 10.5")).toBeDefined()
    expect(screen.getByLabelText("Serviço")).toHaveValue("");
    expect(screen.getByLabelText("Unidade de medida")).toHaveValue("");
    expect(screen.getByLabelText("Preço unitário")).toHaveValue(null);
    expect(screen.getByLabelText("Quantidade")).toHaveValue(null);
});