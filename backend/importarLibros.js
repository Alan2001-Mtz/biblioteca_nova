const XLSX = require("xlsx");
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function obtenerCampo(obj, posiblesNombres) {
  for (let key of Object.keys(obj)) {
    const normalizada = key
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (posiblesNombres.includes(normalizada)) {
      return obj[key];
    }
  }
  return "";
}


async function subir(){

  try{

    console.log("Iniciando carga de libros...");

    const ruta = path.join(__dirname,"base_biblioteca.xlsx");

    const workbook = XLSX.readFile(ruta);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const datos = XLSX.utils.sheet_to_json(sheet);

    console.log(`Libros encontrados: ${datos.length}`);

    if(datos.length === 0){
      console.log("No hay datos en el Excel");
      return;
    }

    console.log("Columnas detectadas:", Object.keys(datos[0]));


    console.log("Limpiando colección...");

    const snapshot = await db.collection("libros").get();

    if(!snapshot.empty){
      let batchDelete = db.batch();
      let count = 0;

      for(const docItem of snapshot.docs){
        batchDelete.delete(docItem.ref);
        count++;

        if(count === 400){
          await batchDelete.commit();
          batchDelete = db.batch();
          count = 0;
        }
      }

      if(count > 0){
        await batchDelete.commit();
      }
    }

    console.log("Colección limpiada");


    console.log("Subiendo libros...");

    let batch = db.batch();
    let contador = 0;
    let insertados = 0;
    let omitidos = 0;

    for(const fila of datos){

      const titulo = obtenerCampo(fila, ["titulo", "nombre", "libro"]);
      const autor = obtenerCampo(fila, ["autor", "escritor"]);
      const clasificacion = obtenerCampo(fila, ["clasificacion", "categoria", "genero"]);

      const tituloLimpio = (titulo || "").toString().trim();
      const autorLimpio = (autor || "").toString().trim();
      const clasificacionLimpia = (clasificacion || "").toString().trim();

      if(!tituloLimpio){
        omitidos++;
        continue;
      }

      const ref = db.collection("libros").doc();

      batch.set(ref,{
        titulo: tituloLimpio,
        autor: autorLimpio || "Desconocido",
        clasificacion: clasificacionLimpia || "General",
        portada: `https://picsum.photos/seed/${encodeURIComponent(tituloLimpio)}/200/300`,
        createdAt: new Date()
      });

      contador++;
      insertados++;

      if(contador === 400){
        await batch.commit();
        batch = db.batch();
        contador = 0;
        console.log(`Lote subido (${insertados} libros)`);
      }
    }

    if(contador > 0){
      await batch.commit();
    }

    console.log("Proceso finalizado");
    console.log(`Insertados: ${insertados}`);
    console.log(`Omitidos: ${omitidos}`);

    process.exit();

  }catch(error){
    console.error("Error general:", error.message);
    process.exit(1);
  }
}

subir();