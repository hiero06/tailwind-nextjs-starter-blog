import fs from 'fs'
import path from 'path'
import { allBlogs } from 'contentlayer/generated'
import { slug } from 'github-slugger'

const tagCounts: Record<string, number> = {}

allBlogs.forEach((post) => {
  post.tags?.forEach((tag) => {
    const tagSlug = slug(tag)
    if (tagSlug in tagCounts) {
      tagCounts[tagSlug]++
    } else {
      tagCounts[tagSlug] = 1
    }
  })
})

fs.writeFileSync(
  path.join(process.cwd(), 'app/tag-data.json'),
  JSON.stringify(tagCounts, null, 2)
)

console.log('✅ tag-data.json generated.')
