import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { AbiItem } from "web3-utils";
import { ToDo } from "../../types/web3-v1-contracts/ToDo";
import ToDoJson from '../contracts/ToDo.json';
import { Task, TodoApi, TodoApiProps } from "../Types";

const gasLimit = 1000000

const useTodoApi: TodoApi = ({ theWeb3, account, setAppMsg }: TodoApiProps) => {
  const [todo, setTodo] = useState<ToDo>()
  const [taskIds, setTaskIds] = useState<string[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const logError = useCallback((msg: string) => {
    console.log(msg)
    setAppMsg(["error", msg])
  }, [setAppMsg])

  useEffect(() => {
    const initToDo = async () => {
      if (theWeb3 === undefined) {
        setTodo(undefined)
        setTaskIds([])
        setTasks([])
        return
      }

      const networkId = await theWeb3.eth.net.getId()
      const network = (ToDoJson.networks as any)[networkId]

      if (network === undefined) {
        logError(`Contract address not found in Network Id ${networkId}`)
        setTodo(undefined)
        setTaskIds([])
        setTasks([])
        return
      }

      const abi = ToDoJson.abi as AbiItem[]
      const address = network && network.address

      console.log(ToDoJson.networks)

      const todo_ = (new theWeb3.eth.Contract(abi, address) as any) as ToDo
      setTodo(todo_)
    }

    initToDo().catch((err: Error) => {
      logError(`Error initToDo: ${err.message}`)
    })
  }, [logError, theWeb3])

  // Approach 3: using getTaskIds()
  // https://eattheblocks.com/todo-list-ethereum-dapp-step8/
  const refreshTaskIds = useCallback(async () => {
    if (todo === undefined) {
      setTaskIds([])
      setTasks([])
      return
    }

    try {
      const ids = await todo.methods.getTaskIds().call()
      // taskIds can be null when it is not connected
      if (ids === null) {
        throw new Error("Failed to get task ids. Check the account.")
      }
      setTaskIds(ids)
    } catch (err) {
      logError(`Error refreshTaskIds: ${err.message}`)
    }
  }, [logError, todo])

  // this is to run refreshTaskIds() after init()
  useEffect(() => {
    refreshTaskIds()
  }, [refreshTaskIds])

  useLayoutEffect(() => {
    const refreshTasks = async () => {
      if (todo === undefined) return

      // await in map https://stackoverflow.com/questions/40140149
      await Promise.all(
        taskIds
          .filter(e => e !== "0")
          .map(taskId => todo.methods.getTask(taskId).call())
      )
        .then(setTasks)
    }

    refreshTasks()
  }, [todo, taskIds])

  const createTask = async (content: string) => {
    if (todo === undefined) return

    const tranObj = todo.methods.createTask(content)

    tranObj.send({ from: account, gas: gasLimit })
      .then(async () => {
        setAppMsg(["success", `Created ${content}`])
        refreshTaskIds()
      }).catch((err) => {
        logError(err.message)
      })
  }

  const toggleDone = (taskId: number) => {
    if (todo === undefined) return

    const tranObj = todo.methods.toggleDone(taskId)

    tranObj.send({ from: account, gas: gasLimit })
      .then(async () => {
        setAppMsg(["success", `Toggled ${taskId}`])
        refreshTaskIds()
      }).catch((err) => {
        logError(err.message)
      })
  }

  const deleteTask = (taskId: number) => {
    if (todo === undefined) return

    const tranObj = todo.methods.deleteTask(taskId)

    tranObj.send({ from: account, gas: gasLimit })
      .then(async () => {
        setAppMsg(["success", `Deleted ${taskId}`])
        refreshTaskIds()
      }).catch((err) => {
        logError(err.message)
      })
  }

  return [tasks, { createTask, toggleDone, deleteTask }]
}

export default useTodoApi
