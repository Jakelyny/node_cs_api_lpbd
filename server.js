/*
Autor: Jakelyny Sousa de Araújo
Data: 15/09/2021

back_end : responsável pela interação/comunicação com o banco de dados.
front_end : responsável pela interação com o usuário (interface gráfica)

Requisitos para o funcionamento:
Node, npm, express e pg

Comandos para a isntalação dos pacotes:
npm install --save express
npm install --save pg
*/

var express = require('express'); //requisita a biblioteca para a criação dos serviçoes web.

var sw = express(); // inicializa uma variável chamada app que possibilitará a criação dos serviços e rotas.

sw.use(express.json()); //padrão de mensagem em json

sw.use(function(req, res, next){
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Acess-Control-Allow-Methods', 'GET,POST');
    next();
});

//definição do primeiro serviço web.
sw.get('/', (req, res) => {
    res.send('Hello, world! Meu primeiro teste.');
});


sw.listen(4000, function(){
    console.log('Server is running.. on Port 4000');
});