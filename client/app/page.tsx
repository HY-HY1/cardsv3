"use client"
import React from 'react'
import axios from 'axios'



const page = () => {
  const getServerSideProps = async () => {
  const response = await axios.post(
    "http://localhost:3000/api/auth/login",
    { email: "Harvey@gmail.com", password: "Harvey123"}
  )
}
  return (
    <div>
      <button onClick={() => getServerSideProps()}>click</button>
    </div>
  )
}

export default page