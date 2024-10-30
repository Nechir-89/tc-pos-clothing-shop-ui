import { useContext, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { UserContext, UserContextType } from '../../contexts/UserContext'
// import TopNavbar from '../../components/TopNavbar'
import './dashboard.css'
import { FaHome } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { Avatar } from '@nextui-org/react';
import { IoMdSettings } from "react-icons/io";

type Props = {}

export default function Dashboard({ }: Props) {
  const { user } = useContext(UserContext) as UserContextType
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [])

  return (
    <main className='dashboard-page'>
      {/* <header dir='ltr'>
        <TopNavbar user={user} />
      </header> */}
      <div className='page-container'>
        <section>
          <Outlet />
        </section>
        {/* sidbar */}
        <div className='sidebar' dir='rtl'>
          <div className='sidebar-item' style={{marginBottom: '1rem'}}>
            <Avatar style={{width: '25px', height: '25px'}} src="assets/avatar-15.png" />
            <p className="text-lg	text-slate-200	 pl-1 text-inherit capitalize">
              {user?.user_name}
            </p>
          </div>
          <Link to='' className='sidebar-item'>
            <span><FaHome /></span>
            سەرەکی
          </Link>
          <Link to='store' className='sidebar-item'>
            <span><MdOutlineShoppingCart /></span>
            مواد (ستوك)
          </Link>
          <Link to='/app' className='sidebar-item'>
            <span><FaStore /></span>
            فروتن
          </Link>
          <Link to='setting' className='sidebar-item'>
            <span><IoMdSettings /></span>
            رێکخستن
          </Link>
          <Link to='/' style={{ marginTop: 'auto' }} className='sidebar-item'>
            <span><IoIosLogOut /></span>
            دەرکەفتن
          </Link>
        </div>
      </div>
    </main>
  )
}