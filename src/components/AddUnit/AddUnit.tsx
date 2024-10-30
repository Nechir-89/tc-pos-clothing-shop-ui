import {
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, useDisclosure, Input
} from "@nextui-org/react";
import { useState } from "react";
import { add_unit } from "../../services/units_service";

type Props = {
  revalidate: () => void
}

export default function AddUnit({ revalidate }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [unitName, setUnitName] = useState('')

  const addUnit = async () => {
    if (unitName.trim() !== '' && unitName.trim().length <= 50) {
      try {
        await add_unit(unitName)
        setUnitName('')
        revalidate()
        onOpenChange()
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('unit name either null or more than 50 characters')
    }
  }

  return (
    <div>
      <Button onPress={onOpen} variant="light" color="primary">
        یەکەیەکا نی
      </Button>
      <Modal backdrop="blur" size="xs" dir="rtl" isOpen={isOpen} placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">زێدەکرنا یەکەیەکا نی</ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  type="text"
                  label="ناڤێ یەکێ"
                  labelPlacement="outside-left"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button size='sm' color="warning" variant="light" onPress={onClose}>
                  گرتن
                </Button>
                <Button size='sm' color="primary" onClick={addUnit}>
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