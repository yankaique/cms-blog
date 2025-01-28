import { Theme } from "@/types/Theme"
import { create } from "zustand"

export type ThemeState = {
    theme: Theme
}

export type ThemeAction = {
    setTheme: (theme: Theme) => void 
}

export const useThemeStore = create<ThemeState & ThemeAction>((set) => ({
    theme: "light",
    setTheme: (theme) => set({ theme })
}))