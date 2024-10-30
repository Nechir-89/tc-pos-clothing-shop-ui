import { MdAttachMoney } from "react-icons/md";
import { Link } from "react-router-dom";

type Props = {}

export default function Setting({ }: Props) {
  return (
    <main dir='rtl' className="p-8 bg-slate-200 h-lvh">
      <header className="flex justify-between	mb-4 items-center">
        <h3 className='font-bold text-lg'>رێکخستنا پروگرامی</h3>
      </header>
      <section className="p-2 w-6/12 grid grid-cols-2 gap-x-8 gap-y-4">
        <Link to='paymentmethods' className="px-4 py-2 rounded bg-stone-100 flex items-center w-max hover:underline underline-offset-8">
          <span className="text-xl"><MdAttachMoney /></span>
          <span className='text-sky-700'>رێکێن پارەدانێ</span>
        </Link>
      </section>
      {/* <footer>

      </footer> */}
    </main>
  )
}