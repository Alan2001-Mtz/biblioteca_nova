export default function BookCard({libro,agregarFavorito,descargar,esFav}){

  return(

    <div className="card">

      <img src={libro.portada} alt={libro.titulo} width="120"/>

      <h3>{libro.titulo}</h3>

      <p>{libro.autor}</p>

      <button
        disabled={esFav}
        onClick={()=>agregarFavorito(libro)}
      >
        {esFav ? "✔ Guardado" : "❤️ Favorito"}
      </button>

      <button onClick={()=>descargar(libro)}>
        Descargar PDF
      </button>

    </div>

  );

}