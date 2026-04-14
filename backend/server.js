require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log(" MongoDB conectado"))
.catch(err=>console.log(" Error Mongo:", err));


const Usuario = mongoose.model("Usuario",{
  nombre:{type:String,required:true},
  correo:{type:String,required:true,unique:true},
  password:{type:String,required:true}
});

const Libro = mongoose.model("Libro",{
  titulo:String,
  autor:String,
  clasificacion:String,
  portada:String
});

const Favorito = mongoose.model("Favorito",{
  userId:String,
  libroId:String,
  titulo:String,
  autor:String,
  clasificacion:String,
  portada:String
});


app.post("/api/auth/register",async(req,res)=>{
  try{
    const {nombre,correo,password} = req.body;

    if(!nombre || !correo || !password){
      return res.status(400).json({mensaje:"Campos obligatorios"});
    }

    const existe = await Usuario.findOne({correo});
    if(existe){
      return res.status(400).json({mensaje:"Correo ya registrado"});
    }

    const hash = await bcrypt.hash(password,10);

    const usuario = await Usuario.create({
      nombre,
      correo,
      password:hash
    });

    res.json({mensaje:"Usuario creado",usuario});

  }catch(e){
    res.status(500).json({mensaje:"Error servidor"});
  }
});

app.post("/api/auth/login",async(req,res)=>{
  try{
    const {correo,password} = req.body;

    const user = await Usuario.findOne({correo});
    if(!user){
      return res.status(400).json({mensaje:"Correo no encontrado"});
    }

    const valido = await bcrypt.compare(password,user.password);
    if(!valido){
      return res.status(400).json({mensaje:"Contraseña incorrecta"});
    }

    const token = jwt.sign(
      {id:user._id},
      process.env.JWT_SECRET,
      {expiresIn:"1d"}
    );

    res.json({token,user});

  }catch(e){
    res.status(500).json({mensaje:"Error servidor"});
  }
});


app.get("/api/libros",async(req,res)=>{
  const libros = await Libro.find();
  res.json(libros);
});


app.post("/api/favoritos",async(req,res)=>{
  const {userId,libro} = req.body;

  await Favorito.create({
    userId,
    libroId:libro._id,
    ...libro
  });

  res.json({mensaje:"Agregado"});
});


app.listen(process.env.PORT,()=>{
  console.log("🚀 Servidor en puerto "+process.env.PORT);
});