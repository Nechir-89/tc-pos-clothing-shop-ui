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
  pc_cost: number,
  pc_price: number,
  updateCostAndPrice: (
    pcCost: number,
    pcPrice: number) => void
}

export default function UpdateCostAndPriceModel({
  stocking_id,
  pc_cost,
  pc_price,
  updateCostAndPrice
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false)

  const [newPcCost, setNewPcCost] = useState<number>(pc_cost)
  const [newPcPrice, setNewPcPrice] = useState<number>(pc_price)

  useEffect(() => {
    setNewPcCost(pc_cost)
    setNewPcPrice(pc_price)
  }, [])

  const submitNewCostAndPrice = async () => {
    setLoading(true)

    // New cost and price must not be same as previous cost and price 
    if ((newPcCost !== pc_cost) || (newPcPrice !== pc_price)) {
      const res = await update_stock_cost_and_price(
        stocking_id,
        newPcCost,
        newPcPrice
      )

      if (res?.data.stocking_id === stocking_id) {
        toast.success('بها هاتە گوهارتن')
        updateCostAndPrice(newPcCost, newPcPrice)
        setLoading(false)
      } else {
        toast.error('سیستەم نەشیا بگوهریت')
        setLoading(false)
      }
    } else {
      toast.error('سیستەم نەشێت گوهریت')
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster reverseOrder={true} />
      <Button onPress={onOpen} size='sm' color='danger' radius="sm"
        variant="light"
        startContent={<FaEdit />}>گوهارتن</Button>

      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">گوهارتنا بهای</ModalHeader>
              <ModalBody className='flex flex-col gap-2'>
                <div className='grid grid-cols-2 gap-x-4 gap-y-6'>
                  <div>
                    <label className='flex items-center gap-x-1 pb-1 text-red-500'>کرین</label>
                    <Input
                      dir='ltr'
                      type="number"
                      radius="sm"
                      style={{ textAlign: 'left' }}
                      value={String(newPcCost)}
                      onChange={(e) => setNewPcCost(() => Number(e.target.value))}
                      />
                  </div>
                  <div>
                    <label className='flex items-center gap-x-1 pb-1 text-green-500'>فروتن</label>
                    <Input dir='ltr' type="number" radius="sm"
                      style={{ textAlign: 'left' }}
                      value={String(newPcPrice)}
                      onChange={(e) => setNewPcPrice(() => Number(e.target.value))} />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {
                  loading ? <Spinner size="sm" color="primary" />
                    : <Button size='sm' color="primary" onClick={submitNewCostAndPrice}>
                      Save
                    </Button>}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
