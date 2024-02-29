import { NextSeo, NextSeoProps } from "next-seo"

const SEO = (props: NextSeoProps) => {
  const { noindex, description, canonical, title, openGraph } = props

  return (
    <NextSeo 
      noindex={noindex}
      title="Manage Score"
      description={description ? description : "Manage Score - Phần mềm quản lý điểm trực tuyến"}
      canonical={canonical}
      openGraph={{
        type: 'website',
        url: openGraph?.url,
        title: title || "Manage Score",
        description: description ? description : "Manage Score - Phần mềm quản lý điểm trực tuyến",
        siteName: "Manage Score"
      }}
      additionalMetaTags={[
        
      ]}
    />
  )
}

export default SEO