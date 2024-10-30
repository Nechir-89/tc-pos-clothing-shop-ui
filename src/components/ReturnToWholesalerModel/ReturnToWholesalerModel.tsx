import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input,
  Spinner
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { set_stock_state_returned_items_to_supplier } from "../../services/stocks_service";
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  state_id: number,
  item_id: number,
  current_units: number,
  current_pcs: number,
  returned_pcs_to_supplier: number,
  updateReturnedItems: (units: number, pcs: number) => void,
  pcs_per_unit: number
}

export default function ReturnToWholesalerModel({
  state_id,
  item_id,
  current_pcs,
  returned_pcs_to_supplier,
  updateReturnedItems,
  pcs_per_unit
}: Props) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false)
  const [newReturnedPcs, setNewReturnedPcs] = useState<number>(returned_pcs_to_supplier)

  useEffect(() => {
    setNewReturnedPcs(returned_pcs_to_supplier)
  }, [])

  const setReturnedItems = async () => {
    setLoading(true)
    // 1. When editing returned items they should not be same as the old quantity of returned items 

    if (newReturnedPcs !== returned_pcs_to_supplier) {
      if (newReturnedPcs <= (current_pcs + returned_pcs_to_supplier)) {
        const newReturnedUnits = newReturnedPcs / pcs_per_unit
        const res = await set_stock_state_returned_items_to_supplier(
          state_id,
          item_id,
          newReturnedUnits,
          newReturnedPcs
        )
        console.log(`Returned units: ${newReturnedUnits}`)
        console.log(`Returned pcs: ${newReturnedPcs}`)
        if (res?.data.state_id === state_id) {
          updateReturnedItems(newReturnedUnits, newReturnedPcs)
          res && toast.success('زڤراندی هاتنە گوهارتن')
        } else {
          toast.error('سیستەم نەشێت گوهریت')
          setLoading(false)
        }
        res && setLoading(false)
      } else {
        toast.error('سیستەم نەشێت گوهریت')
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster reverseOrder={true} />
      <Button onPress={onOpen} size='sm' color='danger' radius="sm"
        variant="light"
        startContent={<FaEdit />}>زڤراندن</Button>

      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {
            () => (
              <>
                <ModalHeader className="flex flex-col gap-1 pt-8"> زڤراندن بو کومپانیێ</ModalHeader>
                <ModalBody className='flex flex-col gap-1'>
                  <label className='block pb-1'>قطعە</label>
                  <Input dir='ltr' type="number" radius="sm"
                    max={current_pcs + returned_pcs_to_supplier}
                    min={0}
                    style={{ textAlign: 'left' }}
                    value={String(newReturnedPcs)}
                    onChange={(e) => setNewReturnedPcs(Number(e.target.value))} />

                  <ol className='border-t-2 pt-4 mt-4 col-span-4 text-sm'>
                    <strong>پزاننین سەرەکی</strong>
                    <li>- بو داخل کرنا عددێ زڤراندیا تنی ژمارا قطعا (پارچا)داخل بکە یان سەرزێدەکە </li>
                    <li>- ئەگەر وەحدە هەبن، وحدا بگوهرە بو پارچان (قطعان) </li>
                  </ol>
                </ModalBody>
                <ModalFooter>
                  {
                    loading ? <Spinner size="sm" color="primary" />
                      : <Button size='sm' color="primary" onClick={setReturnedItems}>
                        خەزنکرن
                      </Button>}
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </>
  )
}
