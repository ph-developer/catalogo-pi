import tinycolor from 'tinycolor2'

export const colors = {
    setBackgroundColor: (classNameOrHex: string) => {
        if (classNameOrHex.startsWith('#')) {
            document.body.style.backgroundColor = classNameOrHex
        } else if (classNameOrHex.startsWith('bg-')) {
            document.body.classList.add(classNameOrHex)
        }
    },
    getDominantColor: async (src: string) => {
        return new Promise<string|null>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) return resolve(null)

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const colorCount = new Map<string, number>();

                for (let i = 0; i < data.length; i += 4) {
                    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
                    const hex = colors.rgbToHex(r, g, b);

                    colorCount.set(hex, (colorCount.get(hex) || 0) + 1);
                }

                let dominantColor = null;
                let maxCount = 0;

                colorCount.forEach((count, color) => {
                    if (count > maxCount) {
                        maxCount = count;
                        dominantColor = color;
                    }
                });

                resolve(dominantColor);
            };

            img.onerror = () => resolve(null);
            img.src = src;
        });
    },
    getDarkenColor: (hexColor: string, amount: number) => {
        return tinycolor(hexColor).darken(amount).toString()
    },
    getTextColor: (hexColor: string) => {
        return tinycolor(hexColor).isDark()? 'white' : 'black'
    },
    rgbToHex: (r: number, g: number, b: number) => {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('');
    }
}