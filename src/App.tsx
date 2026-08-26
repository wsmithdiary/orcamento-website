import Formulario from "./components/Formulario";
import logo from "/logo-dourado.png"
function App() {
  return (
    <main
      className="flex flex-col items-center p-28 w-dvw h-dvh bg-mist-800 text-amber-50"
    >
      <img src={logo} alt="teste" className="w-64" />
      <Formulario />
    </main>
  )
};

export default App;
