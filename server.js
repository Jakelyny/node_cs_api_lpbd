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

var express = require('express'); //requisita a biblioteca para a criação dos serviçoes web.
var pg = require("pg");

var sw = express(); // inicializa uma variável chamada app que possibilitará a criação dos serviços e rotas.

sw.use(express.json()); //padrão de mensagem em json

sw.use(function(req, res, next){
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Acess-Control-Allow-Methods', 'GET,POST');
    next();
});

const config= {
    host: 'localhost',
    user: 'postgres',
    database: 'db_cs_lpbd_2021_9',
    password: '123456',
    port: 5432
}

//definida a conexão com o banco de dados.
const postgres = new pg.Pool(config);

//definindo um serviço web, que estará acessível pelo endereço http://localhost:400/listjogador
sw.get('/listjogador', function (req, res){

    postgres.connect(function(err,client,done){

        if(err){

            console.log("Não conseguiu acessar o BD :" + err);
            res.status(400).send('{'+err+'}');
        }else{

            client.query('SELECT j.nickname, to_char(j.data_nascimento, ')
        }
    })

});

//definição do primeiro serviço web.
sw.get('/', (req, res) => {
    res.send('HELLOO, WORLD! Olá, eu sou um teste ! ! !');
});

//definição da porta
sw.listen(4000, function(){
    console.log('Server is running.. on Port 4000');
});

