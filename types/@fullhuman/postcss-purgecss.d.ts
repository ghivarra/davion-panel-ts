// types/@fullhuman/postcss-purgecss.d.ts
declare module '@fullhuman/postcss-purgecss' {
  interface Options {
    content: string[];
    css: string[];
    // Add more options as needed
  }

  function purgecss(options: Options): any;

  export default purgecss;
}
