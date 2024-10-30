const url = `http://localhost:5002/api/non-scan`
import axios from 'axios'

export const get_all_categories_for_non_scaned_items = async () => {
  let response;
  try {
    response = await axios.get(`${url}/categories`)
  } catch (err) {
    console.error(err)
  }
  return response;
}

export const get_non_scan_items_from_category = async (cat_id: number) => {
  let response;
  try {
    response = await axios.post(`${url}/items_from_category`, { cat_id })
  } catch (err) {
    console.error(err)
  }
  return response;
}
