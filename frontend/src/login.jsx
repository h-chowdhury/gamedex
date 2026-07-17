import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export function Login () {

  return (
    <div>
      <div>
        <Link to={'/signup'}>
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  )

}