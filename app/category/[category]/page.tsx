import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const rawCategory = decodeURIComponent(params.category)
  return genPageMetadata({
    title: rawCategory,
    description: `${siteMetadata.title} ${rawCategory} categorized content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/categories/${rawCategory}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const categoryCounts = categoryData as Record<string, number>
  return Object.keys(categoryCounts).map((category) => ({
    category: encodeURI(category),
  }))
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const rawCategory = decodeURIComponent(params.category)
  const categorySlug = slug(rawCategory)

  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter((post) => slug(post.category ?? 'uncategorized') === categorySlug)
    )
  )

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)

  const pagination = {
    currentPage: 1,
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
