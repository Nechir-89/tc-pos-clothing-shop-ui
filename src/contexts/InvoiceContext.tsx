import React from "react"
import { get_last_stock_by_barcode } from "../services/general_queries_service"
import { InvoiceRequestBody } from "../types/InvoiceItem.types"
import { add_invoice_and_items, get_invoice_document_by_invoice_id, get_invoice_document_by_offset } from "../services/invoice_service"
import { InvoiceItemType } from "../types/InvoiceItem.types"
import { StockDocument } from "../types/Custom.types"

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
  switchItemType: (item: InvoiceItemType) => void,
  addNonScanInvoiceItem: (item: StockDocument, isUnit: boolean, quantity: number) => void
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
  switchItemType: (item: InvoiceItemType) => item,
  addNonScanInvoiceItem: (item: StockDocument, isUnit: boolean, quantity: number) => ({ item, isUnit, quantity })
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
        // console.log(res?.data)
        const duplicatePc = res?.data?.length > 0 &&
          invoiceItems.length > 0 &&
          res?.data[0]?.pc_barcode === barcode &&
          invoiceItems.find(invoiceItem =>
            invoiceItem.item_name === res?.data[0]?.item_name &&
            invoiceItem.unit === res?.data[0]?.pc_unit_name
          )

        const duplicateUnit = res?.data?.length > 0 &&
          invoiceItems.length > 0 &&
          res?.data[0]?.barcode === barcode &&
          invoiceItems.find(invoiceItem =>
            invoiceItem.item_name === res?.data[0]?.item_name &&
            invoiceItem.unit === res?.data[0]?.unit_name
          )

        const i = duplicatePc || duplicateUnit
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
                unit: res?.data[0]?.pc_unit_name,
                unit_name: res?.data[0]?.unit_name,
                pc_unit_name: res?.data[0]?.pc_unit_name,
                is_unit: false,
                price: res?.data[0]?.pc_price,
                pc_price: res?.data[0]?.pc_price,
                unit_price: res?.data[0]?.unit_price,
                cost: res?.data[0]?.pc_cost,
                unit_cost: res?.data[0]?.unit_cost,
                pc_cost: res?.data[0]?.pc_cost,
                subtotal: subTotal,
                pcs_per_unit: res?.data[0]?.pcs_per_unit,
                total_available_pcs: res?.data[0]?.total_available_pcs,
                total_available_units: res?.data[0]?.total_available_units
              }])

            setTotalPriceOfInvoice(prev => prev + subTotal)
            setInvoiceCost(prevState => prevState + res?.data[0]?.pc_cost)
          }

        } else if (res?.data?.length > 0 && res?.data[0]?.barcode === barcode) {

          if (res?.data[0]?.total_available_units >= 1) {
            const unitPrice = res?.data[0]?.unit_price || 0
            const subTotal = unitPrice % 250 === 0 ? unitPrice
              : unitPrice % 250 >= 125 ? unitPrice - (unitPrice % 250) + 250
                : unitPrice - (unitPrice % 250)

            setInvoiceItems([
              ...invoiceItems, {
                number: (invoiceItems[invoiceItems.length - 1]?.number + 1) || 1,
                item_name: res?.data[0]?.item_name,
                item_id: res?.data[0]?.item_id,
                amount: 1,
                unit: res?.data[0]?.unit_name,
                unit_name: res?.data[0]?.unit_name,
                pc_unit_name: res?.data[0]?.pc_unit_name,
                is_unit: true,
                price: res?.data[0]?.unit_price,
                pc_price: res?.data[0]?.pc_price,
                unit_price: res?.data[0]?.unit_price,
                cost: res?.data[0]?.unit_cost,
                unit_cost: res?.data[0]?.unit_cost,
                pc_cost: res?.data[0]?.pc_cost,
                subtotal: subTotal,
                pcs_per_unit: res?.data[0]?.pcs_per_unit,
                total_available_pcs: res?.data[0]?.total_available_pcs,
                total_available_units: res?.data[0]?.total_available_units
              }])

            setTotalPriceOfInvoice(prev => prev + subTotal)
            setInvoiceCost(prevState => prevState + res?.data[0]?.unit_cost)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const addNonScanInvoiceItem = async (item: StockDocument, isUnit: boolean, quantity: number) => {
    const duplicatePc = invoiceItems.find(invoiceItem =>
      invoiceItem.item_name === item.item_name
      && invoiceItem.unit === item.pc_unit_name
    )

    const duplicateUnit = invoiceItems.find(invoiceItem =>
      invoiceItem.item_name === item.item_name
      && invoiceItem.unit === item.unit_name
    )

    const i = duplicatePc || duplicateUnit
    if (i) {
      changeAmount(quantity, i.number)
    } else if (!isUnit) {

      if (item.total_available_pcs >= quantity) {
        const r = quantity * item.pc_price
        const subTotal = r % 250 === 0 ? r
          : r % 250 >= 125 ? r - (r % 250) + 250
            : r - (r % 250)

        setInvoiceItems([
          ...invoiceItems, {
            number: (invoiceItems[invoiceItems.length - 1]?.number + 1) || 1,
            item_name: item.item_name,
            item_id: item.item_id,
            amount: quantity,
            unit: item.pc_unit_name,
            unit_name: item.unit_name,
            pc_unit_name: item.pc_unit_name,
            is_unit: false,
            price: item.pc_price,
            pc_price: item.pc_price,
            unit_price: item.unit_price,
            cost: item.pc_cost * quantity,
            unit_cost: item.unit_cost,
            pc_cost: item.pc_cost,
            subtotal: subTotal,
            pcs_per_unit: item.pcs_per_unit,
            total_available_pcs: item.total_available_pcs,
            total_available_units: item.total_available_units
          }])

        setTotalPriceOfInvoice(prev => prev + subTotal)
        setInvoiceCost(prevState => prevState + (item.pc_cost * quantity))
      }
    } else {
      if (item.total_available_units >= quantity) {
        const r = quantity * item.unit_price
        const subTotal = r % 250 === 0 ? r
          : r % 250 >= 125 ? r - (r % 250) + 250
            : r - (r % 250)

        setInvoiceItems([
          ...invoiceItems, {
            number: (invoiceItems[invoiceItems.length - 1]?.number + 1) || 1,
            item_name: item.item_name,
            item_id: item.item_id,
            amount: quantity,
            unit: item.unit_name,
            unit_name: item.unit_name,
            pc_unit_name: item.pc_unit_name,
            is_unit: true,
            price: item.unit_price,
            pc_price: item.pc_price,
            unit_price: item.unit_price,
            cost: item.unit_cost * quantity,
            unit_cost: item.unit_cost,
            pc_cost: item.pc_cost,
            subtotal: subTotal,
            pcs_per_unit: item.pcs_per_unit,
            total_available_pcs: item.total_available_pcs,
            total_available_units: item.total_available_units
          }])

        setTotalPriceOfInvoice(prev => prev + subTotal)
        setInvoiceCost(prevState => prevState + (item.unit_cost * quantity))
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

        if (i.is_unit && amount <= i.total_available_units) {
          const newTotalCost = i.unit_cost * amount

          setInvoiceCost(prevState => (prevState - i.cost) + newTotalCost)

          let newSubtotal = i.unit_price * amount
          newSubtotal = newSubtotal % 250 === 0 ? newSubtotal
            : newSubtotal % 250 >= 125 ? (newSubtotal - (newSubtotal % 250) + 250)
              : (newSubtotal - (newSubtotal % 250))

          setTotalPriceOfInvoice(prev => (prev - i.subtotal) + newSubtotal)

          return ({
            ...i,
            amount: amount,
            cost: newTotalCost,
            subtotal: newSubtotal
          })

        } else if (!i.is_unit && amount <= i.total_available_pcs) {

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
            is_unit: i.is_unit,
            quantity: i.amount,
            price: i.price,
            cost: i.cost / i.amount,
            total_price: i.subtotal,
            total_cost: i.cost,
            pcs_per_unit: i.pcs_per_unit
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
        unit: invoiceItme.is_unit ? invoiceItme.unit_name : invoiceItme.pc_unit_name,
        unit_name: invoiceItme.unit_name,
        pc_unit_name: invoiceItme.pc_unit_name,
        pc_price: invoiceItme.pc_price,
        unit_price: invoiceItme.unit_price,
        is_unit: invoiceItme.is_unit,
        price: invoiceItme.price,
        cost: invoiceItme.total_cost,
        unit_cost: invoiceItme.unit_cost,
        pc_cost: invoiceItme.pc_cost,
        subtotal: invoiceItme.total_price,
        pcs_per_unit: 0, // We don't store pcs per unit
        total_available_pcs: 0, // We dont store total available pcs and units
        total_available_units: 0 // We dont store total available pcs and units
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
          unit: invoiceItme.is_unit ? invoiceItme.unit_name : invoiceItme.pc_unit_name,
          unit_name: invoiceItme.unit_name,
          pc_unit_name: invoiceItme.pc_unit_name,
          pc_price: invoiceItme.pc_price,
          unit_price: invoiceItme.unit_price,
          is_unit: invoiceItme.is_unit,
          price: invoiceItme.price,
          cost: invoiceItme.total_cost,
          unit_cost: invoiceItme.unit_cost,
          pc_cost: invoiceItme.pc_cost,
          subtotal: invoiceItme.total_price,
          pcs_per_unit: 0, // We don't store pcs per unit
          total_available_pcs: 0, // We dont store total available pcs and units
          total_available_units: 0 // We dont store total available pcs and units
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
        unit: invoiceItme.is_unit ? invoiceItme.unit_name : invoiceItme.pc_unit_name,
        unit_name: invoiceItme.unit_name,
        pc_unit_name: invoiceItme.pc_unit_name,
        pc_price: invoiceItme.pc_price,
        unit_price: invoiceItme.unit_price,
        is_unit: invoiceItme.is_unit,
        price: invoiceItme.price,
        cost: invoiceItme.total_cost,
        unit_cost: invoiceItme.unit_cost,
        pc_cost: invoiceItme.pc_cost,
        subtotal: invoiceItme.total_price,
        pcs_per_unit: 0, // We don't store pcs per unit
        total_available_pcs: 0, // We dont store total available pcs and units
        total_available_units: 0 // We dont store total available pcs and units
      }))
      setInvoiceItems(items)
    }
  }

  const switchItemType = (item: InvoiceItemType) => {

    if (invoiceId === 0) {
      if (!item.is_unit) {
        if (item.amount <= item.total_available_units) {
          const unit = item.unit_name
          const price = item.unit_price

          let newSubtotal = price * item.amount
          newSubtotal = newSubtotal % 250 === 0 ? newSubtotal
            : newSubtotal % 250 >= 125 ? (newSubtotal - (newSubtotal % 250) + 250)
              : (newSubtotal - (newSubtotal % 250))

          setTotalPriceOfInvoice(prev => (prev - item.subtotal) + newSubtotal)

          setInvoiceItems(prev => prev.map((i) => i.number === item.number ?
            {
              ...i, unit, price, subtotal: newSubtotal, cost: i.cost - (i.pc_cost * i.amount) + (i.unit_cost * i.amount),
              is_unit: true
            } : i))

          setInvoiceCost(prev => prev - (item.pc_cost * item.amount) + (item.unit_cost * item.amount))
        }
      } else {
        const unit = item.pc_unit_name
        const price = item.pc_price

        let newSubtotal = price * item.amount
        newSubtotal = newSubtotal % 250 === 0 ? newSubtotal
          : newSubtotal % 250 >= 125 ? (newSubtotal - (newSubtotal % 250) + 250)
            : (newSubtotal - (newSubtotal % 250))

        setTotalPriceOfInvoice(prev => (prev - item.subtotal) + newSubtotal)

        setInvoiceItems(prev => prev.map((i) => i.number === item.number ?
          {
            ...i, unit, price, subtotal: newSubtotal, cost: i.cost - (i.unit_cost * i.amount) + (i.pc_cost * i.amount),
            is_unit: false
          } : i))

        setInvoiceCost(prev => prev - (item.unit_cost * item.amount) + (item.pc_cost * item.amount))
      }
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
      switchItemType,
      addNonScanInvoiceItem
    }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export default InvoiceProvider
