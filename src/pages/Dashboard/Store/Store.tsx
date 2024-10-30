import { Autocomplete, AutocompleteItem, Button, getKeyValue, Input, Pagination, Selection } from "@nextui-org/react"
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@nextui-org/react"
import { useEffect, useMemo, useRef, useState } from "react";
import { get_stocks_states_docs, get_stocks_states_docs_by_barcode, get_stocks_states_docs_by_item_name } from "../../../services/stocks_service";
import { StockState } from "../../../types/Stock.types";
import { get_items } from "../../../services/items_service";
import { Item } from "../../../types/Items.types";
import formatNumberWithComma from "../../../helpers/formatNumberWithComma";
import { FaCartPlus } from "react-icons/fa6";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdOutlinePriceCheck } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaEdit, FaPlus } from "react-icons/fa";
import { CgExport } from "react-icons/cg";
import toast, { Toaster } from 'react-hot-toast';
import { MdArrowBack } from "react-icons/md";

type Props = {}

const columns = [
  {
    key: "item_name",
    label: "ناڤ",
  },
  {
    key: "expire_date",
    label: "مێژوا سەرڤەچونێ",
  },
  {
    key: "amount_in_units",
    label: "داخل کرن",
  },
  // {
  //   key: "barcode",
  //   label: "بارکود",
  // },
  // {
  //   key: "pc_barcode",
  //   label: "بارکودێ پارچەی",
  // },
  {
    key: "current_units",
    label: "وحدێن ماین",
  },
  // {
  //   key: "unit_name",
  //   label: "یەکە",
  // },
  {
    key: "current_pcs",
    label: "قطعێن ماین",
  },
  {
    key: "unit_value",
    label: "بهای وحدێ",
  },
  {
    key: "pc_value",
    label: "بهای قطعێ",
  },
  // {
  //   key: "pc_unit_name",
  //   label: "یەکا پارچێ",
  // },
  // {
  //   key: "expired_units",
  //   label: "سەرڤەجوی (یەکە)",
  // },
  // {
  //   key: "gifted_units",
  //   label: "دیاری (یەکە)",
  // },
  {
    key: "damaged_units",
    label: "تەلەف",
  },
  {
    key: "returned_pcs_to_supplier",
    label: "زڤراندن ",
  },
  // {
  //   key: "solid_pcs",
  //   label: "پارجێن فروتی",
  // },
  // {
  //   key: "solid_units",
  //   label: "یەکێن فروتی",
  // },
  // {
  //   key: "user_name",
  //   label: "یوزر",
  // },
  // {
  //   key: "date",
  //   label: "مێژوا داخل کرنێ",
  // },
].reverse();

// amount_in_units: 1 // added
// approx_profit: 0
// barcode: "12345"
// category_name: "ڤەخارن"
// current_pcs: 30 // added
// current_units: 1 // added
// damaged_pcs: 0
// damaged_units: 0
// date: "2024-03-28T20:40:08.113Z" 
// expire_date: "2024-03-28T20:39:44.030Z" // added
// expired_pcs: 0
// expired_units: 0
// gifted_pcs: 0
// gifted_units: 0
// item_id: 24
// item_name: "کوکاکولا ٥٠٠مل رەش ترکی عسلی" // added
// pc_barcode: "123456"
// pc_cost: 300
// pc_price: 500
// pc_unit_name: "قودیك"
// pcs_per_unit: 30
// production_date: null
// returned_pcs_to_supplier: 0
// returned_units_to_supplier: 0
// solid_pcs: 0 // added
// solid_units: 0 // added
// state_id: 29
// stocking_id: 30
// stocking_note: ""
// total_cost: 0
// total_price: 0
// unit_cost: 9000
// unit_name: "ربطە"
// unit_price: 12000
// user_name: '' added

