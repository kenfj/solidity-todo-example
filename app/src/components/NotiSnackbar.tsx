import { Button } from '@material-ui/core'
import { SnackbarKey, useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import { AppMsg } from '../Types'

// Notistack Demo: https://iamhosseindhv.com/notistack/demos

type Props = {
  appMsg: AppMsg,
}

function NotiSnackbar({ appMsg }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  useEffect(() => {
    const [variant, message] = appMsg

    if (message === "") return

    const action = (key: SnackbarKey) => (
      <Button onClick={() => { closeSnackbar(key) }}>
        'Dismiss'
      </Button>
    )

    const options = {
      variant: variant,
      autoHideDuration: (variant === "error" ? 20 : 5) * 1000,
      action,
    }

    enqueueSnackbar(message, options)
  }, [closeSnackbar, enqueueSnackbar, appMsg])

  return <></>
}

export default NotiSnackbar
