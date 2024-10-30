import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure
} from "@nextui-org/react";
import { MdDelete } from "react-icons/md";
import { useContext } from "react";
import { InvoiceContext, InvoiceContextType } from "../../contexts/InvoiceContext";

type Props = {
  rowNumber: number
}

export default function DeleteInvoiceItem({ rowNumber }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { deleteInvoiceItem } = useContext(InvoiceContext) as InvoiceContextType
  // const [number, setNumber] = useState(invoiceItem?.number || 0);
  // const [updatedInvoiceItems, setUpdatedInvoiceItems] = useState(invoiceItems)
  // useEffect(() => {
  // setUpdatedInvoiceItems(invoiceItems)
  // setNumber(invoiceItem?.number || 0)
  // }, [invoiceItem])
  // console.log(updatedInvoiceItems)
  return (
    <div className='col-span-3 w-full'>
      <button
        onClick={onOpen}
        className='m-0 text-red-600 py-1 flex justify-center w-8'
      >
        <MdDelete className="text-lg m-0" />
      </button>
      <Modal
        // backdrop="blur"
        size="sm"
        dir="rtl"
        isOpen={isOpen}
        placement='auto'
        onOpenChange={onOpenChange}
        disableAnimation
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">ژێبرن</ModalHeader>
              <ModalBody>
                <p>
                  ئەرێ تو یێ پشراستی تە ڤێت ژێ بچیت؟
                </p>
              </ModalBody>
              <ModalFooter>
                <Button size='sm' color="warning" variant="light" onPress={onClose}>
                  نەخێر
                </Button>
                <Button size='sm' color="danger" onClick={() => {
                  deleteInvoiceItem(rowNumber)
                  onClose()
                }}>
                  بەلێ
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}