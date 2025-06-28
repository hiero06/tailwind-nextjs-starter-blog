// app/categories/[categorySlug]/page.tsx
import { allBlogs } from 'contentlayer/generated'
import { slug } from 'github-slugger'
import ListLayout from '@/layouts/ListLayoutWithTags' // Or a more generic ListLayout
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5 // Or adjust as needed

export async function generateStaticParams() {
  // Get all unique categories to generate static paths
  const categories = new Set(allBlogs.map((post) => post.category).filter(Boolean)) // Filter out undefined/null

  // For each category, determine total pages needed for pagination
  const categoryPaths = Array.from(categories).flatMap((category) => {
    const categorySlug = slug(category as string);
    const postsInCategory = allBlogs.filter(
      (post) => post.category && slug(post.category) === categorySlug
    );
    const totalPages = Math.ceil(postsInCategory.length / POSTS_PER_PAGE);

    return Array.from({ length: totalPages }, (_, i) => ({
      categorySlug: categorySlug,
      page: (i + 1).toString(),
    }));
  });

  return categoryPaths;
}

export default async function CategoryPage({ params }: { params: { categorySlug: string; page: string } }) {
  const decodedCategory = decodeURI(params.categorySlug)
  const pageNumber = parseInt(params.page)

  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.category && slug(post.category) === decodedCategory))
  )

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
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

  const title = `Catégorie: ${decodedCategory.replace(/-/g, ' ').toUpperCase()}` // Format title nicely

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}