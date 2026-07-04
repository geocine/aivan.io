const Title = ({ link, date, children, author }) => {
  const authorName = author?.name || ''
  const authorAvatar = author?.avatar || ''

  return (
    <div className="text-center">
      <h1 className="mt-2 mb-0 text-[28px] leading-[1.375] font-semibold md:text-[36px]">
        <a className="text-[#006cb7] no-underline transition-all duration-[330ms] ease-out hover:text-[#ff8e01]" href={link}>
          {children}
        </a>
      </h1>
      <div className="author mt-2 mb-4 inline-flex items-center gap-2 text-[14px] leading-[30px]">
        {authorAvatar ? (
          <img
            className="inline-flex h-8 w-8 shrink-0 rounded-full bg-[#765bac] object-cover text-[12.8px] font-medium text-white uppercase"
            src={authorAvatar}
            alt={authorName}
          />
        ) : (
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#765bac] text-[12.8px] font-medium text-white uppercase">
            {authorName.slice(0, 2)}
          </span>
        )}
        <a href="/">{authorName}</a>
        <span>{date}</span>
      </div>
    </div>
  )
}

export default Title
