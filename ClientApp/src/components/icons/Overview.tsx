import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
  svgColor?: string,
}

export const Overview: FC<IProps> = memo(({ svgColor = "white", ...props }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L1 11.9004H4V20.9004H11V14.9004H13V20.9004H20V11.9004H23L12 2ZM12 4.69141L18 10.0918V10.9004V18.9004H15V12.9004H9V18.9004H6V10.0918L12 4.69141Z" fill={svgColor} />
    </svg>
  )
})
