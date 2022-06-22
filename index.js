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

// Buscando todos os livros 
app.get('/match', (req, res) => {

 
    connection.query('SELECT * FROM livro;', function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
     

})

// ############################################


app.post('/livros', (req, res) => {


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

    // connection.query("INSERT INTO usuario_livro ()")
    res.send(results);
  });
   

}) 

app.post('/', (req, res) => {
  
    connection.query('INSERT INTO usuario (nome, user_name, email, dt_nascimento, senha) VALUES ("Alice da Silva Costa", "aliceSCosta", "alicealmeyda72@gmail.com", "2001-10-23", "123456");', function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
     
})

app.get('/usuarios', (req, res) => {
    res.send('<h1>Listando usuarios</h1>')
})


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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})