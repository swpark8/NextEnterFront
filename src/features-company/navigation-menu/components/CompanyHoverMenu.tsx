import { companyNavigationMenuData } from "../data/companyMenuData";

interface CompanyHoverMenuProps {
  tabId: string;
  onSubMenuClick?: (tabId: string, subId: string) => void;
}

export default function CompanyHoverMenu({ tabId, onSubMenuClick }: CompanyHoverMenuProps) {
  const menuData = companyNavigationMenuData[tabId as keyof typeof companyNavigationMenuData];

  if (!menuData || menuData.items.length === 0) return null;

  return (
    <div className="absolute left-0 -mt-2 top-full z-[60]">
      <div className="bg-white border border-gray-200 shadow-lg py-2 min-w-[200px]">
        <ul>
          {menuData.items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  if (onSubMenuClick) onSubMenuClick(tabId, item.id);
                }}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 transition hover:bg-gray-100 hover:text-purple-600"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
