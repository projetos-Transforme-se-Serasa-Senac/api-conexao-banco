const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'alice2',
  password : '159951',
  database : 'bookmatch',
  port: 3306
});


// #######################################################################

// AUTENTICACAO


app.post('/autentica', (req, res) => {
  
  const usuario = req.body.usuario
  const senha = req.body.senha
  
  connection.query(`SELECT id_usuario, user_name FROM usuario WHERE user_name = '${usuario}' AND senha = '${senha}';`, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
  
})

// ##########################################################################


// CADASTRAR USUARIO

app.post('/usuarios', (req, res) => {
  
  const nome = req.body.nome;
  const user_name = req.body.user_name;
  const email = req.body.email;
  const dt_nascimento = req.body.dt_nascimento;
  const senha = req.body.senha;
  const img_perfil = req.body.img_perfil;
  const img_capa = req.body.img_capa;
  
  const query = `
  INSERT INTO usuario (nome, user_name, email, dt_nascimento, senha, img_perfil, img_capa) 
  VALUES ("${nome}", "${user_name}", "${email}", "${dt_nascimento}", "${senha}", "${img_perfil}", "${img_capa}"); `
  
  
  
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
    });
    

  })

  
// ##########################################################################################


// BUSCAR TODOS OS LIVROS
app.get('/livros:id_usuario', (req, res) => {

  const id_usuario = req.params.id_usuario

  const query = 
  `
  SELECT usuario_livro.id_usuario_livro, usuario.id_usuario, livro.*, usuario.user_name FROM usuario_livro
  JOIN livro ON usuario_livro.id_livro = livro.id_livro
  JOIN usuario ON usuario_livro.id_usuario = usuario.id_usuario
  WHERE usuario.id_usuario NOT IN (${id_usuario});

  `
  
  
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
  
  
})

// ############################################


// CADASTRAR LIVROS

app.post('/livros', (req, res) => {
  
  const id_usuario =  req.body.id_usuario
  const titulo = req.body.titulo
  const autor = req.body.autor
  const genero = req.body.genero
  const classificacao_etaria = req.body.classificacao_etaria
  const aluguel = req.body.aluguel
  const sinopse = req.body.sinopse
  const img_livro = req.body.img_livro
  
  
  const query = `
  
  
  INSERT INTO livro
    (titulo, autor, genero, classificacao_etaria, aluguel, sinopse, imagem, fl_status)
    VALUES 
    ('${titulo}', '${autor}', '${genero}', '${classificacao_etaria}', ${aluguel}, '${sinopse}', '${img_livro}', 0);
    `
    
    connection.query(query, function (error, results, fields) {
    if (error) throw error;

    insereUsuarioLivro(results, id_usuario, res)
  });
  
  
}) 

const insereUsuarioLivro = (results, id_usuario, res) => {
  
  
  // console.log(results)
  // console.log(results[0])
  // console.log(results.insertId)
  const id_livro = results.insertId
  const query = `INSERT INTO usuario_livro (id_usuario, id_livro) VALUES (${id_usuario}, ${id_livro});`
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
    
  });
  
}

//##############################################################################


// MATCH LIVRO

app.post('/match', (req, res) => {

  const id_livro = req.body.id_livro
  const id_usuario = req.body.id_usuario
  
  const query = `  
  INSERT INTO matches (id_usuario_dono, id_usuario_pedinte, id_livro)
  VALUES ( (SELECT id_usuario FROM usuario_livro WHERE id_livro = ${id_livro}), ${id_usuario}, ${id_livro} )
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


// #################################################################

// SEGUIR USUARIO

app.post('/seguir', (req, res) => {

  const id_seguidor = req.body.id_seguidor
  const id_seguindo = req.body.id_seguindo
  
  const query = `  
  INSERT INTO seguidores (id_seguidor, id_seguindo)
  VALUES ( ${id_seguidor}, ${id_seguindo} )
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


// ###################################################################

// FEED

app.get('/feed/:id_seguidor', (req, res) => {

  const id_seguidor = req.params.id_seguidor
  
  const query = `  
  SELECT livro.sinopse, usuario.user_name, usuario.img_perfil, livro.imagem, livro.titulo FROM seguidores
  JOIN usuario_livro ON seguidores.id_seguindo = usuario_livro.id_usuario
  JOIN livro ON usuario_livro.id_livro = livro.id_livro
  JOIN usuario ON usuario_livro.id_usuario = usuario.id_usuario
  WHERE id_seguidor = ${id_seguidor}
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


//######################################################################

//BUSCAR PUBLICACOES

app.get('/publicacoes/:id_usuario', (req, res) => {

  const id_usuario = req.params.id_usuario
  
  const query = `  
  SELECT livro.* FROM usuario_livro
    JOIN livro ON usuario_livro.id_livro = livro.id_livro
  WHERE id_usuario = ${id_usuario}
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


//######################################################################

//BUSCAR EMPRESTADOS

app.get('/emprestados/:id_usuario', (req, res) => {

  const id_usuario = req.params.id_usuario
  
  const query = `  
  SELECT livro.* FROM usuario_livro
    JOIN livro ON usuario_livro.id_livro = livro.id_livro
  WHERE id_usuario = ${id_usuario}
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


//######################################################################

//BUSCAR MEUS PEDIDOS

app.get('/pedidos/:id_usuario', (req, res) => {

  const id_usuario = req.params.id_usuario
  
  const query = `  
  SELECT livro.* FROM usuario_livro
    JOIN livro ON usuario_livro.id_livro = livro.id_livro
  WHERE id_usuario = ${id_usuario}
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


//######################################################################

//BUSCAR SOLICITACOES

app.get('/solicitacoes/:id_usuario', (req, res) => {

  const id_usuario = req.params.id_usuario
  
  const query = `  
  SELECT matches.*, usuario.user_name AS usuario_pedinte, livro.* FROM matches 
  JOIN usuario ON matches.id_usuario_pedinte = usuario.id_usuario
  JOIN livro ON matches.id_livro = livro.id_livro 
  WHERE id_usuario_dono = ${id_usuario}
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


//########################################################################

// BUSCAR PERFIL

app.get('/perfil/:id_usuario', (req, res) => {

  const id_usuario = req.params.id_usuario
  
  
  const query = `  
  SELECT * FROM usuario WHERE id_usuario = ${id_usuario}
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})