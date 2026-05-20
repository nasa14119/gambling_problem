const TEXT = String.raw`
   ____       _               _____              
  |  _ \ ___ | | _ ___ _ __  |  ___|_ _  ___  ___ 
  | |_) / _ \| |/ / _ \ '__| | |_ / _  \/   / __/
  |  __/ (_) |   <  __/ |    |  _| (_| | (_|  __/
  |_|   \___/|_|\_\___|_|    |_|  \__,_|\___\___|
`

export function Title() {
  return <pre className="text-blue-400 font-mono">{TEXT}</pre>
}
