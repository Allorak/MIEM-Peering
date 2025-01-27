import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
  svgColor?: string,
}

export const Works: FC<IProps> = memo(({ svgColor = "white", ...props }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2C5.35503 2 4 3.35503 4 5V19C4 20.645 5.35503 22 7 22H20V20H7C6.43497 20 6 19.565 6 19C6 18.435 6.43497 18 7 18H20V16V2H16H10H7ZM7 4H10V12.123L11.5742 11.0195L13 10.0176L16 12.123V4H18V16H7C6.64816 16 6.31489 16.0739 6 16.1875V5C6 4.43497 6.43497 4 7 4ZM12 4H14V8.27734L13 7.57617L12 8.27734V4Z" fill={svgColor} />
    </svg>
  )
})
