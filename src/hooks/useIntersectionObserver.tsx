import React, { Ref, useEffect, useLayoutEffect } from "react";
import { delay } from "../common/util";

type TuseIntersectionObserverProps = {
  root: Element;
  target: Element;
  handleIntersect: () => void;
  threshold: number;
  rootMargin: string;
};

export default function useIntersectionObserver({
  root,
  target,
  handleIntersect,
  threshold = 1.0,
  rootMargin = `0px 0px 0px 0px`,
}: TuseIntersectionObserverProps) {
  useEffect(() => {
    if (!root) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold,
    });

    if (!target) return;

    observer.observe(target);
    // console.log(`observe start...`);

    return () => {
      // console.log(`observe end...`);
      observer.unobserve(target);
    };
  }, [target, root, rootMargin, handleIntersect, threshold]);
}
