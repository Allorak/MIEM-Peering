import { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
    svgColor?: string,
}

export const Export: FC<IProps> = memo(({ svgColor = "white", ...props }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.707 2.29297L15.293 3.70703L17.5859 6H17C10.9366 6 6 10.9366 6 17V18H8V17C8 12.0174 12.0174 8 17 8H17.5859L15.293 10.293L16.707 11.707L21.4141 7L16.707 2.29297ZM2 8V9V19C2 20.645 3.35503 22 5 22H19C20.645 22 22 20.645 22 19V18V17H20V18V19C20 19.565 19.565 20 19 20H5C4.43497 20 4 19.565 4 19V9V8H2Z" fill={svgColor} />
        </svg>
    )
})