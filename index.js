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
  
  const query = `
  INSERT INTO usuario (nome, user_name, email, dt_nascimento, senha) 
  VALUES ("${nome}", "${user_name}", "${email}", "${dt_nascimento}", "${senha}"); `
  
  
  
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
    });
    

  })

  
// ##########################################################################################


// BUSCAR TODOS OS LIVROS
app.get('/livros', (req, res) => {
  
  
  connection.query('SELECT * FROM livro;', function (error, results, fields) {
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
  const tags = req.body.tags
  const aluguel = req.body.aluguel
  const sinopse = req.body.sinopse
  
  
  const query = `
  
  
  INSERT INTO livro
    (titulo, autor, genero, classificacao_etaria, tags, aluguel, sinopse)
    VALUES 
    ('${titulo}', '${autor}', '${genero}', '${classificacao_etaria}', '${tags}', ${aluguel}, '${sinopse}');
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
  INSERT INTO matches (id_usuario_dono, id_usuario_pedinte)
  VALUES ( (SELECT id_usuario FROM usuario_livro WHERE id_livro = ${id_livro}), ${id_usuario} )
  `

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.send(results); 
  });
     
})


// #################################################################

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})