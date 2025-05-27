import { create } from "zustand";
export type Prize = {
	id: string;
	name: string;
	probability: number;
	color: string;
};
type PrizeState = {
	prizes: Prize[];
	currentWinner: Prize | null;
	addPrize: (prize: Prize) => void;
	removePrize: (id: string) => void;
	setWinner: (winner: Prize) => void;
};
export const usePrizeStore = create<PrizeState>((set) => ({
	prizes: [
		{ id: "1", name: "Yes", probability: 0.5, color: "#FF5252" },
		{ id: "2", name: "No", probability: 0.5, color: "#4CAF50" },
	],
	currentWinner: null,
	addPrize: (prize) =>
		set((state) => ({
			prizes: [...state.prizes, prize],
		})),
	removePrize: (id) =>
		set((state) => ({
			prizes: state.prizes.filter((prize) => prize.id !== id),
		})),
	setWinner: (winner) => set({ currentWinner: winner }),
}));
