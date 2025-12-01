'use client';

import { useEffect } from 'react';

// Removes attributes that some browser extensions inject (e.g. fdprocessedid)
// which can cause React hydration mismatches. Also observes the DOM briefly
// to remove newly injected attributes during initial load.
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
        // ignore
      }
    }

    // initial pass
    removeAttrs(document);

    // Observe mutations for a short period to clean up attributes injected
    // by extensions that run slightly later than our script.
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

    // Stop observing after a short grace period
    const timeout = setTimeout(() => observer.disconnect(), 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
