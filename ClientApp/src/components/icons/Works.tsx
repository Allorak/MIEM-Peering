import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
  svgColor?: string,
}

export const Works: FC<IProps> = memo(({ svgColor = "white", ...props }) => {
  return (
    <svg width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 6H11.5C11.2239 6 11 6.22386 11 6.5V10.5C11 10.7761 11.2239 11 11.5 11H17.5C17.7761 11 18 10.7761 18 10.5V6.5C18 6.22386 17.7761 6 17.5 6ZM17 10H12V7H17V10Z"
        fill={svgColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5 2H5.5C4.67157 2 4 2.67157 4 3.5V19.5C4 21.433 5.567 23 7.5 23H17.5C19.433 23 21 21.433 21 19.5V3.5C21 2.67157 20.3284 2 19.5 2ZM8 3H5.5C5.22386 3 5 3.22386 5 3.5V19.5C5 20.8807 6.11929 22 7.5 22H8V3ZM9 3V22H17.5C18.8807 22 20 20.8807 20 19.5V3.5C20 3.22386 19.7761 3 19.5 3H9Z"
        fill={svgColor}
      />
    </svg>
  )
})
