import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input,
  Spinner
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
// import { update_stock_barcodes } from "../../services/stocks_service";
import toast, { Toaster } from 'react-hot-toast';
import { update_stock_cost_and_price } from "../../services/stocks_service";

type Props = {
  stocking_id: number,
  unit_cost: number,
  unit_price: number,
  pc_cost: number,
  pc_price: number,
  pcs_per_unit: number,
  unit_name: string,
  pc_unit_name: string,
  updateCostAndPrice: (
    unitCost: number,
    unitPrice: number,
    pcCost: number,
    pcPrice: number) => void
}

export default function UpdateCostAndPriceModel({
  stocking_id,
  unit_cost,
  unit_price,
  pc_cost,
  pc_price,
  pcs_per_unit,
  unit_name,
  pc_unit_name,
  updateCostAndPrice
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false)

  const [newUnitCost, setNewUnitCost] = useState<number>(unit_cost)
  const [newUnitPrice, setNewUnitPrice] = useState<number>(unit_price)

  const [newPcCost, setNewPcCost] = useState<number>(pc_cost)
  const [newPcPrice, setNewPcPrice] = useState<number>(pc_price)

  useEffect(() => {
    setNewUnitCost(unit_cost)
    setNewUnitPrice(unit_price)
    setNewPcCost(pc_cost)
    setNewPcPrice(pc_price)
  }, [])

  const submitNewCostAndPrice = async () => {
    setLoading(true)

    // New cost and price must not be same as previous cost and price 
    if ((newUnitCost !== unit_cost) || (newUnitPrice !== unit_price) || (newPcPrice !== pc_price)) {
      const res = await update_stock_cost_and_price(
        stocking_id,
        newUnitCost,
        newUnitPrice,
        newPcCost,
        newPcPrice
      )

      if (res?.data.stocking_id === stocking_id) {
        toast.success('بها هاتە گوهارتن')
        updateCostAndPrice(newUnitCost, newUnitPrice, newPcCost, newPcPrice)
        setLoading(false)
      } else {
        toast.error('سیستەم نەشیا بگوهریت')
        setLoading(false)
      }

      // } else {
      //   setLoading(false)
      // }
    } else {
      toast.error('سیستەم نەشێت گوهریت')
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster reverseOrder={true} />
      <Button onPress={onOpen} size='sm' color='danger' radius="sm"
        // className='text-white'
        // isDisabled={unit_cost === current_units}
        variant="light"
        startContent={<FaEdit />}>گوهارتن</Button>

      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">گوهارتنا بهای</ModalHeader>
              {/* <Divider /> */}
              <ModalBody className='flex flex-col gap-2'>
                <div className='grid grid-cols-2 gap-x-4 gap-y-6'>
                  <div>
                    <label className='flex items-center gap-x-1 pb-1 text-red-500'>کرین بو ئێك
                      <span className='text-orange-600 text-[12px]'>({unit_name})</span>
                    </label>
                    <Input
                      dir='ltr'
                      type="number"
                      radius="sm"
                      style={{ textAlign: 'left' }}
                      value={String(newUnitCost)}
                      onChange={(e) => {
                        setNewUnitCost(Number(e.target.value))
                        setNewPcCost(Math.round(Number(e.target.value) / pcs_per_unit))
                      }} />
                  </div>
                  <div>
                    <label className='flex items-center gap-x-1 pb-1 text-green-500'>فروتن بو ئێك
                      <span className='text-orange-600 text-[12px]'>({unit_name})</span>
                    </label>
                    <Input dir='ltr' type="number" radius="sm"
                      style={{ textAlign: 'left' }}
                      value={String(newUnitPrice)}
                      onChange={(e) => setNewUnitPrice(() => Number(e.target.value))} />
                  </div>
                  <div>
                    <label className='flex items-center gap-x-1 pb-1 text-red-500'>کرین بو ئێك
                      <span className='text-gray-700 text-[12px]'>({pc_unit_name})</span>
                    </label>
                    <Input
                      dir='ltr'
                      isDisabled
                      type="number"
                      radius="sm"
                      style={{ textAlign: 'left' }}
                      value={String(newPcCost)} />
                  </div>
                  <div>
                    <label className='flex items-center gap-x-1 pb-1 text-green-500'>فروتن بو ئێك
                      <span className='text-gray-700 text-[12px]'>({pc_unit_name})</span>
                    </label>
                    <Input dir='ltr' type="number" radius="sm"
                      style={{ textAlign: 'left' }}
                      value={String(newPcPrice)}
                      onChange={(e) => setNewPcPrice(() => Number(e.target.value))} />
                  </div>
                </div>
                {/* <ol className='border-t-2 pt-4 mt-4 col-span-4 text-sm'>
                  <strong>پزاننین سەرەکی</strong>
                  <li>- </li>
                </ol> */}
              </ModalBody>
              <ModalFooter>
                {
                  loading ? <Spinner size="sm" color="primary" />
                    : <Button size='sm' color="primary" onClick={submitNewCostAndPrice}>
                      خەزنکرن
                    </Button>}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
