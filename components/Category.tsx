import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
}

const Category = ({ text }: Props) => {
  return (
    <Link
      href={`/categories/${slug(text)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
    >
      {text}
    </Link>
  )
}

export default Category


