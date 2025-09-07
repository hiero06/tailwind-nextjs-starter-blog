import fs from 'fs'
import path from 'path'
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { slug } from 'github-slugger'

const categoryCounts = {}

allBlogs.forEach((post) => {
  let categories = []

  // 1. Gérer string, tableau ou vide
  if (Array.isArray(post.category)) {
    categories = post.category
  } else if (typeof post.category === 'string' && post.category.trim() !== '') {
    categories = [post.category]
  } else {
    categories = ['undefined']
  }

  // 2. Normaliser avec slug
  categories.forEach((cat) => {
    const cleanCat = cat.trim() === '' ? 'undefined' : slug(cat)
    categoryCounts[cleanCat] = (categoryCounts[cleanCat] || 0) + 1
  })
})

fs.writeFileSync(
  path.join(process.cwd(), 'app/category-data.json'),
  JSON.stringify(categoryCounts, null, 2)
)
console.log('✅ category-data.json generated.')
