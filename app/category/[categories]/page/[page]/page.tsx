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
      category: encodeURI(category),
      page: (i + 1).toString(),
    }))
  })
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string; page: string }>
}) {
  const params = await props.params
  const category = decodeURI(params.category)
  const title = category[0].toUpperCase() + category.split(' ').join('-').slice(1)
  const pageNumber = parseInt(params.page)

  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(category))
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
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
