const Sequelize = require('sequelize'); // Impordime Sequelize
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('language', {
    language_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'language',
    schema: 'movies',
    timestamps: false, // Väldime automaatset createdAt ja updatedAt lisamist
  });
};
