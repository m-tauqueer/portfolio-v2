import { Terminal } from '../components/terminal/Terminal'
import { usePortfolio } from '../hooks/usePortfolio'

export function TerminalPage() {
  const { data, loading, source } = usePortfolio()

  return <Terminal portfolio={data} loading={loading} source={source} />
}
