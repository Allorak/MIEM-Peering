import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
  svgColor?: string,
}

export const Grades: FC<IProps> = memo(({ svgColor = "white", ...props }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 2H14V19H15V2ZM18 2H17V19H18V2ZM5.72361 22.9472C5.39116 23.1134 5 22.8717 5 22.5V19.5C5 19.2239 5.22386 19 5.5 19H9.5C9.77614 19 10 19.2239 10 19.5V22.5C10 22.8717 9.60884 23.1134 9.27639 22.9472L7.5 22.059L5.72361 22.9472ZM7.27639 21.0528L6 21.691V20H9V21.691L7.72361 21.0528C7.58284 20.9824 7.41716 20.9824 7.27639 21.0528Z"
        fill={svgColor}
      />
      <path
        fillRule="evenodd"
        clip-rule="evenodd"
        d="M17.5 2H5.5C4.67157 2 4 2.67157 4 3.5V18.5C4 19.3284 4.67157 20 5.5 20H17.5C19.433 20 21 18.433 21 16.5V5.5C21 3.567 19.433 2 17.5 2ZM5 3.5C5 3.22386 5.22386 3 5.5 3H17.5C18.8807 3 20 4.11929 20 5.5V16.5C20 17.8807 18.8807 19 17.5 19H5.5C5.22386 19 5 18.7761 5 18.5V3.5Z"
        fill={svgColor}
      />
    </svg>
  )
})
