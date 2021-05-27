import { AppBar, Button, makeStyles, TextField, Toolbar, Typography } from '@material-ui/core';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AppMsg } from '../Types';

type Props = {
  wallet: string,
  account: string,
  network: string,
  connectNetwork: () => Promise<void>,
  setAppMsg: Dispatch<SetStateAction<AppMsg>>,
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  connectStatus: {
    color: "white",
    width: "64ch",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}))

function ToDoAppBar({ wallet, network, account, connectNetwork, setAppMsg }: Props) {
  const classes = useStyles();

  const [enableConnBtn, setEnableConnBtn] = useState<boolean>(true)

  const handleConnect = () => {
    setEnableConnBtn(false)

    connectNetwork().then(() => {
      setAppMsg(["info", "Connected"])

      setEnableConnBtn(true)
    }).catch(err => {
      setAppMsg(["error", `Error in Connect Network: ${err.message}`])

      setEnableConnBtn(true)
    })
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Solidity ToDo App
          </Typography>

          <TextField
            label="Connection Info: Wallet/ChainID NetworkID (NetworkType)/Account"
            value={`${wallet} / ${network} / ${account}`}
            inputProps={{ style: { fontSize: 12 } }}
            size="small"
            margin="dense"
            variant="outlined"
            className={classes.connectStatus}
            InputProps={{ readOnly: true, }} />

          <Button
            color="inherit"
            variant="outlined"
            disabled={!enableConnBtn}
            onClick={handleConnect}>
            Connect
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default ToDoAppBar
