import React from "react"
import { get_last_stock_by_barcode } from "../services/general_queries_service"
import { InvoiceRequestBody } from "../types/InvoiceItem.types"
import { add_invoice_and_items, get_invoice_document_by_invoice_id, get_invoice_document_by_offset } from "../services/invoice_service"
import { InvoiceItemType } from "../types/InvoiceItem.types"
// import { StockDocument } from "../types/Custom.types"

export type InvoiceContextType = {
  invoiceItems: InvoiceItemType[] | [],
  totalPriceOfInvoice: number,
  invoiceCost: number,
  gifft: number,
  addInvoiceItem: (barcode: string) => void,
  deleteInvoiceItem: (itemNumber: number) => void,
  changeAmount: (amount: number, itemNumber: number) => void,
  clearInvoice: () => void,
  setGifft: (amount: number) => void,
  submitInvoice: ({ userId, paymentMethodId }:
    { userId: number, paymentMethodId: number }) => void,
  prevInvoice: () => void,
  invoiceId: number,
  nextInvoice: () => void,
  searchInvoice: (inputedInvoiceId: number) => void,
  // switchItemType: (item: InvoiceItemType) => void,
  // addNonScanInvoiceItem: (item: StockDocument, isUnit: boolean, quantity: number) => void
}

export const InvoiceContext = React.createContext<InvoiceContextType>({
  invoiceItems: [],
  totalPriceOfInvoice: 0,
  invoiceCost: 0,
  gifft: 0,
  addInvoiceItem: (barcode: string) => barcode,
  deleteInvoiceItem: (itemNumber: number) => itemNumber,
  changeAmount: (amount: number, itemNumber: number) => ({ amount, itemNumber }),
  clearInvoice: () => { },
  setGifft: (amount: number) => amount,
  submitInvoice: ({ userId, paymentMethodId }:
    { userId: number, paymentMethodId: number }) => ({ userId, paymentMethodId }),
  prevInvoice: () => { },
  invoiceId: 0,
  nextInvoice: () => { },
  searchInvoice: (inputedInvoiceId: number) => inputedInvoiceId,
  // switchItemType: (item: InvoiceItemType) => item,
  // addNonScanInvoiceItem: (item: StockDocument, isUnit: boolean, quantity: number) => ({ item, isUnit, quantity })
})

