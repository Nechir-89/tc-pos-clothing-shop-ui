const url = `http://localhost:5002/api/general/stocks`
// import { User } from '../types/user.types'

import axios from 'axios'

export const get_last_stock_by_barcode = async (barcode: string) => {
  let response;
  try {
    response = await axios.post(`${url}/laststockbybarcode`, { barcode: barcode })
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const get_last_stock_by_item_name = async (item_name: string) => {
  let response;
  try {
    response = await axios.post(`${url}/laststockbyitemname`, { item_name })
  } catch (err) {
    console.error(err)
  }
  return response;
}
