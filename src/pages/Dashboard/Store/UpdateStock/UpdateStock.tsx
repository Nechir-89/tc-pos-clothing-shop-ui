import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider
} from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { StockState } from "../../../../types/Stock.types";
import extractTimeFromDate from "../../../../helpers/extractTimeFromDate";
import extractDateFromDate from "../../../../helpers/extractDateFromDate";
import UpdateStockExpireDataModel from "../../../../components/UpdateStockExpireDataModel";
import UpdateBarcodeModel from "../../../../components/UpdateBarcodeModel";
import { UserContext, UserContextType } from "../../../../contexts/UserContext";
import {
  update_stock_barcodes,
  set_stock_state_returned_items_to_supplier,
  delete_stock,
  update_stock_state_damaged_items
} from "../../../../services/stocks_service";
import toast, { Toaster } from 'react-hot-toast';
import SetDamagedItemsModel from "../../../../components/SetDamagedItemsModel";
import formatNumberWithComma from "../../../../helpers/formatNumberWithComma";
import ReturnToWholesalerModel from "../../../../components/ReturnToWholesalerModel";
import UpdateQuantityModel from "../../../../components/UpdateQuantityModel";
import UpdateCostAndPriceModel from "../../../../components/UpdateCostAndPriceModel";

type Props = {}

