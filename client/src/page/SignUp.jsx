import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, TextInput, Label, Spinner, Alert } from 'flowbite-react'
import Oauth from '../component/Oauth'

export default function SignUp() {
  const [ formData, setFormData ] = useState({})
  const [ error, setError ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      return setError('Please fill in all fields')
    }

    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
  
      const data = await res.json()

//       The reason for using both JSON.stringify(formData) and res.json() in the handleSubmit function is that they serve different purposes and operate at different stages of the request-response cycle.

// 1. JSON.stringify(formData)
// Purpose: This function is used when sending data from the client (your React application) to the server.
// What it does: It converts a JavaScript object (in this case, formData) into a JSON string format. The server expects the data in a specific format, typically JSON, when it receives a request.
// When it's used: You use JSON.stringify(formData) in the body of the fetch call to send the user input (username, email, password) to the server endpoint (/api/auth/signup).
// Example:
// javascript
// Insert Code
// Edit
// Copy code
// body: JSON.stringify(formData)
// This prepares the data to be sent to the server as a JSON string.

// 2. res.json()
// Purpose: This function is used when receiving data from the server back to the client.
// What it does: It parses the response body from the server, which is typically in JSON format, and converts it back into a JavaScript object that can be easily manipulated in your application.
// When it's used: You use res.json() after the fetch call to read the response from the server, allowing you to access the data returned by the server in a structured format.
// Example:
// javascript
// Insert Code
// Edit
// Copy code
// const data = await res.json()
// This reads the JSON response from the server and converts it into a JavaScript object (data), which you can then check for success or failure.

// Summary
// In summary:

// JSON.stringify(formData) is necessary to convert your JavaScript object into a JSON string so that it can be sent in the body of the HTTP request to the server.
// res.json() is necessary to convert the JSON string response from the server back into a JavaScript object so that you can work with the response data in your application.
// They are both essential for handling data between the client and server, but they are used at different points in the process.
  
      if (data.success === false) {
        return setError(data.message)
      }
  
      setLoading(false)
      if (res.ok) {
        navigate('/sign-in')
      }
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className="left flex-1">
          <Link to='/' className='font-bold text-4xl dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Prince
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            You can sign up with email and password or with Google
          </p>
        </div>
        <div className="right flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput 
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput 
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput 
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
            >
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span>Loading...</span>
                  </>
                ) : 'SignUp'
              }
            </Button>
            <Oauth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {
            error && (
              <Alert className='mt-5' color='failure'>
                {error}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
