/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from './button'

const TaskList = () => {
  const { category } = useParams()
  const [list, setList] = useState([])

  useEffect(() => {
    const foo = async () => {
      const categoryList = await fetch(`/api/v1/tasks/${category}`).then((data) => data.json())
      setList(categoryList)
    }
    foo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list])

  return (
    <div>
      <ol>
        {list.map((task) => {
          return (
            <li className="flex" key={task.taskId}>
              <div className="mx-2 ">
                {task.title} {task.status}
              </div>
              <div>
                {task.status === 'new' ? (
                  <Button status="in progress" id={task.taskId} category={category} />
                ) : task.status === 'in progress' ? (
                  <div>
                    <Button status="blocked" id={task.taskId} category={category} />
                    <Button status="done" id={task.taskId} category={category} />
                  </div>
                ) : task.status === 'blocked' ? (
                  <Button status="in progress" id={task.taskId} category={category} />
                ) : (
                  <div />
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
