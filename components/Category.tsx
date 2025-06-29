import Link from 'next/link'
import { slug } from 'github-slugger'

export default function Category({ category }) {
  if (!category || typeof category !== 'string') return null
  return (
    <Link
      href={`/category/${slug(category)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium uppercase"
      aria-label={`View posts in category ${category}`}
    >
      {category}
    </Link>
  )
}