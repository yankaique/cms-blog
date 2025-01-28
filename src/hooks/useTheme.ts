import { useThemeStore } from "@/stores/themeStore"

export const useTheme = () => {
    const { theme, setTheme } = useThemeStore()

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        localStorage.setItem("@blog-cms/theme", newTheme)
        document.body.classList.remove(theme);
        document.body.classList.add(newTheme);
    }

    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem("@blog-cms/theme")
        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme)
        }

        if (savedTheme) {
            document.body.classList.add(savedTheme);
        }else{
            document.body.classList.add("light");
        }
    }

    return {
        theme,
        toggleTheme,
        getSavedTheme
    }
}