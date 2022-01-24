import React, { useEffect, useRef } from "react";

export function makeCancelable(promise: any) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    // Suppress resolution and rejection if canceled
    promise
      .then((val: any) => !isCanceled && resolve(val))
      .catch((error: any) => !isCanceled && reject(error));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}

export function useCancellablePromise() {
  // think of useRef as member variables inside a hook
  // you cannot define promises here as an array because
  // they will get initialized at every render refresh
  const promises: any = useRef();
  // useEffect initializes the promises array
  // and cleans up by calling cancel on every stored
  // promise.
  // Empty array as input to useEffect ensures that the hook is
  // called once during mount and the cancel() function called
  // once during unmount
  useEffect(() => {
    promises.current = promises.current || [];
    return function cancel() {
      promises.current.forEach((p: any) => p.cancel());
      promises.current = [];
    };
  }, []);

  // cancelablePromise remembers the promises that you
  // have called so far. It returns a wrapped cancelable
  // promise
  function cancellablePromise(p: any) {
    const cPromise = makeCancelable(p);
    promises.current.push(cPromise);
    return cPromise.promise;
  }
  return { cancellablePromise };
}
