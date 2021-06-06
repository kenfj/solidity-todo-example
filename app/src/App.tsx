import { colors, CssBaseline, Grid, Paper, Switch } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import React, { useState } from 'react';
import NotiSnackbar from './components/NotiSnackbar';
import TaskInput from './components/TaskInput';
import TaskTable from './components/TaskTable';
import ToDoAppBar from './components/ToDoAppBar';
import useDarkMode from './hooks/useDarkMode';
import useNetwork from './hooks/useNetwork';
import useTodoApi from './hooks/useToDoApi';
import { AppMsg } from './Types';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    maxWidth: 700,
    margin: "50px auto",
    padding: theme.spacing(10),
    textAlign: 'center',
  },
  alert: {
    marginLeft: "auto",
    width: 'fit-content',
  }
}))

function App() {
  const classes = useStyles()
  const [appMsg, setAppMsg] = useState<AppMsg>(["info", ""])

  const [isDark, toggleDark] = useDarkMode()
  const [{ wallet, network, account, theWeb3, isConnected }, connectNetwork, disconnectNetwork] = useNetwork({ setAppMsg })
  const [tasks, { createTask, toggleDone, deleteTask }] = useTodoApi({ theWeb3, account, setAppMsg })

  // React + Material-UIでダークモードを実装してみた
  // https://dev.classmethod.jp/articles/react-material-ui-dark-mode/
  const theme = createMuiTheme({
    palette: {
      type: isDark ? "dark" : "light",
      primary: {
        main: colors.blue[600],
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToDoAppBar {...{ wallet, network, account, isConnected, connectNetwork, disconnectNetwork, setAppMsg }} />
      <Alert severity="info" className={classes.alert}>Try connect Ropsten test network by MetaMask</Alert>

      <Paper elevation={5} className={classes.paper}>
        <Grid container spacing={5}>
          {/* https://kanchi0914.netlify.app/2020/03/12/react-spacer/ */}
          <div style={{ flexGrow: 1 }}></div>
          <Switch
            color="default"
            size="small"
            edge="end"
            checked={isDark}
            onChange={() => toggleDark()} />
          <Grid item xs={12}>
            <TaskInput createTask={createTask} />
          </Grid>
          <Grid item xs={12}>
            <TaskTable
              tasks={tasks}
              toggleDone={toggleDone}
              deleteTask={deleteTask} />
          </Grid>
        </Grid>
      </Paper>
      <SnackbarProvider maxSnack={3}>
        <NotiSnackbar appMsg={appMsg} />
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
