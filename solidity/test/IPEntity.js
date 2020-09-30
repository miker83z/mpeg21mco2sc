const fs = require('fs');
const jsonContract = JSON.parse(fs.readFileSync('./test/c6.json', 'utf8'));
const IPEntity = artifacts.require('IPEntity.sol');

contract('IPEntity', (accounts) => {
  var owner = accounts[0];
  var alice = accounts[1];
  var bob = accounts[2];

  it('should create a new contract and mint a new obligation to alice', async () => {
    const token = await IPEntity.deployed();
    await token.newMCOContract(
      web3.utils.asciiToHex('hKL30svS0pLsv8ghXQ98h23L'),
      accounts,
      {
        from: owner,
      }
    );
    await token.newObligation(
      web3.utils.asciiToHex('hKL30svS0pLsv8ghXQ98h23L'),
      alice,
      'http://ipentity.com/obligation1'
    );
    aal = await token.balanceOf(alice);
    // console.log(aal.toString());
    assert.equal(aal, '1', 'Amount was not correctly minted');
  });

  it('should create a new contract from a json-ld', async () => {
    const token = await IPEntity.deployed();
    if (jsonContract['hasParty'].length > 9) return;

    const parties = {};
    for (let i = 0; i < jsonContract['hasParty'].length; i++) {
      parties[jsonContract['hasParty'][i]['@id']] = accounts[i + 1];
    }

    console.log(parties);

    await token.newMCOContract(
      web3.utils.asciiToHex('hKL30svS0pLsv8hXQ98h23L'),
      accounts,
      {
        from: owner,
      }
    );

    jsonContract.issues.forEach(async (element) => {
      switch (element['@type'][0]) {
        case 'mco-core:Obligation':
          await token.newObligation(
            web3.utils.asciiToHex('hKL30svS0pLsv8hXQ98h23L'),
            parties[element['obligatesAction']['actedBy']['@id']],
            JSON.stringify(element['obligatesAction'])
          );
          break;
        case 'mvco:Permission':
          await token.newObligation(
            web3.utils.asciiToHex('hKL30svS0pLsv8hXQ98h23L'),
            parties[element['permitsAction']['actedBy']['@id']],
            JSON.stringify(element['permitsAction'])
          );
          break;
        case 'mco-core:Prohibition':
          await token.newObligation(
            web3.utils.asciiToHex('hKL30svS0pLsv8hXQ98h23L'),
            parties[element['permitsAction']['actedBy']['@id']],
            JSON.stringify(element['forbidsAction'])
          );
          break;
        default:
          console.log(element['@type']);
      }
    });

    aal = await token.balanceOf(alice);
    // console.log(aal.toString());
    assert.equal(aal, '3', 'Amount was not correctly minted');
  });

  it('should log tokens', async () => {
    const token = await IPEntity.deployed();

    for (let i = 1; i <= jsonContract['issues'].length; i++) {
      aal = await token.tokenURI(i);
      console.log(aal);
    }
  });
});
