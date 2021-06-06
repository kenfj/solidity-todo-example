import { VariantType } from "notistack"
import { Dispatch, SetStateAction } from "react"
import Web3 from "web3"

export type Task = {
  0: string
  1: string
  2: string
  3: boolean
  4: string
}

export type AppMsg = [
  variant: VariantType,
  message: string
]

type SetAppMsg = Dispatch<SetStateAction<AppMsg>>

export type NetworkProps = {
  setAppMsg: SetAppMsg,
}

export type TodoApiProps = {
  theWeb3: Web3 | undefined,
  account: string,
  setAppMsg: SetAppMsg,
}

export type TodoApi = ({ theWeb3: web3, account, setAppMsg }: TodoApiProps) => [
  tasks: Task[],
  api: {
    createTask: (content: string) => Promise<void>,
    toggleDone: (taskId: number) => void,
    deleteTask: (taskId: number) => void,
  }
]

export type DarkMode = [
  isDark: boolean,
  toggleDark: () => void
]
