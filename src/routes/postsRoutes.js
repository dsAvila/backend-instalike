import express from 'express'; // Importa o módulo express para criar a aplicação web
import multer from 'multer'; // Importa o módulo multer para lidar com uploads de arquivos
import cors from 'cors';
// Importa as funções controladoras de posts do arquivo postsController.js
import { listPosts, postNewPost, updateNewPost, uploadImage } from '../controller/postsController.js';

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
    // Configura o armazenamento em disco para arquivos enviados
    destination: function (req, file, cb) {
        // Define o diretório de destino para os uploads. Crie a pasta 'uploads' caso não exista.
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Mantém o nome original do arquivo enviado
        cb(null, file.originalname);
    }
});

// Configura o middleware multer para uploads
const upload = multer({
    dest: "./uploads", // Caminho alternativo para Linux ou Mac (comentado)
    storage, // Utiliza a configuração de armazenamento definida em 'storage'
});

const routes = (app) => {
    // Habilita o parser de JSON para interpretar dados enviados no formato JSON
    app.use(express.json());
    app.use(cors(corsOptions));
    // Rota GET para listar todos os posts (acessível em http://localhost:porta/posts)
    app.get('/posts', listPosts);
    // Rota POST para criar um novo post (acessível em http://localhost:porta/posts)
    app.post('/posts', postNewPost);
    // Rota POST para upload de imagem (acessível em http://localhost:porta/upload)
    // Utiliza o middleware 'upload.single('image')' para processar um único arquivo chamado 'image'
    app.post('/upload', upload.single('image'), uploadImage);

    app.put('/upload/:id', updateNewPost);
}

export default routes;