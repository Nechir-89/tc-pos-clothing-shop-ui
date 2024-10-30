import { Item } from "../types/Items.types";
import { Stock } from "../types/Stock.types";
const url = `http://localhost:5002/api/items`

export type NewItem = Item & Stock;

// import { User } from '../types/user.types'

import axios from 'axios'

// adding new item with stock data for first time
export const add_new_item = async (model: NewItem) => {
  let response;
  try {
    response = await axios.post(`${url}/new`, { ...model })
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const get_items = async () => {
  let response;
  try {
    response = await axios.get(`${url}`)
  } catch (error) {
    console.log(error)
  }

  return response;
}
