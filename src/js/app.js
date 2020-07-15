App = {
  web3Provider: null,
  contracts: {},
  editor: null,
  editor2: null,

  init: async function () {
    // Load pets.
    const data = await $.getJSON('../json-ld/stream-big-label.json');
    App.accounts = await $.getJSON('../accounts.json');

    App.editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
      lineNumbers: true,
      mode: { name: 'javascript', json: true },
      theme: 'base16-dark',
    });

    App.editor.setValue(JSON.stringify(data, null, 2));
    App.editor.setSize(null, 500);

    App.editor2 = CodeMirror.fromTextArea(document.getElementById('editor2'), {
      mode: { name: 'javascript', json: true },
    });
    App.editor2.setValue('Loading tokens from blockchain...');
    App.editor2.setSize(null, 500);

    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there an injected web3 instance ?
    try {
      if (ethereum) {
        App.web3Provider = ethereum;
        ethereum.enable();
      } else {
        //// If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider(
          'http://localhost:8545'
        );
      }
      web3 = new Web3(App.web3Provider);
    } catch (error) {
      document.getElementById('metamask').style.display = 'block';
      document.getElementById('formdiv').style.display = 'none';
      document.getElementById('uploadbtn').style.display = 'none';
      App.editor2.setValue('You need an Ethereum provider (Metamask)');
    }

    return App.initContract();
  },

  initContract: async function () {
    try {
      const ipentityArtifact = await $.getJSON('IPEntity.json');
      var contractAddress = $('#caddr').val();
      $('#cstatus').text('Searching Contract...');

      // Get the necessary contract artifact file and instantiate it with web3
      App.contracts.ipentity = new web3.eth.Contract(
        ipentityArtifact.abi,
        contractAddress
      );

      // Set the provider for our contract
      App.contracts.ipentity.setProvider(App.web3Provider);
      $('#cstatus').text('Contract Found!');
    } catch (error) {
      console.log(error);
      $('#cstatus').text('Contract Error!');
    }

    // Use our contract to retrieve and show tokens
    App.showBalancesList();

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-contract', App.handleUpload);
    $(document).on('click', '.btn-refresh', App.showBalancesList);
    $(document).on('click', '.btn-update', App.initContract);
    $(document).on('click', '.btn-case', App.setCase);
  },

  showBalancesList: async function () {
    try {
      const tokenList = [];
      const caller = await web3.eth.getAccounts();

      const totalSupply = await App.contracts.ipentity.methods
        .totalSupply()
        .call({ from: caller[0] });

      for (i = totalSupply - 1; i >= 0; i--) {
        const tokenId = await App.contracts.ipentity.methods
          .tokenByIndex(i)
          .call({ from: caller[0] });
        const tokenURI = await App.contracts.ipentity.methods
          .tokenURI(tokenId)
          .call({ from: caller[0] });
        const ownerOf = await App.contracts.ipentity.methods
          .ownerOf(tokenId)
          .call({ from: caller[0] });
        tokenList.push({
          tokenId: tokenId,
          ownerOf: ownerOf,
          tokenURI: tokenURI,
        });
        App.editor2.setValue(JSON.stringify(tokenList, null, 2));
      }
    } catch (error) {
      console.log(error);
    }
  },

  handleUpload: async function (event) {
    event.preventDefault();

    const jsonContract = JSON.parse(App.editor.getValue());
    if (jsonContract['hasParty'].length > 10) return;

    const parties = {};
    for (let i = 0; i < jsonContract['hasParty'].length; i++) {
      parties[jsonContract['hasParty'][i]['@id']] = App.accounts[i + 1];
    }

    const caller = await web3.eth.getAccounts();

    try {
      await App.contracts.ipentity.methods
        .newMCOContract(
          web3.utils.asciiToHex(Math.random().toString(36).substring(2)),
          Object.values(parties)
        )
        .send({ from: caller[0] });

      jsonContract.issues.forEach(async (element) => {
        switch (element['@type'][0]) {
          case 'mco-core:Obligation':
            await App.contracts.ipentity.methods
              .newObligation(
                web3.utils.asciiToHex('hKL30svS0pLsv8hXQ98h23L'),
                parties[element['obligatesAction']['actedBy']['@id']],
                JSON.stringify(element['obligatesAction'])
              )
              .send({ from: caller[0] });
            break;
          case 'mvco:Permission':
            await App.contracts.ipentity.methods
              .newPermission(
                web3.utils.asciiToHex('hKL30svS0pLsv8hXQ98h23L'),
                parties[element['permitsAction']['actedBy']['@id']],
                JSON.stringify(element['permitsAction'])
              )
              .send({ from: caller[0] });
            break;
          case 'mco-core:Prohibition':
            await App.contracts.ipentity.methods
              .newProhibition(
                web3.utils.asciiToHex('hKL30svS0pLsv8hXQ98h23L'),
                parties[element['permitsAction']['actedBy']['@id']],
                JSON.stringify(element['forbidsAction'])
              )
              .send({ from: caller[0] });
            break;
          default:
            console.log(element['@type']);
        }
      });
    } catch (error) {
      console.log(error);
    }
    return App.showBalancesList();
  },

  setCase: async function (event) {
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    var jsonFile = '';

    switch (petId) {
      case 0:
        jsonFile = '../json-ld/stream-big-label.json';
        break;
      case 1:
        jsonFile = '../json-ld/stream-small-label.json';
        break;
      case 2:
        jsonFile = '../json-ld/stream-no-label.json';
        break;
      case 3:
        jsonFile = '../json-ld/download-big-label.json';
        break;
      case 4:
        jsonFile = '../json-ld/download-small-label.json';
        break;
      case 5:
        jsonFile = '../json-ld/download-no-label.json';
        break;
      default:
        break;
    }
    const data = await $.getJSON(jsonFile);
    App.editor.setValue(JSON.stringify(data, null, 2));
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

$('form').keypress(function (e) {
  //Enter key
  if (e.which == 13) {
    return false;
  }
});
