import fs from 'fs'
import path from 'path'
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { slug } from 'github-slugger'

const categoryCounts = {}

allBlogs.forEach((post) => {
  const category = post.category ? slug(post.category) : 'undefined'
  categoryCounts[category] = (categoryCounts[category] || 0) + 1
})

fs.writeFileSync(
  path.join(process.cwd(), 'app/category-data.json'),
  JSON.stringify(categoryCounts, null, 2)
)

console.log('✅ category-data.json generated.')
