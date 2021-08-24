const db = require('./dbconn')

const Meucontato = db.sequelize.define('pessoas', {
  nome:{
    type: db.Sequelize.STRING
  },
  telefone:{
    type: db.Sequelize.STRING
  },
  email:{
    type: db.Sequelize.STRING
  }
})

//Meucontato.sync({force: true})

module.exports = Meucontato;
