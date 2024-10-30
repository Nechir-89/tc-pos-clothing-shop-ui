const url = `http://localhost:5002/api/payment_methods`

import axios from 'axios'

export const get_payment_methods = async () => {
  let response;
  try {
    response = await axios.get(`${url}`)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const get_active_payment_methods = async () => {
  let response;
  try {
    response = await axios.get(`${url}/active`)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const add_payment_method = async (
  name: string,
  def: boolean,
  active: boolean) => {
  let response;
  try {
    response = await axios.post(`${url}/add`,
      { name, def, active })
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const toggle_payment_method = async (
  id: number,
  active: boolean) => {
  let response;
  try {
    response = await axios.put(`${url}/toggle`,
      { id, active })
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const default_payment_method = async (
  id: number) => {
  let response;
  try {
    response = await axios.put(`${url}/default`,
      { id })
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const change_payment_method_name = async (
  id: number,
  name: string) => {
  let response;
  try {
    response = await axios.put(`${url}/change_name`,
      { id, name })
  } catch (err) {
    console.error(err)
  }
  return response;
}
