import { FC, useEffect, useState } from "react"
import { useSprings, animated, useSpring } from "react-spring"

import { Book1 } from "./fragments/Book1"
import { Book2 } from "./fragments/Book2"
import { Book3 } from "./fragments/Book3"
import { Chat } from "./fragments/Chat"
import { Eraser } from "./fragments/Eraser"
import { Icon1 } from "./fragments/Icon1"
import { Icon2 } from "./fragments/Icon2"
import { Icon3 } from "./fragments/Icon3"
import { Icon4 } from "./fragments/Icon4"
import { Icon5 } from "./fragments/Icon5"
import { Pen1 } from "./fragments/Pen1"
import { Plant } from "./fragments/Plant"
import { Pen2 } from "./fragments/Pen2"
import { Lines } from "./fragments/Lines"
import { Play } from "./fragments/Play"
import { Hat } from "./fragments/Hat"
import { Background } from "./fragments/Background"

export const PreviewLogo: FC = (() => {
    const [toggle, setToggleAnimation] = useState(false)

    const background = [<Background />]
    const icons = [<Icon1 key='icon-1' />, <Icon2 key='icon-2' />, <Icon3 key='icon-3' />, <Icon4 key='icon-4' />, <Icon5 key='icon-5' />]
    const books = [<Plant key='plant-1' />, <Book3 key='book-3' />, <Book2 key='book-2' />, <Book1 key='book-1' />, <Chat key='chat-1' />, <Hat key='hat-1' />, <Pen1 key='pen-1' />, <Pen2 key='pen-2' />, <Eraser key='eraser-1' />, <Play key='play-1' />]
    const lines = [<Lines />]

    const springs = useSprings(books.length, books.map((_, index) => {
        return {
            transform: toggle
                ? 'translate3d(0px, 0px, 0px)'
                : 'translate3d(0px, -500px, 0px)',
            opacity: toggle ? 1 : 0,
            delay: 700 + (index * 50),
        }
    }))

    const iconSprings = useSprings(icons.length, icons.map((_, index) => {
        return {
            transform: toggle
                ? 'rotate(0deg) scale(1)'
                : 'rotate(360deg) scale(0)',
            delay: 660 + (index * 100),
            config: { friction: 16 }
        }
    }))

    const backgroundSpring = useSprings(background.length, background.map((_, index) => {
        return {
            transform: toggle
                ? 'rotate(0deg) scale(1)'
                : 'rotate(45deg) scale(0)',
            config: { mass: 1.5, tension: 150, friction: 30 }
        }
    }))

    const AnimatedLines: FC = () => {
        const linesSpring = useSpring({ opacity: toggle ? 1 : 0 });

        return <animated.g style={linesSpring}>{lines}</animated.g>;
    }

    const animatedIcons = iconSprings.map((animatedStyle, index) => {
        return <animated.g key={index} style={{ transformOrigin: 'center', transformBox: 'fill-box', ...animatedStyle }}>{icons[index]}</animated.g>
    })

    const animatedBooks = springs.map((animatedStyle, index) => {
        return <animated.g key={index} style={animatedStyle}>{books[index]}</animated.g>
    })

    const animatedBackground = backgroundSpring.map((animatedStyle, index) => {
        return <animated.g key={index} style={{ transformOrigin: 'center', transformBox: 'fill-box', ...animatedStyle }}>{background[index]}</animated.g>
    })

    useEffect(() => {
        if (!toggle) {
            setToggleAnimation(!toggle)
        }
    }, [])

    return (
        <>
            <svg width="100%" height="auto" overflow="visible" viewBox="0 0 704 509" fill="none" xmlns="http://www.w3.org/2000/svg">

                {animatedBackground}
                <AnimatedLines />
                {animatedIcons}
                {animatedBooks}

                <defs>
                    <linearGradient id="paint0_linear_582_9170" x1="351.877" y1="133" x2="351.877" y2="508.821" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#F2F2F2" />
                        <stop offset="1" stop-color="#DCE8EF" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_582_9170" x1="155.795" y1="253.224" x2="155.795" y2="374.646" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#878CF0" />
                        <stop offset="1" stop-color="#5555EB" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_582_9170" x1="151.948" y1="247.028" x2="151.948" y2="368.45" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#C6DFF2" />
                        <stop offset="0.998965" stop-color="#9BB7FC" />
                        <stop offset="0.9994" stop-color="#9BB7FC" />
                        <stop offset="1" stop-color="#9BB7FC" />
                    </linearGradient>
                    <linearGradient id="paint3_linear_582_9170" x1="86.3274" y1="284.622" x2="86.3274" y2="364.112" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E9716C" />
                        <stop offset="1" stop-color="#E65B55" />
                    </linearGradient>
                    <linearGradient id="paint4_linear_582_9170" x1="562.894" y1="262.419" x2="614.985" y2="262.419" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4D5DEC" />
                        <stop offset="0.326986" stop-color="#4136EB" />
                        <stop offset="1" stop-color="#420087" />
                    </linearGradient>
                    <linearGradient id="paint5_linear_582_9170" x1="351.877" y1="133" x2="351.877" y2="508.821" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#CFDFE8" />
                        <stop offset="1" stop-color="#BED3E0" />
                    </linearGradient>
                    <linearGradient id="paint6_linear_582_9170" x1="155.795" y1="253.224" x2="155.795" y2="374.646" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#747FE1" />
                        <stop offset="1" stop-color="#494DDC" />
                    </linearGradient>
                    <linearGradient id="paint7_linear_582_9170" x1="151.948" y1="247.028" x2="151.948" y2="368.45" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#ABCBE3" />
                        <stop offset="0.998965" stop-color="#86A6EC" />
                        <stop offset="1" stop-color="#86A6EC" />
                    </linearGradient>
                    <linearGradient id="paint8_linear_582_9170" x1="351.88" y1="132.998" x2="351.88" y2="508.822" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#CFDFE8" />
                        <stop offset="1" stop-color="#BED3E0" />
                    </linearGradient>
                    <linearGradient id="paint9_linear_582_9170" x1="487.645" y1="445.56" x2="646.821" y2="361.11" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#8DA4B7" />
                        <stop offset="0.271348" stop-color="#8DA4B7" />
                        <stop offset="0.339572" stop-color="#A5B7C6" />
                        <stop offset="0.612299" stop-color="#C3D3DD" />
                        <stop offset="0.690193" stop-color="#758D9E" />
                        <stop offset="1" stop-color="#758D9E" />
                    </linearGradient>
                    <linearGradient id="paint10_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4D5DEC" />
                        <stop offset="0.326986" stop-color="#4136EB" />
                        <stop offset="1" stop-color="#420087" />
                    </linearGradient>
                    <linearGradient id="paint11_linear_582_9170" x1="154.051" y1="304.057" x2="629.784" y2="304.057" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint12_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint13_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint14_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint15_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint16_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint17_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint18_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint19_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint20_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint21_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint22_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint23_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint24_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint25_linear_582_9170" x1="316.811" y1="253.184" x2="316.811" y2="460.398" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#8DA4B7" />
                        <stop offset="0.271348" stop-color="#8DA4B7" />
                        <stop offset="0.339572" stop-color="#A5B7C6" />
                        <stop offset="0.532086" stop-color="#B0C1CF" />
                        <stop offset="0.561095" stop-color="#8DA4B7" />
                        <stop offset="0.676471" stop-color="#8DA4B7" />
                        <stop offset="0.918104" stop-color="#758D9E" />
                        <stop offset="1" stop-color="#758D9E" />
                    </linearGradient>
                    <linearGradient id="paint26_linear_582_9170" x1="559.85" y1="403.136" x2="559.85" y2="417.254" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint27_linear_582_9170" x1="589.175" y1="389.189" x2="589.175" y2="397.3" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint28_linear_582_9170" x1="598.311" y1="383.924" x2="598.311" y2="392.024" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint29_linear_582_9170" x1="607.408" y1="378.661" x2="607.408" y2="386.761" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint30_linear_582_9170" x1="616.545" y1="373.386" x2="616.545" y2="381.497" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint31_linear_582_9170" x1="501.177" y1="440.838" x2="501.177" y2="448.949" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint32_linear_582_9170" x1="510.314" y1="435.573" x2="510.314" y2="443.673" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint33_linear_582_9170" x1="519.41" y1="430.311" x2="519.41" y2="438.411" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint34_linear_582_9170" x1="528.547" y1="425.036" x2="528.547" y2="433.146" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint35_linear_582_9170" x1="191.422" y1="286.248" x2="191.422" y2="287.927" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint36_linear_582_9170" x1="222.233" y1="304.204" x2="222.233" y2="305.883" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#385987" />
                        <stop offset="0.475936" stop-color="#5B7687" />
                        <stop offset="1" stop-color="#5B7687" />
                    </linearGradient>
                    <linearGradient id="paint37_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint38_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint39_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint40_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint41_linear_582_9170" x1="154.051" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint42_linear_582_9170" x1="154.051" y1="304.059" x2="629.786" y2="304.059" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5978F1" />
                        <stop offset="0.326986" stop-color="#4E58F0" />
                        <stop offset="1" stop-color="#4F2BA8" />
                    </linearGradient>
                    <linearGradient id="paint43_linear_582_9170" x1="460.785" y1="374.066" x2="494.681" y2="374.066" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#68ACFF" />
                        <stop offset="0.429325" stop-color="#68ACFF" />
                        <stop offset="1" stop-color="#3B6BFF" />
                    </linearGradient>
                    <linearGradient id="paint44_linear_582_9170" x1="496.608" y1="353.388" x2="530.489" y2="353.388" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4D5DEC" />
                        <stop offset="1" stop-color="#2200EB" />
                    </linearGradient>
                    <linearGradient id="paint45_linear_582_9170" x1="568.596" y1="353.763" x2="602.493" y2="353.763" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#EFCF64" />
                        <stop offset="1" stop-color="#FF7159" />
                    </linearGradient>
                    <linearGradient id="paint46_linear_582_9170" x1="532.392" y1="332.723" x2="566.288" y2="332.723" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#DF697B" />
                        <stop offset="1" stop-color="#BE2773" />
                    </linearGradient>
                    <linearGradient id="paint47_linear_582_9170" x1="461.204" y1="415.77" x2="495.086" y2="415.77" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4D5DEC" />
                        <stop offset="1" stop-color="#2200EB" />
                    </linearGradient>
                    <linearGradient id="paint48_linear_582_9170" x1="425" y1="394.73" x2="458.882" y2="394.73" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#DF697B" />
                        <stop offset="1" stop-color="#BE2773" />
                    </linearGradient>
                    <linearGradient id="paint49_linear_582_9170" x1="496.989" y1="395.106" x2="530.885" y2="395.106" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#74DBFF" />
                        <stop offset="0.134696" stop-color="#74DBFF" />
                        <stop offset="0.689777" stop-color="#9776F0" />
                        <stop offset="0.750356" stop-color="#9776F0" />
                        <stop offset="1" stop-color="#4D2FFF" />
                    </linearGradient>
                    <linearGradient id="paint50_linear_582_9170" x1="532.812" y1="374.428" x2="566.694" y2="374.428" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#68ACFF" />
                        <stop offset="0.429325" stop-color="#68ACFF" />
                        <stop offset="1" stop-color="#3B6BFF" />
                    </linearGradient>
                    <linearGradient id="paint51_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3B4DCD" />
                        <stop offset="0.326986" stop-color="#322DCC" />
                        <stop offset="1" stop-color="#320075" />
                    </linearGradient>
                    <linearGradient id="paint52_linear_582_9170" x1="154.051" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint53_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint54_linear_582_9170" x1="154.051" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint55_linear_582_9170" x1="154.054" y1="304.058" x2="629.783" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint56_linear_582_9170" x1="154.051" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint57_linear_582_9170" x1="154.051" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint58_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint59_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint60_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint61_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint62_linear_582_9170" x1="154.052" y1="304.057" x2="629.784" y2="304.057" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint63_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint64_linear_582_9170" x1="154.052" y1="304.058" x2="629.784" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint65_linear_582_9170" x1="154.052" y1="304.058" x2="629.785" y2="304.058" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4463D1" />
                        <stop offset="0.326986" stop-color="#3C49D0" />
                        <stop offset="1" stop-color="#3C2492" />
                    </linearGradient>
                    <linearGradient id="paint66_linear_582_9170" x1="341.1" y1="224.667" x2="465.1" y2="303.167" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4134E6" />
                        <stop offset="1" stop-color="#421AB6" />
                    </linearGradient>
                    <linearGradient id="paint67_linear_582_9170" x1="347.23" y1="444.969" x2="347.23" y2="459.161" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E9716C" />
                        <stop offset="1" stop-color="#E65B55" />
                    </linearGradient>
                    <linearGradient id="paint68_linear_582_9170" x1="327.164" y1="449.316" x2="327.278" y2="449.515" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5465E2" />
                        <stop offset="1" stop-color="#6147AC" />
                    </linearGradient>
                    <linearGradient id="paint69_linear_582_9170" x1="335.051" y1="435.97" x2="335.091" y2="436.04" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5465E2" />
                        <stop offset="1" stop-color="#6147AC" />
                    </linearGradient>
                    <linearGradient id="paint70_linear_582_9170" x1="281.37" y1="415.992" x2="365.173" y2="415.992" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#878CF0" />
                        <stop offset="1" stop-color="#5555EB" />
                    </linearGradient>
                    <linearGradient id="paint71_linear_582_9170" x1="514.261" y1="221.237" x2="514.261" y2="238.458" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#56548C" />
                        <stop offset="1" stop-color="#444477" />
                    </linearGradient>
                    <linearGradient id="paint72_linear_582_9170" x1="496.562" y1="179.345" x2="525.132" y2="228.829" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#68ACFF" />
                        <stop offset="0.429325" stop-color="#68ACFF" />
                        <stop offset="1" stop-color="#3B6BFF" />
                    </linearGradient>
                    <linearGradient id="paint73_linear_582_9170" x1="496.562" y1="179.345" x2="525.132" y2="228.829" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#62A3F2" />
                        <stop offset="1" stop-color="#3866F2" />
                    </linearGradient>
                    <linearGradient id="paint74_linear_582_9170" x1="379.362" y1="184.37" x2="447.742" y2="302.807" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#DF697B" />
                        <stop offset="1" stop-color="#BE2773" />
                    </linearGradient>
                    <linearGradient id="paint75_linear_582_9170" x1="379.362" y1="184.37" x2="447.741" y2="302.807" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E1829F" />
                        <stop offset="1" stop-color="#C24B99" />
                    </linearGradient>
                    <linearGradient id="paint76_linear_582_9170" x1="304.25" y1="162.222" x2="348.699" y2="239.21" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5465E2" />
                        <stop offset="1" stop-color="#6147AC" />
                    </linearGradient>
                    <linearGradient id="paint77_linear_582_9170" x1="350.362" y1="201.37" x2="418.741" y2="319.807" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5465E2" />
                        <stop offset="1" stop-color="#6147AC" />
                    </linearGradient>
                    <linearGradient id="paint78_linear_582_9170" x1="183.887" y1="402.237" x2="198.077" y2="426.815" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5465E2" />
                        <stop offset="1" stop-color="#6147AC" />
                    </linearGradient>
                    <linearGradient id="paint79_linear_582_9170" x1="227.578" y1="417.479" x2="227.578" y2="441.552" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E9716C" />
                        <stop offset="1" stop-color="#E65B55" />
                    </linearGradient>
                    <linearGradient id="paint80_linear_582_9170" x1="252.389" y1="35.8431" x2="252.389" y2="176.362" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#EC827D" />
                        <stop offset="1" stop-color="#E65B55" />
                    </linearGradient>
                    <linearGradient id="paint81_linear_582_9170" x1="231.703" y1="103.756" x2="231.703" y2="122.522" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#EFCF64" />
                        <stop offset="1" stop-color="#FFA920" />
                    </linearGradient>
                    <linearGradient id="paint82_linear_582_9170" x1="256.014" y1="89.719" x2="256.014" y2="108.485" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#EFCF64" />
                        <stop offset="1" stop-color="#FFA920" />
                    </linearGradient>
                    <linearGradient id="paint83_linear_582_9170" x1="280.327" y1="75.6823" x2="280.327" y2="94.4481" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#EFCF64" />
                        <stop offset="1" stop-color="#FFA920" />
                    </linearGradient>
                    <linearGradient id="paint84_linear_582_9170" x1="404.431" y1="45.8608" x2="404.431" y2="119.199" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#56548C" />
                        <stop offset="1" stop-color="#444477" />
                    </linearGradient>
                    <linearGradient id="paint85_linear_582_9170" x1="404.498" y1="19.483" x2="404.498" y2="72.4998" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#56548C" />
                        <stop offset="1" stop-color="#444477" />
                    </linearGradient>
                    <linearGradient id="paint86_linear_582_9170" x1="427.486" y1="46.1215" x2="427.486" y2="119.196" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#444477" />
                        <stop offset="0.37792" stop-color="#444477" />
                        <stop offset="1" stop-color="#2F2F68" />
                    </linearGradient>
                    <linearGradient id="paint87_linear_582_9170" x1="447.786" y1="50.0605" x2="447.786" y2="103.949" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#56548C" />
                        <stop offset="1" stop-color="#444477" />
                    </linearGradient>
                    <linearGradient id="paint88_linear_582_9170" x1="361.36" y1="50.0617" x2="361.36" y2="103.95" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#444477" />
                        <stop offset="0.37792" stop-color="#444477" />
                        <stop offset="1" stop-color="#2F2F68" />
                    </linearGradient>
                    <linearGradient id="paint89_linear_582_9170" x1="346.31" y1="213.016" x2="346.31" y2="321.672" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E9716C" />
                        <stop offset="1" stop-color="#E65B55" />
                    </linearGradient>
                </defs>
            </svg>
        </>
    )
})