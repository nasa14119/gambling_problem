import { Empty } from '#/components/Leaderboard/Empty'
import { SERVER_PATH } from '#/env'
import { useEffect, useState } from 'react'

type User = {
  userUuid: string
  username: string
  password: string
}
export function UsersView() {
  const [data, setData] = useState<User[] | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(SERVER_PATH + '/admin/users', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const parse: User[] = await res.json()
      setData(parse)
    }
    fetchData()
  }, [])
  if (!data)
    return (
      <div className="size-full p-5">
        <Empty />
      </div>
    )
  return (
    <div className="grid grid-cols-3 items-start auto-rows-min size-full px-5 gap-y-2 gap-x-10 max-h-full overflow-y-scroll">
      {data.map((v) => (
        <div key={v.userUuid} className="w-full">
          <span className="flex gap-x-2 justify-between items-end">
            <span className="min-w-20">{v.username}</span>
            <span className="text-sm">uuid: {v.userUuid}</span>
          </span>
          <span className="text-[8px] flex flex-col ">
            <span>password:</span>
            <span>{v.password}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
