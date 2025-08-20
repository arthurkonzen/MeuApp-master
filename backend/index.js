const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./database.sqlite');

app.use(cors());
app.use(bodyParser.json());

// Cria tabela de usuários se não existir
db.run('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nome TEXT, email TEXT UNIQUE, senha TEXT)');

// Cria tabela de bebês se não existir
db.run('CREATE TABLE IF NOT EXISTS bebes (id INTEGER PRIMARY KEY, nome TEXT, dataNascimento TEXT, rg TEXT, cpf TEXT, usuarioId INTEGER)');

// Cadastro de usuário
app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
    if (row) return res.json({ erro: 'Email já cadastrado' });
    db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], function(err) {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
      res.json({ sucesso: true });
    });
  });
});

// Login de usuário
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  db.get('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, user) => {
    if (!user) return res.json({ erro: 'E-mail ou senha incorretos' });
    // Simula criação de token (não seguro, para fins didáticos)
    const token = Math.random().toString(36).substring(2);
    res.json({ token, nome: user.nome, email: user.email, id: user.id });
  });
});

// Cadastro de bebê
app.post('/bebes', (req, res) => {
  const { nome, dataNascimento, rg, cpf, usuarioId } = req.body;
  if (!nome || !dataNascimento || !usuarioId) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
  }
  db.run('INSERT INTO bebes (nome, dataNascimento, rg, cpf, usuarioId) VALUES (?, ?, ?, ?, ?)', [nome, dataNascimento, rg, cpf, usuarioId], function(err) {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar bebê' });
    res.json({ sucesso: true });
  });
});

// Listagem de bebês por usuário (para uso futuro)
app.get('/bebes/:usuarioId', (req, res) => {
  const usuarioId = req.params.usuarioId;
  db.all('SELECT * FROM bebes WHERE usuarioId = ?', [usuarioId], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar bebês' });
    res.json(rows);
  });
});

app.listen(3333, () => {
  console.log('Backend rodando na porta 3333');
});