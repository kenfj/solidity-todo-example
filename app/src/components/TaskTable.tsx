import { Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React from "react";
import { Task } from "../Types";

type Props = {
  tasks: Task[]
  toggleDone: (taskId: number) => void
  deleteTask: (taskId: number) => void
}

function TaskList({ tasks, toggleDone, deleteTask }: Props) {
  return (
    <>{
      tasks.length === 0 ?
        '登録されたTODOはありません。' :
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Done</TableCell>
                <TableCell>DateComplete</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task[0]}>
                  <TableCell>{task[0]}</TableCell>
                  <TableCell>{formatDate(task[1])}</TableCell>
                  <TableCell>{task[2]}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={task[3]}
                      color="primary"
                      onChange={() => toggleDone(Number(task[0]))}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(task[4])}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => deleteTask(Number(task[0]))}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    }</>
  );
}

const formatDate = (rawDate: string) => {
  if (rawDate === "0") return "--"

  const _date = new Date(Number(rawDate) * 1000)
  const d = `${_date.getMonth() + 1}/${_date.getDate()}`
  const t = `${_date.getHours()}:${_date.getMinutes()}`
  return `${d} ${t}`
};

export default TaskList
