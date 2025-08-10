// L’API Rest et la Base de données : Créer un modèle Sequelize
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pokemon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    types: {
      type: DataTypes.STRING,
      allowNull: false,
      //Getter : BDD -> APi Rest
      //Setter : API Rest -> BDD
      get() {
        return this.getDataValue('types').split(','); //string -> tableau
      },
      set(types) {
        this.setDataValue('types', types.join()); //tableau -> string
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false
  })
}