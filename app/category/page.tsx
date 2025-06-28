import Link from '@/components/Link'
import Tag from '@/components/Tag' // Remplace par `Category` si tu préfères créer un composant dédié
import { slug } from 'github-slugger'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Categories', description: 'Browse blog categories' })

export default async function Page() {
  const categoryCounts = categoryData as Record<string, number>
  const categoryKeys = Object.keys(categoryCounts)
  const sortedCategories = categoryKeys.sort((a, b) => categoryCounts[b] - categoryCounts[a])

  return (
    <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
      <div className="space-x-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
          Categories
        </h1>
      </div>
      <div className="flex max-w-lg flex-wrap">
        {categoryKeys.length === 0 && 'No categories found.'}
        {sortedCategories.map((category) => {
          return (
            <div key={category} className="mt-2 mr-5 mb-2">
              <Tag text={category} />
              <Link
                href={`/categories/${slug(category)}`}
                className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                aria-label={`View posts categorized as ${category}`}
              >
                {` (${categoryCounts[category]})`}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
