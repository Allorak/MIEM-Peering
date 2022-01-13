import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
  svgColor?: string,
}

export const Burger: FC<IProps> = memo(({ svgColor = "white" }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
        fill={svgColor}
      />
    </svg>
  )
})