import WebFont from 'webfontloader';
import asyncRetry from 'async-retry';

// import { analytics } from 'src/timestep/analytics';

export function loadFont(name: string) {
  return new Promise<string>((resolve, reject) => {
    WebFont.load({
      classes: false,
      custom: {
        families: [name],
      },

      active: () => resolve(name),

      inactive: () => {
        // TODO Add timings and other useful data
        // analytics.pushError('FontLoadFailed', { message: name });
        console.log('>>> FontLoadFailed');

        resolve(name);
      },
    });
  });
}

export function loadImage(src: string, retry?: boolean) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    if (src.indexOf('https://') === 0) {
      img.crossOrigin = 'anonymous';
    }

    img.src = src;

    // TODO Better handling and instrumentation
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (retry !== false) {
        setTimeout(() => resolve(loadImage(src, false)), 500);
      } else {
        reject(new Error(`Image failed to load: ${src}`));
      }
    };
  });
}

export function loadJson(req: RequestInit & { url: RequestInfo }) {
  return asyncRetry(
    () => window.fetch(req.url, req).then((res) => res.json()),
    { retries: 4, minTimeout: 100 },
  );
}
