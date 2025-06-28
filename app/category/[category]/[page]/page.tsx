import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
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

// ✅ Utilisation directe du type inline (alternative propre à `interface Props`)
export default async function CategoryPage({
  params,
}: {
  params: { category: string; page: string }
}) {
  const rawCategory = decodeURIComponent(params.category)
  const categorySlug = slug(rawCategory)
  const pageNumber = parseInt(params.page, 10)

  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) => slug(post.category ?? 'uncategorized') === categorySlug
      )
    )
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
