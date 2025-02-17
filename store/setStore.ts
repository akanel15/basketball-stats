import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import uuid from "react-native-uuid";
import { createSet, SetType } from "@/types/set";
import { Stat } from "@/types/stats";

type SetState = {
  sets: Record<string, SetType>;
  addSet: (name: string, teamId: string) => void;
  removeSet: (setId: string) => void;
  updateStats: (setId: string, stat: Stat, amount: number) => void;
  incrementRunCount: (setId: string) => void;
};

export const useSetStore = create(
  persist<SetState>(
    (set) => ({
      sets: {},
      addSet: (name: string, teamId: string) => {
        const id = uuid.v4();
        return set((state) => ({
          sets: {
            [id]: createSet(id, name, teamId),
            ...state.sets,
          },
        }));
      },
      removeSet: (setId: string) => {
        return set((state) => {
          if (!state.sets[setId]) {
            console.warn(`Set with ID ${setId} not found. Cannot remove.`);
            return state;
          }
          const newSets = { ...state.sets };
          delete newSets[setId];
          return { sets: newSets };
        });
      },
      updateStats: (setId: string, stat: Stat, amount: number) => {
        set((state) => {
          const set = state.sets[setId];
          if (!set) {
            console.warn(`Set with ID ${setId} not found.`);
            return state;
          }
          return {
            sets: {
              ...state.sets,
              [setId]: {
                ...set,
                stats: {
                  ...set.stats,
                  [stat]: (set.stats?.[stat] || 0) + amount,
                },
              },
            },
          };
        });
      },
      incrementRunCount: (setId: string) => {
        set((state) => {
          const set = state.sets[setId];
          if (!state.sets[setId]) {
            console.warn(`Set with ID ${setId} not found. Cannot remove.`);
            return state;
          }
          return {
            sets: {
              ...state.sets,
              [setId]: {
                ...set,
                runCount: (set.runCount || 0) + 1,
              },
            },
          };
        });
      },
    }),
    {
      name: "baskItball-set-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
