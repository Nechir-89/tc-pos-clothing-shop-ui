
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
  is_unit?: Boolean,
  quantity: number,
  total_price: number,
  total_cost: number,
  cost: number,
  price: number,
  pcs_per_unit?: number
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
  invoice_type: "sale" | "return"
}

// use this type to inddicate row in invoice table
export type InvoiceItemType = {
  number: number,
  item_name: string,
  item_id: number,
  amount: number,
  price: number,
  pc_price: number,
  cost: number,  // cost is the subtotal cost
  pc_cost: number,
  subtotal: number,
  total_available_pcs: number,
  valid_quantity_to_return: number
}
