import { Button, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PaymentMethod } from "../../../../types/PaymentMethod.types";
import { get_payment_methods } from "../../../../services/payment_methods_service";
import UpdatePaymentMethodModel from "../../../../components/UpdatePaymentMethodModel";
import AddPaymentMethodModel from "../../../../components/AddPaymentMethodModel";

type Props = {}

export default function PaymentMethods({ }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true)
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  useEffect(() => {
    loadMethods()
  }, [])

  const loadMethods = async () => {
    const resp = await get_payment_methods()
    resp && setMethods(resp?.data)
    resp && setLoading(false)
  }
  
  return (
    <main dir='rtl' className='p-6 bg-slate-200 p-6 h-lvh overflow-x-auto'>
      <header className="flex justify-between items-center">
        <h3 className='font-bold text-lg'>رێکێن پارەدانێ</h3>
        <Button
          onClick={() => navigate(-1)}
          color="primary"
          variant="light"
          size='sm'
          endContent={<MdArrowBack style={{ fontSize: '20px' }} />}>
          زڤرێن
        </Button>
      </header>
      <section className="px-6 pt-6">
        {
          !loading ?
            <ol className="list-decimal text-right">
              {
                methods.map((method: PaymentMethod) =>
                  <li key={method.payment_method_id} className={
                    method.def ? `text-blue-800 text-lg	` :
                      `${method.active ? 'text-lg' : 'text-gray-400'}`}>
                    {method.payment_method_name}
                    <UpdatePaymentMethodModel
                      id={method.payment_method_id || 0}
                      name={method.payment_method_name}
                      def={method.def}
                      active={method.active}
                      refreshMethods={loadMethods}
                    />
                  </li>)
              }
            </ol> : <Spinner size="sm" />
        }
      </section>
      <footer className="flex justify-start mt-8">
        <AddPaymentMethodModel refreshPaymentMethods={loadMethods}/>
      </footer>
    </main>
  )
}