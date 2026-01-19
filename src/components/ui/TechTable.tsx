interface TechCategory {
  category: string
  items: string[]
}

interface TechTableProps {
  data: TechCategory[]
  className?: string
}

export default function TechTable({ data, className = '' }: TechTableProps) {
  return (
    <table className={`tech-table w-full ${className}`}>
      <tbody>
        {data.map((row) => (
          <tr key={row.category}>
            <td className="whitespace-nowrap align-top">{row.category}</td>
            <td>{row.items.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
