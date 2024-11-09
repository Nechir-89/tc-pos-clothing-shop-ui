import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input
} from "@nextui-org/react";
import { useContext, useState } from "react";
import { InvoiceContext, InvoiceContextType } from "../../contexts/InvoiceContext";


type Props = {}

// gifft or cut
export default function Gifft({ }: Props) {
  const { setGifft, totalPriceOfInvoice, invoiceType } = useContext(InvoiceContext) as InvoiceContextType
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [gifftAmount, setGifftAmount] = useState<number>(250)

  return (
    <div className='col-span-3 w-full'>
      <Button onPress={onOpen} radius='none' size='lg' className={`${invoiceType==='sale'? 'bg-forestGreen': 'bg-yellow-700'}  text-white w-full`} >
        {invoiceType==='sale'? 'پێهێلان': 'برین'}
      </Button>
      <Modal size="sm" dir="rtl" isOpen={isOpen} placement='auto' onOpenChange={onOpenChange} disableAnimation>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">دیاری / سماح</ModalHeader>
              <ModalBody>
                <Input dir='ltr' isRequired autoFocus type="number" min={1} radius="sm"
                  size='md' className="w-full" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                  value={String(gifftAmount)}
                  onChange={(e) => setGifftAmount(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                      if (gifftAmount > -1 && gifftAmount <= totalPriceOfInvoice) {
                        setGifft(gifftAmount)
                        onClose()
                        setGifftAmount(250)
                      }
                    }
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button size='sm' color="warning" variant="light" onPress={onClose}>
                  دەرکەتن
                </Button>
                <Button size='sm' color="primary" onClick={() => {
                  if (gifftAmount && gifftAmount <= totalPriceOfInvoice) {
                    setGifft(gifftAmount)
                    onClose()
                    setGifftAmount(250)
                  }
                }}>
                  دیاری
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}