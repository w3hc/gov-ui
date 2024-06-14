import React from 'react'
import { default as NextHead } from 'next/head'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../../utils/config'

interface Props {
  title?: string
  description?: string
}

export function Head({ title, description }: Props) {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL
  const img = `${origin}/huangshan.png`
  return (
    <NextHead>
      <title>{title ?? SITE_NAME}</title>
      <meta name="description" content={description ?? SITE_DESCRIPTION} />
      <meta property="og:image" content={img} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Add any additional meta tags that are specific to your app */}
    </NextHead>
  )
}
