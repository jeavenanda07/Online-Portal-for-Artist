import React from 'react'
import ShopCard from '@/app/components/profile/shop/ShopCard'
import ShopHeader from '@/app/components/profile/shop/ShopHeader'
import Shoplist from '@/app/components/ui/Shoplist'

const page = () => {
  return (
    <div>
        <ShopHeader />
        
        <div className='w-full max-w-[1680px] mx-auto'>
          <h3>Browse featured shop</h3>
          <p>Browse trending creations</p>
          <Shoplist />
        </div>

    </div>
  )
}

export default page
