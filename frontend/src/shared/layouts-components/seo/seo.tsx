
import  { useEffect } from 'react';

interface SeoProps {
  title: string;
}

const Seo = ({ title }: SeoProps) => {

  useEffect(() => {
    document.title = `Neuralytic - ${title}`
  }, [])

  return (
    <>
    </>
  )
}

export default Seo