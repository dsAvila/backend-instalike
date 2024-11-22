import { getAllPosts, createPost, updatePost } from "../models/postModel.js";
import fs from 'fs';
import generateDescriptionWithGemini from "../services/geminiService.js";

export async function listPosts(req, res) {
    // Obtém todos os posts usando a função getAllPosts
    const posts = await getAllPosts();
    // Envia os posts como resposta JSON com status 200 (OK)
    res.status(200).json(posts);
}

export async function postNewPost(req, res) {
    const newPost = req.body;
    try {
        const postCreated = await createPost(newPost);
        res.status(200).json(postCreated);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function uploadImage(req, res) {
    const newPost = {
        description: "",
        imageUrl: req.file.originalname,
        alt: ""
    }

    try {
        const postCreated = await createPost(newPost);
        const imageUpdated = `uploads/${postCreated.insertedId}.png`;
        fs.renameSync(req.file.path, imageUpdated);
        res.status(200).json(postCreated);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function updateNewPost(req, res) {
    const id = req.params.id;
    const urlImage = `http://localhost:3000/${id}.png`;
    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const description = await generateDescriptionWithGemini(imageBuffer);
        const post = {
            imageUrl: urlImage,
            description: description,
            alt: req.body.alt
        }
        const postCreated = await updatePost(id, post);
        res.status(200).json(postCreated);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}