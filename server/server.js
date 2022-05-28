/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import shortid from 'shortid'
import { readdirSync } from 'fs'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

require('colors')

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const { readFile, writeFile } = require('fs').promises

const read = (category) =>
  readFile(`${__dirname}/tasks/${category}.json`, 'utf8').then((res) => JSON.parse(res))
const write = (category, data) =>
  writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(data), 'utf8')

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const tasks = await read(category)
    .then((result) => {
      return result.reduce((acc, task) => {
        if (!task._isDeleted) {
          return [
            ...acc,
            {
              taskId: task.taskId,
              title: task.title,
              status: task.status
            }
          ]
        }
        return acc
      }, [])
    })
    .catch(() => {
      console.log({ status: 'error', message: 'file not found' })
      return 'file not found'
    })
  res.json(tasks)
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const day = 1000 * 60 * 60 * 24
  const week = 7 * 1000 * 60 * 60 * 24
  const month = 30 * 1000 * 60 * 60 * 24

  const timespanCondition = (time, item) => {
    return +new Date() - time < item._createdAt
  }

  const period = await read(category).then((tasksList) => {
    let timespanPeriod = []
    for (let i = 0; i < tasksList.length; i += 1) {
      if (timespan === 'day') {
        if (timespanCondition(day, tasksList[i])) {
          timespanPeriod = [...timespanPeriod, tasksList[i]]
        }
      }
      if (timespan === 'week') {
        if (timespanCondition(week, tasksList[i]) && timespanCondition(day, tasksList[i])) {
          timespanPeriod = [...timespanPeriod, tasksList[i]]
        }
      }
      if (timespan === 'month') {
        if (timespanCondition(month, tasksList[i]) && timespanCondition(week, tasksList[i])) {
          timespanPeriod = [...timespanPeriod, tasksList[i]]
        }
      }
    }
    return timespanPeriod
  })
  const tasks = period.reduce((acc, task) => {
    if (!task._isDeleted) {
      return [
        ...acc,
        {
          taskId: task.taskId,
          title: task.title,
          status: task.status
        }
      ]
    }
    return acc
  }, [])
  res.json(tasks)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const { body } = req

  const newBody = [
    {
      taskId: shortid.generate(),
      title: body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _deletedAt: null
    }
  ]
  const tasks = await read(category)
    .then(async (result) => {
      const newTasksObj = [...result, ...newBody]
      await write(category, newTasksObj)
      return newTasksObj
    })
    .catch(async () => {
      await write(category, [])
      return []
    })
  res.json(tasks)
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const { status } = req.body

  const statuses = ['done', 'new', 'in progress', 'blocked']
  const condition = statuses.some((it) => it === status)

  const updatedTasks = await read(category)
    .then((result) => {
      if (condition) {
        const task = result.find((it) => it.taskId === id)
        const updatedTask = { ...task, status }
        const otherTasks = result.filter((it) => it.taskId !== id)
        const newTasks = [...otherTasks, updatedTask]
        write(category, newTasks)
        return newTasks
      }
      res.status(501)
      return { status: 'error', message: 'incorrect status' }
    })
    .catch((err) => {
      console.log(err)
      res.json({ status: 'error', message: 'file not found' })
    })
  res.json(updatedTasks)
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const tasks = await read(category)
    .then((result) => {
      const task = result.find((it) => it.taskId === id)
      const otherTasks = result.filter((it) => it.taskId !== id)
      const deletedTask = { ...task, _isDeleted: true }
      return [...otherTasks, deletedTask]
    })
    .catch((err) => {
      console.log(err)
      return []
    })
  write(category, tasks)
  res.json(tasks)
})

const dir = `${__dirname}/tasks/`

server.get('/api/v1/categories', (req, res) => {
  const list = readdirSync(dir).map((it) => it.replace(/\..+$/, ''))
  res.json(list)
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
