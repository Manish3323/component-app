import { useState, useCallback, useEffect } from 'react'

export type QueryResult<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

export const useQuery = <T>(queryFn: () => Promise<T>): QueryResult<T> => {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const run = useCallback(queryFn, [queryFn])
  useEffect(() => {
    run()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [run])

  return { data, loading, error }
}
