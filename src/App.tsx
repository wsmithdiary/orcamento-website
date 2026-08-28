import { useState } from "react";
import Decimal from "decimal.js";
import Header from "./components/Header/Header";
import Formulario from "./components/Formulario/Formulario";
import ItemsList from "./components/ItemsList/ItemsList";
import BarraTotal from "./components/BarraTotal/BarraTotal";
import { calcularTotal } from "./core/calcular";
import type { Item } from "./components/ItemsList/ItemsList.type";

function App() {
  const [itens, setItens] = useState<Item[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const total = itens.length > 0 ? calcularTotal(itens) : new Decimal(0);

  function adicionarItem(novo: Item) {
    setItens((anteriores) => [...anteriores, novo]);
  }

  function excluirItem(id: string) {
    setItens((anteriores) => anteriores.filter((item) => item.id !== id));
    if (editandoId === id) setEditandoId(null);
  }

  /** Troca o item alterado por um novo objeto — nunca muta o array original. */
  function salvarItem(alterado: Item) {
    setItens((anteriores) =>
      anteriores.map((item) => (item.id === alterado.id ? alterado : item)),
    );
    setEditandoId(null);
  }

  return (
    <main className="min-h-dvh bg-base-100 pb-24 font-marca">
      <Header />
      <Formulario onAdicionar={adicionarItem} />
      <ItemsList
        itens={itens}
        editandoId={editandoId}
        onEditar={setEditandoId}
        onExcluir={excluirItem}
        onSalvar={salvarItem}
        onCancelar={() => setEditandoId(null)}
      />
      <BarraTotal total={total} onExportar={() => { }} />
    </main>
  );
}

export default App;