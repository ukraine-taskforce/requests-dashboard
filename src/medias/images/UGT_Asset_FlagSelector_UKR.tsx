import React from "react";

export interface ImgFlagUkProps extends React.SVGProps<SVGSVGElement> {
  alt: string;
}

export const ImgFlagUk: React.FunctionComponent<ImgFlagUkProps> = ({ alt, ...props }) => {
  return (
    <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {Boolean(alt) && <title>{alt}</title>}
      <rect width="17" height="5" fill="#0183D1" />
      <rect y="5" width="17" height="5" fill="#FFD101" />
    </svg>
  );
};
