/*
Autor: Jakelyny Sousa de Araújo
Data: 15/09/2021

back_end : responsável pela interação/comunicação com o banco de dados.
front_end : responsável pela interação com o usuário (interface gráfica)

Requisitos para o funcionamento:
Node, npm, express e pg

Comandos para a instalação dos pacotes:
npm install --save express
npm install --save pg
*/

var express = require('express'); // requisita a biblioteca para a criacao dos serviços web.
var pg = require("pg"); // requisita a biblioteca pg para a comunicacao com o banco de dados.

var sw = express(); // iniciliaza uma variavel chamada app que possitilitará a criação dos serviços e rotas.

sw.use(express.json());//padrao de mensagens em json.

sw.use(function(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   res.header('Access-Control-Allow-Methods', 'GET,POST');
   next();
});

const config = {
   host: 'localhost',
   user: 'postgres',
   database: 'db_cs_lpbd_2020_2',
   password: '123456',
   port: 5432
};

//definia conexao com o banco de dados.
const postgres = new pg.Pool(config);

sw.get('/listpatente', function (req, res) {

   postgres.connect(function(err,client,done) {

      if(err){

          console.log("Não conseguiu acessar o BD :"+ err);
          res.status(400).send('{'+err+'}');
      }else{
       client.query('SELECT p.codigo, p.nome FROM tb_patente p order by p.codigo asc',function(err,result) {        
               done(); // closing the connection;
               if(err){
                   console.log(err);
                   res.status(400).send('{'+err+'}');
               }else{
                   res.status(200).send(result.rows);
               }
               
           });
      } 
   });
});


//definindo um serviço web, que estará acessível pelo endereço http://localhost:4000/listjogador
sw.get('/listjogador', function (req, res) {

   postgres.connect(function(err,client,done) {

      if(err){

          console.log("Não conseguiu acessar o BD :"+ err);
          res.status(400).send('{'+err+'}');
      }else{
       
       client.query('SELECT j.nickname, to_char(j.data_nascimento, \'yyyy-mm-dd\') as data_nascimento,  j.qtd_estrela, p.codigo, p.nome, p.descricao, j.senha, to_char(j.data_cadastro, \'yyyy-mm-dd\') as data_cadastro FROM tb_jogador j, tb_patente p where j.patente_codigo=p.codigo order by j.data_cadastro asc',function(err,result) {        
               
               done(); // closing the connection;
               if(err){

                   console.log(err);

                   res.status(400).send('{'+err+'}');

               }else{

                   res.status(200).send(result.rows);//retorna para o requisitante a lista de registro(s) encontrado(s) pelo comando select.
               }
               
           });
      } 
   });
});

sw.post('/insertjogador', function (req, res, next) {
   
   postgres.connect(function(err,client,done) {

      if(err){

          console.log("Nao conseguiu acessar o  BD "+ err);
          res.status(400).send('{'+err+'}');
      }else{            

           var q ={
               text: 'insert into tb_jogador (nickname, data_nascimento, senha, patente_codigo, qtd_estrela, data_cadastro) values ($1,$2,$3,$4,$5, now())',
               values: [req.body.nickname, req.body.data_nascimento, req.body.senha, req.body.patente.codigo, req.body.qtd_estrela]
           }
           console.log(q);
   
           client.query(q,function(err,result) {
               done(); // closing the connection;
               if(err){
                   console.log('retornou 400 no insert');
                   console.log(err);
                   console.log(err.data);
                   res.status(400).send('{'+err+'}');
               }else{

                   console.log('retornou 201 no insert');
                   res.status(201).send(req.body.nickname);//se não realizar o send nao finaliza o client
               }           
           });
      }       
   });
});

sw.post('/updatejogador/', (req, res) => {

   postgres.connect(function(err,client,done) {
       if(err){

           console.log("Não conseguiu acessar o BD: "+ err);
           res.status(400).send('{'+err+'}');

       }else{

           var q ={
               text: 'update tb_jogador set data_nascimento = $1, senha = $2, qtd_estrela = $3, patente_codigo = $4 where nickname = $5',
               values: [req.body.data_nascimento, req.body.senha, req.body.qtd_estrela, req.body.patente.codigo, req.body.nickname]
           }
           console.log(q);
    
           client.query(q,function(err,result) {
               done(); // closing the connection;
               if(err){
                   console.log("Erro no updatejogador: "+err);
                   res.status(400).send('{'+err+'}');
               }else{             
                   res.status(200).send(req.body.nickname);//se não realizar o send nao finaliza o client nao finaliza
               }
           });
       }
    });
});




sw.get('/deletejogador/:nickname', (req, res) => {

   postgres.connect(function(err,client,done) {
       if(err){
           console.log("Não conseguiu acessar o serviço deletejogador!"+ err);
           res.status(400).send('{'+err+'}');
       }else{
           
           var q ={
               text: 'delete FROM tb_jogador where nickname = $1',
               values: [req.params.nickname]
           }
   
           client.query( q , function(err,result) {
               done(); // closing the connection;
               if(err){
                   console.log(err);
                   res.status(400).send('{'+err+'}');
               }else{
                   res.status(200).send({'nickname': req.params.nickname});//retorna o nickname deletado.
               }

           });
       } 
    });

});



//definicao do primeiro serviço web.
sw.get('/', (req, res) => {
   res.send('Hello, world! meu primeiro teste.  #####');
})


sw.listen(4000, function () {
   console.log('Server is running.. on Port 4000');
});