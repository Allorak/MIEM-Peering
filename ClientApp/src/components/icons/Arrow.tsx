import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
  svgColor?: string,
}

export const Arrow: FC<IProps> = memo(({ svgColor = "white", ...props }) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5.80467L0.942667 6.74733L5.138 2.552V11.6093H6.47133V2.552L10.6667 6.74733L11.6093 5.80467L5.80467 0L0 5.80467Z" fill={svgColor} />
    </svg>
  )
})
