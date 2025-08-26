const { max } = require("lodash");

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
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom ne peut pas être vide." },
        notNull: { msg: "Le nom est une propriété requise." },
        len: { args: [3, 25], msg: "Le nom doit contenir entre 3 et 25 caractères." }
      }
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Utilisez uniquement des nombres entiers pour les points de vie." },
        notNull: { msg: "Les points de vie sont une propriété requise." },
        min: { args: [0], msg: "Les points de vie ne peuvent pas être négatifs." },
        max: { args: [999], msg: "Les points de vie ne peuvent pas dépasser 999." }
      }
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Utilisez uniquement des nombres entiers pour les points de dégât." },
        notNull: { msg: "Les points de dégât sont une propriété requise." },
        min: { args: [0], msg: "Les points de dégât ne peuvent pas être négatifs." },
        max: { args: [99], msg: "Les points de dégât ne peuvent pas dépasser 99." }
      }
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: { msg: "Utilisez uniquement une URL valide pour l'image." },
        notNull: { msg: "L'URL de l'image est une propriété requise." },
      }
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