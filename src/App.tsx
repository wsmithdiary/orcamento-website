import Formulario from "./components/Formulario";
import logo from "/logo-dourado.png"
function App() {
  return (
    <main
      className="bg-base-50 min-h-dvh  gap-5 items-center p-5"
    >
      <img 
        src={logo} 
        alt="Logo Alicerce Empreiteira" 
        className="min-w-32 max-h-64" 
      />
      <Formulario />
    </main>
  )
};

export default App;
