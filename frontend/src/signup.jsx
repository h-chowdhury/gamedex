import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export function SignUp () {

  return (
    <div>
      <div>
        <Link to={'/login'}>
          <button>Login</button>
        </Link>
      </div>
    </div>
  )

}