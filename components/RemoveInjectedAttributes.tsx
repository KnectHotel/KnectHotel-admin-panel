'use client';

import { useEffect } from 'react';




export default function RemoveInjectedAttributes() {
  useEffect(() => {
    const ATTRS_TO_REMOVE = ['fdprocessedid'];

    function removeAttrs(root: ParentNode = document) {
      try {
        ATTRS_TO_REMOVE.forEach((attr) => {
          const els = Array.from(root.querySelectorAll(`[${attr}]`));
          els.forEach((el) => el.removeAttribute(attr));
        });
      } catch (e) {
        
      }
    }

    
    removeAttrs(document);

    
    
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes') {
          const target = m.target as Element;
          if (!target) continue;
          ATTRS_TO_REMOVE.forEach((a) => {
            if (target.hasAttribute && target.hasAttribute(a)) {
              try {
                target.removeAttribute(a);
              } catch (e) {}
            }
          });
        } else if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 1) removeAttrs(n as ParentNode);
          });
        }
      }
    });

    observer.observe(document.documentElement || document.body, {
      attributes: true,
      attributeFilter: ATTRS_TO_REMOVE,
      childList: true,
      subtree: true
    });

    
    const timeout = setTimeout(() => observer.disconnect(), 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
