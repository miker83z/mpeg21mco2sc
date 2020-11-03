module.exports = {
  port: process.env.PORT,
  files: ['.src/**/*.{html,htm,css,js}'],
  server: {
    baseDir: ['./src', './solidity/build/contracts'],
  },
  ghostMode: false,
};
