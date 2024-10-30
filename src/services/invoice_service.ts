// import { Item } from "../types/Items.types";
// import { Stock } from "../types/Stock.types";
const url = `http://localhost:5002/api/invoices`

// export type NewItem = Item & Stock;

import axios from 'axios'
import { InvoiceRequestBody } from '../types/InvoiceItem.types';

export const add_invoice_and_items = async (model: InvoiceRequestBody) => {
  let response;
  try {
    response = await axios.post(`${url}`, model)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const get_invoice_document_by_offset = async (offset: number) => {
  let response;
  try {
    response = await axios.post(`${url}/invoice_document_by_offset`, { offset })
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const get_invoice_document_by_invoice_id = async (invoice_id: number) => {
  let response;
  try {
    response = await axios.post(`${url}/invoice_document_by_invoice_id`, { invoice_id })
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const total_profit = async () => {
  let response;
  try {
    response = await axios.get(`${url}/total_profit`)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const total_profit_of_day = async () => {
  let response;
  try {
    response = await axios.get(`${url}/total_profit_of_day`)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const total_profit_of_last_week = async () => {
  let response;
  try {
    response = await axios.get(`${url}/total_profit_of_last_week`)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const total_profit_of_last_month = async () => {
  let response;
  try {
    response = await axios.get(`${url}/total_profit_of_last_month`)
  } catch (err) {
    console.error(err)
  }
  return response;
}

// export const get_items = async () => {
//   let response;
//   try {
//     response = await axios.get(`${url}`)
//   } catch (error) {
//     console.log(error)
//   }

//   return response;
// }
