import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import { NetworkProps } from "../Types";

// https://stackoverflow.com/questions/56457935
declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

// NOTE: many changes in recent version

// HTTP provider is deprecated; use Websocket provider instead
// https://web3js.readthedocs.io/en/v1.3.4/web3.html#providers

// Web3.js: givenProvider VS currentProvider
// https://stackoverflow.com/questions/55822581

// if ERC1193 compliant wallet (e.g. MetaMask) available on browser:
//   web3 set window.ethereum to Web3.givenProvider
//   and Web3.givenProvider == web3.currentProvider
// else:
//   givenProvider is null
//   use external WebsocketProvider (local or remote Websocket URL)

// MetaMask: web3.currentProvider is deprecated; use window.ethereum instead
// https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3

// Don't use window.web3 MetaMask Legacy Web3
// https://metamask.zendesk.com/hc/en-us/articles/360053147012

// ethereum.networkVersion (DEPRECATED)
// https://docs.metamask.io/guide/ethereum-provider.html#ethereum-networkversion-deprecated
// use Chain ID over Network ID
// https://chainid.network/

// ethereum.selectedAddress (DEPRECATED)
// https://docs.metamask.io/guide/ethereum-provider.html#ethereum-selectedaddress-deprecated
// ethereum.enable() (DEPRECATED)
// https://docs.metamask.io/guide/ethereum-provider.html#ethereum-enable-deprecated

// save REACT_APP_INFURA_ID in .env.local for local development
// https://qiita.com/geekduck/items/6f99a3da15dd39658fff#開発環境、本番環境でアプリに渡す環境変数を切り替えたい
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    }
  }
}

// Note: TrustWallet cannot connect to ropsten
const web3Modal = new Web3Modal({
  // network: "ropsten",
  cacheProvider: false,
  providerOptions
})

function useNetwork({ setAppMsg }: NetworkProps) {
  const [wallet, setWallet] = useState<string>("---")
  const [network, setNetwork] = useState<string>("---")
  const [account, setAccount] = useState<string>("---")
  const [theWeb3, setWeb3] = useState<any>()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // if ethereum-compatible browsers
    if (typeof window.ethereum !== 'undefined') {
      setWallet(window.ethereum?.isMetaMask ? "MetaMask" : "OtherWallet")
    } else {
      setWallet("None")
    }
  }, [])

  const connectNetwork = async () => {
    // when injected provider like MetaMask available on browser
    // Web3.givenProvider === window.ethereum
    // web3.currentProvider === window.ethereum
    // https://web3js.readthedocs.io/en/v1.3.4/getting-started.html
    const fallbackWSProviderUrl = "ws://127.0.0.1:9545"

    // this is using bare Web3
    // const web3_ = new Web3(Web3.givenProvider || fallbackWSProviderUrl)

    // this is using web3Modal wrapper
    const provider = await web3Modal.connect()

    setIsConnected(true)

    // use local blockchain for local server with wallet other than MetaMask
    const isLocal = !provider.isMetaMask && (window.location.hostname === "127.0.0.1")

    if (isLocal)
      setAppMsg(["info", `Connect to local blockchain for development: ${fallbackWSProviderUrl}`])

    const provider_ = isLocal ? fallbackWSProviderUrl : provider
    const web3_ = new Web3(provider_)

    console.log(`web3 version: ${web3_.version}`)
    setWeb3(web3_)

    setupNetwork(web3_)

    // even if failed to setup account/network, initToDo will succeed
    setupAccount(web3_)
  }

  const setupNetwork = async (web3_: Web3) => {
    const nodeInfo = await web3_.eth.getNodeInfo()
    console.log(`setupNetwork Connected by: ${nodeInfo}`)
    setWallet(nodeInfo.split(" ", 1)[0])

    // Chain ID VS Network ID
    // https://ethereum.stackexchange.com/questions/76581
    // Chain ID and Network ID can be different
    // https://medium.com/@pedrouid/chainid-vs-networkid-how-do-they-differ-on-ethereum-eec2ed41635b
    // move away from networkId and start using chainId instead
    // https://chainid.network/

    // chain ID of the current connected node
    const chainId = await web3_.eth.getChainId()

    // current network ID
    const networkId = await web3_.eth.net.getId()

    const networkType = await web3_.eth.net.getNetworkType()
      .catch(err => {
        console.log(`Error in getNetworkType: ${err.message}`)
        return "unknown"
      })

    setNetwork(`${chainId} ${networkId} (${networkType})`)
  }

  // https://stackoverflow.com/a/61199795
  const setupAccount = (web3_: Web3) => {
    web3_.eth.getAccounts().then(accounts => {
      // use 1st account
      setAccount(accounts[0])
    }).catch(err => {
      console.log(err.message)
      throw err
    })
  }

  const disconnectNetwork = async () => {
    if (theWeb3 && theWeb3.currentProvider && theWeb3.currentProvider.close) {
      await theWeb3.currentProvider.close()
    }
    web3Modal.clearCachedProvider()

    setNetwork("---")
    setAccount("---")
    setWeb3(undefined)
    setIsConnected(false)
  }

  return [{ wallet, network, account, theWeb3, isConnected }, connectNetwork, disconnectNetwork] as const
}

export default useNetwork
