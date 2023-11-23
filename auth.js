const { Web3Auth } = require("@web3auth/modal");
const { SolanaWallet } = require("@web3auth/solana-provider");

const web3auth = new Web3Auth({
  clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ", // get it from Web3Auth Dashboard
  web3AuthNetwork: "sapphire_mainnet",
  chainConfig: {
    chainNamespace: "solana",
    chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
    rpcTarget: "https://rpc.ankr.com/solana",
    displayName: "Solana Mainnet",
    blockExplorer: "https://explorer.solana.com",
    ticker: "SOL",
    tickerName: "Solana",
  },
});
await web3auth.initModal();

const web3authProvider = await web3auth.connect();

const solanaWallet = new SolanaWallet(web3authProvider); // web3auth.provider