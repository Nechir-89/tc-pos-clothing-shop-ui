import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input,
  Spinner
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { update_stock_state_damaged_items } from "../../services/stocks_service";
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  state_id: number,
  item_id: number,
  current_units: number,
  current_pcs: number,
  damaged_pcs: number,
  updateDamagedItems: (units: number, pcs: number) => void,
  pcs_per_unit: number
}

export default function SetDamagedItemsModel({
  state_id,
  item_id,
  current_pcs,
  damaged_pcs,
  updateDamagedItems,
  pcs_per_unit
}: Props) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false)
  const [newDamagedPcs, setNewDamagedPcs] = useState<number>(damaged_pcs)

  useEffect(() => {
    setNewDamagedPcs(damaged_pcs)
  }, [])

  const setDamagedItems = async () => {
    setLoading(true)
    // 1. When editing damageditems they should not be same as the old quantity of damaged items 

    if (newDamagedPcs !== damaged_pcs) {
      if (newDamagedPcs <= (current_pcs + damaged_pcs)) {
        const newDamagedUnits = newDamagedPcs / pcs_per_unit
        const res = await update_stock_state_damaged_items(
          state_id,
          item_id,
          newDamagedUnits,
          newDamagedPcs
        )
        
        if (res?.data.state_id === state_id) {
          updateDamagedItems(newDamagedUnits, newDamagedPcs)
          toast.success('شکەستی/تەلەف هاتە گوهارتن')
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
        startContent={<FaEdit />}>گوهارتن</Button>

      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {
            () => (
              <>
                <ModalHeader className="flex flex-col gap-1 pt-8">شکەستن / تەلف</ModalHeader>
                <ModalBody className='flex flex-col gap-1'>
                  <label className='block pb-1'>قطعە</label>
                  <Input dir='ltr' type="number" radius="sm"
                    max={current_pcs + damaged_pcs}
                    min={0}
                    style={{ textAlign: 'left' }}
                    value={String(newDamagedPcs)}
                    onChange={(e) => setNewDamagedPcs(() => Number(e.target.value))} />

                  <ol className='border-t-2 pt-4 mt-4 col-span-4 text-sm'>
                    <strong>پزاننین سەرەکی</strong>
                    <li>- بو داخل کرنا تەلەفی یان شکەستیا تنی ژمارا قطعا (پارچا)داخل بکە یان سەرزێدەکە </li>
                    <li>- ئەگەر وەحدە هەبن، وحدا بگوهرە بو پارچان (قطعان) </li>
                  </ol>
                </ModalBody>
                <ModalFooter>
                  {
                    loading ? <Spinner size="sm" color="primary" />
                      : <Button size='sm' color="primary" onClick={setDamagedItems}>
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
