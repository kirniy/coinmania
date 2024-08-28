export const SYMBOL_WEIGHTS = { "🪩": 0.0301, "🍹": 0.0708, "🎁": 0.1232, "🎉": 0.2283, "💃": 0.5476 };
export const SYMBOLS = Object.entries(SYMBOL_WEIGHTS).flatMap(([s, w]) => Array(Math.round(w * 1000)).fill(s));
export const PAYOUTS = { "🪩🪩🪩": 50000, "🍹🍹🍹": 20000, "🎁🎁🎁": 10000, "🎉🎉🎉": 2500, "💃💃💃": 1000, "🪩🪩": 500, "🍹🍹": 400, "🎁🎁": 200, "🎉🎉": 100, "💃💃": 50 };
export const REEL_SIZE = 20;
export const MAX_SPINS_PER_DAY = 2;