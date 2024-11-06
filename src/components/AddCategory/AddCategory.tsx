import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { add_category } from "../../services/categories_service";
import { useState } from "react";

type Props = {
  revalidate: () => void;
};

export default function AddCategory({ revalidate }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categoryName, setCategoryName] = useState("");

  const addCategory = async () => {
    if (categoryName.trim() !== "" && categoryName.trim().length <= 50) {
      try {
        await add_category(categoryName);
        setCategoryName("");
        revalidate();
        onOpenChange();
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("category name either null or more than 50 characters");
    }
  };

  return (
    <div>
      <Button onPress={onOpen} variant="light" className="text-red-700 font-bold mr-4">
        زێدەکرن
      </Button>
      <Modal
        size="sm"
        dir="rtl"
        isOpen={isOpen}
        placement="auto"
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">
                بەشەکێ نی
              </ModalHeader>
              <ModalBody dir='rtl'>
                <Input
                  size="lg"
                  isRequired
                  type="text"
                  label="ناڤ"
                  labelPlacement="inside"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button size="sm" color="primary" onClick={addCategory}>
                  Save
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
