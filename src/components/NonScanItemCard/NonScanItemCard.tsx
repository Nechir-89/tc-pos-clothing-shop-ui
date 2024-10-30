import { useContext, useState } from 'react'
import {
  Input, Card, CardBody,
  CardHeader, Checkbox, Button
} from '@nextui-org/react'
import { FaPlus } from "react-icons/fa6";
import { StockDocument } from '../../types/Custom.types'
import formatNumberWithComma from '../../helpers/formatNumberWithComma'
import { InvoiceContext, InvoiceContextType } from '../../contexts/InvoiceContext';
type Props = {
  item: StockDocument,
  onClose: () => void
}

export default function NonScanItemCard({ item, onClose }: Props) {
  const [quantity, setQuantity] = useState<number>(1)
  const [isUnit, setIsUnit] = useState<boolean>(false)
  const { addNonScanInvoiceItem } = useContext(InvoiceContext) as InvoiceContextType

  return (
    <Card shadow="sm" key={item.item_id}
      className="m-2 "
      onPress={() => console.log("item pressed")}>
      <CardHeader className='flex justify-between bg-gray-700 text-white mb-2 rounded'>
        <b>{item.item_name}</b>
        <strong className="text-white">{quantity
          && isUnit ? formatNumberWithComma(quantity * item.unit_price)
          : formatNumberWithComma(quantity * item.pc_price)}</strong>

      </CardHeader>
      <CardBody className="overflow-visible p-0">
        <Checkbox color='secondary' isSelected={!isUnit} radius="sm" onClick={() => setIsUnit(prev => !prev)}>
          {item.pc_unit_name} ({formatNumberWithComma(item.pc_price)})
        </Checkbox>
        <Checkbox color='secondary' isSelected={isUnit} radius="sm" onClick={() => setIsUnit(prev => !prev)}>
          {item.unit_name} ({formatNumberWithComma(item.unit_price)})
        </Checkbox>

        <div className="flex justify-between	items-center mt-2	">
          <Input size='md' dir='ltr' isRequired type="number"
            className='w-36 m-2 mb-4'
            labelPlacement="inside"
            min={0}
            max={isUnit ? item.total_available_units :
              item.total_available_pcs}
            radius="sm"
            style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold' }}
            value={String(quantity)}
            onChange={(e) => setQuantity(() => Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // findItemByBarcode()
                if (quantity) {
                  addNonScanInvoiceItem(item, isUnit, quantity);
                  onClose()
                }
              }
            }}/>
          <div className='px-4 pt-0'>
            <Button size='sm'  className='bg-gray-700 text-white'
              isIconOnly 
              // className='text-white p-0'
              // style={{ padding: '0px' }}
              onClick={() => {
                addNonScanInvoiceItem(item, isUnit, quantity)
                onClose()
              }}
            >
              <FaPlus />
            </Button>
          </div>
        </div>
      </CardBody>
      {/* <CardFooter className="text-small justify-between">
        
        <p className="text-default-500">{item.pc_price}</p>
      </CardFooter> */}
    </Card>
  )
}