import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input,
  Spinner
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { update_stock_barcodes } from "../../services/stocks_service";
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  stocking_id: number,
  barcode: string | null,
  pcBarcode: string | null,
  updateBarcodes: (barcode: string | null, pcBarcode: string | null) => void
}

export default function UpdateBarcodeModel({
  stocking_id,
  barcode,
  // productionDate,
  pcBarcode,
  updateBarcodes
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const [newExpireDate, setNewExpireDate] = useState<Date | null>(expireDate)
  // const [newProductionDate, setNewProductionDate] = useState<Date | null>(productionDate)
  // const [expiredPcs, setExpiredPcs] = useState<number>(expPcs)
  // const [expiredUnits, setExpiredUnits] = useState<number>(expUnits)
  const [loading, setLoading] = useState<boolean>(false)
  const [newBarcode, setNewBarcode] = useState<string | null>(barcode)
  const [newPcBarcode, setNewPcBarcode] = useState<string | null>(pcBarcode)

  // const updateExpireDate = async () => {
  //   if (newExpireDate !== expireDate) {
  //     setUpdatingExpireDate(true)
  //     const resp = await update_stocks_expire_date(stocking_id, newExpireDate)
  //     resp?.data && newExpireDate && changeExpireDate(newExpireDate)
  //     resp?.data && setUpdatingExpireDate(false)
  //   }
  // }

  useEffect(() => {
    setNewBarcode(barcode)
    setNewPcBarcode(pcBarcode)
    // setNewProductionDate(productionDate)
  }, [])

  const submitNewBarcods = async () => {
    setLoading(true)
    // 1. Editing barcodes requires at least one non empty barcode 
    // (i.e barcode or pc barcode or both of them must be provided)

    // 2. When editing barcodes they should not be same as the old barcodes 
    // (i.e at least one of barcodes must be different)

    if (newBarcode !== barcode || newPcBarcode !== pcBarcode) {
      if (newBarcode !== '' || newPcBarcode !== '') {
        const resp = await update_stock_barcodes(stocking_id, newBarcode, newPcBarcode)
        resp && setLoading(false)
        if (resp?.data.stocking_id === stocking_id) {
          updateBarcodes(newBarcode, newPcBarcode)
          toast.success('بارکود هاتە گوهارتن')
        }else{
          toast.error('سیستەم نەشێت بارکودی گوهریت')
        }
      } else {
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
        variant="light"
        startContent={<FaEdit />}>گوهارتن</Button>

      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">گوهارتنا بارکودا</ModalHeader>
              {/* <Divider /> */}
              <ModalBody className='flex flex-col gap-2'>
                <div>
                  <label className='block pb-1'>بارکود</label>
                  <Input dir='ltr' type="text" className='' radius="sm"
                    style={{ textAlign: 'left' }} value={String(newBarcode)}
                    onChange={(e) => setNewBarcode(() => e.target.value)} />
                </div>
                <div>
                  <label className='block pb-1'>بارکودێ قطعەی</label>
                  {/* item: pc barcode */}
                  <Input dir='ltr' type="text" radius="sm"
                    style={{ textAlign: 'left' }} value={String(newPcBarcode)}
                    onChange={(e) => setNewPcBarcode(() => e.target.value)} />
                </div>
              </ModalBody>
              <ModalFooter>
                {
                  loading ? <Spinner size="sm" color="primary" />
                    : <Button size='sm' color="primary" onClick={submitNewBarcods}>
                      گوهارتن
                    </Button>}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
