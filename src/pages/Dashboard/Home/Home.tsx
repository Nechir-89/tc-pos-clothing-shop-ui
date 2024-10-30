import { useEffect, useState } from 'react'
import { total_profit, total_profit_of_day, total_profit_of_last_month, total_profit_of_last_week } from '../../../services/invoice_service'
import formatNumberWithComma from '../../../helpers/formatNumberWithComma'

type Props = {}

export default function Home({ }: Props) {
  const [state, setState] = useState({
    total_cost: 0,
    total_price: 0,
    total_gifted: 0,
    count: 0
  })

  const [dayProfit, setDayProfit] = useState({
    total_cost: 0,
    total_price: 0,
    total_gifted: 0,
    count: 0
  })

  const [weekProfit, setWeekProfit] = useState({
    total_cost: 0,
    total_price: 0,
    total_gifted: 0,
    count: 0
  })

  const [monthProfit, setMonthProfit] = useState({
    total_cost: 0,
    total_price: 0,
    total_gifted: 0,
    count: 0
  })

  const getProfit = async () => {
    const resp = await total_profit()
    if (resp?.data) {
      setState({
        total_cost: resp?.data?.total_cost,
        total_price: resp?.data?.total_price,
        total_gifted: resp?.data?.total_gifted,
        count: resp?.data?.count
      })
    }
  }

  const getDayProfit = async () => {
    const resp = await total_profit_of_day()
    if (resp?.data) {
      setDayProfit({
        total_cost: resp?.data?.total_cost,
        total_price: resp?.data?.total_price,
        total_gifted: resp?.data?.total_gifted,
        count: resp?.data?.count
      })
    }
  }

  const getWeekProfit = async () => {
    const resp = await total_profit_of_last_week()
    if (resp?.data) {
      setWeekProfit({
        total_cost: resp?.data?.total_cost,
        total_price: resp?.data?.total_price,
        total_gifted: resp?.data?.total_gifted,
        count: resp?.data?.count
      })
    }
  }

  const getMonthProfit = async () => {
    const resp = await total_profit_of_last_month()
    if (resp?.data) {
      setMonthProfit({
        total_cost: resp?.data?.total_cost,
        total_price: resp?.data?.total_price,
        total_gifted: resp?.data?.total_gifted,
        count: resp?.data?.count
      })
    }
  }

  useEffect(() => {
    getProfit()
    getDayProfit()
    getWeekProfit()
    getMonthProfit()
  }, [])

  return (
    <main dir='rtl'>
      <div className='p-4 grid grid-cols-2 justify-items-end w-fit'>
        <Card
          title={'ئەڤرو'}
          total_cost={dayProfit.total_cost}
          total_price={dayProfit.total_price}
          total_gifted={dayProfit.total_gifted}
          count={dayProfit.count} />

        <Card
          title={'هەفتی'}
          total_cost={weekProfit.total_cost}
          total_price={weekProfit.total_price}
          total_gifted={weekProfit.total_gifted}
          count={weekProfit.count} />

        <Card
          title={'هەیڤ'}
          total_cost={monthProfit.total_cost}
          total_price={monthProfit.total_price}
          total_gifted={monthProfit.total_gifted}
          count={monthProfit.count} />

        <Card
          title={'دەستپێکێ تا نوکە'}
          total_cost={state.total_cost}
          total_price={state.total_price}
          total_gifted={state.total_gifted}
          count={state.count} />
      </div>
    </main>
  )
}

type CardProps = {
  title: string,
  total_cost: number,
  total_price: number,
  total_gifted: number,
  count: number
}

function Card({ title, total_cost, total_price, count, total_gifted }: CardProps) {
  return (
    <article className='bg-white rounded-md	 shadow-md m-6 flex flex-col items-start w-60'>
      <h3 className="text-lg font-bold bg-black text-white w-full p-2 rounded-md text-right">{title}</h3>
      <div className='text-right py-3 '>
        <p className="px-2 py-1 text-base">ژمارا فاتوران: <strong>{formatNumberWithComma(count)}</strong></p>
        <p className="px-2 py-1 text-base">سەرجەمێ فروتنێ: <strong>{formatNumberWithComma(total_price)}</strong></p>
        <p className="px-2 py-1 text-base">سەرجەمێ کرینێ: <strong>{formatNumberWithComma(total_cost)}</strong></p>
        <p className="px-2 py-1 text-base">سماح/دیاری: <strong>{formatNumberWithComma(total_gifted)}</strong></p>
        <p className="px-2 py-1 text-base">فایدە: <strong>{formatNumberWithComma(total_price - total_cost)}</strong></p>
      </div>
    </article>
  );
}
