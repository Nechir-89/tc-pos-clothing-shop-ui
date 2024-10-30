import { Autocomplete, AutocompleteItem, Button, Checkbox, Input, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { Stock } from "../../../../types/Stock.types";
import { get_last_stock_by_barcode, get_last_stock_by_item_name } from "../../../../services/general_queries_service";
import { UserContext, UserContextType } from "../../../../contexts/UserContext";
import toast, { Toaster } from 'react-hot-toast';
import { add_new_stock } from "../../../../services/stocks_service";
import Ajv from "ajv";
import { get_items } from "../../../../services/items_service";
import { Item } from "../../../../types/Items.types";

const ajv = new Ajv({ allErrors: true })
type Props = {}

const schema = {
  type: "object",
  properties: {
    item_id: { type: "integer", minimum: 1 },
    unit_cost: { type: "integer", minimum: 1 },
    unit_price: { type: "integer", minimum: 1 },
    pc_cost: { type: "number", minimum: 1 },
    pc_price: { type: "integer", minimum: 1 },
    amount_in_units: { type: "number", minimum: 0 },
    pcs_per_unit: { type: "integer", minimum: 1 },
    user_id: { type: "integer", minimum: 1 },
    stocking_note: { type: "string", maxLength: 100, nullable: true },
    barcode: { type: "string", maxLength: 25, nullable: true },
    pc_barcode: { type: "string", maxLength: 100, nullable: true }
  },
  required: ["unit_cost", "unit_price", "pc_cost", "pc_price", "amount_in_units", "user_id"],
  additionalProperties: false
}

const validate = ajv.compile(schema)

export default function Stocking({ }: Props) {

  const navigate = useNavigate();

  const { user } = useContext(UserContext) as UserContextType

  useEffect(() => {
    if (!user) {
      navigate('/')
    }

    listItems();

  }, [])

  const [barcode, setBarcode] = useState('');
  const [itemName, setItemName] = useState('');
  const [newBarcode, setNewBarcode] = useState(false)
  const [newPrice, setNewPrice] = useState(false)
  const [loading, setLoading] = useState(false);
  const [itemRecords, setItemRecords] = useState<Item[] | []>([])

  const listItems = async () => {
    const resp = await get_items();
    resp?.data && setItemRecords(resp.data)
  }
  const [state, setState] = useState({
    unit_id: 0,
    unit_name: '',
    category_name: '',
    category_id: 0,
    pc_unit_name: '',
    pc_unit_id: 0,
    total_available_units: 0,
    total_available_pcs: 0,
    item_name: '',
    item_id: 0,
    pcs_per_unit: 0,
    barcode: '',
    pc_barcode: '',
    unit_cost: 0,
    unit_price: 0,
    pc_cost: 0,
    pc_price: 0,
  })

  const [stockState, setStockState] = useState<Stock & { pcs: number }>({
    amount_in_units: 0,
    unit_cost: 0,
    unit_price: 0,
    pc_cost: 0,
    pc_price: 0,
    expire_date: null,
    stocking_note: '',
    barcode: '',
    pc_barcode: '',
    user_id: 0,
    pcs: 0
  })

  const findLastStockByBarcode = async () => {
    try {
      const res = await get_last_stock_by_barcode(barcode)

      res?.data?.length !== 0 && setStockState({
        ...stockState,
        unit_cost: res?.data[0]?.unit_cost,
        unit_price: res?.data[0]?.unit_price,
        pc_cost: res?.data[0]?.pc_cost,
        pc_price: res?.data[0]?.pc_price,
        barcode: res?.data[0]?.barcode,
        pc_barcode: res?.data[0]?.pc_barcode,
        item_id: res?.data[0]?.item_id,
      })

      res?.data?.length !== 0 && setState({
        unit_id: res?.data[0]?.unit_id,
        unit_name: res?.data[0]?.unit_name,
        category_name: res?.data[0]?.category_name,
        category_id: res?.data[0]?.category_id,
        pc_unit_name: res?.data[0]?.pc_unit_name,
        pc_unit_id: res?.data[0]?.pc_unit_id,
        total_available_units: res?.data[0]?.total_available_units,
        total_available_pcs: res?.data[0]?.total_available_pcs,
        item_name: res?.data[0]?.item_name,
        barcode: res?.data[0]?.barcode,
        pc_barcode: res?.data[0]?.pc_barcode,
        item_id: res?.data[0]?.item_id,
        pcs_per_unit: res?.data[0]?.pcs_per_unit,
        unit_cost: res?.data[0]?.unit_cost,
        unit_price: res?.data[0]?.unit_price,
        pc_cost: res?.data[0]?.pc_cost,
        pc_price: res?.data[0]?.pc_price,
      })

      res?.data?.length === 0 && setStockState({
        amount_in_units: 0,
        unit_cost: 0,
        unit_price: 0,
        pc_cost: 0,
        pc_price: 0,
        expire_date: null,
        stocking_note: '',
        barcode: '',
        pc_barcode: '',
        user_id: 0,
        pcs: 0
      })

      res?.data?.length === 0 && setState({
        unit_id: 0,
        unit_name: '',
        category_name: '',
        category_id: 0,
        pc_unit_name: '',
        pc_unit_id: 0,
        total_available_units: 0,
        total_available_pcs: 0,
        item_name: '',
        item_id: 0,
        pcs_per_unit: 0,
        barcode: '',
        pc_barcode: '',
        unit_cost: 0,
        unit_price: 0,
        pc_cost: 0,
        pc_price: 0,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const findLastStockByItemName = async (item_name: string) => {
    try {
      const res = await get_last_stock_by_item_name(item_name)

      res?.data?.length !== 0 && setStockState({
        ...stockState,
        unit_cost: res?.data[0]?.unit_cost,
        unit_price: res?.data[0]?.unit_price,
        pc_cost: res?.data[0]?.pc_cost,
        pc_price: res?.data[0]?.pc_price,
        barcode: res?.data[0]?.barcode,
        pc_barcode: res?.data[0]?.pc_barcode,
        item_id: res?.data[0]?.item_id,
      })

      res?.data?.length !== 0 && setState({
        unit_id: res?.data[0]?.unit_id,
        unit_name: res?.data[0]?.unit_name,
        category_name: res?.data[0]?.category_name,
        category_id: res?.data[0]?.category_id,
        pc_unit_name: res?.data[0]?.pc_unit_name,
        pc_unit_id: res?.data[0]?.pc_unit_id,
        total_available_units: res?.data[0]?.total_available_units,
        total_available_pcs: res?.data[0]?.total_available_pcs,
        item_name: res?.data[0]?.item_name,
        barcode: res?.data[0]?.barcode,
        pc_barcode: res?.data[0]?.pc_barcode,
        item_id: res?.data[0]?.item_id,
        pcs_per_unit: res?.data[0]?.pcs_per_unit,
        unit_cost: res?.data[0]?.unit_cost,
        unit_price: res?.data[0]?.unit_price,
        pc_cost: res?.data[0]?.pc_cost,
        pc_price: res?.data[0]?.pc_price,
      })

      res?.data?.length === 0 && setStockState({
        amount_in_units: 0,
        unit_cost: 0,
        unit_price: 0,
        pc_cost: 0,
        pc_price: 0,
        expire_date: null,
        stocking_note: '',
        barcode: '',
        pc_barcode: '',
        user_id: 0,
        pcs: 0
      })

      res?.data?.length === 0 && setState({
        unit_id: 0,
        unit_name: '',
        category_name: '',
        category_id: 0,
        pc_unit_name: '',
        pc_unit_id: 0,
        total_available_units: 0,
        total_available_pcs: 0,
        item_name: '',
        item_id: 0,
        pcs_per_unit: 0,
        barcode: '',
        pc_barcode: '',
        unit_cost: 0,
        unit_price: 0,
        pc_cost: 0,
        pc_price: 0,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const addNewStock = async () => {
    setLoading(true)
    const amounInUnits = (stockState.pcs / state.pcs_per_unit) + stockState.amount_in_units
    const data = {
      item_id: state.item_id,
      unit_cost: newPrice ? stockState.unit_cost : state.unit_cost,
      unit_price: newPrice ? stockState.unit_price : state.unit_price,
      pc_cost: newPrice ? stockState.pc_cost : state.pc_cost,
      pc_price: newPrice ? stockState.pc_price : state.pc_price,
      amount_in_units: amounInUnits,
      pcs_per_unit: state.pcs_per_unit,
      user_id: user?.user_id ? user.user_id : 0,
      stocking_note: stockState.stocking_note,
      barcode: newBarcode ? stockState.barcode : state.barcode,
      pc_barcode: newBarcode ? stockState.pc_barcode : state.pc_barcode,
    }

    if (validate(data)) {
      // @ts-ignore
      data.expire_date = stockState.expire_date
      // @ts-ignore
      data.production_date = undefined
      try {
        notify('خەزنکرن...')
        const response = await add_new_stock(data)
        if (response?.status === 201) {
          setItemName('')
          notify(`هاتە خەزنکرن ب شوەکێ سەرکەفتی.`)
          // setStockState({ ...stockState, amount_in_units: 0 })
          try {
            let res;
            if (stockState.barcode)
              res = await get_last_stock_by_barcode(stockState.barcode)

            res?.data?.length !== 0 && setStockState({
              ...stockState,
              unit_cost: res?.data[0]?.unit_cost,
              unit_price: res?.data[0]?.unit_price,
              pc_cost: res?.data[0]?.pc_cost,
              pc_price: res?.data[0]?.pc_price,
              barcode: res?.data[0]?.barcode,
              pc_barcode: res?.data[0]?.pc_barcode,
              item_id: res?.data[0]?.item_id,
            })

            res?.data?.length !== 0 && setState({
              unit_id: res?.data[0]?.unit_id,
              unit_name: res?.data[0]?.unit_name,
              category_name: res?.data[0]?.category_name,
              category_id: res?.data[0]?.category_id,
              pc_unit_name: res?.data[0]?.pc_unit_name,
              pc_unit_id: res?.data[0]?.pc_unit_id,
              total_available_units: res?.data[0]?.total_available_units,
              total_available_pcs: res?.data[0]?.total_available_pcs,
              item_name: res?.data[0]?.item_name,
              barcode: res?.data[0]?.barcode,
              pc_barcode: res?.data[0]?.pc_barcode,
              item_id: res?.data[0]?.item_id,
              pcs_per_unit: res?.data[0]?.pcs_per_unit,
              unit_cost: res?.data[0]?.unit_cost,
              unit_price: res?.data[0]?.unit_price,
              pc_cost: res?.data[0]?.pc_cost,
              pc_price: res?.data[0]?.pc_price,
            })
          } catch (error) {

          }
        }
        else {
          notify(`نەشێت سەر زێدەکەت`)
        }
      } catch (error) {
        console.log(error)
        notify(`نەشێت سەر زێدەکەت`)
      }
    } else {
      notify('ئەڤ زانیاریێن تە داخلکرین کێم و کوری یا تێدا، هیڤیدارین بهێنە پشتراستکرن.')
      console.log(validate.errors)
    }
    setLoading(false)
  }
  // console.log(stockState)
  // console.log(state)
  const notify = (msg: string) => toast(msg);
  return (
    <main dir='rtl' className='px-8 py-1 bg-white h-lvh'>
      <Toaster reverseOrder={true} />
      <header className="flex justify-between	px-2 items-center">
        <h3 className='font-bold'>سەر زێدەکرن (تعبیە)</h3>
        <Button
          onClick={() => navigate(-1)}
          color="primary"
          variant="light"
          endContent={<MdArrowBack style={{ fontSize: '20px' }} />}>
          زڤرێن
        </Button>
      </header>
      <div className='grid grid-cols-2 p-8 max-w-5xl ml-auto items-center gap-6'>
        {/* right side */}
        <div className="flex flex-col gap-y-3 border-dashed	border-green-950	border-e">
          {/* item: barcode */}
          <div className='flex gap-x-4'>
            <Input dir='ltr' type="text" label="بارکود" className='w-80' labelPlacement="inside"
              id='item-barcode'
              radius="sm"
              style={{ textAlign: 'left' }}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => {
                // barcode steps: Tab key ==> barcode value ==> Enter key
                if (e.key === 'Tab') {
                  e.preventDefault(); // Prevent default behavior
                }
                if (e.key === 'Enter') {
                  findLastStockByBarcode()
                  // @ts-ignore
                  const input: HTMLInputElement | null = document.getElementById('item-barcode');
                  input?.focus();
                  input?.select();
                }
              }}
            />
          </div>
          {/* item name */}
          <Autocomplete size='sm' label="ناڤ" className='w-80'
            // disableAnimation
            labelPlacement="inside" radius="sm"
            selectedKey={itemName}
            // @ts-ignore
            onSelectionChange={(key: string) => {
              setItemName(key)
              findLastStockByItemName(key)
            }}>
            {itemRecords.map((i: Item) => (
              <AutocompleteItem key={i.item_name || ''} value={i.item_name}>
                {i.item_name}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          {/* item details */}
          <div className="p-y-8 text-right">
            <article>
              <h4 className='inline-block border-b-2 border-gray-600 mb-2 font-semibold'>پێزانین سەرەکی</h4>
              <p>ناڤ: <strong>{state.item_name}</strong></p>
              <p>بهایێ کرینا ئێك {state.unit_name}: <strong>{state.unit_cost}</strong></p>
              <p>بهایێ فروتنا ئێك {state.unit_name}: <strong>{state.unit_price}</strong></p>
              <p>پارچە: <strong>{state.pcs_per_unit}</strong> {state.pc_unit_name}</p>
              <p>بهایێ کرینا ئێك {state.pc_unit_name}: <strong>{state.pc_cost}</strong></p>
              <p>بهایێ فروتنا ئێك {state.pc_unit_name}: <strong>{state.pc_price}</strong></p>
              <p>بارکود: <strong>{state.barcode}</strong></p>
              <p>بارکودێ پارچەی/قطعەی : <strong>{state.pc_barcode}</strong></p>
            </article>
            <article className="mt-4">
              <h4 className='inline-block border-b-2 border-gray-600 mb-2 font-semibold'>نوکە ل مارکێتێ</h4>
              <p>عدد ({state.unit_name}): <strong>{state.total_available_units}</strong></p>
              <p>عدد ({state.pc_unit_name}): <strong>{state.total_available_pcs}</strong></p>
            </article>
          </div>
        </div>
        {/* left side */}
        <div className="flex flex-col gap-y-3 self-start">
          <div className="flex gap-x-3">
            {/* units */}
            <Input size='sm' dir='ltr' type="number" label={`عدد (${state.unit_name} )`}
              className='w-72' labelPlacement="inside" radius="sm" style={{ textAlign: 'left' }}
              value={String(stockState.amount_in_units)}
              onChange={(e) => setStockState({ ...stockState, amount_in_units: Number(e.target.value) })}
            />
            {/* pcs */}
            <Input size='sm' dir='ltr' type="number" label={`عدد (${state.pc_unit_name} )`}
              className='w-72' labelPlacement="inside" radius="sm" style={{ textAlign: 'left' }}
              value={String(stockState.pcs)}
              onChange={(e) => setStockState({ ...stockState, pcs: Number(e.target.value) })}
            />
          </div>
          <div className="flex gap-x-3">
            {/* expire date */}
            <Input type="date" label={`مێژویا سەرڤەچونێ`}
              labelPlacement="inside" radius="sm" color="danger"
              // @ts-ignore
              value={stockState.expire_date ? (new Date(stockState.expire_date)).toISOString().slice(0, 10) : ''}
              onChange={(e) => setStockState({ ...stockState, expire_date: new Date(e.target.value) })}
            />
            {/* stock: note */}
            <Input type="text" label="تێبینی" labelPlacement="inside" radius="sm"
              value={stockState.stocking_note}
              onChange={(e) => setStockState({ ...stockState, stocking_note: e.target.value })}
            />
          </div>
          <div className='flex justify-right gap-x-4 mt-6'>
            <Checkbox isSelected={newBarcode} onValueChange={setNewBarcode}>
              بارکودەکێ نی
            </Checkbox>
            <Checkbox isSelected={newPrice} onValueChange={setNewPrice}>
              بهایەکێ نی
            </Checkbox>
          </div>
          {newPrice && <>
            {/* cost of unit */}
            <div className='flex gap-x-4'>
              <Input dir='ltr' isRequired type="number" size='sm' label={`بهایێ کرینێ (${state.unit_name}) `} className='w-72'
                labelPlacement="inside" radius="sm" style={{ textAlign: 'left' }}
                value={String(stockState.unit_cost)}
                onChange={(e) => setStockState({ ...stockState, unit_cost: Number(e.target.value) })}
                onKeyUp={() => {
                  if (stockState.unit_cost) {
                    setStockState({
                      ...stockState,
                      pc_cost: Math.round(stockState.unit_cost / (state.pcs_per_unit ? state.pcs_per_unit : 1))
                    })
                  } else {
                    setStockState({
                      ...stockState,
                      pc_cost: 0
                    })
                  }
                }}
              />
              {/* price of unit */}
              <Input dir='ltr' isRequired type="number" size='sm' label={`بهایێ فروتنێ (${state.unit_name}) `} className='w-72'
                labelPlacement="inside" radius="sm" style={{ textAlign: 'left' }}
                value={String(stockState.unit_price)}
                onChange={(e) => setStockState({ ...stockState, unit_price: Number(e.target.value) })}
              />
            </div>
            {/* cost of pc */}
            <div className='flex gap-x-4'>
              <Input dir='ltr' isRequired type="number" isDisabled color="success" size='sm'
                label={`بهایێ کرینێ (${state.pc_unit_name})`} className='w-72' labelPlacement="inside" radius="sm"
                style={{ textAlign: 'left' }}
                value={String(stockState.pc_cost)}
                onChange={(e) => setStockState({ ...stockState, pc_cost: Number(e.target.value) })}
              />
              {/* price of pc */}
              <Input dir='ltr' isRequired type="number" size='sm' label={`بهایێ فروتنێ (${state.pc_unit_name}) `} className='w-72'
                labelPlacement="inside" radius="sm" style={{ textAlign: 'left' }}
                value={String(stockState.pc_price)}
                onChange={(e) => setStockState({ ...stockState, pc_price: Number(e.target.value) })}
              />
            </div>
          </>
          }
          <div>
            {newBarcode && <>
              {/* item: barcode */}
              <div className='flex gap-x-4'>
                <Input dir='ltr' type="text" label="بارکود" className='w-72' labelPlacement="inside"
                  id='new-item-barcode'
                  radius="sm"
                  style={{ textAlign: 'left' }}
                  value={stockState.barcode}
                  onChange={(e) => setStockState({ ...stockState, barcode: e.target.value })}
                  onKeyDown={(e) => {
                    // barcode steps: Tab key ==> barcode value ==> Enter key
                    if (e.key === 'Tab') {
                      e.preventDefault(); // Prevent default behavior
                    }
                    if (e.key === 'Enter') {
                      // @ts-ignore
                      const input: HTMLInputElement | null = document.getElementById('new-item-barcode');
                      input?.focus();
                      input?.select();
                    }
                  }}
                />
                {/* item: pc barcode */}
                <Input id='new-pc-barcode' dir='ltr' type="text" label="بارکودێ پارچەی" className='w-72'
                  labelPlacement="inside"
                  radius="sm"
                  style={{ textAlign: 'left' }}
                  value={stockState.pc_barcode}
                  onChange={(e) => setStockState({ ...stockState, pc_barcode: e.target.value })}
                  onKeyDown={(e) => {
                    // barcode steps: Tab key ==> barcode value ==> Enter key
                    if (e.key === 'Tab') {
                      e.preventDefault(); // Prevent default behavior
                    }
                    if (e.key === 'Enter') {
                      // @ts-ignore
                      const input: HTMLInputElement | null = document.getElementById('new-pc-barcode');
                      input?.focus();
                      input?.select();
                    }
                  }}
                />
              </div>
            </>
            }
          </div>

        </div>
        {/* action buttons */}
        <div className="col-start-2 col-end-2">
          <Button color="warning" variant="light" onClick={() => navigate(-1)}>
            دەرکەفتن
          </Button>
          {
            loading ?
              <Spinner size="md" />
              : <Button color="primary" onClick={addNewStock}>
                خەزنکرن
              </Button>
          }
        </div>
      </div>
    </main>
  )
}