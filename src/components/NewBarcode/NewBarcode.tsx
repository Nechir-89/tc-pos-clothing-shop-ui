import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from "@nextui-org/react";

type Props = {}

export default function NewBarcode({ }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button onPress={onOpen} variant="light" color="primary">
        بارکودەکێ نی
      </Button>
      <Modal size="xs" dir="rtl" isOpen={isOpen} placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8"> بارکودەکێ نی</ModalHeader>
              <ModalBody>
                <Input
                  dir='ltr'
                  isRequired
                  type="number"
                  label="بارکود"
                  labelPlacement="inside"
                />
                <Input
                  dir='ltr'
                  isRequired
                  type="number"
                  label="بارکودێ پارچەی"
                  labelPlacement="inside"
                />
              </ModalBody>
              <ModalFooter>
                <Button size='sm' color="warning" variant="light" onPress={onClose}>
                  گرتن
                </Button>
                <Button size='sm' color="primary" onPress={onClose}>
                  خەزنکرن
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}