// components/theme-background.tsx
export default function ThemeBackground() {
    return (
        <div className="absolute inset-0 z-0">
            {/* 基础背景层 - 实现颜色过渡 */}
            <div className="absolute inset-0 transition-colors duration-500 ease-in-out">
                <div
                    className="absolute inset-0 bg-[#f8f9fa] dark:bg-[#0d1117]"
                    data-testid="base-background"
                />
            </div>

            {/* 渐变层 - 添加透明度过渡 */}
            <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-[#FF0080] via-[#7928CA] to-[#4299E1] opacity-[0.07] dark:opacity-[0.15]"
                    data-testid="gradient-layer"
                />
            </div>

            {/* 网格图案层 - 增加不透明度 */}
            <div
                className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.7] dark:opacity-[0.4] transition-opacity duration-500 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
                data-testid="grid-pattern"
            />
        </div>
    )
} 