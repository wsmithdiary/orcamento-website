import { useState } from "react";
import Decimal from "decimal.js";
import type { Item } from "../../ItemsList/ItemsList.type";
import { calcularSubtotal } from "../../../core/calcular";
import { formatarMoeda, formatarQuantidade } from "../../../core/formatar";
import { IconeEditar, IconeExcluir, IconeConfirmar } from "../../Icones/Icones";

type ItemCardProps = {
    item: Item;
    editando: boolean;
    onEditar: (id: string) => void;
    onExcluir: (id: string) => void;
    onSalvar: (item: Item) => void;
    onCancelar: () => void;
};

/** Um item da lista. Em repouso mostra o texto; em edição, os campos e os botões de confirmar. */
export default function ItemCard({
    item,
    editando,
    onEditar,
    onExcluir,
    onSalvar,
    onCancelar,
}: ItemCardProps) {
    if (!editando) {
        return (
            <li className="rounded-lg border border-tinta-100 bg-base-50 p-3">
                <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 text-sm font-medium text-tinta-900">
                        {item.descricao}
                    </p>
                    <div className="flex shrink-0 gap-1.5">
                        <button
                            type="button"
                            onClick={() => onEditar(item.id)}
                            aria-label={`Editar ${item.descricao}`}
                            className="flex size-9 items-center justify-center rounded-md border border-tinta-100 text-marca-700 hover:bg-marca-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-500"
                        >
                            <IconeEditar />
                        </button>
                        <button
                            type="button"
                            onClick={() => onExcluir(item.id)}
                            aria-label={`Excluir ${item.descricao}`}
                            className="flex size-9 items-center justify-center rounded-md border border-perigo-200 text-perigo-600 hover:bg-perigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-perigo-600"
                        >
                            <IconeExcluir />
                        </button>
                    </div>
                </div>

                <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-tinta-500">
                        {formatarQuantidade(item.quantiaTotal)} {item.unidadeDeMedida}
                        {" × "}
                        {formatarMoeda(item.precoUnitario)}
                    </span>
                    <span className="text-sm font-medium tabular-nums text-tinta-900">
                        {formatarMoeda(calcularSubtotal(item.precoUnitario, item.quantiaTotal))}
                    </span>
                </div>
            </li>
        );
    }

    return <ItemCardEdicao item={item} onSalvar={onSalvar} onCancelar={onCancelar} />;
}

/** Componente separado para que o estado dos campos nasça e morra junto com o modo de edição. */
function ItemCardEdicao({
    item,
    onSalvar,
    onCancelar,
}: Pick<ItemCardProps, "item" | "onSalvar" | "onCancelar">) {
    const [descricao, setDescricao] = useState(item.descricao);
    const [unidadeDeMedida, setUnidadeDeMedida] = useState(item.unidadeDeMedida);
    const [precoUnitario, setPrecoUnitario] = useState(item.precoUnitario.toString());
    const [quantiaTotal, setQuantiaTotal] = useState(item.quantiaTotal.toString());

    const preco = paraDecimal(precoUnitario);
    const quantia = paraDecimal(quantiaTotal);
    const valido = descricao.trim() !== "" && preco !== null && quantia !== null;

    function salvar() {
        if (!valido) return;
        onSalvar({
            ...item,
            descricao: descricao.trim(),
            unidadeDeMedida,
            precoUnitario: preco,
            quantiaTotal: quantia,
        });
    }

    return (
        <li className="rounded-lg border border-ok-200 bg-ok-50 p-3">
            <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                aria-label="Descrição do item"
                className="mb-2 h-9 w-full rounded-md border border-ok-200 bg-base-50 px-3 text-sm text-tinta-900"
            />

            <div className="grid grid-cols-3 gap-1.5">
                <input
                    value={unidadeDeMedida}
                    onChange={(e) => setUnidadeDeMedida(e.target.value)}
                    aria-label="Unidade de medida"
                    className="h-9 w-full rounded-md border border-ok-200 bg-base-50 px-2 text-sm text-tinta-900"
                />
                <input
                    value={precoUnitario}
                    onChange={(e) => setPrecoUnitario(e.target.value)}
                    inputMode="decimal"
                    aria-label="Preço unitário"
                    className="h-9 w-full rounded-md border border-ok-200 bg-base-50 px-2 text-right text-sm text-tinta-900"
                />
                <input
                    value={quantiaTotal}
                    onChange={(e) => setQuantiaTotal(e.target.value)}
                    inputMode="decimal"
                    aria-label="Quantidade"
                    className="h-9 w-full rounded-md border border-ok-200 bg-base-50 px-2 text-right text-sm text-tinta-900"
                />
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2">
                <span className="text-sm font-medium tabular-nums text-ok-800">
                    {valido ? formatarMoeda(calcularSubtotal(preco, quantia)) : "—"}
                </span>
                <div className="flex gap-1.5">
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="h-9 rounded-md border border-tinta-100 bg-base-50 px-3 text-sm text-tinta-900 hover:bg-base-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={salvar}
                        disabled={!valido}
                        aria-label="Confirmar alterações"
                        className="flex size-9 items-center justify-center rounded-md bg-ok-600 text-base-50 hover:bg-ok-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <IconeConfirmar />
                    </button>
                </div>
            </div>
        </li>
    );
}

/** Aceita vírgula decimal do pt-BR. Devolve null quando o texto não é número usável. */
function paraDecimal(texto: string): Decimal | null {
    const limpo = texto.trim().replace(",", ".");
    if (limpo === "") return null;
    try {
        const valor = new Decimal(limpo);
        return valor.gt(0) ? valor : null;
    } catch {
        return null;
    }
}