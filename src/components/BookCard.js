import jsPDF from "jspdf";

export default function BookCard({
  libro,
  agregarFavorito,
  esFav = false,
  eliminarFavorito
}) {
  const titulo = libro?.titulo || "Sin titulo";
  const autor = libro?.autor || "Desconocido";
  const clasificacion = libro?.clasificacion || "General";
  const portada =
    libro?.portada ||
    `https://picsum.photos/seed/${encodeURIComponent(titulo)}/200/300`;

  const descargarFicha = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("Ficha Bibliografica", 10, 15);

    pdf.setFontSize(12);
    pdf.text(`Usuario: ${user.email || "No identificado"}`, 10, 30);
    pdf.text(`Libro: ${titulo}`, 10, 40);
    pdf.text(`Autor: ${autor}`, 10, 50);
    pdf.text(`Clasificacion: ${clasificacion}`, 10, 60);
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 70);

    pdf.save(`${titulo}.pdf`);
  };

  return (
    <div className="card">
      <img src={portada} alt={titulo} />

      <h3>{titulo}</h3>
      <p>
        <b>Autor:</b> {autor}
      </p>
      <p>
        <b>Clasificacion:</b> {clasificacion}
      </p>

      <div className="botones">
        {!esFav && typeof agregarFavorito === "function" && (
          <button type="button" className="fav" onClick={() => agregarFavorito(libro)}>
            Favorito
          </button>
        )}

        {esFav && typeof eliminarFavorito === "function" && (
          <button
            type="button"
            className="fav"
            onClick={() => eliminarFavorito(libro.id)}
          >
            Quitar
          </button>
        )}

        <button type="button" className="descargar" onClick={descargarFicha}>
          Descargar
        </button>
      </div>
    </div>
  );
}
