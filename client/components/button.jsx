import React from 'react'

const Button = ({ status, id, category }) => {
  const onClick = async () => {
    await fetch(`/api/v1/tasks/${category}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
  }
  return (
    <div>
      <button
        className=" mx-2 border-solid border-2 border-sky-500 rounded"
        type="button"
        onClick={onClick}
      >
        {status}
      </button>
    </div>
  )
}

export default Button
