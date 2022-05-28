import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Head from './head'

const Home = () => {
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  console.log(categories)

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
          className="border-solid border-2 border-sky-500 rounded"
          type="text"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        />
        <button
          type="button"
          className="border-solid border-2 border-sky-500 rounded"
          onClick={onClick}
        >
          Add
        </button>
      </div>
      <div>
        <ol>
          {categories?.map((item) => {
            return (
              <div key={item}>
                <li>
                  <Link to={`/${item}`}>{item}</Link>
                </li>
              </div>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export default Home