const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [invoiceItems, setInvoiceItems] = React.useState<InvoiceItemType[] | []>([])
  const [totalPriceOfInvoice, setTotalPriceOfInvoice] = React.useState<number>(0)
  const [gifft, setGifft] = React.useState<number>(0)
  const [invoiceCost, setInvoiceCost] = React.useState<number>(0)
  const [offset, setOffset] = React.useState<number>(-1)
  const [invoiceId, setInvoiceId] = React.useState<number>(0)

  const addInvoiceItem = async (barcode: string) => {
    if (barcode) {
      try {
        const res = await get_last_stock_by_barcode(barcode)
        console.log(res?.data)
        const duplicatePc = res?.data?.length > 0 &&
          invoiceItems.length > 0 &&
          res?.data[0]?.pc_barcode === barcode &&
          invoiceItems.find(invoiceItem =>
            invoiceItem.item_name === res?.data[0]?.item_name 
          )
        const i = duplicatePc
        // if it is duplicate pc
        if (i) {
          changeAmount(i.amount + 1, i.number)
        } else if (res?.data?.length > 0 && res?.data[0]?.pc_barcode === barcode) {

          if (res?.data[0]?.total_available_pcs >= 1) {
            const subTotal = res?.data[0]?.pc_price % 250 === 0 ? res?.data[0]?.pc_price
              : res?.data[0]?.pc_price % 250 >= 125 ?
                res?.data[0]?.pc_price - (res?.data[0]?.pc_price % 250) + 250
                : res?.data[0]?.pc_price - (res?.data[0]?.pc_price % 250)

            setInvoiceItems([
              ...invoiceItems, {
                number: (invoiceItems[invoiceItems.length - 1]?.number + 1) || 1,
                item_name: res?.data[0]?.item_name,
                item_id: res?.data[0]?.item_id,
                amount: 1,
                // unit: res?.data[0]?.pc_unit_name,
                // unit_name: res?.data[0]?.unit_name,
                // pc_unit_name: res?.data[0]?.pc_unit_name,
                // is_unit: false,
                price: res?.data[0]?.pc_price,
                pc_price: res?.data[0]?.pc_price,
                // unit_price: res?.data[0]?.unit_price,
                cost: res?.data[0]?.pc_cost, // subtotoal cost for item
                // unit_cost: res?.data[0]?.unit_cost,
                pc_cost: res?.data[0]?.pc_cost,
                subtotal: subTotal, //subtotal price for item
                // pcs_per_unit: res?.data[0]?.pcs_per_unit,
                total_available_pcs: res?.data[0]?.total_available_pcs,
                // total_available_units: res?.data[0]?.total_available_units
              }])

            setTotalPriceOfInvoice(prev => prev + subTotal)
            setInvoiceCost(prevState => prevState + res?.data[0]?.pc_cost)
          }

        } 
      } catch (err) {
        console.log(err)
      }
    }
  }

  const deleteInvoiceItem = (itemNumber: number) => {
    const item = invoiceItems.find(item => item.number === itemNumber)
    // setTotalPriceOfInvoice(prevState => prevState - (item?.subtotal || 0))

    setInvoiceItems(invoiceItems.filter(item => item.number !== itemNumber))
    setTotalPriceOfInvoice(prev => {
      const totalPrice = prev - (item?.subtotal || 0)
      if (totalPrice % 250 === 0) {
        return totalPrice
      } else if (totalPrice % 250 >= 125) {
        return totalPrice - (totalPrice % 250) + 250
      } else {
        return totalPrice - (totalPrice % 250)
      }
    })
    setInvoiceCost(prevState => prevState - (item?.cost || 0))
  }

  const changeAmount = (amount: number, itemNumber: number) => {

    const updatedListOfInvoiceItems = invoiceItems?.map(i => {

      if (i.number === itemNumber) {

        // if (i.is_unit && amount <= i.total_available_units) {
        //   const newTotalCost = i.unit_cost * amount

        //   setInvoiceCost(prevState => (prevState - i.cost) + newTotalCost)

        //   let newSubtotal = i.unit_price * amount
        //   newSubtotal = newSubtotal % 250 === 0 ? newSubtotal
        //     : newSubtotal % 250 >= 125 ? (newSubtotal - (newSubtotal % 250) + 250)
        //       : (newSubtotal - (newSubtotal % 250))

        //   setTotalPriceOfInvoice(prev => (prev - i.subtotal) + newSubtotal)

        //   return ({
        //     ...i,
        //     amount: amount,
        //     cost: newTotalCost,
        //     subtotal: newSubtotal
        //   })

        // } else 
        // if (!i.is_unit && amount <= i.total_available_pcs) {
        if (amount <= i.total_available_pcs) {

          let newSubtotal = i.pc_price * amount
          newSubtotal = newSubtotal % 250 === 0 ? newSubtotal
            : newSubtotal % 250 >= 125 ? (newSubtotal - (newSubtotal % 250) + 250)
              : (newSubtotal - (newSubtotal % 250))

          setTotalPriceOfInvoice(prev => (prev - i.subtotal) + newSubtotal)

          const newTotalCost = i.pc_cost * amount
          setInvoiceCost(prevState => (prevState - i.cost) + newTotalCost)

          return ({
            ...i,
            amount: amount,
            cost: newTotalCost,
            subtotal: newSubtotal
          })
        }
      }
      return i
    })

    setInvoiceItems(updatedListOfInvoiceItems)
  }

  const clearInvoice = () => {
    setInvoiceItems([])
    setTotalPriceOfInvoice(0)
    setGifft(0)
    setInvoiceCost(0)
    setInvoiceId(0)
    setOffset(-1)
  }

  const submitInvoice = async ({ userId, paymentMethodId }: { userId: number, paymentMethodId: number }) => {

    if (invoiceItems.length > 0 && offset === -1) {
      const data: InvoiceRequestBody = {
        invoice_date: new Date(),
        invoice_price: totalPriceOfInvoice,
        gifted_amount: gifft,
        paid_price: totalPriceOfInvoice - gifft,
        invoice_cost: invoiceCost,
        payment_method_id: paymentMethodId,
        user_id: userId,
        items: invoiceItems.map(i => {
          return {
            item_id: i.item_id,
            // is_unit: i.is_unit,
            quantity: i.amount,
            price: i.price,
            cost: i.cost / i.amount,
            total_price: i.subtotal,
            total_cost: i.cost,
            // pcs_per_unit: i.pcs_per_unit
          }
        })
      }
      const response = await add_invoice_and_items(data)
      if (response?.data?.invoice_id) {
        clearInvoice()
      }
    }
  }

  const prevInvoice = async () => {
    const resp = await get_invoice_document_by_offset(offset + 1)
    // console.log(resp)
    if (Array.isArray(resp?.data)) {
      setTotalPriceOfInvoice(resp?.data[0]?.invoice_price)
      setGifft(resp?.data[0]?.gifted_amount)
      setInvoiceCost(resp?.data[0]?.invoice_cost)
      setOffset(prevValue => prevValue + 1)
      setInvoiceId(resp?.data[0]?.invoice_id)

      const prevInvoiceItems = resp?.data?.map((invoiceItme, index): InvoiceItemType => ({
        number: index + 1,
        item_name: invoiceItme.item_name,
        item_id: invoiceItme.item_id,
        amount: invoiceItme.quantity,
        // unit: invoiceItme.is_unit ? invoiceItme.unit_name : invoiceItme.pc_unit_name,
        // unit_name: invoiceItme.unit_name,
        // pc_unit_name: invoiceItme.pc_unit_name,
        pc_price: invoiceItme.pc_price,
        // unit_price: invoiceItme.unit_price,
        // is_unit: invoiceItme.is_unit,
        price: invoiceItme.price,
        cost: invoiceItme.total_cost,
        // unit_cost: invoiceItme.unit_cost,
        pc_cost: invoiceItme.pc_cost,
        subtotal: invoiceItme.total_price,
        // pcs_per_unit: 0, // We don't store pcs per unit
        total_available_pcs: 0, // We dont store total available pcs and units
        // total_available_units: 0 // We dont store total available pcs and units
      }))
      setInvoiceItems(prevInvoiceItems)
    }
  }

  const nextInvoice = async () => {
    if (offset !== -1) {

      const resp = (offset - 1 > -1) && await get_invoice_document_by_offset(offset - 1)
      // console.log(resp)
      if (resp && Array.isArray(resp?.data)) {
        setTotalPriceOfInvoice(resp?.data[0]?.invoice_price)
        setGifft(resp?.data[0]?.gifted_amount)
        setInvoiceCost(resp?.data[0]?.invoice_cost)
        setOffset(prevValue => prevValue - 1)
        setInvoiceId(resp?.data[0]?.invoice_id)

        const prevInvoiceItems = resp?.data?.map((invoiceItme, index): InvoiceItemType => ({
          number: index + 1,
          item_name: invoiceItme.item_name,
          item_id: invoiceItme.item_id,
          amount: invoiceItme.quantity,
          // unit: invoiceItme.is_unit ? invoiceItme.unit_name : invoiceItme.pc_unit_name,
          // unit_name: invoiceItme.unit_name,
          // pc_unit_name: invoiceItme.pc_unit_name,
          pc_price: invoiceItme.pc_price,
          // unit_price: invoiceItme.unit_price,
          // is_unit: invoiceItme.is_unit,
          price: invoiceItme.price,
          cost: invoiceItme.total_cost,
          // unit_cost: invoiceItme.unit_cost,
          pc_cost: invoiceItme.pc_cost,
          subtotal: invoiceItme.total_price,
          // pcs_per_unit: 0, // We don't store pcs per unit
          total_available_pcs: 0, // We dont store total available pcs and units
          // total_available_units: 0 // We dont store total available pcs and units
        }))
        setInvoiceItems(prevInvoiceItems)
      }
    }
  }

  const searchInvoice = async (inputedInvoiceId: number) => {
    const resp = await get_invoice_document_by_invoice_id(inputedInvoiceId)

    if (Array.isArray(resp?.data) && resp?.data?.length > 0) {
      setTotalPriceOfInvoice(resp?.data[0]?.invoice_price)
      setGifft(resp?.data[0]?.gifted_amount)
      setInvoiceCost(resp?.data[0]?.invoice_cost)
      // setOffset(prevValue => prevValue + 1)
      setInvoiceId(resp?.data[0]?.invoice_id)

      const items = resp?.data?.map((invoiceItme, index): InvoiceItemType => ({
        number: index + 1,
        item_name: invoiceItme.item_name,
        item_id: invoiceItme.item_id,
        amount: invoiceItme.quantity,
        // unit: invoiceItme.is_unit ? invoiceItme.unit_name : invoiceItme.pc_unit_name,
        // unit_name: invoiceItme.unit_name,
        // pc_unit_name: invoiceItme.pc_unit_name,
        pc_price: invoiceItme.pc_price,
        // unit_price: invoiceItme.unit_price,
        // is_unit: invoiceItme.is_unit,
        price: invoiceItme.price,
        cost: invoiceItme.total_cost,
        // unit_cost: invoiceItme.unit_cost,
        pc_cost: invoiceItme.pc_cost,
        subtotal: invoiceItme.total_price,
        // pcs_per_unit: 0, // We don't store pcs per unit
        total_available_pcs: 0, // We dont store total available pcs and units
        // total_available_units: 0 // We dont store total available pcs and units
      }))
      setInvoiceItems(items)
    }
  }

  return (
    <InvoiceContext.Provider value={{
      invoiceItems,
      addInvoiceItem,
      deleteInvoiceItem,
      changeAmount,
      totalPriceOfInvoice,
      invoiceCost,
      clearInvoice,
      gifft,
      setGifft,
      submitInvoice,
      prevInvoice,
      invoiceId,
      nextInvoice,
      searchInvoice,
      // switchItemType,
      // addNonScanInvoiceItem
    }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export default InvoiceProvider
