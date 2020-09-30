const IPEntity = artifacts.require('./IPEntity.sol');

module.exports = function (deployer) {
  return deployer.deploy(
    IPEntity,
    'IPEntity1',
    'IPE',
    web3.utils.asciiToHex('h34ImQ34f0aK0')
  );
};
