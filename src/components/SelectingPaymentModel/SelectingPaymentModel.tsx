import {
  Modal, ModalContent, ModalHeader, ModalBody,
  Button, useDisclosure,
  Checkbox
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { get_active_payment_methods } from "../../services/payment_methods_service";
import { PaymentMethod } from "../../types/PaymentMethod.types";

type Props = {
  setSelectedPaymentMethod: (id: number) => void
}

export default function SelectingPaymentMethodModel({ setSelectedPaymentMethod }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [activeMethods, setActiveMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const loadActivePaymentMethods = async () => {
    const resp = await get_active_payment_methods()
    resp?.data && setActiveMethods(resp.data)
    resp?.data && setSelectedMethod(resp.data.find((m: PaymentMethod) => m.def))
  }

  useEffect(() => {
    loadActivePaymentMethods()
  }, [])

  return (
    <div className='col-span-3 w-full'>
      <Button
        onPress={onOpen}
        size='lg'
        radius="none"
        className='bg-sky-700 text-white w-full'
      >{selectedMethod?.payment_method_name}</Button>
      <Modal size="sm" dir="rtl" isOpen={isOpen}
        placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">هەلبژارتنا رێکا پارەدانێ</ModalHeader>
              <ModalBody className='flex flex-col gap-2'>
                <div className='mt-4'>
                  {
                    activeMethods.length > 0 && activeMethods.map((method: PaymentMethod) =>
                      <Checkbox
                        key={method.payment_method_id || 0}
                        color="secondary"
                        isSelected={selectedMethod?.payment_method_id === method.payment_method_id}
                        onChange={() => {
                          setSelectedMethod(method)
                          setTimeout(() => onClose(), 800)
                          setSelectedPaymentMethod(method.payment_method_id || 1)
                        }}
                        radius="full">
                        {method.payment_method_name}
                      </Checkbox>
                    )
                  }

                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}