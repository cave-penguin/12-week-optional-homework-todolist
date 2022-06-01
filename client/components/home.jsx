import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Head from './head'

const Home = () => {
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const handleClear = (e) => {
    e.preventDefault()
    setCategory('')
  }

  const onClick = async (e) => {
    await fetch(`/api/v1/tasks/${category}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    await fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((item) => setCategories(item))
      .catch((err) => console.log(err))
    handleClear(e)
  }

  const changeCategory = () => {
    fetch(`api/v1/rename/${category}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: { newName: JSON.stringify(newCategory) }
    })
    fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((item) => setCategories(item))
      .catch((err) => console.log(err))
    setIsActive(!isActive)
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
          className=" m-2 border-solid border-2 border-sky-500 rounded"
          type="text"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
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
          {categories?.map((item) => {
            return (
              <li key={item} className="flex">
                {isActive ? (
                  <input
                    className="m-2 border-solid border-2 border-sky-500 rounded"
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                ) : (
                  <Link className="" to={`/${item}`}>
                    {item}
                  </Link>
                )}

                <div>
                  <button
                    className="m-2 border-solid border-2 border-sky-500 rounded"
                    type="button"
                    onClick={changeCategory}
                  >
                    Edit
                  </button>
                  <button
                    className="m-2 border-solid border-2 border-sky-500 rounded"
                    type="button"
                  >
                    Delete
                  </button>
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
