import React, { useState } from 'react'
import { Link } from 'gatsby'
import { Box, Text, Button } from '@chakra-ui/core'
import styled from '@emotion/styled'
import Image from './Image'
import Title from './Title'
import authors from '../../content/data/authors.json'

const PostCard = styled.div`
  box-shadow: none;
  .cover {
    border-radius: 4px;
  }
  .excerpt {
    font-size: 18px;
  }
`

const ContinueButton = styled(Button)`
  background: #8ac73d;
  color: #fff;
  height: 60px;
  width: 100%;
  &:focus {
    box-shadow: none;
  }
  &:hover {
    background: #a0cc68;
  }
`

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
  // waiting for https://github.com/gatsbyjs/gatsby/issues/10482
  const [authorData] = useState(() => authors.find(auth => auth.id === author))

  return (
    <PostCard to={link}>
      <Box maxW={'100%'} overflow="hidden" {...rest}>
        <Title link={link} date={date} author={authorData}>
          {title}
        </Title>
        <Image
          aspectRatio={2.93}
          src={cover}
          sizes={[370, 530, 690, 850]}
          className="cover"
        />
        <Box p="2">
          <Text
            mt={2}
            lineHeight="1.8"
            className="excerpt"
            as="p"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
          <Box mt={4}>
            <ContinueButton size="lg" to={link} as={Link}>
              Continue Reading
            </ContinueButton>
          </Box>
        </Box>
      </Box>
    </PostCard>
  )
}

export default Card
