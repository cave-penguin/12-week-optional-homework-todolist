import React, { useState } from 'react'

const NewTaskInput = ({ category, updatedTasksList }) => {
  const [newTask, setNewTask] = useState('')

  const handleClear = (e) => {
    e.preventDefault()
    setNewTask('')
  }
  const onClick = async (e) => {
    const newTaskList = await fetch(`/api/v1/tasks/${category}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask })
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
    updatedTasksList(newTaskList)
    handleClear(e)
  }

  return (
    <div>
      <input
        className=" mx-2 border-solid border-2 border-sky-500 rounded"
        type="text"
        onChange={(e) => setNewTask(e.target.value)}
        value={newTask}
      />
      <button
        className=" mx-2 border-solid border-2 border-sky-500 rounded"
        type="button"
        onClick={onClick}
      >
        Add
      </button>
    </div>
  )
}

export default NewTaskInput
