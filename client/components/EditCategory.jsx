import React, { useEffect } from 'react'
import axios from 'axios'

const EditCategory = ({
  category,
  isActive,
  setIsActive,
  changeCategory,
  newCategory,
  setNewCategory,
  setCategories
}) => {
  useEffect(() => {
    setNewCategory(category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClick = async () => {
    await axios(`/api/v1/rename/${category}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { name: newCategory }
    })
      .then((res) => res.data)
      .then((data) => {
        changeCategory(data.name)
      })
      .catch((err) => console.log(err))
    await fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((item) => setCategories(item))
      .catch((err) => console.log(err))
    setIsActive(!isActive)
  }

  return (
    <div className="flex justify-between">
      <input
        className=" m-2 border-solid border-2 border-sky-500 rounded"
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button
        className="m-2 border-solid border-2 border-sky-500 rounded"
        type="button"
        onClick={onClick}
      >
        Edit
      </button>
    </div>
  )
}

export default EditCategory
