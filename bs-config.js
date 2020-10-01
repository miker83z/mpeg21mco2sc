module.exports = {
  port: 8889, //process.env.PORT,
  files: ['.src/**/*.{html,htm,css,js}'],
  server: {
    baseDir: ['./src', './solidity/build/contracts'],
  },
};
