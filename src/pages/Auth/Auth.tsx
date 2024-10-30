import { useContext, useState } from "react"
import { UserContext, UserContextType } from "../../contexts/UserContext"
import { login } from "../../services/auth_service"
import { useNavigate } from "react-router-dom"
import { Card, CardBody, CardFooter, Image, Button, Spinner } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {}

export function Login({ }: Props) {
  const { updateUser } = useContext(UserContext) as UserContextType
  const navigate = useNavigate()
  const [user, setUser] = useState<{ name: string, passcode: string }>({
    name: '',
    passcode: ''
  })

  const [loading, setLoading] = useState<Boolean>(false)

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await login(user.name, user.passcode)
      if (res?.data) {
        updateUser({
          role: res?.data?.role,
          user_id: res?.data?.user_id,
          user_name: res?.data?.user_name
        })

        if (res?.data?.role === 'admin') {
          navigate('/app/dashboard')
        } else {
          navigate('/app')
        }

      } else {
        setLoading(false)
        console.log('Could not login')
      }
      // console.log(res)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main dir='ltr' style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      rowGap: '4px',
      minHeight: '100vh'
    }}>
      <Image
        isZoomed
        width={120}
        height={120}
        alt="Techcamp Logo"
        src="assets/tc-logo.svg"
      />
      <p style={{ color: '#f3f3fe' }}>Techcamp POS for Single Point of Sale</p>

      <Card className="w-[350px] p-4">
        <CardBody>
          {/* Name */}
          <Input
            autoFocus
            isRequired
            label='Name'
            labelPlacement="outside"
            type="text"
            className='mb-4'
            placeholder='Your name'
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.currentTarget.value })} />

          {/* passcode */}
          <Input
            isRequired
            label="Passcode"
            labelPlacement="outside"
            placeholder='Your passcode'
            value={user.passcode}
            onChange={(e) => setUser({ ...user, passcode: e.currentTarget.value })}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}>
                {
                  isVisible ? (<FaEyeSlash className="text-default-400 pointer-events-none" />)
                    : (<FaEye className="text-default-400 pointer-events-none" />)
                }
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="max-w-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                handleClick()
            }}
          />
        </CardBody>
        <CardFooter>
          {
            loading ?
              <Spinner size="sm" />
              : <Button
                color="primary"
                size="sm"
                onClick={handleClick}>Login</Button>
          }
        </CardFooter>
      </Card>
      {/* <p style={{ color: '#f3f3fe' }}>مارکێتا سەرهلدان</p> */}
    </main>
  )
}