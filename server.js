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

//Requisita a biblioteca para a criação dos serviços web.
var express = require('express'); 

//Requisita a biblioteca pg para a comunicação com o banco de dados.
var pg = require("pg"); 

//Iniciliaza uma variavel chamada app que possitilitará a criação dos serviços e rotas.
var sw = express(); 

//Padrao de mensagens em JSON.
sw.use(express.json());

sw.use(function (req, res, next) {      //Definições de termos de segurança.

    //Essa passagem do asterisco significa que vai permitir o acesso do serviço por qualquer outra fonte por ser uma rede interna.
    res.header('Access-Control-Allow-Origin', '*');  
    //Ligações de cabeçalho.
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');  
    //Permissão dos métodos, aqui no caso o GET e o POST.
    res.header('Access-Control-Allow-Methods', 'GET,POST');  
    next();
});

const config = {
    host: 'localhost',                  //IP ou nome da máquina.
    user: 'postgres',                   //Usuário postgres.
    database: 'CounterStrike',          //Nome da base de dados que estabelecerá a comunicação.
    password: 'nini',                   //A senha do usuário postgres.
    port: 5432                          //A porta.
};

const postgres = new pg.Pool(config);  //Define conexao com o banco de dados.

sw.get('/listtipoarma', function (req, res) {  //Requisição e respostas da listagem de tipo arma.

    postgres.connect(function (err, client, done) {  //Passagem de parâmetros de erros, comandos SQL e finalização do comando.

        if (err) {  //Teste da variável 'err'

            console.log("Não conseguiu acessar o BD :" + err);
            res.status(400).send('{' + err + '}');  //Passagem do protocolo HTTP 400 de erro
        } else {
            client.query('SELECT t.codigo, t.nome FROM tb_tipo_arma t ORDER BY t.codigo', function (err, result) { //Comando SQL SELECT
                done();   //Encerrando conexão.
                if (err) {
                    console.log(err);
                    res.status(400).send('{' + err + '}');
                } else {
                    res.status(200).send(result.rows);
                }

            });
        }
    });
});

sw.get('/listmunicao', function (req, res) {  //Requisição e respostas da listagem da munição.

    postgres.connect(function (err, client, done) {  //Passagem de parâmetros de erros, comandos SQL e finalização do comando.

        if (err) {  //Teste da variável 'err'.

            console.log("Não conseguiu acessar o BD :" + err);
            res.status(400).send('{' + err + '}');  //Passagem do protocolo HTTP 400 de erro.
        } else {
            client.query('SELECT m.codigo, m.nome FROM tb_municao m ORDER BY m.codigo', function (err, result) { //Comando SQL SELECT
                done();   //Encerrando conexão.
                if (err) {
                    console.log(err);
                    res.status(400).send('{' + err + '}');
                } else {
                    res.status(200).send(result.rows);
                }

            });
        }
    });
});

//definindo um serviço web, que estará acessível pelo endereço http://localhost:4000/listjogador
sw.get('/listarma', function (req, res) {

    postgres.connect(function (err, client, done) {

        if (err) {

            console.log("Não conseguiu acessar o BD :" + err);
            res.status(400).send('{' + err + '}');
        } else {

            client.query('SELECT a.codigo, a.nome, a.preco, t.nome, m.nome FROM tb_municao m INNER JOIN tb_arma a ON m.codigo = a.municao_codigo INNER JOIN tb_tipo_arma t ON t.codigo = a.tipoarma_codigo ORDER BY a.codigo', function (err, result) { //Comando SQL SELECT
                done();   //Encerrando conexão.
                if (err) {
                    console.log(err);
                    res.status(400).send('{' + err + '}');

                } else {
                    res.status(200).send(result.rows); //Retorna para o requisitante a lista de registro(s) encontrado(s) pelo comando SELECT.
                }
            });
        }
    });
});

sw.post('/insertarma', function (req, res, next) {

    postgres.connect(function (err, client, done) {

        if (err) {
            console.log("Nao conseguiu acessar o  BD " + err);
            res.status(400).send('{' + err + '}');
        } else {

            var q = {
                text:  'INSERT INTO tb_arma (codigo, nome, preco, tipoarma_codigo, municao_codigo) VALUES ($1,$2,$3,$4,$5, now())', values: [req.body.codigo, req.body.nome, req.body.preco, req.tipoArmas.codigo, req.body.municao.codigo]
            }
            console.log(q);

            client.query(q, function (err, result) {
                done();   //Encerrando conexão.
                if (err) {
                    console.log('retornou 400 no insert');
                    console.log(err);
                    console.log(err.data);
                    res.status(400).send('{' + err + '}');
                } else {

                    console.log('retornou 201 no insert');
                    res.status(201).send(req.body.nome); //Se não realizar o send não finaliza o client
                }
            });
        }
    });
});

sw.post('/updatearma/', (req, res) => {

    postgres.connect(function (err, client, done) {
        if (err) {

            console.log("Não conseguiu acessar o BD: " + err);
            res.status(400).send('{' + err + '}');

        } else {

            var q = {
                text:  'UPDATE tb_arma SET nome = $1, preco = $2, tipoarma_codigo = $3, municao_codigo = $4 	WHERE codigo = $5',
                values: [req.body.nome, req.body.preco, req.tipoArmas.codigo, req.body.municao.codigo, req.body.codigo]
            }
            console.log(q);

            client.query(q, function (err, result) {
                done();   //Encerrando conexão.
                if (err) {
                    console.log("Erro no updatearma: " + err);
                    res.status(400).send('{' + err + '}');
                } else {
                    res.status(200).send(req.body.nome);//se não realizar o send nao finaliza o client nao finaliza
                }
            });
        }
    });
});

sw.get('/deletearma/:codigo', (req, res) => {

    postgres.connect(function (err, client, done) {
        if (err) {
            console.log("Não conseguiu acessar o serviço deletearma!" + err);
            res.status(400).send('{' + err + '}');
        } else {

            var q = {
                text:   'DELETE FROM tb_arma WHERE codigo = $1',
                values: [req.params.codigo]
            }

            client.query(q, function (err, result) {
                done();   //Encerrando conexão.
                if (err) {
                    console.log(err);
                    res.status(400).send('{' + err + '}');
                } else {
                    res.status(200).send({ 'Código da arma': req.params.codigo });//retorna o nickname deletado.
                }

            });
        }
    });

});

//Definicao do primeiro serviço web.
sw.get('/', (req, res) => {
    res.send('HELLO, WORLD! Olá, eu sou um teste ! ! !');
})

//Inicialização do serviço utilizando a porta 4000.
sw.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});