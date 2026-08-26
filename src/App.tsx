import Formulario from "./components/Formulario";
import logo from "/logo-dourado.png"
function App() {
  return (
    <main
      className="flex flex-col gap-5 items-center p-5 bg-mist-800 text-amber-100"
    >
      <img src={logo} alt="teste" className="w-64" />
      <Formulario />
    </main>
  )
};

export default App;
