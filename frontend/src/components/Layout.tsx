import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../public/acchu_logo.png';
//import HeartbeatLoader  from './HeartbeatLoader';
import {
  LayoutDashboard,
  Database,
  Users,
  Bell,
  Syringe,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Heart,
  Search,
  Activity,
  HeartPulse,
  Bug,
  Stethoscope,
  Thermometer,
  Wind,
  Droplet,
  FlaskConical,
  CircleDot,
} from 'lucide-react';


interface NavigationItem {
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  hasSubmenu?: boolean;
  children?: NavigationItem[];
}

interface LayoutProps {
  children: React.ReactNode;
}

// Animation Components
const FloatingParticles: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${15 + Math.random() * 10}s infinite ease-in-out`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
);

const RippleButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setTimeout(() => setRipple(null), 600);
    onClick?.();
  };

  return (
    <div className="relative overflow-hidden rounded-xl" onClick={handleClick}>
      {children}
      {ripple && (
        <div
          className="absolute w-8 h-8 bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x - 16,
            top: ripple.y - 16,
          }}
        />
      )}
    </div>
  );
};

const PulseGlow: React.FC<{ children: React.ReactNode; active?: boolean }> = ({
  children,
  active = false
}) => (
  <div className="relative">
    {active && (
      <div className="absolute inset-0 bg-blue-400 rounded-xl blur-md opacity-20 animate-pulse" />
    )}
    {children}
  </div>
);

const AnimatedHealthIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
    <div className="relative">
      <HeartPulse className="h-4 w-4 text-green-500 animate-pulse" />
      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
    </div>
    <span className="text-xs font-medium text-green-700">System Active</span>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<{ [key: string]: boolean }>({});
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, hasPageAccess } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Add CSS animations to global styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(180deg); }
      }
      @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
      }
      @keyframes slideIn {
        0% { opacity: 0; transform: translateX(-20px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
        50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
      }
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-ripple { animation: ripple 0.6s linear; }
      .animate-slide-in { animation: slideIn 0.3s ease-out; }
      .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
      .animate-glow { animation: glow 2s ease-in-out infinite; }
      .animate-bounce-in { animation: bounceIn 0.6s ease-out; }
      .sidebar-transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      .content-transition { transition: all 0.3s ease-in-out; }
    `;
    document.head.appendChild(style);
    return () => {
      // ensure cleanup returns void (removeChild returns the removed node, so wrap in block)
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((mainContentRef.current?.scrollTop ?? 0) > 10);
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
    }
    return () => mainContent?.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Masters', href: '/masters', icon: Database },
    { name: 'User Management', href: '/user-management', icon: Users },

    // Notification Dropdown
    {
      name: 'Notification',
      icon: Bell,
      hasSubmenu: true,
      children: [
        {
          name: 'Malaria',
          href: '/malaria-listing',
          icon: Bug,
          hasSubmenu: true,
          children: [
            { name: 'Notification', href: '/malaria-entry' },
            { name: 'Listing', href: '/malaria-listing' },
          ]
        },
        {
          name: 'TB',
          href: '/tb-notification',
          icon: Stethoscope,
          hasSubmenu: true,
          children: [
            { name: 'Notification', href: '/tb-notification' },
            { name: 'Screening', href: '/tb-screening' },
            { name: 'TB Listing', href: '/tb-listing' },
          ]
        },
        {
          name: 'Fever & Rash',
          href: '/fever-rash-entry',
          icon: Thermometer,
          hasSubmenu: true,
          children: [
            { name: 'New Entry', href: '/fever-rash-entry' },
            { name: 'Notification Listing', href: '/fever-rash-notifications' },
          ]
        },
        {
          name: 'ARI',
          href: '/ari-notification',
          icon: Wind,
          hasSubmenu: true,
          children: [
            { name: 'Notification', href: '/ari-notification' },
            { name: 'Listing', href: '/ari-listing' },
          ]
        },
        {
          name: 'Polio',
          href: '/polio-case-listing',
          icon: CircleDot,
          hasSubmenu: true,
          children: [
            { name: 'Case Listing', href: '/polio-case-listing' },
            { name: 'Investigation', href: '/polio-investigation' },
          ]
        },
        {
          name: 'Hemorrhagic ds',
          href: '/hemorrhagic-diseases',
          icon: Droplet,
          hasSubmenu: true,
          children: [
            { name: 'New Entry', href: '/hemorrhagic-diseases' },
            { name: 'Notification Listing', href: '/hemorrhagic-notification-listing' },
          ]
        },
        {
          name: 'Viral Hepatitis',
          href: '/hev-notification',
          icon: FlaskConical,
          hasSubmenu: true,
          children: [
            { name: 'HAV', href: '/hav-listing' },
            { name: 'HBV', href: '/hbv-listing' },
            { name: 'HCV', href: '/hcv-listing' },
            { name: 'HEV', href: '/hev-listing' },
          ]
        },
      ],
    },

    // Reporting Dropdown
    {
      name: 'Reporting',
      icon: FileText,
      hasSubmenu: true,
      children: [
        { name: 'Vaccination Report', href: '/vaccination-report' },
        { name: 'Malaria Report', href: '/malaria-report' },
      ],
    },

    // Vaccination Dropdown
    {
      name: 'Vaccination',
      icon: Syringe,
      hasSubmenu: true,
      children: [
        { name: 'Vaccination Reporting Form', href: '/vaccin-report' },
        { name: 'Vaccination Listing Search', href: '/vaccination-listing' },
      ],
    },

    // Support & Help
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Contact', href: '/contact', icon: HeartPulse },
  ];

  // Filter navigation items by user permissions (super admin sees all)
  const filterNavItems = (items: NavigationItem[]): NavigationItem[] => {
    return items
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterNavItems(item.children);
          if (filteredChildren.length === 0) return null;
          return { ...item, children: filteredChildren };
        }
        // leaf item — check access
        if (item.href && item.href !== '#' && !hasPageAccess(item.href)) return null;
        return item;
      })
      .filter(Boolean) as NavigationItem[];
  };

  const enhancedNavigation: NavigationItem[] = filterNavItems(
    navigation.map(item => {
      if (item.hasSubmenu && item.children) {
        return {
          ...item,
          children: item.children.map(child => ({
            ...child,
            hasSubmenu: (child as any).children !== undefined
          }))
        };
      }
      return item;
    })
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    const checkActivePath = (item: NavigationItem): boolean => {
      if (item.href && isActive(item.href)) return true;
      if (item.children) {
        return item.children.some(child => {
          if (child.href && isActive(child.href)) return true;
          if ((child as any).children) {
            return (child as any).children.some((nestedChild: any) =>
              nestedChild.href && isActive(nestedChild.href)
            );
          }
          return false;
        });
      }
      return false;
    };

    enhancedNavigation.forEach((item) => {
      if (item.hasSubmenu && checkActivePath(item)) {
        setSubmenuOpen(prev => ({ ...prev, [item.name]: true }));
      }
    });
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const Icon = item.icon;
    const active = item.href ? isActive(item.href) : false;
    const submenuVisible = submenuOpen[item.name];
    const marginLeft = level * 4;

    return (
      <div key={item.name} className="group relative animate-slide-in">
        <RippleButton>
          <Link
            to={item.href ?? '#'}
            onClick={(e) => {
              if (item.hasSubmenu) {
                e.preventDefault();
                setSubmenuOpen((prev) => ({
                  ...prev,
                  [item.name]: !prev[item.name],
                }));
              } else {
                setSidebarOpen(false);
              }
            }}
            className={`group flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden border ${active
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border-blue-400 animate-glow'
              : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 border-transparent hover:border-blue-200'
              } transform hover:scale-[1.02] active:scale-[0.98]`}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <PulseGlow active={active}>
              <div
                className={`mr-4 p-2 rounded-lg transition-all duration-300 ${active
                  ? 'bg-white/20 shadow-inner'
                  : 'bg-slate-100 group-hover:bg-white group-hover:shadow-sm'
                  }`}
              >
                {Icon ? (
                  <Icon className={`h-5 w-5 transition-all duration-300 ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-500'
                    }`} />
                ) : (
                  <div className="h-5 w-5" />
                )}
              </div>
            </PulseGlow>

            {!collapsed && (
              <span className="flex-1 text-left font-medium">{item.name}</span>
            )}

            {item.hasSubmenu && !collapsed && (
              <ChevronDown
                className={`ml-auto h-4 w-4 transition-all duration-300 ${submenuVisible ? 'rotate-180' : ''
                  } ${active ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-600'}`}
              />
            )}

            {/* Active indicator dot */}
            {active && !item.hasSubmenu && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </Link>
        </RippleButton>

        {collapsed && (
          <div className="absolute left-full top-2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-lg">
            {item.name}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
          </div>
        )}

        {item.hasSubmenu && submenuVisible && !collapsed && item.children && (
          <div className="mt-1 space-y-1 animate-fade-in-up">
            {item.children.map((child, index) => {
              const childActive = child.href ? isActive(child.href) : false;

              if ((child as any).hasSubmenu && (child as any).children) {
                return renderNavigationItem(child as NavigationItem, level + 1);
              }

              return (
                <Link
                  key={child.name}
                  to={child.href || '#'}
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-all duration-300 transform hover:translate-x-1 ${childActive
                    ? 'bg-blue-100 text-blue-800 font-medium border-l-4 border-blue-500'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  style={{
                    marginLeft: `${(level + 1) * 4}px`,
                    animationDelay: `${index * 50}ms`
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  {child.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <FloatingParticles />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 ${collapsed ? 'w-20' : 'w-72'
          } bg-white/90 backdrop-blur-xl border-r border-slate-200/60 transform transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0 sidebar-transition ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          } flex flex-col h-screen`}
      >
        <FloatingParticles />

        {/* Enhanced Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-700/20" />
          <div className="relative flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-6 w-6 text-white animate-pulse" />
            </div>
            {!collapsed && (
              <div className="animate-slide-in">
                <span className="text-xl font-bold text-white drop-shadow-lg">AccuHealth</span>
                <div className="text-xs text-blue-100/80 font-medium">Medical Suite</div>
              </div>
            )}
          </div>

          <div className="flex space-x-2 relative">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-white/80 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transform hover:scale-110"
            >
              <Menu className="h-5 w-5 transition-transform duration-300" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(false);
              }}
              className="lg:hidden text-white/80 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transform hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 overflow-y-auto mt-8 px-2 space-y-1 relative pb-20">
          {enhancedNavigation.map((item, index) => (
            <div
              key={item.name}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {renderNavigationItem(item)}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="flex-shrink-0 p-4 animate-fade-in-up">
            <AnimatedHealthIndicator />
          </div>
        )}
      </div>

      {/* Enhanced Main Content */}
      <div className="flex flex-col flex-1 lg:mt-0 content-transition">
        {/* Enhanced Top Bar */}
        <div className={`bg-white/80 backdrop-blur-xl border-b border-gray-200/60 h-16 px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'
          }`}>
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex items-center mr-20">
              <RippleButton>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-110 mr-4"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </RippleButton>

              {(() => {
                // Recursively find the deepest matching nav item and build breadcrumb
                const getPageInfo = (
                  items: NavigationItem[],
                  ancestors: string[] = []
                ): { title: string; breadcrumb: string[] } | null => {
                  for (const item of items) {
                    if (item.children) {
                      const found = getPageInfo(item.children, [...ancestors, item.name]);
                      if (found) return found;
                    }
                    if (item.href && isActive(item.href)) {
                      return { title: item.name, breadcrumb: [...ancestors, item.name] };
                    }
                  }
                  return null;
                };
                const pageInfo = getPageInfo(enhancedNavigation);
                const pageTitle = pageInfo?.title || 'Dashboard';
                const breadcrumb = pageInfo?.breadcrumb || ['Dashboard'];
                return (
                  <div className="animate-fade-in-up">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      {pageTitle}
                    </h1>
                    <div className="text-sm text-slate-500 mt-0.5 flex items-center space-x-1 flex-wrap">
                      {breadcrumb.map((crumb, i) => (
                        <span key={i} className="flex items-center space-x-1">
                          {i > 0 && <span className="text-slate-300 mx-1">›</span>}
                          <span className={i === breadcrumb.length - 1 ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                            {crumb}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex-1 flex items-center mr-6">
              <div className="flex items-center space-x-4 ml-auto">
                <RippleButton>
                  <button className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-300 transform hover:scale-110 group">
                    <Bell className="h-5 w-5 transition-transform group-hover:shake" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg animate-bounce-in">
                      3
                    </span>
                  </button>
                </RippleButton>

                <div className="relative" ref={userMenuRef}>
                  <RippleButton>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-3 text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl px-4 py-2.5 transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-blue-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg transition-transform duration-300 hover:rotate-12">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium transition-all duration-300">{user?.name || 'Admin User'}</div>
                        <div className="text-xs text-slate-500 transition-all duration-300">{user?.role || 'Administrator'}</div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </RippleButton>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/60 py-2 z-50 animate-bounce-in origin-top-right">
                      <div className="px-4 py-3 border-b border-slate-100/60">
                        <div className="text-sm font-medium text-slate-900">{user?.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                      </div>
                      <RippleButton>
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 group"
                        >
                          <LogOut className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
                          Sign out
                        </button>
                      </RippleButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-transparent" ref={mainContentRef}>
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;