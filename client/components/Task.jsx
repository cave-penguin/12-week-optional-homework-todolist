import React from 'react'
import Button from './button'

const Task = (props) => {
  return (
    <div>
      {props.list
        ? props.list.map((task) => {
            return (
              <li className="flex justify-between" key={task.taskId}>
                <div className="mx-2 ">{task.title}</div>
                <div>{task.status}</div>
                <div>
                  {task.status === 'new' && (
                    <Button
                      updateList={props.updateList}
                      status="in progress"
                      id={task.taskId}
                      category={props.category}
                    />
                  )}
                  {task.status === 'in progress' && (
                    <div className="flex">
                      <Button
                        updateList={props.updateList}
                        status="blocked"
                        id={task.taskId}
                        category={props.category}
                      />
                      <Button
                        updateList={props.updateList}
                        status="done"
                        id={task.taskId}
                        category={props.category}
                      />
                    </div>
                  )}
                  {task.status === 'blocked' && (
                    <Button
                      updateList={props.updateList}
                      status="in progress"
                      id={task.taskId}
                      category={props.category}
                    />
                  )}
                </div>
              </li>
            )
          })
        : []}
    </div>
  )
}

export default Task