export default function UpdateStock({ }: Props) {

  const navigate = useNavigate();
  const location = useLocation()
  const [stock, setStock] = useState<StockState | null>(null)
  const { user } = useContext(UserContext) as UserContextType

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
    setStock(location.state)
    // console.log(location.state)
  }, [])

  return (
    <main dir='rtl' className='p-6 bg-slate-200 p-6 h-lvh overflow-x-auto'>
      <Toaster reverseOrder={true} />
      <header className="flex justify-between items-center">
        <h3 className='font-bold text-lg'>زانیاری</h3>
        <Button
          onClick={() => navigate(-1)}
          color="primary"
          variant="light"
          size='sm'
          endContent={<MdArrowBack style={{ fontSize: '20px' }} />}>
          زڤرێن
        </Button>
      </header>
      <section className='p-6'>
        <div dir='rtl' className='grid grid-cols-2 gap-x-6 gap-y-8'>
          {/* main stock details */}
          <Card radius="sm" className="" shadow="sm">
            <CardHeader className='bg-neutral-800'>
              <h3 className='font-bold text-slate-100'>زانیاریێن سەرەکی</h3>
            </CardHeader>
            <Divider />
            <CardBody className='text-right'>
              {
                stock && <div className='grid grid-cols-2 gap-3'>
                  {/* item name */}
                  <div>
                    <h4 className="text-slate-400	">ناڤێ مەوادی</h4>
                    <span className='text-sm font-semibold	'>{stock.item_name}</span>
                  </div>
                  {/* Category name */}
                  <div>
                    <h4 className="text-slate-400	">بەش</h4>
                    <span className='text-sm font-semibold	'>{stock.category_name}</span>
                  </div>
                  {/* PCs per unit */}
                  <div>
                    <h4 className="text-slate-400	">عددێ قطعان بو 1 {stock.unit_name}</h4>
                    <span className='text-sm font-semibold	'>{stock.pcs_per_unit}</span>
                  </div>
                  {/* unit name */}
                  <div>
                    <h4 className="text-slate-400	">وحدا مەزن</h4>
                    <span className='text-sm font-semibold	'>{stock.unit_name}</span>
                  </div>
                  {/* unit pc name */}
                  <div>
                    <h4 className="text-slate-400	">وحدا بچیك</h4>
                    <span className='text-sm font-semibold	'>{stock.pc_unit_name}</span>
                  </div>
                  {/* Inputed date */}
                  <div>
                    <h4 className="text-slate-400	">مێژوا داخلکرنێ</h4>
                    <span dir='ltr' className='text-right text-sm font-semibold	flex gap-x-2 justify-end'>
                      <span>{extractTimeFromDate(new Date(stock.date || ''))}</span>
                      <span>{extractDateFromDate(new Date(stock.date || ''))}</span>
                    </span>
                  </div>
                </div>
              }
            </CardBody>
          </Card>
          {/* expiration details */}
          <Card radius="sm" className="" shadow="sm">
            <CardHeader className='bg-green-900'>
              <h3 className='font-bold text-slate-100'>سەرڤەچون </h3>
            </CardHeader>
            <Divider />
            <CardBody className='text-right'>
              {
                stock && <div className='grid grid-cols-2 gap-3'>
                  {/* expire date */}
                  <div>
                    <h4 className="text-slate-400	"> مێژوا سەرڤەچونێ</h4>
                    <span dir='ltr' className='text-right text-sm font-semibold	flex gap-x-2 justify-end'>
                      {/* <span>{stock.expire_date ? extractTimeFromDate(new Date(stock.expire_date || '')) : 'نەهاتیە داخلکرن'}</span> */}
                      <span>{stock.expire_date ? extractDateFromDate(new Date(stock.expire_date || '')) : 'نەهاتیە داخلکرن'}</span>
                    </span>
                  </div>
                  {/* expired units */}
                  <div>
                    <h4 className="text-slate-400	">وحدێن سەرڤەجوی</h4>
                    <span className='text-sm font-semibold	'>{stock.expired_units} {stock.unit_name}</span>
                  </div>
                  {/* expired PCs */}
                  <div>
                    <h4 className="text-slate-400	">قطعێن سەرڤەجوی</h4>
                    <span className='text-sm font-semibold	'>{stock.expired_pcs} {stock.pc_unit_name}</span>
                  </div>
                  {/* production date */}
                  <div>
                    <h4 className="text-slate-400	"> مێژوا بەرهەمهێنانا موادی</h4>
                    <span dir='ltr' className='text-right text-sm font-semibold	flex gap-x-2 justify-end'>
                      {/* <span>{stock.production_date ? extractTimeFromDate(new Date(stock.production_date || '')) : 'نەهاتیە داخلکرن'}</span> */}
                      <span>{stock.production_date ? extractDateFromDate(new Date(stock.production_date || '')) : 'نەهاتیە داخلکرن'}</span>
                    </span>
                  </div>
                </div>
              }
            </CardBody>
            <CardFooter dir='ltr'>
              {
                stock && <UpdateStockExpireDataModel
                  stocking_id={stock?.stocking_id || 0}
                  expireDate={stock?.expire_date || null}
                  // productionDate={stock?.production_date || null}
                  expUnits={stock?.expired_units || 0}
                  expPcs={stock?.expired_pcs || 0}
                  currentPcs={stock?.current_pcs || 0}
                  currentUnits={stock?.current_units || 0}
                  itemId={stock?.item_id || 0}
                  stateId={stock?.state_id || 0}
                  changeExpireDate={(newExpireDate: Date) => setStock({ ...stock, expire_date: newExpireDate })}
                  changeCurrentQuantity={(currentUnits: number, currentPcs: number) => setStock({
                    ...stock,
                    current_units: 0,
                    current_pcs: 0,
                    expired_units: currentUnits,
                    expired_pcs: currentPcs
                  })} />
              }
            </CardFooter>
          </Card>
          {/* Quantity details */}
          <Card radius="sm" className="" shadow="sm">
            <CardHeader className='bg-green-900'>
              <h3 className='font-bold text-slate-100'>عدد</h3>
            </CardHeader>
            <Divider />
            <CardBody className='text-right'>
              {
                stock && <div className='grid grid-cols-2 gap-3'>
                  {/* inputed units*/}
                  <div>
                    <h4 className="text-slate-400	"> وحدێن داخل کری</h4>
                    <span className='text-sm font-semibold	flex gap-x-2'>
                      <span>{Math.floor(stock?.amount_in_units || 0)}</span>
                      <span>{stock.unit_name}</span>
                    </span>
                  </div>
                  {/* inputed pcs */}
                  <div>
                    <h4 className="text-slate-400	">قطعێن داخل کری</h4>
                    <span className='text-sm font-semibold	flex gap-x-2'>
                      <span>{Math.round((stock?.amount_in_units || 0) * (stock?.pcs_per_unit || 0) % (stock?.pcs_per_unit || 0))}</span>
                      <span>{stock.pc_unit_name}</span>
                    </span>
                  </div>
                  {/* current number of units*/}
                  <div>
                    <h4 className="text-slate-400	"> وحدێن ماین</h4>
                    <span className='text-sm font-semibold	'>{(stock.current_units || 0)} {stock.unit_name}</span>
                  </div>
                  {/* current number of pcs */}
                  <div>
                    <h4 className="text-slate-400	">قطعێن ماین</h4>
                    <span className='text-sm font-semibold	'>{stock.current_pcs} {stock.pc_unit_name}</span>
                  </div>
                </div>
              }
            </CardBody>
            <CardFooter dir='ltr'>
              {
                stock && <UpdateQuantityModel

                  item_id={stock?.item_id || 0}
                  stocking_id={stock?.stocking_id || 0}
                  state_id={stock?.state_id || 0}

                  current_pcs={stock?.current_pcs || 0}
                  current_units={stock?.current_units || 0}

                  unit_name={stock?.unit_name || ''}
                  pc_unit_name={stock?.pc_unit_name || ''}

                  pcs_per_unit={stock?.pcs_per_unit || 0}

                  amount_in_units={Math.floor(stock?.amount_in_units || 0)}
                  amount_in_pcs={Math.round((stock?.amount_in_units || 0) * (stock?.pcs_per_unit || 0) % (stock?.pcs_per_unit || 0))}

                  old_quantity_in_units={stock?.amount_in_units || 0}

                  updateQuantity={(amountInUnits: number, currentUnits: number, currentPcs: number) => {
                    setStock({
                      ...stock,
                      amount_in_units: amountInUnits,
                      current_units: currentUnits,
                      current_pcs: currentPcs
                    })
                  }} />
              }
            </CardFooter>
          </Card>
          {/*price and cost of stock*/}
          <Card radius="sm" className="" shadow="sm">
            <CardHeader className='bg-neutral-800'>
              <h3 className='font-bold text-slate-100'>بها</h3>
            </CardHeader>
            <Divider />
            <CardBody className='text-right'>
              {
                stock && <div className='grid grid-cols-2 gap-3'>
                  {/* Unit cost*/}
                  <div>
                    <h4 className="text-red-400	">بهایێ کرینا {stock.unit_name}</h4>
                    <span className='text-sm font-semibold	text-red-700'>{formatNumberWithComma(stock?.unit_cost || 0)}</span>
                  </div>
                  {/* Unit Price*/}
                  <div>
                    <h4 className="text-teal-500	">بهایێ فروتنا {stock.unit_name}</h4>
                    <span className='text-sm font-semibold	text-green-700'>{formatNumberWithComma(stock?.unit_price || 0)}</span>
                  </div>
                  {/* PC cost*/}
                  <div>
                    <h4 className="text-red-400	"> بهایێ کرینا {stock.pc_unit_name}</h4>
                    <span className='text-sm font-semibold	text-red-700'>{formatNumberWithComma(stock?.pc_cost || 0)}</span>
                  </div>
                  {/* PC Price*/}
                  <div>
                    <h4 className="text-teal-500	"> بهایێ فروتنا {stock.pc_unit_name}</h4>
                    <span className='text-sm font-semibold	text-green-700'>{formatNumberWithComma(stock?.pc_price || 0)}</span>
                  </div>
                </div>
              }
            </CardBody>
            <CardFooter dir='ltr' className='flex gap-2'>
              {
                stock && <UpdateCostAndPriceModel
                  stocking_id={stock?.stocking_id || 0}
                  unit_cost={stock?.unit_cost || 0}
                  unit_price={stock?.unit_price || 0}
                  pc_cost={stock?.pc_cost || 0}
                  pc_price={stock?.pc_price || 0}
                  pcs_per_unit={stock?.pcs_per_unit || 0}
                  unit_name={stock?.unit_name || ''}
                  pc_unit_name={stock?.pc_unit_name || ''}
                  updateCostAndPrice={(
                    unitCost: number,
                    unitPrice: number,
                    pcCost: number,
                    pcPrice: number) => {
                    setStock({
                      ...stock,
                      unit_price: unitPrice,
                      unit_cost: unitCost,
                      pc_price: pcPrice,
                      pc_cost: pcCost
                    })
                  }}
                />
              }
            </CardFooter>
          </Card>
          {/* Barcodes */}
          <Card radius="sm" className="" shadow="sm">
            <CardHeader className='bg-green-900'>
              <h3 className='font-bold text-slate-100'>بارکود</h3>
            </CardHeader>
            <Divider />
            <CardBody className='text-right'>
              {
                stock && <div className='grid grid-cols-2 gap-3'>
                  {/* unit barcode*/}
                  <div>
                    <h4 className="text-slate-400	"> بارکودێ وحدێ</h4>
                    <span className='text-sm font-semibold	'>{stock.barcode ? stock.barcode : 'نەهاتیە دیارکرن'}</span>
                  </div>
                  {/* inputed pcs */}
                  <div>
                    <h4 className="text-slate-400	">بارکودێ قطعەی</h4>
                    <span className='text-sm font-semibold	'>
                      {stock.pc_barcode ? stock.pc_barcode : 'نەهاتیە دیارکرن'}
                    </span>
                  </div>
                </div>
              }
            </CardBody>
            <CardFooter dir='ltr' className='flex gap-2'>
              {
                stock && <UpdateBarcodeModel
                  stocking_id={stock?.stocking_id || 0}
                  barcode={String(stock.barcode)}
                  pcBarcode={String(stock.pc_barcode)}
                  updateBarcodes={(barcode, pcBarcode) => setStock({
                    ...stock,
                    barcode: String(barcode),
                    pc_barcode: String(pcBarcode)
                  })} />
              }
              {
                stock && <Button size='sm' color='secondary' variant="light" radius="sm"
                  isDisabled={(stock?.barcode || stock?.pc_barcode) ? false : true}
                  // className='text-slate-100'
                  onClick={async () => {
                    const resp = await update_stock_barcodes(stock.stocking_id || 0, '', '')
                    if (resp?.data.stocking_id === stock.stocking_id) {
                      toast.success('هاتە گوهارتن بو بێ بارکودی')
                      setStock({ ...stock, barcode: '', pc_barcode: '' })
                    } else {
                      toast.error('سیستەم نەشێت بگوهریت بو بێ بارکودی')
                    }
                  }}>گوهارتن بو بێ  بارکود</Button>
              }
            </CardFooter>
          </Card>
          {/* Damage */}
          <Card radius="sm" shadow="sm">
            <CardHeader className='bg-green-900'>
              <h3 className='font-bold text-slate-100'>شکەستن / تەلف</h3>
            </CardHeader>
            <Divider />
            <CardBody className='text-right'>
              {
                stock && <div className='grid grid-cols-2 gap-3'>
                  {/* unit barcode*/}
                  <div>
                    <h4 className="text-slate-400	">وحدە</h4>
                    <span className='text-sm font-semibold	'>{stock.damaged_units}</span>
                  </div>
                  {/* inputed pcs */}
                  <div>
                    <h4 className="text-slate-400	">قطعە</h4>
                    <span className='text-sm font-semibold	'>
                      {stock.damaged_pcs}
                    </span>
                  </div>
                </div>
              }
            </CardBody>
            <CardFooter dir='ltr' className='flex gap-2'>
              {
                stock && <Button size='sm' color='secondary' radius="sm" variant="light"
                  isDisabled={stock?.current_pcs === 0}
                  onClick={async () => {
                    const resp = await update_stock_state_damaged_items(
                      stock?.state_id || 0,
                      stock?.item_id || 0,
                      (stock?.damaged_units || 0) + (stock?.current_units || 0),
                      (stock?.damaged_pcs || 0) + (stock?.current_pcs || 0)
                    )
                    if (resp?.data?.state_id === stock?.state_id) {
                      toast.success('شکەستی/تەلەف هاتە گوهارتن')
                      const {
                        damaged_pcs,
                        damaged_units,
                        current_pcs,
                        current_units
                      } = stock

                      setStock({
                        ...stock,
                        damaged_units: (damaged_units || 0) + (current_units || 0),
                        damaged_pcs: (damaged_pcs || 0) + (current_pcs || 0),
                        current_units: 0,
                        current_pcs: 0
                      })
                    } else {
                      toast.error('سیستەم نەشێت گوهریت')
                    }
                  }}>تەلەفکرن هەمیان</Button>
              }
              {
                stock && <SetDamagedItemsModel
                  state_id={stock.state_id || 0}
                  item_id={stock.item_id || 0}
                  current_units={stock.current_units || 0}
                  current_pcs={stock.current_pcs || 0}
                  damaged_pcs={stock.damaged_pcs || 0}
                  updateDamagedItems={(units: number, pcs: number) => {
                    const {
                      damaged_pcs,
                      damaged_units,
                      current_pcs,
                      current_units
                    } = stock

                    setStock({
                      ...stock,
                      damaged_units: units,
                      damaged_pcs: pcs,
                      current_pcs: (current_pcs || 0) - (pcs - (damaged_pcs || 0)),
                      current_units: (current_units || 0) - (units - (damaged_units || 0))
                    })
                  }}
                  pcs_per_unit={stock.pcs_per_unit || 0}
                />
              }
            </CardFooter>
          </Card>
          {/* gifted items */}
          <Card radius="sm" className="" shadow="sm">
            <CardHeader className='bg-neutral-800'>
              <h3 className='font-bold text-slate-100'>دیاری کرن</h3>
            </CardHeader>
            <Divider />
            <CardBody className='text-right'>
              {
                stock && <div className='grid grid-cols-2 gap-3'>
                  {/* gifted barcode*/}
                  <div>
                    <h4 className="text-slate-400	">وحدێن دیاریکری</h4>
                    <span className='text-sm font-semibold	'>{stock.gifted_units}</span>
                  </div>
                  {/* gifted pcs */}
                  <div>
                    <h4 className="text-slate-400	">قطعێن دیاریکری</h4>
                    <span className='text-sm font-semibold	'>
                      {stock.gifted_pcs}
                    </span>
                  </div>
                </div>
              }
            </CardBody>
          </Card>
          {/* return to wholesale*/}
          <Card radius="sm" className="" shadow="sm">
            <CardHeader className='bg-green-900'>
              <h3 className='font-bold text-slate-100'>زڤراندن بو کومپانیێ</h3>
            </CardHeader>
            <Divider />
            <CardBody className='text-right'>
              {
                stock && <div className='grid grid-cols-2 gap-3'>
                  {/* returned units to wholesale*/}
                  <div>
                    <h4 className="text-slate-400	">وحدێن زڤراندی</h4>
                    <span className='text-sm font-semibold	'>{stock.returned_units_to_supplier}</span>
                  </div>
                  {/* returned PCs to wholesale*/}
                  <div>
                    <h4 className="text-slate-400	">قطعێن زڤراندی</h4>
                    <span className='text-sm font-semibold	'>
                      {stock.returned_pcs_to_supplier}
                    </span>
                  </div>
                </div>
              }
            </CardBody>
            <CardFooter dir='ltr' className='flex gap-2'>
              {
                stock && <Button size='sm' color='secondary' variant="light" radius="sm"
                  isDisabled={(stock?.current_pcs !== 0) ? false : true}
                  onClick={async () => {
                    const resp = await set_stock_state_returned_items_to_supplier(
                      stock?.state_id || 0,
                      stock?.item_id || 0,
                      (stock?.current_units || 0) + (stock?.returned_units_to_supplier || 0),
                      (stock?.current_pcs || 0) + (stock?.returned_pcs_to_supplier || 0)
                    )
                    if (resp?.data.state_id === stock.state_id) {
                      toast.success('زڤراندی هاتنە گوهارتن')
                      const {
                        returned_pcs_to_supplier,
                        returned_units_to_supplier,
                        current_pcs,
                        current_units
                      } = stock

                      setStock({
                        ...stock,
                        returned_units_to_supplier: (current_units || 0) + (returned_units_to_supplier || 0),
                        returned_pcs_to_supplier: (current_pcs || 0) + (returned_pcs_to_supplier || 0),
                        current_pcs: 0,
                        current_units: 0
                      })
                    } else {
                      toast.error('سیستەم نەشێت گوهریت')
                    }
                  }}>زڤراندنا هەمیان</Button>
              }

              {
                stock && <ReturnToWholesalerModel
                  state_id={stock.state_id || 0}
                  item_id={stock.item_id || 0}
                  current_units={stock.current_units || 0}
                  current_pcs={stock.current_pcs || 0}
                  returned_pcs_to_supplier={stock.returned_pcs_to_supplier || 0}
                  updateReturnedItems={(units: number, pcs: number) => {
                    const {
                      returned_pcs_to_supplier,
                      returned_units_to_supplier,
                      current_pcs,
                      current_units
                    } = stock

                    setStock({
                      ...stock,
                      returned_units_to_supplier: units,
                      returned_pcs_to_supplier: pcs,
                      current_pcs: (current_pcs || 0) - (pcs - (returned_pcs_to_supplier || 0)),
                      current_units: (current_units || 0) - (units - (returned_units_to_supplier || 0))
                    })
                  }}
                  pcs_per_unit={stock.pcs_per_unit || 0}
                />
              }

            </CardFooter>
          </Card>

        </div>
        <div dir='rtl' className='flex p-4 pt-6'>
          {stock && <Button
            size='sm'
            className='bg-red-600 text-slate-100'
            isDisabled={(stock.current_units || 0) !== (stock.amount_in_units || 0)}
            onClick={async () => {
              const confirm = window.confirm('تو یێ پشراستی تە ڤێت ئەڤ ستوکە ژێ بچیت؟')
              if (confirm) {
                const res = await delete_stock(stock?.item_id || 0, stock?.stocking_id || 0, stock?.state_id || 0)
                res && navigate(-1)
              }
            }}>ژێبرن ستوکی</Button>}
        </div>
      </section>
    </main>
  )
}