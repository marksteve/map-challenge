import React from 'react'
import { Router, Link } from '@reach/router'

import './App.css'

import Lines from './Lines'

function Intro () {
  return (
    <div className='intro'>
      <h1>#30DayMapChallenge</h1>
      <p>&larr; Choose a day from the sidebar</p>
    </div>
  )
}

function App () {
  return (
    <main>
      <Router>
        <Intro path='/' />
        <Lines path='/lines' />
      </Router>
      <nav>
        <Link to='/'>
          <strong>#30DayMapChallenge</strong>
        </Link>
        <Link to='/points'>1. Points</Link>
        <Link to='/lines'>2. Lines</Link>
      </nav>
    </main>
  )
}

export default App
