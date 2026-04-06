import jsPDF from "jspdf";

export default function BookCard({ libro, agregarFavorito, esFav, eliminarFavorito }) {

  const portada = libro.portada 
    || `https://picsum.photos/seed/${encodeURIComponent(libro.titulo)}/200/300`;

  const descargarFicha = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("📚 Ficha Bibliográfica", 10, 10);

    pdf.setFontSize(12);
    pdf.text(`Usuario: ${user.email || "No identificado"}`, 10, 30);
    pdf.text(`Libro: ${libro.titulo}`, 10, 40);
    pdf.text(`Autor: ${libro.autor}`, 10, 50);
    pdf.text(`Clasificación: ${libro.clasificacion}`, 10, 60);
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 70);

    pdf.save(`${libro.titulo}.pdf`);
  };

  return (
    <div className="card">

      <img src={portada} alt={libro.titulo} />

      <h3>{libro.titulo || "Sin título"}</h3>
      <p><b>Autor:</b> {libro.autor || "Desconocido"}</p>
      <p><b>Clasificación:</b> {libro.clasificacion || "General"}</p>

      <div className="botones">

        {/* AGREGAR FAVORITO */}
        {!esFav && (
          <button onClick={() => agregarFavorito(libro)}>
            ❤️ Favorito
          </button>
        )}

        {/* ELIMINAR FAVORITO */}
        {esFav && eliminarFavorito && (
          <button onClick={() => eliminarFavorito(libro.id)}>
            ❌ Quitar
          </button>
        )}

        {/* DESCARGAR */}
        <button onClick={descargarFicha}>
          📥 Descargar
        </button>

      </div>

    </div>
  );
}