
import {
  Modal, ModalContent, ModalHeader, ModalBody, Button,
  useDisclosure,
  Spinner
} from "@nextui-org/react";
// import { add_category } from "../../services/categories_service";
import { useEffect, useState } from "react";
import { get_all_categories_for_non_scaned_items, get_non_scan_items_from_category } from "../../services/non_scan_service";
import { Category } from "../../types/Category.types";
import { StockDocument } from "../../types/Custom.types";
import NonScanItemCard from "../NonScanItemCard";

type Props = {
  // revalidate: () => void
}

export default function NonScanItemsModel({ }: Props) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categories, setCategories] = useState<Category[] | []>([])
  const [catItems, setCatItems] = useState<StockDocument[]>([])
  const [selectedCat, setSelectedCat] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const listCatItems = async (cat_id: number) => {
    setLoading(() => true)
    const resp = await get_non_scan_items_from_category(cat_id)
    if (resp?.data && Array.isArray(resp?.data)) {
      const cat_items = resp.data.filter(item => item[0])?.map(i => i[0])
      setCatItems(() => cat_items)
      setLoading(() => false)
    }
  }

  const listCategories = async () => {
    const resp = await get_all_categories_for_non_scaned_items();
    if (resp?.data && Array.isArray(resp?.data)) {
      setCategories(() => resp?.data)
      listCatItems(resp?.data[0]?.category_id)
      setSelectedCat(() => resp?.data[0]?.category_id)
    }
  }

  useEffect(() => {
    listCategories();
  }, [])

  return (
    <>
      <Button onPress={onOpen} radius='none' size='lg' className='bg-forestGreen text-white w-full' >
        بێ بارکود
      </Button>
      <Modal size="5xl" dir="rtl" isOpen={isOpen} placement='auto' onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">موادێن بێ بارکود</ModalHeader>
              <ModalBody>
                <div dir='ltr' className='grid' style={{ gridTemplateColumns: '82% 18%' }}>
                  {/* left side */}
                  {
                    loading ?
                      <section className='flex justify-center'>
                        <Spinner size="md" />
                      </section> :
                      <section dir='rtl' className="p-2 flex flex-wrap"
                        style={{
                          maxHeight: '480px',
                          overflowY: 'auto'
                        }}>
                        {
                          catItems?.map((item: StockDocument) =>
                            <NonScanItemCard key={item.item_id} item={item} onClose={onClose} />)
                        }
                      </section>
                  }
                  {/* right side */}
                  <section dir='rtl' className="p-2 border-l-2">
                    {
                      categories?.map(cat => <div key={cat.category_id}
                        onClick={() => {
                          listCatItems(cat.category_id)
                          setSelectedCat(cat.category_id)
                        }}
                        className={` py-1 
                        cursor-pointer 
                        hover:bg-gray-200 
                        rounded 
                        px-2 
                        ${cat.category_id === selectedCat ? 'bg-blue-500 text-white' :
                            'bg-none text-black'}`}
                      >
                        {cat.category_name}
                      </div>)
                    }
                  </section>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}