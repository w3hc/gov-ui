import React from 'react'
import { default as NextHead } from 'next/head'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../../utils/config'

interface Props {
  title?: string
  description?: string
}

export function Head(props: Props) {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL
  const img = `${origin}/huangshan.png`
  return (
    <NextHead>
      <title>{props.title ?? SITE_NAME} </title>
      {/* <meta property="og:url" content="https://gov-ui.netlify.app/" /> */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.title ?? SITE_NAME} />
      <meta name="twitter:card" content={SITE_DESCRIPTION} />
      <meta property="og:description" content={props.description ?? SITE_DESCRIPTION} />
      <meta property="og:image" content={img} />
      <meta name="description" content={props.description ?? SITE_DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta property="og:url" content="https://deploy-preview-84--gov-ui.netlify.app" />
      <meta property="og:type" content="website" />
      {/* <meta property="og:title" content="" /> */}
      {/* <meta property="og:description" content="" /> */}
      {/* <meta property="og:image" content="" /> */}

      {/* <meta name="twitter:card" content="summary_large_image" /> */}
      <meta property="twitter:domain" content="deploy-preview-84--gov-ui.netlify.app" />
      <meta property="twitter:url" content="https://deploy-preview-84--gov-ui.netlify.app" />
      <meta name="twitter:title" content={props.title ?? SITE_NAME} />
      <meta name="twitter:description" content={props.description ?? SITE_DESCRIPTION} />
      <meta name="twitter:image" content="https://deploy-preview-84--gov-ui.netlify.app/huangshan.png" />
    </NextHead>
  )
}
