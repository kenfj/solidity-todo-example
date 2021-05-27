import { Button, Grid, makeStyles, TextField } from "@material-ui/core"
import React, { useRef } from "react"

type Props = {
  createTask: (content: string) => Promise<void>,
}

const useStyles = makeStyles((theme) => ({
  textfields: {
    justifyContent: "center",
  },
  textfield: {
    width: 'calc(100% - 100px)',
    marginRight: 10,
  },
}))

function TaskInput({ createTask }: Props) {
  const classes = useStyles()
  const contentElm = useRef<HTMLInputElement>(document.createElement("input"))

  const addTask = () => {
    createTask(contentElm.current.value)
    contentElm.current.value = ""
  }

  return (
    <Grid container spacing={10}>
      <Grid item xs={12} className={classes.textfields}>
        <TextField
          type="text"
          inputRef={contentElm}
          className={classes.textfield}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={addTask}>Add</Button>
      </Grid>
    </Grid>
  )
}

export default TaskInput
