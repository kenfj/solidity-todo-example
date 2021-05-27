import { useEffect, useState } from 'react';
import Web3 from 'web3';

// https://stackoverflow.com/questions/56457935
declare global {
  interface Window {
    ethereum: any
    web3: string
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

function useNetwork() {
  const [wallet, setWallet] = useState<string>("---")
  const [network, setNetwork] = useState<string>("---")
  const [account, setAccount] = useState<string>("---")
  const [theWeb3, setWeb3] = useState<Web3>()

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
    const web3_ = new Web3(Web3.givenProvider || fallbackWSProviderUrl)

    console.log(`web3 version: ${web3_.version}`)
    setWeb3(web3_)

    setupNetwork(web3_)

    // even if failed to setup account/network, initToDo will succeed
    await setupAccount(web3_).catch(err => {
      console.log(err.message)
      throw err
    })
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
    // if ethereum-compatible browsers
    if (typeof window.ethereum !== 'undefined') {
      // window.ethereum.isConnected() is always true

      // ethereum.enable() equivalent in the latest version
      // https://web3js.readthedocs.io/en/v1.3.4/web3-eth.html#requestaccounts
      return web3_.eth.requestAccounts().then(accounts => {
        setAccount(accounts[0])
      })
      // the above request wallet_requestPermissions eth_requestAccounts in web3
      // https://docs.metamask.io/guide/getting-started.html
      // await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
      return web3_.eth.getAccounts().then(accounts => {
        setAccount(accounts[0])
      })
    }
  }

  return [{ wallet, network, account, theWeb3 }, connectNetwork] as const
}

export default useNetwork
