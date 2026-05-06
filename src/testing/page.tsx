import React from 'react'
import {prisma} from '@/lib/prisma';    

function page() {
 console.log("Testing Prisma Connection...", prisma);
  return (
    <div>
      <h2>hello</h2>
    </div>
  )
}

export default page
