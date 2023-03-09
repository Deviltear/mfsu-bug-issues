declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    // eslint-disable-next-line no-unused-vars
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
declare const __CURRENT_LIFE_VERSION__: string;
