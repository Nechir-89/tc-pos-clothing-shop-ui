import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input,
  Spinner,
  Checkbox
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
// import { update_stock_barcodes } from "../../services/stocks_service";
import toast, { Toaster } from 'react-hot-toast';
import { change_payment_method_name, default_payment_method, toggle_payment_method } from "../../services/payment_methods_service";

type Props = {
  id: number,
  name: string,
  active: boolean,
  def: boolean,
  refreshMethods: () => void
}

export default function UpdatePaymentMethodModel({
  id,
  name,
  active,
  def,
  refreshMethods
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [methodName, setMethodName] = useState<string>(name)
  const [_active, setActive] = useState<boolean>(active)
  const [_def, setDefault] = useState<boolean>(def)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setMethodName(name)
    setActive(active)
    setDefault(def)
  }, [])


  const changeName = async () => {
    if (methodName.trim().length > 0 && methodName !== name) {
      const resp = await change_payment_method_name(id, methodName)
      if (resp?.data.payment_method_id === id) {
        toast.success('ناڤ هاتە گوهارتن')
        refreshMethods()
      } else {
        toast.error('سیستەم نەشیا ناڤی بگوهریت')
      }
    }
  }

  const editActiveState = async () => {
    if (active !== _active) {
      const resp = await toggle_payment_method(id, _active)
      if (resp?.data.payment_method_id === id) {
        toast.success('حالەت هاتە گوهارتن')
        refreshMethods()
      } else {
        toast.error('سیستەم نەشیا حالەتی بگوهریت')
      }
    }
  }

  const editDefaultState = async () => {
    if (_active && !def && _def) {
      const resp = await default_payment_method(id)
      if (resp?.data.payment_method_id === id) {
        toast.success('ئەڤ رێك هاتە هەلبژارتن وەك رێکا سەرەکی بو پارەدانێ')
        refreshMethods()
      } else {
        toast.error('سیستەم نەشیا بکەتە رێکا سەرەکی')
      }
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  const editPaymentMethod = () => {
    setLoading(true);
    changeName()
    editActiveState()
    editDefaultState()
  }

  return (
    <>
      <Toaster reverseOrder={true} />
      <Button
        onPress={onOpen}
        size='sm'
        radius="sm"
        variant="light"
        isIconOnly
        color={def ? `primary` : `default`}
      ><FaEdit /></Button>

      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">گوهارتنا رێکا پارەدانێ</ModalHeader>
              {/* <Divider /> */}
              <ModalBody className='flex flex-col gap-2'>
                {/* <div className='grid grid-cols-2 gap-x-4'> */}
                <div>
                  <label className='flex items-center gap-x-1 pb-1'>ناڤ</label>
                  <Input
                    autoFocus
                    radius="sm"
                    size="sm"
                    value={methodName}
                    onChange={(e) => setMethodName(e.target.value)} />
                </div>
                <div className='mt-4'>
                  <Checkbox
                    color="primary"
                    radius="md"
                    isSelected={_active}
                    isDisabled={def}
                    onChange={() => {
                        _active && setDefault(false)
                        setActive(!_active)
                    }}>کارکرن</Checkbox>
                  <Checkbox
                    color="secondary"
                    radius="md"
                    isSelected={_def}
                    isDisabled={def}
                    onChange={() => {
                      if (_def) {
                        setDefault(!_def)
                      } else {
                        setDefault(!_def)
                        setActive(true)
                      }
                    }}>رێکا سەرەکی</Checkbox>
                </div>
                {/* </div> */}
                <ol className='border-t-2 pt-4 mt-4 col-span-4 text-sm'>
                  <strong>پزاننین سەرەکی</strong>
                  <li>- ئەگەر ریکا پارەدانێ یا سەرەکی بیت سیستەم نەشێت روەستینیت ژ کارکرنێ</li>
                </ol>
              </ModalBody>
              <ModalFooter>
                {
                  loading ? <Spinner size="sm" color="primary" />
                    : <Button size='sm' color="primary" onClick={editPaymentMethod}>
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