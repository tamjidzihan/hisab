import {
  Banknote,
  BookOpen,
  Briefcase,
  Bus,
  Car,
  Coffee,
  CreditCard,
  Dumbbell,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  PawPrint,
  Plane,
  ShoppingBag,
  Smartphone,
  Tag,
  TrendingUp,
  Utensils,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export const CATEGORY_ICON_OPTIONS: Array<{
  name: string
  Icon: LucideIcon
}> = [
  { name: 'Home', Icon: Home },
  { name: 'Utensils', Icon: Utensils },
  { name: 'Zap', Icon: Zap },
  { name: 'Car', Icon: Car },
  { name: 'ShoppingBag', Icon: ShoppingBag },
  { name: 'HeartPulse', Icon: HeartPulse },
  { name: 'Briefcase', Icon: Briefcase },
  { name: 'Laptop', Icon: Laptop },
  { name: 'TrendingUp', Icon: TrendingUp },
  { name: 'Banknote', Icon: Banknote },
  { name: 'BookOpen', Icon: BookOpen },
  { name: 'Bus', Icon: Bus },
  { name: 'Coffee', Icon: Coffee },
  { name: 'CreditCard', Icon: CreditCard },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'Gift', Icon: Gift },
  { name: 'GraduationCap', Icon: GraduationCap },
  { name: 'PawPrint', Icon: PawPrint },
  { name: 'Plane', Icon: Plane },
  { name: 'Smartphone', Icon: Smartphone },
  { name: 'Wifi', Icon: Wifi },
  { name: 'Wrench', Icon: Wrench },
  { name: 'Tag', Icon: Tag },
]

export const getCategoryIcon = (name?: string): LucideIcon =>
  CATEGORY_ICON_OPTIONS.find((option) => option.name === name)?.Icon ?? Tag
