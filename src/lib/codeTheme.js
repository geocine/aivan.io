export default {
  plain: {
    backgroundColor: '#282c34',
    color: 'rgb(217, 239, 255)',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: 'rgb(144, 145, 147)',
      },
    },
    {
      types: ['plain'],
      style: {
        color: 'rgb(217, 239, 255)',
      },
    },
    {
      types: ['string', 'parameter'],
      style: {
        color: 'rgb(255, 164, 51)',
      },
    },
    {
      types: ['number'],
      style: {
        color: 'rgb(198, 120, 221)',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(171, 178, 191)',
      },
    },
    {
      types: ['builtin', 'class-name', 'atrule'],
      style: {
        color: 'rgb(97, 175, 239)',
      },
    },
    {
      types: ['char', 'constant'],
      style: {
        color: 'rgb(86, 182, 194)',
      },
    },
    {
      types: ['variable', 'operator', 'tag', 'deleted'],
      style: {
        color: 'rgb(224, 108, 117)',
      },
    },
    {
      types: ['function', 'attr-name', 'inserted'],
      style: {
        color: 'rgb(152, 195, 121)',
      },
    },
    {
      types: ['changed'],
      style: {
        color: 'rgb(229, 192, 123)',
      },
    },
  ],
}
