import {
  Button,
  Input,
  Spinner
} from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import AddCategory from "../../../../components/AddCategory";
import AddUnit from "../../../../components/AddUnit";
import AddPCUnit from "../../../../components/AddPCUnit";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { get_categories } from "../../../../services/categories_service";
import { Category } from "../../../../types/Category.types";
import { get_units } from "../../../../services/units_service";
import { Unit } from "../../../../types/Unit.types";
import { get_pcs_units } from "../../../../services/pcs_units_service";
import { Pcs } from "../../../../types/Pcs.types";
import { UserContext, UserContextType } from "../../../../contexts/UserContext";
import { Item } from "../../../../types/Items.types";
import Ajv from "ajv";
import { Stock } from "../../../../types/Stock.types";
import { add_new_item } from "../../../../services/items_service";
import toast, { Toaster } from 'react-hot-toast';

const ajv = new Ajv({ allErrors: true })

const itemSchema = {
  type: "object",
  properties: {
    item_name: { type: "string", maxLength: 100, minLength: 3 },
    pcs_per_unit: { type: "integer", minimum: 1 },
    user_id: { type: "integer", minimum: 1 },
    category_id: { type: "integer", minimum: 1 },
    item_note: { type: "string", maxLength: 100, nullable: true },
    unit_id: { type: "integer", minimum: 1 },
    archived: { type: "boolean" },
    pc_unit_id: { type: "integer", minimum: 1 }
  },
  required: ["item_name", "pcs_per_unit",
    "user_id", "category_id", "unit_id",
    "archived", "pc_unit_id"],
  additionalProperties: false
}

const stockSchema = {
  type: "object",
  properties: {
    unit_cost: { type: "integer", minimum: 1 },
    unit_price: { type: "integer", minimum: 1 },
    pc_cost: { type: "number", minimum: 1 },
    pc_price: { type: "integer", minimum: 1 },
    amount_in_units: { type: "number", minimum: 0 },
    // expire_date: { type: "string", format: 'date-time', nullable: false },
    user_id: { type: "integer", minimum: 1 },
    stocking_note: { type: "string", maxLength: 100, nullable: true },
    barcode: { type: "string", maxLength: 25, nullable: true },
    pc_barcode: { type: "string", maxLength: 100, nullable: true }
  },
  required: ["unit_cost", "unit_price", "pc_cost", "pc_price", "amount_in_units", "user_id"],
  additionalProperties: false
}

const validateItem = ajv.compile(itemSchema)
const validateStock = ajv.compile(stockSchema)

type Props = {}

type InputingItemType = {
  item_name: string,
  pcs: number | null,
  item_note: string
}


