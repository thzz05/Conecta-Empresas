const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Biblioteca para hashing de senha
require('dotenv').config();

const app = express();
const port = 3000;

// Configurar middleware para lidar com JSON e dados de formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS) da pasta 'public'
app.use(express.static('public'));

// URI de conexão ao MongoDB Atlas
const uri = process.env.MONGODB_URI || "mongodb+srv://admin:123senac@conecta.rqjpi.mongodb.net/?retryWrites=true&w=majority&appName=Conecta";

// Conectar ao MongoDB Atlas
let db;
MongoClient.connect(uri)
    .then(client => {
        db = client.db('conectaDB');
        console.log('Conectado ao MongoDB Atlas');
    })
    .catch(error => console.error(error));

// Rota para exibir a página de login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Rota para registro de usuário
app.post('/register', (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Erro ao conectar ao banco de dados.' });
    }

    const { username, password } = req.body;

    // Hashing da senha antes de salvar no banco
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.json({ success: false, message: 'Erro ao processar a senha.' });
        }

        const collection = db.collection('users');
        collection.insertOne({ username, password: hashedPassword })
            .then(result => {
                res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
            })
            .catch(error => {
                res.json({ success: false, message: 'Erro ao cadastrar o usuário.' });
                console.error(error);
            });
    });
});

// Rota para login de usuário
app.post('/login', (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Erro ao conectar ao banco de dados.' });
    }

    const { username, password } = req.body;

    const collection = db.collection('users');
    collection.findOne({ username })
        .then(user => {
            if (!user) {
                return res.redirect('/login-error');
            }

            // Comparar a senha fornecida com a senha armazenada
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.json({ success: false, message: 'Erro ao comparar a senha.' });
                }

                if (result) {
                    // Redirecionar para a rota '/logado' após login bem-sucedido
                    res.redirect('/logado');
                } else {
                    res.redirect('/login-error');
                }
            });
        })
        .catch(error => {
            res.json({ success: false, message: 'Erro ao realizar login.' });
            console.error(error);
        });
});

// Nova rota '/logado' que redireciona para a página logado.html
app.get('/logado', (req, res) => {
    res.sendFile(__dirname + '/public/logado.html'); 
});

// Nova rota '/login-error' que redireciona para a página error.html
app.get('/login-error', (req, res) => {
    res.sendFile(__dirname + '/public/error.html');
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
