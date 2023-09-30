const express = require('express');
const app = express();
const puerto = process.env.PORT || 3000;

app.use(express.json());

let peliculas = [
    { id: 1, titulo: "El Padrino", director: "Francis Ford Coppola", año_lanzamiento: 1972, genero: "Drama/Crimen", calificacion: 9.2 },
    { id: 2, titulo: "Titanic", director: "James Cameron", año_lanzamiento: 1997, genero: "Romance/Drama", calificacion: 7.8 },
    { id: 3, titulo: "Avatar", director: "James Cameron", año_lanzamiento: 2009, genero: "Ciencia ficción/Acción", calificacion: 7.8 },
    { id: 4, titulo: "Forrest Gump", director: "Robert Zemeckis", año_lanzamiento: 1994, genero: "Drama/Comedia", calificacion: 8.8 },
    { id: 5, titulo: "Matrix", director: "The Wachowskis", año_lanzamiento: 1999, genero: "Ciencia ficción/Acción", calificacion: 8.7 },
    { id: 6, titulo: "Spiderman", director: "Sam Raimi", año_lanzamiento: 2002, genero: "Acción/Aventura", calificacion: 7.3 },
    { id: 7, titulo: "La La Land", director: "Damien Chazelle", año_lanzamiento: 2016, genero: "Musical/Romance", calificacion: 8.0 },
    { id: 8, titulo: "Gladiator", director: "Ridley Scott", año_lanzamiento: 2000, genero: "Acción/Drama", calificacion: 8.5 },
    { id: 9, titulo: "Inception", director: "Christopher Nolan", año_lanzamiento: 2010, genero: "Ciencia ficción/Acción", calificacion: 8.8 },
    { id: 10, titulo: "Avengers", director: "Joss Whedon", año_lanzamiento: 2012, genero: "Acción/Aventura", calificacion: 8.0 }
];


//Obtener la lista de todas las peliculas (GET).
app.get('/socios/v1/peliculas', (req, res) => {
    if (peliculas.length>0){
        res.status(200).json({
            estado:1,
            mensaje: "Existen peliculas",
            peliculas: peliculas
        })
    }else{
        res.status(404).json({
            estado:0,
            mensaje: "No existen peliculas"
        })
    }
});

//Obtener una pelicula por su ID (GET).
app.get('/socios/v1/peliculas/:id', (req, res) => {
    const id = req.params.id;
    const pelicula = peliculas.find(pelicula => pelicula.id == id);

    if(pelicula){
        //Si se encontró la pelicula
        res.status(200).json({
            estado:1,
            mensaje: "Se encontró pelicula",
            pelicula: pelicula
        })
    }else{
        //No se encontró pelicula
        res.status(404).json({
            estado:0,
            mensaje: "No se encontró pelicula"
        })
    }
});

//Agregar una nueva pelicula (POST).
app.post('/socios/v1/peliculas', (req, res) => {
    const titulo = req.body.titulo;
    const director = req.body.director;
    const año_lanzamiento = req.body.año_lanzamiento;
    const genero = req.body.genero;
    const calificacion = req.body.calificacion;

    // Generar ID aleatorio único
    //-----------------------------------------------------------------------------------
    let id;
    let peliculaExistente;

    do {
        id = Math.round(Math.random() * 1000);
        peliculaExistente = peliculas.find(pelicula => pelicula.id === id);
    } while (peliculaExistente);
    //-----------------------------------------------------------------------------------

    if(titulo==undefined){
        res.status(400).json({
            estado: 0,
            mensaje: "Faltan parámetros en la solicitud"
        })
    }else{
        const pelicula = {id:id, titulo:titulo, director:director, año_lanzamiento:año_lanzamiento, genero:genero, calificacion:calificacion}
        let logitudInicial = peliculas.length;
        peliculas.push(pelicula)
        // Comprobar que se creo pelicula
        if(peliculas.length > logitudInicial){
            res.status(200).json({
                estado:1,
                mensaje:"Pelicula creada",
                pelicula:pelicula
            })
        }else{
            res.status(500).json({
                estado:0,
                mensaje:"Ocurrió un error desconocido"
            })
        }
    }
});

//Actualizar una pelicula por su ID (PUT).
app.put('/socios/v1/peliculas/:id', (req, res) => {
    //Actualizar datos de pelicula
    const id = req.params.id;
    const {titulo, director, año_lanzamiento, genero, calificacion} = req.body;
    
    if(titulo==undefined){
        res.status(400).json({
            estado: 0,
            mensaje: "Faltan parámetros en la solicitud"
        })
    }else{
        const posActualizar = peliculas.findIndex(pelicula => pelicula.id == id)
        if(posActualizar != -1){
            //Si encontro pelicula con el id buscado
            peliculas[posActualizar].titulo = titulo;
            peliculas[posActualizar].director = director;
            peliculas[posActualizar].año_lanzamiento = año_lanzamiento;
            peliculas[posActualizar].genero = genero;
            peliculas[posActualizar].calificacion = calificacion;

            res.status(200).json({
                estado: 1,
                mensaje: "Pelicula actualizada",
                pelicula: peliculas[posActualizar]
            })
        }else{
            //No se encontró
            res.status(404).json({
                estado: 0,
                mensaje: "No se encontró pelicula"
            })
        }
    }    
});

//Eliminar una pelicula por su ID (DELETE).
app.delete('/socios/v1/peliculas/:id', (req, res) => {
    //Eliminar pelicula
    const id = req.params.id;
    const posEliminar = peliculas.findIndex(pelicula => pelicula.id == id)
    
    if(posEliminar != -1){
        //Si encontro la pelicula con el id buscado
        peliculas.splice(posEliminar, 1); 

        res.status(201).json({
            estado: 1,
            mensaje: "Pelicula eliminada"
        })
    }else{
        //No se encontró
        res.status(404).json({
            estado: 0,
            mensaje: "No se encontró pelicula"
        })
    }
});

app.listen(puerto, () => {
    console.log('Servidor corriendo en el puerto: ', puerto);

});