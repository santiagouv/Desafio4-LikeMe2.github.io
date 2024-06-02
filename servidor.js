import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'likeme',
    allowExitOnIdle: true
});

app.listen(3000, () => console.log("SERVIDOR ON"));

// Ruta para obtener todos los posts
app.get("/posts", async (req, res) => {
    try{
        const consulta = 'SELECT * FROM posts'
    const result = await pool.query(consulta);
    console.log('Posts obtenidos')
    res.json(result.rows);
    } catch (error) {
        res.status(500).send(error)
    }
});

// Ruta para agregar un nuevo post
app.post("/posts", async (req, res) => {
    try{
        const { titulo, img, descripcion } = req.body;
        const consulta = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)'
        await pool.query(consulta, [titulo, img, descripcion]);
        console.log('Post agregado');
        res.status(201).json({ message: 'Post agregado' });
    } catch (error) {
        res.status(500).send(error)
    }

});

// Ruta para dar like a un post
app.put("/posts/like/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const consulta = 'UPDATE posts SET likes = likes + 1 WHERE id = $1'
        await pool.query(consulta,[id]);
        console.log('Like dado');
        res.status(200).json({ message: 'Post likeado' });
    } catch (error) {
        res.status(500).send(error)
    }
});

// Ruta para eliminar un post
app.delete("/posts/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const consulta = 'DELETE FROM posts WHERE id = $1'
        await pool.query(consulta, [id]);
        console.log('Post eliminado');
        res.status(200).json({ message: 'Post eliminado' });
    } catch (error) {
        res.status(500).send(error)
    }

});
