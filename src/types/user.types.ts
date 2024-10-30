export type User = {
  user_id: number,
  user_name: string,
  role: 'admin' | 'cashier',
  passcode: string
}

export type AppUser = Omit<User, 'passcode'>