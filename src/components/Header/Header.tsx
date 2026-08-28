
import Logo from '/icone-dourado.png';

export default function Header() {
    return (
        <header className="flex items-center gap-3 border-b-2 border-b-marca-700 bg-base-50 px-4 py-4">
            <img
                src={Logo}
                alt=""
                className="h-10 w-auto" />
            <div>
                <h1 className="text-marca-700 font-medium text-lg">
                    Alicerce Empreiteira
                </h1>
                <p
                    className="text-xs text-tinta-500">
                    Orçamento em minutos
                </p>
            </div>
        </header>
    );
}