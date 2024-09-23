export const TABS: Tab[] = [
  { name: 'Home', icon: '🏠', color: '#f8cc46', path: '/' },
  { name: 'Bonus', icon: '🎁', color: '#842221', path: '/bonus' },
  { name: 'Game', icon: '🎮', color: '#5c35c5', path: '/stub' },
  { name: 'Profile', icon: '👥', color: '#2596be', path: '/profile' },
];

export type Tab = {
  name: string,
  icon: string,
  color: string,
  path: string,
}