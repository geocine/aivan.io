import React from 'react'
import { Box, Text, Flex } from '@chakra-ui/core'

const ColorBox = ({ color, ...rest }) => {
  return (
    <Box
      maxWidth={200}
      borderRadius={6}
      overflow="hidden"
      boxShadow={`0 0 25px rgba(0,0,0,0.1)`}
      display="inline-block"
      {...rest}
    >
      <Box bg={color} h={[100, 150]} />
      <Flex align="center" justify="center" maxWidth="200px" height="50px">
        <Text textAlign="center">{color}</Text>
      </Flex>
    </Box>
  )
}

export default ColorBox
