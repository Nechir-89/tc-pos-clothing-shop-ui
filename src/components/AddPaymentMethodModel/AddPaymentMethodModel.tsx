import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input,
  Spinner,
  Checkbox
} from "@nextui-org/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
// import { update_stock_barcodes } from "../../services/stocks_service";
import toast, { Toaster } from 'react-hot-toast';
import { add_payment_method, default_payment_method } from "../../services/payment_methods_service";

type Props = {
  refreshPaymentMethods: () => void
}

export default function AddPaymentMethodModel({ refreshPaymentMethods }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [methodName, setMethodName] = useState<string>('')
  const [_active, setActive] = useState<boolean>(true)
  const [_def, setDefault] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const submitNewMethod = async () => {
    setLoading(true)
    if (methodName.trim().length > 0) {
      const resp = await add_payment_method(methodName, _def, _active)
      if (resp?.data.payment_method_id > 0) {
        toast.success('ریکەکا نی هاتە زێدەکرن بو پارەدانێ')
        if (_def && _active) {
          const res = await default_payment_method(resp?.data.payment_method_id)
          if (res?.data.payment_method_id === resp?.data.payment_method_id) {
            toast.success('رێکا نی بو رێکا سەرەکی هاتە هەلبژارتن')
          } else {
            toast.error('سیستەم نەشیا رێکا نی بکەتە رێکا سەرەکی')
          }
        }
        refreshPaymentMethods()
        setLoading(false)
      } else {
        toast.error('سیستەم نەشیا زێدەبکەت')
        setLoading(false)
      }
    }else{
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster reverseOrder={true} />
      <Button
        onPress={onOpen}
        size='sm'
        radius="sm"
        color='primary'
        variant="bordered"
        endContent={<FaPlus />}
      >زێدەکرن</Button>

      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">زێدەکرنا رێکا پارەدانێ</ModalHeader>
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
                    onChange={() => {
                      if (_def) {
                        // toast.error('سیستەم نەشێت گوهریت ژبەرکو ئەڤە رێکە یا سەرەکیە بو وەرگرتنا پاران')
                        setDefault(!_def)
                      }
                      setActive(!_active)

                    }}>کارکرن</Checkbox>

                  <Checkbox
                    color="secondary"
                    radius="md"
                    isDisabled={!_active}
                    isSelected={_active && _def}
                    onChange={() => {
                      setDefault(!_def)
                    }}>رێکا سەرەکیە</Checkbox>
                </div>
              </ModalBody>
              <ModalFooter>
                {
                  loading ? <Spinner size="sm" color="primary" />
                    : <Button size='sm' color="primary" onClick={submitNewMethod}>
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