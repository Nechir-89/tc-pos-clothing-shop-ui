import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input,
  Spinner
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
// import { update_stock_barcodes } from "../../services/stocks_service";
import toast, { Toaster } from 'react-hot-toast';
import { update_stock_amount_in_pcs } from "../../services/stocks_service";

type Props = {
  item_id: number,
  stocking_id: number,
  state_id: number,
  // amount_in_units: number,
  amount_in_pcs: number,
  // current_units: number,
  current_pcs: number,
  // unit_name: string,
  // pc_unit_name: string,
  updateQuantity: (
    amountInPcs: number,
    // currentUnits: number,
    currentPcs: number
  ) => void,
  // pcs_per_unit: number,
  old_quantity_in_pcs: number
}

export default function UpdateQuantityModel({
  item_id,
  stocking_id,
  state_id,
  amount_in_pcs,
  current_pcs,
  updateQuantity,
  old_quantity_in_pcs
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false)
  const [newAmountInPcs, setNewAmountInPcs] = useState<number>(amount_in_pcs)

  useEffect(() => {
    setNewAmountInPcs(amount_in_pcs)
  }, [])

  const submitNewQuantity = async () => {
    setLoading(true)

    // New quantity must not be same as previous quantity 
    if (newAmountInPcs !== amount_in_pcs) {
      // const newtotoalQuantityInUnits = Math.round(((newAmountInPcs / pcs_per_unit) + newAmountInUnits) * 10000000) / 10000000
      // const usedAmountInUnits = old_quantity_in_units - current_units

      // used or sold pcs
      const usedAmountInPcs = old_quantity_in_pcs - current_pcs;
      if (newAmountInPcs >= usedAmountInPcs) {

        // const newCurrentUnits = Math.round((current_units + (newtotoalQuantityInUnits - old_quantity_in_units)) * 10000000) / 10000000
        // const newCurrentUnits = Math.round((current_pcs + (newAmountInPcs - old_quantity_in_units)) * 10000000) / 10000000
        const newCurrentPcs = current_pcs + (newAmountInPcs - old_quantity_in_pcs);

        const res = await update_stock_amount_in_pcs(
          item_id,
          stocking_id,
          state_id,
          newAmountInPcs,
          old_quantity_in_pcs,
          newCurrentPcs)

        if (res?.data.item_id === item_id) {
          toast.success('عدد هاتە گوهارتن')
          updateQuantity(newAmountInPcs,newCurrentPcs)
          setLoading(false)
        } else {
          toast.error('سیستەم نەشیا بگوهریت')
          setLoading(false)
        }

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
        // className='text-white'
        // isDisabled={amount_in_units === current_units}
        variant="light"
        startContent={<FaEdit />}>گوهارتن</Button>

      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">گوهارتنا عددێ داخل کری</ModalHeader>
              {/* <Divider /> */}
              <ModalBody className='flex flex-col gap-2'>
                <div className='grid grid-cols-2 gap-x-4'>
                  {/* <div>
                    <label className='flex items-center gap-x-1 pb-1'>وحدە <span className='text-teal-500 text-[12px]'>({unit_name})</span></label>
                    <Input
                      dir='ltr'
                      type="number"
                      radius="sm"
                      style={{ textAlign: 'left' }}
                      value={String(newAmountInUnits)}
                      onChange={(e) => setNewAmountInUnits(() => Number(e.target.value))} />
                  </div> */}
                  <div>
                    <label className='flex items-center gap-x-1 pb-1'>قطعە 
                      {/* <span className='text-teal-500 text-[12px]'>({pc_unit_name})</span> */}
                      </label>
                    {/* item: pc current_units */}
                    <Input dir='ltr' type="number" radius="sm"
                      style={{ textAlign: 'left' }}
                      value={String(newAmountInPcs)}
                      onChange={(e) => setNewAmountInPcs(() => Number(e.target.value))} />
                  </div>
                </div>
                <ol className='border-t-2 pt-4 mt-4 col-span-4 text-sm'>
                  <strong>پزاننین سەرەکی</strong>
                  <li>- بچیکترین عدد بهێتە داخل کرن دڤێت مەزنتربیت یان هندی <strong className='text-orange-600'>
                    {/* ({Math.round((old_quantity_in_units - current_units) * 1000) / 1000} وحدا) یان */}
                    {/* ({Math.round((old_quantity_in_units - current_units) * pcs_per_unit * 1000) / 1000} قطعە) بیت، */}
                    {old_quantity_in_pcs - current_pcs}
                  </strong> ژبەرکو ئەڤ عدد هاتیە بکارئینان</li>
                </ol>
              </ModalBody>
              <ModalFooter>
                {
                  loading ? <Spinner size="sm" color="primary" />
                    : <Button size='sm' color="primary" onClick={submitNewQuantity}>
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
