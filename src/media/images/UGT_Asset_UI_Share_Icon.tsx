import React from "react";

export interface ImgShareProps extends React.SVGProps<SVGSVGElement> {
  alt: string;
  fill?: "black" | "white";
}

export const ImgShare: React.FunctionComponent<ImgShareProps> = ({ alt, fill = "black", ...props }) => {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {Boolean(alt) && <title>{alt}</title>}
      <g opacity="1">
        <path
          d="M8.72692 7.8543V11.036L14.5449 5.59985L8.72692 0.181885V3.27267C3.07261 4.05446 0.818149 7.92703 0 11.8178C2.0181 9.09062 4.69072 7.8543 8.72692 7.8543Z"
          fill={fill}
        />
      </g>
    </svg>
  );
};
