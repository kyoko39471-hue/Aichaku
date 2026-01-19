// src/icons/iconMap.jsx

// 加载 closet 下的所有 svg
const closetModules = import.meta.glob('./closet/*.svg', {
  eager: true,
  import: 'default',
})

// 加载 beauty 下的所有 svg
const beautyModules = import.meta.glob('./beauty/*.svg', {
  eager: true,
  import: 'default',
})

// 加载 appliance 下的所有 svg（以后用）
const applianceModules = import.meta.glob('./appliance/*.svg', {
  eager: true,
  import: 'default',
})

// 公用方法：把 ./closet/hoodie-zip.svg → hoodieZip
function modulesToIconMap(modules) {
  return Object.fromEntries(
    Object.entries(modules).map(([path, src]) => {
      const name = path
        .split('/')
        .pop()
        .replace('.svg', '')
        .replace(/-([a-z])/g, (_, c) => c.toUpperCase())

      return [name, src]
    })
  )
}

// 3️⃣ 分类 ICONS
export const CLOSET_ICONS = modulesToIconMap(closetModules)
export const BEAUTY_ICONS = modulesToIconMap(beautyModules)
export const APPLIANCE_ICONS = modulesToIconMap(applianceModules)

// 4️⃣ 总 ICONS（Icon 组件用）
export const ICONS = {
  ...CLOSET_ICONS,
    ...BEAUTY_ICONS,
  ...APPLIANCE_ICONS,
}

// 5️⃣ 给选择器 / suggestions 用
export const ICON_NAMES = Object.keys(ICONS)
export const CLOSET_ICON_NAMES = Object.keys(CLOSET_ICONS)
export const BEAUTY_ICON_NAMES = Object.keys(BEAUTY_ICONS)
export const APPLIANCE_ICON_NAMES = Object.keys(APPLIANCE_ICONS)