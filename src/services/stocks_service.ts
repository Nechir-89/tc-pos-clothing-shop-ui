import { Stock } from "../types/Stock.types";
const stockUri = `http://localhost:5002/api/stocks`
const stockStateUri = `http://localhost:5002/api/states/stocks/`
const updateStockExpireDateUri = `http://localhost:5002/api/stocks/update/expire_date`

export type NewStock = Stock & { pcs_per_unit: number };

import axios from 'axios'

export const add_new_stock = async (model: NewStock) => {
  let response;
  try {
    response = await axios.post(`${stockUri}/new`, model)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const get_stocks_states_docs = async () => {
  let response;
  try {
    response = await axios.get(`${stockStateUri}/docs`)
  } catch (error) {
    console.error(error)
  }
  return response
}

export const get_stocks_states_docs_by_barcode = async (barcode: string) => {
  let response;
  try {
    response = await axios.post(`${stockStateUri}/docsbybarcode`, { barcode })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const get_stocks_states_docs_by_item_name = async (item_name: string) => {
  let response;
  try {
    response = await axios.post(`${stockStateUri}/docsbyitemname`, { item_name })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const update_stocks_expire_date = async (stocking_id: number, expire_date: Date | null) => {
  let response;
  try {
    response = await axios.put(`${updateStockExpireDateUri}`, { stocking_id, expire_date })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const update_stocks_state_expire = async (
  item_id: number,
  state_id: number,
  current_units: number,
  current_pcs: number) => {
  let response;
  try {
    response = await axios.put(`${stockStateUri}/update/expire_stock`, {
      item_id, state_id,
      current_units, current_pcs
    })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const update_stock_barcodes = async (
  stocking_id: number,
  barcode: string | null,
  pc_barcode: string | null) => {
  let response;
  try {
    response = await axios.put(`${stockUri}/update/barcodes`, {
      stocking_id,
      barcode,
      pc_barcode
    })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const update_stock_state_damaged_items = async (
  state_id: number,
  item_id: number,
  damaged_units: number,
  damaged_pcs: number) => {
  let response;
  try {
    response = await axios.put(`${stockStateUri}/update/damaged_items`, {
      state_id,
      item_id,
      damaged_units,
      damaged_pcs
    })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const set_stock_state_returned_items_to_supplier = async (
  state_id: number,
  item_id: number,
  returned_units_to_supplier: number,
  returned_pcs_to_supplier: number) => {
  let response;
  try {
    response = await axios.put(`${stockStateUri}/update/returned_to_wholesaler`, {
      state_id,
      item_id,
      returned_units_to_supplier,
      returned_pcs_to_supplier
    })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const delete_stock = async (
  item_id: number,
  stocking_id: number,
  state_id: number) => {
  let response;
  try {
    response = await axios.post(`${stockUri}/delete`, {
      item_id,
      stocking_id,
      state_id
    })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const update_stock_amount_in_units = async (
  item_id: number,
  stocking_id: number,
  state_id: number,
  newtotalQuantityInUnits: number,
  old_quantity_in_units: number,
  newCurrentUnits: number,
  newCurrentPcs: number) => {
  let response;
  try {
    response = await axios.put(`${stockUri}/update/amount_in_units`, {
      item_id,
      stocking_id,
      state_id,
      newtotalQuantityInUnits,
      old_quantity_in_units,
      newCurrentUnits,
      newCurrentPcs
    })
  } catch (error) {
    console.error(error)
  }
  return response
}

export const update_stock_cost_and_price = async (
  stocking_id: number,
  unit_cost: number,
  unit_price: number,
  pc_cost: number,
  pc_price: number) => {
  let response;
  try {
    response = await axios.put(`${stockUri}/update/cost_and_price`, {
      stocking_id,
      unit_cost,
      unit_price,
      pc_cost,
      pc_price
    })
  } catch (error) {
    console.error(error)
  }
  return response
}

