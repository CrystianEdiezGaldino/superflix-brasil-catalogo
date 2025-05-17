
import { useState, useEffect, RefObject } from 'react';

export function useHover<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>
): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(() => {
    const node = elementRef.current;
    if (node) {
      node.addEventListener('mouseenter', handleMouseOver);
      node.addEventListener('mouseleave', handleMouseOut);

      return () => {
        node.removeEventListener('mouseenter', handleMouseOver);
        node.removeEventListener('mouseleave', handleMouseOut);
      };
    }
  }, [elementRef]);

  return value;
}
