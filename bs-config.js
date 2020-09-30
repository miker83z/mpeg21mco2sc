module.exports = {
  port: 8889,
  files: ['.src/**/*.{html,htm,css,js}'],
  server: {
    baseDir: ['./src', './solidity/build/contracts'],
  },
};
