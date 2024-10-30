import {
  Modal, ModalContent, ModalHeader, ModalBody,
  Button, useDisclosure, Input,
  Spinner
} from "@nextui-org/react";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  update_stocks_expire_date,
  update_stocks_state_expire
} from "../../services/stocks_service";
import { FcExpired } from "react-icons/fc";

type Props = {
  stocking_id: number,
  expireDate: Date | null,
  // productionDate: Date | null,
  expPcs: number,
  expUnits: number,
  changeExpireDate: (newExpireDate: Date) => void,
  changeCurrentQuantity: (currentUnits: number, currentPcs: number) => void,
  currentUnits: number,
  currentPcs: number,
  itemId: number,
  stateId: number
}

export default function UpdateStockExpireDataModel({
  stocking_id,
  expireDate,
  // productionDate,
  expPcs,
  expUnits,
  changeExpireDate,
  changeCurrentQuantity,
  currentUnits,
  currentPcs,
  itemId,
  stateId }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newExpireDate, setNewExpireDate] = useState<Date | null>(expireDate)
  // const [newProductionDate, setNewProductionDate] = useState<Date | null>(productionDate)
  // const [expiredPcs, setExpiredPcs] = useState<number>(expPcs)
  // const [expiredUnits, setExpiredUnits] = useState<number>(expUnits)

  const [updatingExpireDate, setUpdatingExpireDate] = useState<Boolean>(false)
  const [loading, setLoading] = useState<Boolean>(false)

  const updateExpireDate = async () => {
    if (newExpireDate !== expireDate) {
      setUpdatingExpireDate(true)
      const resp = await update_stocks_expire_date(stocking_id, newExpireDate)
      resp?.data && newExpireDate && changeExpireDate(newExpireDate)
      resp?.data && setUpdatingExpireDate(false)
      resp?.data && toast.success('مێژویا سەرڤەچونێ هاتەگوهارتن')
    }
  }

  useEffect(() => {
    setNewExpireDate(expireDate)
    // setNewProductionDate(productionDate)
  }, [])

  const setExpire = async () => {
    setLoading(true)
    // to expire stock we must make sure the expire date has met
    const expDate: Date = newExpireDate ? new Date(newExpireDate) : new Date()
    expDate.setDate(expDate.getDate() + 1)

    if (expDate < new Date()) {
      if (currentUnits > 0 || currentPcs > 0) {
        const res = await update_stocks_state_expire(itemId, stateId, currentUnits, currentPcs)
        res && setLoading(false)
        res && changeCurrentQuantity(currentUnits, currentPcs)
        res && toast.success('موادێ مای هاتە اکسپایرکرن')
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

      <Modal size="md" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">سەرڤەچون</ModalHeader>
              {/* <Divider /> */}
              <ModalBody className='grid grid-cols-4 gap-x-2 gap-y-4 pb-6'>
                {/* expire date */}
                <div className="flex flex-col col-span-3">
                  <label className="text-sm pb-2 text-slate-400">مێژویا سەرڤەچونێ</label>
                  <Input type="date" radius="sm" size="sm"
                    value={newExpireDate ? (new Date(newExpireDate)).toISOString().slice(0, 10) : ''}
                    // @ts-ignore
                    onChange={(e) => setNewExpireDate(new Date(e.target.value))}
                  />
                </div>
                {/* expire date update btn */}
                <div className="self-end">
                  {
                    updatingExpireDate ? <Spinner size="sm" color="secondary" />
                      : <Button size='sm' color="secondary"
                        className='w-full'
                        startContent={<FaEdit />}
                        onClick={updateExpireDate}>
                        گوهارتن
                      </Button>
                  }
                </div>
                {/* production date */}
                {/* <div className="flex flex-col col-span-3">
                  <label className="text-sm pb-2">مێژویا بەرهەمهێنانێ</label>
                  <Input color='danger' type="date" radius="sm" size="sm"
                    value={newProductionDate ? (new Date(newProductionDate)).toISOString().slice(0, 10) : ''}
                    // @ts-ignore
                    onChange={(e) => setNewProductionDate(new Date(e.target.value))}
                  />
                </div> */}
                {/* production date update btn */}
                {/* <div className="self-end">
                  <Button size='sm' color="secondary" isIconOnly>
                    <FaEdit />
                  </Button>
                </div> */}
                {/* expired quantity */}
                <div className='col-span-3 grid grid-cols-2 gap-x-2'>
                  <div className="self-end">
                    <label className='text-sm text-slate-400'>قطعێن سەرڤەجوی</label>
                    <span className=' block text-sm font-semibold	'>{expPcs}</span>
                    {/* <Input dir='ltr' type="number" isDisabled
                      min={0} radius="sm" size='sm'
                      style={{ textAlign: 'left' }}
                      value={String(expPcs)}
                    value={String(expiredPcs)}
                    onChange={(e) => setExpiredPcs(() => Number(e.target.value))}
                    /> */}
                  </div>
                  <div className="self-end">
                    <label className='text-sm text-slate-400'>وحدێن سەرڤەجوی</label>
                    <span className=' block text-sm font-semibold	'>{expUnits}</span>
                    {/* <Input dir='ltr' type="number" isDisabled
                      min={0} radius="sm" size='sm'
                      style={{ textAlign: 'left' }}
                      value={String(expUnits)}
                      value={String(expiredUnits)}
                      onChange={(e) => setExpiredUnits(() => Number(e.target.value))}
                    /> */}
                  </div>
                </div>
                {/* expired quantity btn */}
                <div className="self-end">
                  {
                    loading ? <Spinner size="sm" color="secondary" />
                      : <Button color="danger" variant="bordered"
                        size='sm' startContent={<FcExpired className="text-xl" />}
                        onClick={setExpire}>
                        اکسپایر
                      </Button>
                  }
                </div>
                <ol className='border-t-2 pt-4 col-span-4 text-sm'>
                  <strong>پزاننین سەرەکی</strong>
                  <li>- بو اکسپایرکرنا موادی د ڤێت تاریخا اکسپایرێ هەبیت بو موادی</li>
                  <li>- دەمێ مواد دهێتە اکسپایرکرن هەمی مواد مای پێکڤە دێ هێتە اکسپایرکرن</li>
                  <li>- گەلەك یا گرنگە تاریخا کومپیوتری یا درست بیت</li>
                </ol>
              </ModalBody>
              {/* <ModalFooter>
                <Button size='sm' color="primary" variant="light" onPress={onClose}>
                  گرتن
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}