import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Head from './head'

// import wave from '../assets/images/wave.jpg'

const Home = () => {
  const [category, setCategory] = useState('')

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
        <Link className="border-solid border-2 border-sky-500 rounded" to={`/${category}`}>
          Go
        </Link>
      </div>
    </div>
  )
}

// Home.propTypes = {}

export default Home