export default function NewItem({ }: Props) {
  const navigate = useNavigate()

  const { user } = useContext(UserContext) as UserContextType

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [])

  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[] | []>([])
  const [category, setCategory] = useState('')

  const [units, setUnits] = useState<Unit[] | []>([])
  const [unit, setUnit] = useState('')

  const [pcsUnits, setPcsUnits] = useState<Pcs[] | []>([])
  const [pcUnit, setPcUnit] = useState('')

  const [itemState, setItemState] = useState<InputingItemType>({
    item_name: '',
    pcs: null,
    item_note: ''
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

  const listCategories = async () => {
    try {
      const res = await get_categories();
      setCategories(res?.data)
    } catch (error) {
      console.error(error)
    }
  }

  const listUnits = async () => {
    try {
      const res = await get_units();
      setUnits(res?.data)
    } catch (error) {
      console.error(error)
    }
  }

  const listPcsUnits = async () => {
    try {
      const res = await get_pcs_units();
      setPcsUnits(res?.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    listCategories();
    listUnits();
    listPcsUnits();
    setLoading(false);
  }, [])

  const addNewItem = async () => {
    setLoading(true);
    const selectedCategory = category && categories.find((cat: Category) => cat.category_name === category);
    const selectUnit = unit && units.find((u: Unit) => u.unit_name === unit);
    const selectedPcUnit = pcUnit && pcsUnits.find((p: Pcs) => p.pc_unit_name === pcUnit);

    // new item data
    const newItemData: Item = {
      item_name: itemState.item_name,
      pcs_per_unit: itemState.pcs ? itemState.pcs : 0,
      user_id: user?.user_id ? user?.user_id : 0,
      category_id: selectedCategory ? selectedCategory.category_id : 0,
      item_note: itemState.item_note,
      unit_id: selectUnit ? selectUnit.unit_id : 0,
      archived: false,
      pc_unit_id: selectedPcUnit ? selectedPcUnit.pc_unit_id : 0
    }
    
    const amountInUnits = (stockState.pcs / newItemData.pcs_per_unit) + stockState.amount_in_units

    // new stock data
    const newStockData: Stock = {
      unit_cost: stockState.unit_cost,
      unit_price: stockState.unit_price,
      pc_cost: stockState.pc_cost,
      pc_price: stockState.pc_price,
      amount_in_units: amountInUnits,
      user_id: user?.user_id ? user?.user_id : 0,
      stocking_note: stockState.stocking_note,
      barcode: stockState.barcode,
      pc_barcode: stockState.pc_barcode,
    }

    if (validateItem(newItemData)) {
      if (validateStock(newStockData)) {
        newStockData.expire_date = stockState.expire_date
        newStockData.production_date = undefined
        const data = {
          ...newItemData,
          ...newStockData
        }
        notify('خەزنکرن...')
        const resp = await add_new_item(data)
        // toast.promise(
        //   add_new_item(data),
        //   {
        //     loading: 'خزنکرن...',
        //     success: <b>سەر هاتە زێدەکرن</b>,
        //     error: <b>نەشێت سەر زێدەکەت</b>,
        //   }
        // )
        if (resp?.status === 201) {

          notify(`هاتە خەزنکرن ب شوەکێ سەرکەفتی.`)
          setItemState({
            item_name: '',
            pcs: null,
            item_note: ''
          })

          setStockState({
            amount_in_units: 0,
            unit_cost: 0,
            unit_price: 0,
            pc_cost: 0,
            pc_price: 0,
            expire_date: null,
            stocking_note: '',
            barcode: '',
            pc_barcode: '',
            user_id: user?.user_id ? user.user_id : 0,
            pcs: 0
          })

        } else {
          notify(`نەشێت سەر زێدەکەت`)
        }

      } else {
        // console.log(validateStock.errors)
        notify('ئەڤ زانیاریێن تە داخلکرین (لایێ چەپێ) کێم و کوری یا تێدا، هیڤیدارین بهێنە پشتراستکرن.')
      }
    } else {
      // console.log(validateItem.errors)
      notify('ئەڤ زانیاریێن تە داخلکرین (لایێ راستێ) کێم و کوری یا تێدا، هیڤیدارین بهێنە پشتراستکرن.')
    }
    setLoading(false)
  }

  const notify = (msg: string) => toast(msg);

  return (
    <main dir='rtl' className='px-8 py-1 bg-white h-lvh'>
      <Toaster reverseOrder={true} />
      <header className="flex justify-between	px-2 items-center">
        <h3 className='font-bold'>زێدەکرن بو جارا ئێکێ</h3>
        <Button
          onClick={() => navigate(-1)}
          color="primary"
          variant="light"
          endContent={<MdArrowBack style={{ fontSize: '20px' }} />}>
          زڤرێن
        </Button>
      </header>
      <div className='grid grid-cols-2 p-8 ml-auto items-center gap-6'>
        {/* right side */}
        <div className="flex flex-col gap-y-3 border-dashed	border-green-950	border-e">
          {/* item: category */}
          <div className="flex items-center gap-y-4">
            <Autocomplete isRequired size='sm' label="بەش" className='w-72'
              // disableAnimation
              labelPlacement="inside" radius="sm"
              selectedKey={category}
              // @ts-ignore
              onSelectionChange={setCategory}>
              {categories.map((category: Category) => (
                <AutocompleteItem key={category.category_name} value={category.category_name}>
                  {category.category_name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <AddCategory revalidate={listCategories} />
          </div>
          {/* item: name */}
          <div>
            <Input isRequired type="text" label="ناڤ" className='w-72'
              // disableAnimation={true}
              labelPlacement="inside"
              radius="sm"
              value={String(itemState.item_name)}
              onChange={(e) => setItemState({ ...itemState, item_name: e.target.value })}
            />
          </div>
          {/* item: unit */}
          <div className="flex items-center gap-y-4">
            <Autocomplete isRequired size='sm' label="یەکە" className='w-72' labelPlacement="inside"
              radius="sm"
              selectedKey={unit}
              // @ts-ignore
              onSelectionChange={setUnit}>
              {units.map((unit: Unit) => (
                <AutocompleteItem key={unit.unit_name} value={unit.unit_name}>
                  {unit.unit_name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <AddUnit revalidate={listUnits} />
          </div>

          {/* item: pc unit */}
          <div className="flex items-center gap-y-4">
            <Autocomplete isRequired size='sm' label="یەکا پارچێ" className='w-72' labelPlacement="inside"
              radius="sm"
              selectedKey={pcUnit}
              // @ts-ignore
              onSelectionChange={setPcUnit}>
              {pcsUnits.map((unit: Pcs) => (
                <AutocompleteItem key={unit.pc_unit_name} value={unit.pc_unit_name}>
                  {unit.pc_unit_name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <AddPCUnit revalidate={listPcsUnits} />
          </div>
          {/* item: pcs per unit */}
          <div>
            <Input dir='ltr' isRequired type="number" label="پارچە" className='w-72' min={1}
              labelPlacement="inside"
              radius="sm"
              style={{ textAlign: 'left' }}
              value={String(itemState.pcs)}
              onChange={(e) => setItemState({ ...itemState, pcs: Number(e.target.value) })}
              onKeyUp={() => {
                if (itemState.pcs && stockState.unit_cost) {
                  setStockState({
                    ...stockState,
                    pc_cost: Math.round(stockState.unit_cost / itemState.pcs)
                  })
                } else {
                  setStockState({
                    ...stockState,
                    pc_cost: 0
                  })
                }
              }}
            />
          </div>
          {/* item: note */}
          <div>
            <Input type="text" label="تێبینی" className='w-72' labelPlacement="inside"
              radius="sm"
              value={itemState.item_note}
              onChange={(e) => setItemState({ ...itemState, item_note: e.target.value })}
            />
          </div>
        </div>
        {/* left side */}
        <div className="flex flex-col gap-y-3 self-start">
          <div className='flex gap-x-4'>
            {/* units */}
            <Input size='sm' dir='ltr' type="number" label={`عدد ( ${unit} )`} className='w-72'
              labelPlacement="inside"
              radius="sm"
              min={1}
              style={{ textAlign: 'left' }}
              value={String(stockState.amount_in_units)}
              onChange={(e) => setStockState({ ...stockState, amount_in_units: Number(e.target.value) })}
            />
            {/* pcs */}
            <Input size='sm' dir='ltr' type="number" label={`عدد ( ${pcUnit} )`} className='w-72'
              labelPlacement="inside"
              radius="sm"
              min={1}
              style={{ textAlign: 'left' }}
              value={String(stockState.pcs)}
              onChange={(e) => setStockState({ ...stockState, pcs: Number(e.target.value) })}
            />

          </div>
          {/* buying date or inputing date */}
          {/* <div>
            <Input isRequired type="date" label={`مێژوو`} className='w-72'
              labelPlacement="inside"
              radius="sm"
              value={(new Date(stockState.date)).toISOString().slice(0, 10)}
              onChange={(e) => setStockState({ ...stockState, date: new Date(e.target.value) })}
            />
          </div> */}
          {/* cost of unit */}
          <div className='flex gap-x-4'>
            <Input dir='ltr' isRequired type="number" size='sm' label={`بهایێ کرینێ (ئێك ${unit} )`}
              className='w-72' labelPlacement="inside" radius="sm" style={{ textAlign: 'left' }}
              min={0}
              value={String(stockState.unit_cost)}
              onChange={(e) => {
                setStockState({ ...stockState, unit_cost: Number(e.target.value) })
              }}
              onKeyUp={() => {
                if (itemState.pcs && stockState.unit_cost) {
                  setStockState({
                    ...stockState,
                    pc_cost: Math.round(stockState.unit_cost / itemState.pcs)
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
            <Input dir='ltr' isRequired type="number" size='sm' label={`بهایێ فروتنێ (ئێك ${unit} )`}
              className='w-72' labelPlacement="inside" radius="sm" style={{ textAlign: 'left' }}
              min={0}
              value={String(stockState.unit_price)}
              onChange={(e) => setStockState({ ...stockState, unit_price: Number(e.target.value) })}
            />
          </div>

          {/* cost of pc */}
          <div className='flex gap-x-4'>
            <Input dir='ltr' isRequired type="number" isDisabled color="success" size='sm'
              min={0}
              label={`بهایێ کرینێ (ئێك ${pcUnit} )`} className='w-72' labelPlacement="inside" radius="sm"
              style={{ textAlign: 'left' }}
              value={String(stockState.pc_cost)}
            />
            {/* price of pc */}
            <Input dir='ltr' isRequired type="number" size='sm' label={`بهایێ فروتنێ (ئێك ${pcUnit} )`}
              className='w-72' labelPlacement="inside" radius="sm" style={{ textAlign: 'left' }}
              min={0}
              value={String(stockState.pc_price)}
              onChange={(e) => setStockState({ ...stockState, pc_price: Number(e.target.value) })}
            />
          </div>
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
          {/* item: expire and note */}
          <div className='flex gap-x-4'>
            {/* expire date */}
            <Input color='danger' type="date" label={`مێژویا سەرڤەچونێ`}
              labelPlacement="inside" radius="sm"
              // @ts-ignore
              value={stockState.expire_date ? (new Date(stockState.expire_date)).toISOString().slice(0, 10) : ''}
              onChange={(e) => setStockState({ ...stockState, expire_date: new Date(e.target.value) })}
            />
            {/* note */}
            <Input type="text" label="تێبینی" labelPlacement="inside" radius="sm"
              value={stockState.stocking_note}
              onChange={(e) => setStockState({ ...stockState, stocking_note: e.target.value })}
            />
          </div>
        </div>
        {/* action buttons */}
        <div className="col-span-2 justify-self-center flex gap-x-4">
          <Button color="warning" variant="light" onClick={() => navigate(-1)}>
            دەرکەفتن
          </Button>
          {
            loading ?
              <Spinner size="md" />
              : <Button color="primary" onClick={addNewItem}>
                خەزنکرن
              </Button>
          }

        </div>
      </div>
    </main>
  )
}