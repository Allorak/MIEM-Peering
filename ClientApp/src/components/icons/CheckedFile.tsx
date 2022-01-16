import { FC, memo } from "react"

export const CheckedFile: FC = memo(() => {
    return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.1" cx="30" cy="30" r="30" fill="#00C767" />
            <path d="M31 19H24C23.4696 19 22.9609 19.2107 22.5858 19.5858C22.2107 19.9609 22 20.4696 22 21V37C22 37.5304 22.2107 38.0391 22.5858 38.4142C22.9609 38.7893 23.4696 39 24 39H36C36.5304 39 37.0391 38.7893 37.4142 38.4142C37.7893 38.0391 38 37.5304 38 37V26L31 19Z" stroke="#00C767" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M31 19V26H38" stroke="#00C767" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M30 29H49V49H30V29Z" fill="#E7F3E8" />
            <path d="M39.9999 32C35.5839 32 31.9999 35.584 31.9999 40C31.9999 44.416 35.5839 48 39.9999 48C44.4159 48 47.9999 44.416 47.9999 40C47.9999 35.584 44.4159 32 39.9999 32ZM38.3999 44L34.3999 40L35.5279 38.872L38.3999 41.736L44.4719 35.664L45.5999 36.8L38.3999 44Z" fill="#00C767" />
        </svg>
    )
})
