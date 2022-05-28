/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
// import Button from './button'
import Task from './Task'
import NewTaskInput from './NewTaskInput'

const TaskList = () => {
  const { category } = useParams()
  const [list, setList] = useState([])

  const updateTaskById = (id, status) => {
    const updatedList = list.map((task) => (task.taskId === id ? { ...task, status } : task))
    setList(updatedList)
  }

  const updatedTasksList = (newList = []) => {
    setList(newList)
  }

  useEffect(() => {
    fetch(`/api/v1/tasks/${category}`)
      .then((result) => result.json())
      .then((it) => setList(it))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Link to="/">back</Link>
      <div>{category}</div>
      <NewTaskInput updatedTasksList={updatedTasksList} category={category} />
      <ul>
        <Task list={list} updateList={updateTaskById} category={category} />
      </ul>
      {/* <NewTaskInput updatedTasksList={updatedTasksList} category={category} /> */}
    </div>
  )
}

export default TaskList
