
//conexão com o banco de dados e importa o modelo
const db = require('./models/dbconn')
const Meucontato = require('./models/addcontato')

//Importa o express
const express = require('express')
const app = express()

//criar diretório público com os arquivos estáticos
app.use(express.static('./views/assets/'))


//Importa e configura bodyparser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//Rotas

//Rota home
app.get('/', function(req,res){
  res.render('index')

})

//Página de cadastro - Novo contato
app.get('/cadastro', function(req,res){
  res.render('cadastro')
})


//Rota que envia os dados e cria o contato no BD
app.post('/add',function(req, res){
	Meucontato.create({
		nome: req.body.nome,
		telefone: req.body.telefone,
    email: req.body.email
	}).then(function(){
		res.redirect('/')
	}).catch(function(erro){
		res.send("Erro no envio da postagem: " + erro)
	})

})

//Ver todos os contatos
app.get('/all', function(req,res){
  Meucontato.findAll().then(function(contatos){
    res.render('todos', {contatos: contatos})
  })
})


//Busca um contato especifico e exibe
app.post('/busca', function(req,res){

  var Op = db.Sequelize.Op

  Meucontato.findAll({where: {nome: {[Op.like]: "%" + req.body.nome + "%"}}}).then(function(contato){
      res.render('busca', {contato: contato})
  }).catch(function(erro){
    res.send('contato não encontrado'+"<br>"+erro)
  })


})

//Deleta um contato - falta uma página de confirmação (sim ou não)
app.get('/deletar/:id', function(req,res){
  Meucontato.destroy({where: {id: req.params.id}}).then(function(){
    res.redirect('/deletado')
  }).catch(function(erro){
    res.send("Erro ao deletar: " + erro)
  })

})

//Confirma que o usuário foi deletado
app.get('/deletado', function(req,res){
  res.render('deletado')
})

//Busca os dados do contato selecionado e envia para o formulário
//Quando a URL possui parametros, o arquivo CSS não funciona.
//Foi preciso fazer o CSS Inline na view 'editar'
app.get('/editar/:id', function(req,res){

  Meucontato.findAll({where: {id: req.params.id}}).then(function(contato){
      res.render('editar', {contato: contato})
  }).catch(function(erro){
    res.send('contato não encontrado: '+erro)
  })

})


//Atualiza os dados do formulário no banco e exibe a pagina de confirmação
app.post('/update', function(req,res){

  Meucontato.update(
    {nome:req.body.nome,
    telefone: req.body.telefone,
    email:req.body.email},
    {where: {id: req.body.id}}

  ).then(function(){
    res.render('atualizado')
  })

})


//importa handlebars e configura template de view
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//Ativa o servidor
app.listen(8081, function(req,res){
  console.log('Servidor up')
})
