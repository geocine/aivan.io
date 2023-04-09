import React from 'react'
import { Box, Text, Stack, Avatar } from '@chakra-ui/react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { bpDesktopOnly } from '../lib/breakpoints'

const StyledTitle = styled(Box)`
  h1 {
    font-size: 28px;
    a {
      transition: all 0.33s ease-out;
      color: #006cb7;
    }
    a:hover {
      color: #ff8e01;
      opacity: 1;
    }
  }
  ${bpDesktopOnly} {
    h1 {
      font-size: 36px;
    }
  }
`

const Title = ({ link, date, children, author }) => {
  return (
    <StyledTitle textAlign="center">
      <Text mt={2} fontWeight="semibold" as="h1" lineHeight="short">
        <Link to={link}>{children}</Link>
      </Text>
      <Stack
        isInline
        mt={2}
        mb={4}
        fontSize="14px"
        verticalAlign="center"
        className="author"
        display="inline-flex"
        lineHeight="30px"
      >
        <Avatar size="sm" name={author.name} src={author.avatar} />
        <a href="#">{author.name}</a>
        <Text marginLeft={2} as="span">
          {date}
        </Text>
      </Stack>
    </StyledTitle>
  )
}

export default Title
