import React from "react"

type ProgressBarProps = {
    progress: number,
}

const ProgressBar = ({ progress = 0 }: ProgressBarProps) => {
    return (
        <div className="flex px-1 py-0.5 rounded-xl border border-[#fffad0] w-full">
            <span
                style={{
                    width: `${Math.min(progress, 100)}%`
                }}
                className="h-1 rounded-full bg-gradient-to-r from-[#f3c45a] to-[#fffad0] text-black"
            >
            </span>
        </div>
    )
}

export { ProgressBar }