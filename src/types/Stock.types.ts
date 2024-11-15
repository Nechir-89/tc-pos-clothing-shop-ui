export type Stock = {
  stocking_id?: number,
  date?: Date,
  unit_cost?: number,
  unit_price?: number,
  pc_cost: number,
  pc_price: number,
  amount_in_units?: number,
  amount_in_pcs: number,
  expire_date?: Date | null,
  user_id: number,
  item_id?: number,
  stocking_note?: string,
  production_date?: Date,
  barcode?: string,
  pc_barcode: string
}

export type StockState = {
  amount_in_units?: number,
  amount_in_pcs?: number,
  approx_profit?: number,
  barcode?: string,
  category_name?: string,
  current_pcs?: number,
  current_units?: number, 
  damaged_pcs?: number,
  damaged_units?: number,
  date?: Date,
  expire_date?: Date,
  expired_pcs?: number,
  expired_units?: number,
  gifted_pcs?: number,
  gifted_units?: number,
  item_id?: number,
  item_name?: string,
  pc_barcode?: string,
  pc_cost?: number,
  pc_price?: number,
  pc_unit_name?: string,
  pcs_per_unit?: number,
  production_date?: Date,
  returned_pcs_to_supplier?: number,
  returned_units_to_supplier?: number,
  solid_pcs?: number,
  solid_units?: number,
  state_id?: number,
  stocking_id?: number,
  stocking_note?: string,
  total_cost?: number,
  total_price?: number,
  unit_cost?: number,
  unit_name?: string,
  unit_price?: number,
  user_name?: string,
}
