import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "../ui/switch"
import { Moon, Sun } from "lucide-react"

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked:any) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-gray-800"
      />
      <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
    </div>
  )
}
