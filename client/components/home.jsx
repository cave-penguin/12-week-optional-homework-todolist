import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Head from './head'
import EditCategory from './EditCategory'

const Home = () => {
  const [value, setValue] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState('')

  const changeCategory = (getCategory) => {
    setCategory(getCategory)
  }

  const handleClear = (e) => {
    e.preventDefault()
    setCategory('')
  }

  const onClick = async (e) => {
    setCategory(value)
    await axios(`/api/v1/tasks/${category}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    await fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((item) => setCategories(item))
      .catch((err) => console.log(err))
    handleClear(e)
  }

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetch('/api/v1/categories')
        .then((res) => res.json())
        .catch((err) => console.log(err))
      setCategories(data)
    }
    getCategories()
  }, [])

  return (
    <div>
      <Head title="Home" />
      <div>
        <input
          className="m-2 border-solid border-2 border-sky-500 rounded"
          type="text"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <button
          type="button"
          className="m-2 border-solid border-2 border-sky-500 rounded"
          onClick={onClick}
        >
          Add
        </button>
      </div>
      <div>
        <ol>
          {categories.map((item, index) => {
            if (editingCategory === item && isActive) {
              return (
                <EditCategory
                  category={item}
                  setIsActive={setIsActive}
                  isActive={isActive}
                  changeCategory={changeCategory}
                  newCategory={newCategory}
                  setNewCategory={setNewCategory}
                  setCategories={setCategories}
                />
              )
            }
            return (
              <li key={item} className="flex justify-between ">
                <Link className="p-3" to={`/${item}`}>
                  {index + 1}. {item}
                </Link>
                <div>
                  <button
                    className="m-2 border-solid border-2 border-sky-500 rounded"
                    type="button"
                    onClick={() => {
                      setEditingCategory(item)
                      setIsActive(!isActive)
                    }}
                  >
                    Edit
                  </button>
                  {/* <button
                    className="m-2 border-solid border-2 border-sky-500 rounded"
                    type="button"
                  >
                    Delete
                  </button> */}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export default Home
