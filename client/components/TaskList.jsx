/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from './button'

const TaskList = () => {
  const { category } = useParams()
  const [list, setList] = useState([])

  const updateTaskById = (id, status) => {
    const updatedList = list.map((task) => (task.taskId === id ? { ...task, status } : task))
    setList(updatedList)
  }

  useEffect(() => {
    fetch(`/api/v1/tasks/${category}`)
      .then((result) => result.json())
      .then((it) => setList(it))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Link to="/">Back</Link>
      <div>{category}</div>

      <ol>
        {list.map((task) => {
          return (
            <li className="flex" key={task.taskId}>
              <div className="mx-2 ">
                {task.title} {task.status}
              </div>
              <div>
                {task.status === 'new' && (
                  <Button
                    updateList={updateTaskById}
                    status="in progress"
                    id={task.taskId}
                    category={category}
                  />
                )}
                {task.status === 'in progress' && (
                  <div className="flex">
                    <Button
                      updateList={updateTaskById}
                      status="blocked"
                      id={task.taskId}
                      category={category}
                    />
                    <Button
                      updateList={updateTaskById}
                      status="done"
                      id={task.taskId}
                      category={category}
                    />
                  </div>
                )}
                {task.status === 'blocked' && (
                  <Button
                    updateList={updateTaskById}
                    status="in progress"
                    id={task.taskId}
                    category={category}
                  />
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default TaskList
