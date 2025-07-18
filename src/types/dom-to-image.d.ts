declare module 'dom-to-image' {
  interface Options {
    quality?: number;
    bgcolor?: string;
    height?: number;
    width?: number;
    style?: object;
    filter?: (node: HTMLElement) => boolean;
    imagePlaceholder?: string;
    cacheBust?: boolean;
    useCORS?: boolean;
    allowTaint?: boolean;
    foreignObjectRendering?: boolean;
    removeContainer?: boolean;
    imageTimeout?: number;
    httpTimeout?: number;
    scale?: number;
    imagePlaceholder?: string;
    backgroundColor?: string;
    style?: object;
    filter?: (node: HTMLElement) => boolean;
    width?: number;
    height?: number;
    quality?: number;
    cacheBust?: boolean;
    useCORS?: boolean;
    allowTaint?: boolean;
    foreignObjectRendering?: boolean;
    removeContainer?: boolean;
    imageTimeout?: number;
    httpTimeout?: number;
    scale?: number;
  }

  interface DomToImage {
    toPng(node: HTMLElement, options?: Options): Promise<string>;
    toJpeg(node: HTMLElement, options?: Options): Promise<string>;
    toSvg(node: HTMLElement, options?: Options): Promise<string>;
    toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
    toPixelData(node: HTMLElement, options?: Options): Promise<Uint8ClampedArray>;
  }

  const domtoimage: DomToImage;
  export default domtoimage;
} 