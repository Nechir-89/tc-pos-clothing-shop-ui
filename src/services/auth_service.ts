const auth_url = `http://localhost:5002/auth`
// import { User } from '../types/user.types'

import axios from 'axios'

// type loginUser = Omit<User, {'user_id', 'role'}>
export const login = async (user_name: string, passcode: string) => {
  let response;
  try {
    response = await axios.post(`${auth_url}/login`, { user_name, passcode })
  } catch (err) {
    console.error(err)
  }
  return response;
}
