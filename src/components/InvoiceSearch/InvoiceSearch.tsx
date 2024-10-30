import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input
} from "@nextui-org/react";
import { useContext, useState } from "react";
import { InvoiceContext, InvoiceContextType } from "../../contexts/InvoiceContext";


type Props = {
}

export default function InvoiceSearch({ }: Props) {
  const { searchInvoice } = useContext(InvoiceContext) as InvoiceContextType
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [invoiceId, setInvoiceId] = useState<number>(0)

  return (
    <>
      <Button onPress={onOpen} radius='none' size='lg' className='bg-forestGreen text-white w-full' >
        لێگەرینا فاتورێ
      </Button>
      <Modal size="sm" dir="rtl" isOpen={isOpen} placement='auto' onOpenChange={onOpenChange} disableAnimation>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">لێگەرینا فاتورێ</ModalHeader>
              <ModalBody>
                <Input dir='ltr' autoFocus type="number"
                  min={1} radius="sm"
                  size='md' className="w-full" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                  value={String(invoiceId)} onChange={(e) => setInvoiceId(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key == 'Enter' && invoiceId) {
                      searchInvoice(invoiceId)
                      onClose()
                    }
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button size='sm' color="warning" variant="light" onPress={onClose}>
                  دەرکەتن
                </Button>
                <Button size='sm' color="primary" onClick={() => {
                  if (invoiceId) {
                    searchInvoice(invoiceId)
                    onClose()
                  }
                }}>
                  لێگەریان
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}