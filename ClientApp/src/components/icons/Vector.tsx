import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
    svgColor?: string,
}

export const Vector: FC<IProps> = memo(({ svgColor = "#A4ADC8", ...props }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.87891 4.12L13.7589 12L5.87891 19.88L7.99891 22L17.9989 12L7.99891 2L5.87891 4.12Z" fill={svgColor} />
        </svg>
    )
})
