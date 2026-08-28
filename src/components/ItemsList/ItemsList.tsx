import type { Item } from "./ItemsList.type";
import ItemCard from "./ItemCard/ItemCard";

type ItemsListProps = {
    itens: Item[];
    editandoId: string | null;
    onEditar: (id: string) => void;
    onExcluir: (id: string) => void;
    onSalvar: (item: Item) => void;
    onCancelar: () => void;
};

export default function ItemsList({
    itens,
    editandoId,
    onEditar,
    onExcluir,
    onSalvar,
    onCancelar,
}: ItemsListProps) {
    if (itens.length === 0) {
        return (
            <p className="px-4 py-8 text-center text-sm text-tinta-500">
                Nenhum item adicionado ainda.
            </p>
        );
    }

    return (
        <section className="px-4 py-4">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-tinta-300">
                Itens do orçamento · {itens.length}
            </h2>
            <ul className="flex flex-col gap-2.5">
                {itens.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        editando={item.id === editandoId}
                        onEditar={onEditar}
                        onExcluir={onExcluir}
                        onSalvar={onSalvar}
                        onCancelar={onCancelar}
                    />
                ))}
            </ul>
        </section>
    );
}