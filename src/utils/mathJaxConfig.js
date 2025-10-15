const mathJaxConfig = {
  version: 2,
  tex2jax: {
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
  CommonHTML: { linebreaks: { automatic: true } },
  SVG: { linebreaks: { automatic: true } },
  "HTML-CSS": { linebreaks: { automatic: true } },
  messageStyle: 'none',
  styles: {
    '.MathJax_SVG svg': { 'max-width': '100%' },
    'table>tbody>tr>td>.MathJax_SVG svg': { 'max-width': 'inherit' },
  },
};

export default mathJaxConfig;
