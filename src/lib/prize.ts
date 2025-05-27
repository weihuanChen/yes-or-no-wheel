import { Prize } from "@/store/prize-store";
// 概率计算
export const calculateWinner = (prizes: Prize[]) => {
	const total = prizes.reduce((sum, p) => sum + p.probability, 0);
	const random = Math.random() * total;
	let cumulative = 0;

	for (const prize of prizes) {
		cumulative += prize.probability;
		if (random <= cumulative) return prize;
	}
	return prizes[0]; // 兜底
};
