import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
    svgColor?: string,
}

export const CheckIcon: FC<IProps> = memo(({ svgColor = "#1EBD88"}) => {
    return (
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.531006" y="0.5" width="24" height="23" rx="11.5" fill={svgColor} fillOpacity="0.1" />
            <path d="M17.531 8.5625L10.656 15.4375L7.53101 12.3125" stroke={svgColor} strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
        </svg>
    )
})