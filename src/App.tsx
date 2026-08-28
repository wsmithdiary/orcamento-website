import { useState } from "react";
import Decimal from "decimal.js";
import Header from "./components/Header/Header";
import DadosClienteForm from "./components/DadosCliente/DadosCliente";
import Formulario from "./components/Formulario/Formulario";
import ItemsList from "./components/ItemsList/ItemsList";
import BarraTotal from "./components/BarraTotal/BarraTotal";
import { calcularTotal } from "./core/calcular";
import { calcularComBdi } from "./core/documento";
import { gerarPdf } from "./core/gerarPDF";
import { DADOS_CLIENTE_VAZIO } from "./components/DadosCliente/DadosCliente.type";
import type { Item } from "./components/ItemsList/ItemsList.type";

// ============================================================
// Todo o estado compartilhado mora aqui.
// Regra: o estado sobe ate o ancestral comum de quem depende dele.
// Formulario e ItemsList sao irmaos, entao a lista fica no pai.
// ============================================================
function App() {
  /** A lista de itens. Lida pelo ItemsList, alterada pelo Formulario e pelos cartoes. */
  const [itens, setItens] = useState<Item[]>([]);

  /** Qual item esta em edicao. null significa nenhum — so um por vez. */
  const [editandoId, setEditandoId] = useState<string | null>(null);

  /** Dados que so vao para o cabecalho do PDF. */
  const [dados, setDados] = useState(DADOS_CLIENTE_VAZIO);

  // Valores derivados: recalculados a cada render, sem useState proprio.
  // Guardar o total em estado criaria duas fontes de verdade para o mesmo numero.
  const custo = itens.length > 0 ? calcularTotal(itens) : new Decimal(0);
  const { percentual, total } = calcularComBdi(custo, dados.bdi);

  /** Acrescenta no fim da lista. A forma com funcao e segura em atualizacoes seguidas. */
  function adicionarItem(novo: Item) {
    setItens((anteriores) => [...anteriores, novo]);
  }

  /** filter devolve um array novo. splice mutaria o original e nada re-renderizaria. */
  function excluirItem(id: string) {
    setItens((anteriores) => anteriores.filter((item) => item.id !== id));

    // Sem isso, o editandoId ficaria apontando para um item que nao existe mais.
    if (editandoId === id) setEditandoId(null);
  }

  /** Troca o item alterado por um objeto novo; os demais seguem intactos. */
  function salvarItem(alterado: Item) {
    setItens((anteriores) =>
      anteriores.map((item) => (item.id === alterado.id ? alterado : item)),
    );
    setEditandoId(null);
  }

  return (
    // pb-24 reserva o espaco da BarraTotal, que e fixed e nao ocupa lugar no fluxo.
    <main className="min-h-dvh bg-base-100 pb-24 font-marca">
      <Header />

      {/* Sanfona fechada por padrao: preenchida uma vez, ao contrario dos itens. */}
      <DadosClienteForm dados={dados} onChange={setDados} />

      <Formulario onAdicionar={adicionarItem} />

      <ItemsList
        itens={itens}
        editandoId={editandoId}
        onEditar={setEditandoId}
        onExcluir={excluirItem}
        onSalvar={salvarItem}
        onCancelar={() => setEditandoId(null)}
      />

      <BarraTotal
        total={total}
        bdi={percentual}
        podeExportar={itens.length > 0}
        onExportar={() => gerarPdf(itens, dados)}
      />
    </main>
  );
}

export default App;