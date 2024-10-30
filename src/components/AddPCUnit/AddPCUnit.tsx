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
import { useState } from "react";
import { add_pc_unit } from "../../services/pcs_units_service";


type Props = {
  revalidate: () => void
}

export default function AddPCUnit({ revalidate }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pcUnitName, setPcUnitName] = useState('')

  const addPcUnit = async () => {
    if (pcUnitName.trim() !== '' && pcUnitName.trim().length <= 50) {
      try {
        await add_pc_unit(pcUnitName)
        setPcUnitName('')
        revalidate()
        onOpenChange()
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('pc unit name either null or more than 50 characters')
    }
  }

  return (
    <div>
      <Button onPress={onOpen} variant="light" color="primary">
        یەکەیەکا نی بو پارچەی
      </Button>
      <Modal backdrop="blur" size="xs" dir="rtl" isOpen={isOpen} placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">زێدەکرنا یەکەیەکا نی بو پارچەی</ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  type="text"
                  label="ناڤێ یەکێ"
                  labelPlacement="outside-left"
                  value={pcUnitName}
                  onChange={(e) => setPcUnitName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button size='sm' color="warning" variant="light" onPress={onClose}>
                  گرتن
                </Button>
                <Button size='sm' color="primary" onClick={addPcUnit}>
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