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
import { useContext, useState } from "react";
import { PiPlusMinusBold } from "react-icons/pi";
import {
  InvoiceContext,
  InvoiceContextType,
} from "../../contexts/InvoiceContext";

type Props = {
  itemNumber: number;
  variant: "icon" | "button";
  availableAmount?: number;
  validQuantityToReturn?: number;
  invoiceType?: "sale" | "return";
};

export default function ChangeAmount({
  itemNumber,
  variant,
  availableAmount,
  validQuantityToReturn,
  invoiceType,
}: Props) {
  const { changeAmount } = useContext(InvoiceContext) as InvoiceContextType;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [amount, setAmount] = useState<number>(1);

  return (
    <div className="col-span-3 w-full">
      {variant === "button" ? (
        <Button
          isDisabled
          onPress={onOpen}
          radius="none"
          size="lg"
          className="bg-forestGreen text-white w-full"
        >
          عدد
        </Button>
      ) : (
        <button
          onClick={onOpen}
          className="m-0 text-forestGreen py-1 flex justify-center w-8"
        >
          <PiPlusMinusBold className="text-lg m-0" />
        </button>
      )}
      <Modal
        size="sm"
        dir="rtl"
        isOpen={isOpen}
        placement="auto"
        onOpenChange={onOpenChange}
        disableAnimation
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">
                گوهارتنا عددی
              </ModalHeader>
              <ModalBody>
                <Input
                  dir="ltr"
                  isRequired
                  autoFocus
                  type="number"
                  min={1}
                  radius="sm"
                  max={
                    invoiceType === "sale"
                      ? availableAmount
                      : validQuantityToReturn
                  }
                  size="md"
                  className="w-full"
                  style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                  value={String(amount)}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      if (amount) {
                        changeAmount(amount, itemNumber);
                        onClose();
                        setAmount(1);
                      }
                    }
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  color="warning"
                  variant="light"
                  onPress={onClose}
                >
                  دەرکەتن
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => {
                    if (amount) {
                      changeAmount(amount, itemNumber);
                      onClose();
                      setAmount(1);
                    }
                  }}
                >
                  گوهارتن
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
