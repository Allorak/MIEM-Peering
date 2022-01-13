import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
    svgColor?: string,
}

export const Checkings: FC<IProps> = memo(({ svgColor = "white", ...props }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2C2.895 2 2 2.895 2 4V16C2 17.105 2.895 18 4 18H16C17.105 18 18 17.105 18 16V4C18 2.895 17.105 2 16 2H4ZM4 4H16V16H4V4ZM20 6V20H6V22H20C21.105 22 22 21.105 22 20V6H20ZM13.293 6.29297L9 10.5859L6.70703 8.29297L5.29297 9.70703L9 13.4141L14.707 7.70703L13.293 6.29297Z" fill={svgColor} />
        </svg>

    )
})
