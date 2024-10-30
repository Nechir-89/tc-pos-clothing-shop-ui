
export type Invoice = {
  invoice_id?: number,
  invoice_date: Date,
  payment_method_id?: number,
  user_id: number,
  gifted_amount?: number,
  paid_price: number,
  invoice_price: number,
  invoice_cost: number 
}

export type InvoiceItem = {
  invoice_item_id?: number,
  invoice_id?: number,
  item_id: number,
  is_unit: Boolean,
  quantity: number,
  total_price: number,
  total_cost: number,
  cost: number,
  price: number,
  pcs_per_unit: number
}

export type InvoiceRequestBody = {
  invoice_date: Date,
  invoice_price: number,
  gifted_amount: number,
  paid_price: number,
  invoice_cost: number,
  payment_method_id: number,
  user_id: number,
  items: InvoiceItem[],
}

// use this type to inddicate row in invoice table
export type InvoiceItemType = {
  number: number,
  item_name: string,
  item_id: number,
  amount: number,
  unit: string,
  unit_name: string,
  pc_unit_name: string,
  is_unit: Boolean,
  price: number,
  pc_price: number,
  unit_price: number,
  cost: number,  // cost is the subtotal cost
  unit_cost: number,
  pc_cost: number,
  subtotal: number,
  pcs_per_unit: number,
  total_available_pcs: number,
  total_available_units: number,
}
