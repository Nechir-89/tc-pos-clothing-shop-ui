const url = `http://localhost:5002/api/units`
// import { User } from '../types/user.types'

import axios from 'axios'

export const get_units = async () => {
  let response;
  try {
    response = await axios.get(`${url}`)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const add_unit = async (name: string) => {
  let response;
  try {
    response = await axios.post(`${url}`, { name: name })
  } catch (err) {
    console.error(err)
  }
  return response;
}
