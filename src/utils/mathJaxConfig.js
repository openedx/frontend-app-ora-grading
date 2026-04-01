const mathJaxConfig = {
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
      ['[mathjaxinline]', '[/mathjaxinline]'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
      ['[mathjax]', '[/mathjax]'],
    ],
    processEscapes: true,
  },
  options: {
    enableMenu: false,
  },
  chtml: {
    linebreaks: { automatic: true },
  },
  svg: {
    linebreaks: { automatic: true },
  },
};

export default mathJaxConfig;
