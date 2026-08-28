import { useState } from "react";
import Campo from "../Campo/Campo";
import CampoSelect from "../Campo/CampoSelect/CampoSelect";
import validarFormulario from "../../core/validacao";
import type { ErrosFormulario } from "./Formulario.types";
import type { Item } from "../ItemsList/ItemsList.type";

type FormularioProps = {
    onAdicionar: (item: Item) => void;
};

const selectOpcoes = [
    { valor: "", rotulo: "Selecione..." },
    { valor: "m", rotulo: "m" },
    { valor: "m²", rotulo: "m²" },
    { valor: "m³", rotulo: "m³" },
];

const AJUDA_NUMERO =
    "Use vírgula para as casas decimais. Para milhar, escreva sem ponto: 1000";

export default function Formulario({ onAdicionar }: FormularioProps) {
    const [erros, setErros] = useState<ErrosFormulario>({});
    const [descricao, setDescricao] = useState("");
    const [unidadeDeMedida, setUnidadeDeMedida] = useState("");
    const [precoUnitario, setPrecoUnitario] = useState("");
    const [quantiaTotal, setQuantiaTotal] = useState("");

    function limparCampos() {
        setDescricao("");
        setUnidadeDeMedida("");
        setPrecoUnitario("");
        setQuantiaTotal("");
        setErros({});
    }

    function enviar() {
        const resultado = validarFormulario({
            descricao,
            unidadeDeMedida,
            precoUnitario,
            quantiaTotal,
        });

        if (!resultado.ok) {
            setErros(resultado.erros);
            return;
        }

        const { campos } = resultado;

        onAdicionar({
            id: crypto.randomUUID(),
            descricao: campos.descricao,
            unidadeDeMedida: campos.unidadeDeMedida,
            precoUnitario: campos.precoUnitario,
            quantiaTotal: campos.quantiaTotal,
        });

        limparCampos();
    }

    return (
        <form
            className="flex flex-col gap-1.5 border-b border-tinta-100 bg-base-50 px-4 py-4"
            onSubmit={(evento) => {
                evento.preventDefault();
                enviar();
            }}
        >
            <Campo
                label="Descrição"
                erro={erros.descricao}
                value={descricao}
                onChange={setDescricao}
                required
            />

            <div className="grid grid-cols-2 gap-3">
                <CampoSelect
                    label="Unidade"
                    erro={erros.unidadeDeMedida}
                    value={unidadeDeMedida}
                    onChange={setUnidadeDeMedida}
                    opcoes={selectOpcoes}
                    required
                />
                <Campo
                    label="Quantidade"
                    erro={erros.quantiaTotal}
                    title={AJUDA_NUMERO}
                    placeholder="0,00"
                    value={quantiaTotal}
                    onChange={setQuantiaTotal}
                    type="text"
                    inputMode="decimal"
                    required
                />
            </div>

            <Campo
                label="Preço unitário"
                erro={erros.precoUnitario}
                title={AJUDA_NUMERO}
                placeholder="0,00"
                value={precoUnitario}
                onChange={setPrecoUnitario}
                type="text"
                inputMode="decimal"
                required
            />

            <button
                type="submit"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-marca-700 px-4 py-3 text-sm font-medium text-base-50 hover:bg-marca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-500"
            >
                + Adicionar item
            </button>
        </form>
    );
}