import Image from './Image'
import Title from './Title'
import authors from '../../content/data/authors.json'

const Card = ({
  category,
  title,
  cover,
  excerpt,
  date,
  link,
  author,
  ...rest
}) => {
  const authorData = authors.find(auth => auth.id === author)

  return (
    <article className="max-w-full overflow-hidden shadow-none" style={rest.mb ? { marginBottom: `${rest.mb * 4}px` } : undefined}>
      <Title link={link} date={date} author={authorData}>
        {title}
      </Title>
      <Image
        aspectRatio={2.93}
        src={cover}
        sizes={[370, 530, 690, 850]}
        className="overflow-hidden rounded"
        alt={title}
      />
      <div className="p-2">
        <p className="mt-2 mb-0 text-[18px] leading-[1.8]" dangerouslySetInnerHTML={{ __html: excerpt }} />
        <div className="mt-4">
          <a
            className="inline-flex h-[60px] w-full min-w-12 items-center justify-center rounded-md bg-[#8ac73d] px-6 text-[18px] leading-[1.2] font-semibold whitespace-nowrap text-white no-underline transition-colors duration-200 hover:bg-[#a0cc68] focus:shadow-none"
            href={link}
          >
            Continue Reading
          </a>
        </div>
      </div>
    </article>
  )
}

export default Card
