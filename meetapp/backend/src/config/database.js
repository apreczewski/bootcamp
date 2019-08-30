module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meetappp',
  define: {
    timestamps: false,
    underscored: false,
    underscoredAll: true,
  },
};
