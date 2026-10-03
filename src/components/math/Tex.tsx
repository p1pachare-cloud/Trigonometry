// src/components/math/Tex.tsx
import React, { useMemo } from 'react';
import katex from 'katex';

interface TexProps {
  math: string;
  block?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Tex: React.FC<TexProps> = ({ math, block = false, className = '', ariaLabel }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (e) {
      console.warn('KaTeX render error:', e);
      return `<code>${math}</code>`;
    }
  }, [math, block]);

  return (
    <span
      className={`katex-wrap ${block ? 'katex-block' : 'katex-inline'} ${className}`}
      role="math"
      aria-label={ariaLabel || math}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
