
import  { useEffect } from 'react';

interface SeoProps {
  title: string;
}

const Seo = ({ title }: SeoProps) => {

  useEffect(() => {
    document.title = `Vyzor - ${title}`
  }, [])

  return (
    <>
    </>
  )
}

export default Seo