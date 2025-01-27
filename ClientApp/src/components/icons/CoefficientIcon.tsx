import { FC, memo } from "react"

export const CoefficientIcon: FC = memo(() => {
    return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.1" cx="30" cy="30" r="30" fill="#00C767" />
            <path d="M38.24 30.24C39.3658 29.1142 39.9983 27.5872 39.9983 25.995C39.9983 24.4029 39.3658 22.8759 38.24 21.75C37.1142 20.6242 35.5872 19.9917 33.995 19.9917C32.4028 19.9917 30.8758 20.6242 29.75 21.75L23 28.5V37H31.5L38.24 30.24Z" stroke="#4BDE97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M34 26L20 40" stroke="#4BDE97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M35.5 33H27" stroke="#4BDE97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
})