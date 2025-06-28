import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

// ✅ Générer les paramètres statiques
export function generateStaticParams() {
  const categoryCounts = categoryData as Record<string, number>
  return Object.keys(categoryCounts).flatMap((category) => {
    const postCount = categoryCounts[category]
    const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({
      category: encodeURIComponent(category),
      page: (i + 1).toString(),
    }))
  })
}

// ✅ Mise à jour pour Next.js 15 - params est maintenant une Promise
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>
}) {
  // ✅ Attendre la résolution des params
  const { category, page } = await params

  const rawCategory = decodeURIComponent(category)
  const categorySlug = slug(rawCategory)
  const pageNumber = parseInt(page, 10)

  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => slug(post.category ?? 'uncategorized') === categorySlug))
  )

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )

  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  const title = `Category: ${rawCategory}`

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