export default function Store({ }: Props) {
  const navigate = useNavigate()
  const marketCostRef = useRef(0);
  const marketPriceRef = useRef(0);
  const itemRef = useRef<StockState | undefined>(undefined);
  const [rows, setRows] = useState<StockState[] | []>([])
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [state, setState] = useState({
    barcode: '',
    itemName: ''
  })
  const [itemRecords, setItemRecords] = useState<Item[] | []>([])
  const pages = Math.ceil(rows?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows?.slice(start, end);
  }, [page, rows]);

  const listStockDocuments = async () => {
    const res = await get_stocks_states_docs()
    res?.data && setRows(res?.data)
    if (res?.data) {
      let marketCost = 0
      let marketPrice = 0
      res?.data.forEach((stock: StockState) => {
        marketCost = marketCost + ((stock?.current_units || 1) * (stock?.unit_cost || 1))
        marketPrice = marketPrice + ((stock?.current_units || 1) * (stock?.unit_price || 1))
      })

      marketCostRef.current = marketCost
      marketPriceRef.current = marketPrice
    }
  }

  const listItems = async () => {
    const resp = await get_items();
    resp?.data && setItemRecords(resp.data)
  }

  useEffect(() => {
    listStockDocuments();
    listItems();
  }, [])

  const reload = () => {
    listStockDocuments();
  }

  const listStockDocumentsByBarcode = async () => {
    if (state.barcode) {
      try {
        const res = await get_stocks_states_docs_by_barcode(state.barcode)
        res?.data && setRows(res?.data)
        setState({ ...state, itemName: '' })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const listStockDocumentsByItemName = async () => {
    try {
      const res = await get_stocks_states_docs_by_item_name(state.itemName)
      res?.data && setRows(res?.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (state?.itemName?.length > 0) {
      listStockDocumentsByItemName()
      setState({ ...state, barcode: '' })
    }
  }, [state.itemName])

  const notify = (msg: string) => toast.error(msg);

  return (
    <main className="p-4 bg-white h-lvh">

      <Toaster reverseOrder={true} />
      <header dir='rtl' className="flex flex-col gap-y-4">
        <div className="flex justify-normal items-center	 lg:flex-nowrap md:flex-wrap sm:flex-wrap gap-4">
          <Input dir='ltr' type="text" label="بارکود" labelPlacement="inside"
            id='barcode'
            radius="sm"
            size='sm'
            variant="bordered"
            className='w-80'
            style={{ textAlign: 'left' }}
            value={state.barcode}
            onChange={(e) => setState({ ...state, barcode: e.target.value })}
            onKeyDown={(e) => {
              // barcode steps: Tab key ==> barcode value ==> Enter key
              if (e.key === 'Tab') {
                e.preventDefault(); // Prevent default behavior
              }
              if (e.key === 'Enter') {
                // @ts-ignore
                const input: HTMLInputElement | null = document.getElementById('barcode');
                input?.focus();
                input?.select();
                listStockDocumentsByBarcode();
              }
            }}
          />
          <Autocomplete isRequired size='sm' label="ناڤ" className='w-80'
            // disableAnimation
            labelPlacement="inside" radius="sm"
            selectedKey={state.itemName}
            // @ts-ignore
            onSelectionChange={(key: string) => setState({ ...state, itemName: key })}>
            {itemRecords.map((i: Item) => (
              <AutocompleteItem key={i.item_name || ''} value={i.item_name}>
                {i.item_name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          {/* reload */}
          <Button size='sm' isIconOnly aria-label='reload'
            variant="light"
            onClick={reload}>
            <FaArrowsRotate style={{ fontSize: '16px' }} />
          </Button>
          {/* new item */}
          <Button
            size='sm'
            color="primary"
            onClick={() => navigate('newitem')}
            endContent={<FaPlus />}>
            زێدەکرن
          </Button>
          <Button
            size='sm'
            color="primary"
            onClick={() => navigate('stock')}
            endContent={<FaCartPlus />}>
            سەر زێدەکرن
          </Button>
          {/* edit */}
          <Button size='sm' aria-label='edit button' color="secondary"
            onClick={() => {
              if (!itemRef.current) {
                notify('هیڤیدکەین رێکوردەکی هەلبژێرە')
              } else {
                navigate('updatestock', { state: itemRef.current })
              }
            }}
            // isDisabled={!itemRef.current ? true : false}
            endContent={<FaEdit />}>
            زانیاری
          </Button>
          {/* export */}
          <Button size='sm' isIconOnly aria-label='reload'
            className="bg-forestGreen" onClick={reload}>
            <CgExport style={{ color: 'white' }} />
          </Button>

        </div>
      </header>
      <section className='text-right m-2 mt-4'>
        {/* table */}
        <Table
          // isStriped
          // shadow="lg"
          className='rounded-xl shadow-[0px_0px_15px_rgba(0,0,0,0.3)]'
          aria-label="stock data table"
          // color='danger'
          selectionMode="single"
          bottomContent={
            <div className="flex w-full justify-center" dir='ltr'>
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                // @ts-ignore
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}

          onSelectionChange={(keys: Selection) => {
            // console.log(keys[0]);
            if (keys !== 'all') {
              // const stateId = keys.values().next().value
              // keys is of type set
              // converting set to array needs destructing set
              const stateId = [...keys][0]
              itemRef.current = items.find(item => item.state_id === Number(stateId))
              // console.log(itemRef.current)

            }
          }}

        >
          <TableHeader>
            {columns.map((column) =>
              <TableColumn
                className='text-right '
                key={column.key}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.state_id}
                className="border-b-1 border-stale-500">
                {(columnKey) => {
                  if (columnKey === 'date')
                    return <TableCell>{new Date(getKeyValue(item, columnKey)).toISOString().slice(0, 10)}
                    </TableCell>
                  else if (columnKey === 'expire_date')
                    return <TableCell style={{ color: 'red' }}>{
                      getKeyValue(item, columnKey) ?
                        new Date(getKeyValue(item, columnKey)).toISOString().slice(0, 10)
                        : '-'
                    }
                    </TableCell>
                  else if (columnKey === 'current_units' || columnKey === 'amount_in_units') {
                    return <TableCell>
                      <div dir='rtl' className='flex flex-row items-center gap-1'>
                        <span>{getKeyValue(item, columnKey)}</span>
                        <span className='text-[12px] text-stone-600'> {getKeyValue(item, 'unit_name')}</span>
                      </div>
                    </TableCell>
                  }
                  else if (columnKey === 'current_pcs') {
                    return <TableCell>
                      <div dir='rtl' className='flex flex-row items-center gap-1'>
                        <span>{getKeyValue(item, columnKey)}</span>
                        <span className='text-[12px] text-stone-600'> {getKeyValue(item, 'pc_unit_name')}</span>
                      </div>
                    </TableCell>
                  }
                  else if (columnKey === 'unit_value') {
                    return <TableCell>
                      <div dir='rtl' className='text-sm flex flex-row items-center gap-1'>
                        <span className="text-orange-700 text-[12px]">{formatNumberWithComma(getKeyValue(item, "unit_cost"))}</span>
                        <MdArrowBack className='text-[12px]' />
                        <span className="text-teal-700 text-[12px]">{formatNumberWithComma(getKeyValue(item, 'unit_price'))}</span>
                      </div>
                    </TableCell>
                  }
                  else if (columnKey === 'pc_value') {
                    return <TableCell>
                      <div dir='rtl' className='flex flex-row items-center gap-1'>
                        <span className="text-orange-700 text-[12px]">{formatNumberWithComma(getKeyValue(item, "pc_cost"))}</span>
                        <MdArrowBack className="text-[12px]" />
                        <span className="text-teal-700 text-[12px]">{formatNumberWithComma(getKeyValue(item, 'pc_price'))}</span>
                      </div>
                    </TableCell>
                  }
                  else
                    return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                }
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
      <footer className='m-4 flex items-center gap-x-6'>
        <div dir='rtl' className="flex items-center	text-green-800 gap-x-2" style={{ fontSize: '18px' }}>
          <strong> {formatNumberWithComma(marketPriceRef.current)}</strong>
          <strong className='ml-2'> <FaHandHoldingDollar size='26px' /></strong>
        </div>
        <div dir='rtl' className="flex items-center	text-indigo-700	gap-x-2" style={{ fontSize: '18px' }}>
          <strong> {formatNumberWithComma(marketCostRef.current)}</strong>
          <strong className='ml-2'> <MdOutlinePriceCheck size='26px' /></strong>
        </div>
      </footer>
    </main>
  )
}