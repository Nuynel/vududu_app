import {Link, useRoute, useLocation} from "wouter";
import {CalendarIcon, DocumentIcon, PawIcon, GraphIcon, PeopleIcon, ContactsIcon, IconProps} from "../g_shared/icons";
import * as React from "react";
import {Paths} from "../g_shared/constants/routes";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";

const Menu = () => {
  const [matchDogsRoutes] = useRoute('/dogs/*?')
  const [matchLittersRoutes] = useRoute('/litters/*?')
  const [matchEventsRoutes] = useRoute(Paths.events_short)
  const [matchHistoryRoutes] = useRoute(Paths.history_short)
  const [matchProfileRoutes] = useRoute(Paths.profile)
  const [matchContactsRoutes] = useRoute(Paths.contacts)
  const [matchDocumentsRoutes] = useRoute(Paths.documents)
  const [matchPedigreesRoutes] = useRoute(Paths.pedigrees)
  const {isSmall} = useResponsiveGrid()

  const DesktopMenuConfig: {
    icon: (props: IconProps) => JSX.Element,
    to: string,
    title: { ru: string, en: string },
    routeComparison: boolean
  }[] = [
    {
      icon: PeopleIcon,
      to: Paths.profile,
      title: { ru: 'Профиль', en: 'Profile'},
      routeComparison: matchProfileRoutes
    },
    {
      icon: ContactsIcon,
      to: Paths.contacts,
      title: { ru: 'Контакты', en: 'Contacts'},
      routeComparison: matchContactsRoutes
    },
    {
      icon: PawIcon,
      to: Paths.dogs,
      title: { ru: 'Собаки', en: 'Dogs'},
      routeComparison: matchDogsRoutes
    },
    {
      icon: PawIcon,
      to: Paths.litters,
      title: { ru: 'Пометы', en: 'Litters'},
      routeComparison: matchLittersRoutes
    },
    {
      icon: CalendarIcon,
      to: Paths.events,
      title: { ru: 'События', en: 'Events'},
      routeComparison: matchEventsRoutes || matchHistoryRoutes
    },
    {
      icon: DocumentIcon,
      to: Paths.documents,
      title: { ru: 'Документы', en: 'Documents'},
      routeComparison: matchDocumentsRoutes
    },
    {
      icon: GraphIcon,
      to: Paths.pedigrees,
      title: { ru: 'Родословные', en: 'Pedigrees'},
      routeComparison: matchPedigreesRoutes
    }
  ]

  const MobileMenuConfig: {
    icon: (props: IconProps) => JSX.Element,
    to: string,
    routeComparison: boolean
  }[] = [
    {
      icon: PeopleIcon,
      to: Paths.contacts,
      routeComparison: matchContactsRoutes
    },
    {
      icon: PawIcon,
      to: Paths.dogs,
      routeComparison: matchDogsRoutes || matchLittersRoutes
    },
    {
      icon: CalendarIcon,
      to: Paths.events,
      routeComparison: matchEventsRoutes || matchHistoryRoutes
    },
    {
      icon: DocumentIcon,
      to: Paths.documents,
      routeComparison: matchDocumentsRoutes
    },
    {
      icon: GraphIcon,
      to: Paths.pedigrees,
      routeComparison: matchPedigreesRoutes
    }
  ]

  if (isSmall) {
    return (
      <nav className="grid-area-nav h-16 flex items-center justify-around border-t border-gray-200 bg-white shadow-md">
        {MobileMenuConfig.map((config, index) => {
          const DynamicIcon = config.icon
          return (
            <Link key={index} to={`~${config.to}`}>
              <button className="p-2">
                <DynamicIcon color={config.routeComparison ? '#3b82f6' : '#9ca3af'} />
              </button>
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="grid-area-nav gap-2 py-4 px-2 flex flex-col justify-start bg-gray-200">
      {DesktopMenuConfig.map((config, index) => {
        const DynamicIcon = config.icon
        return (
          <Link key={index} to={`~${config.to}`}>
            <button className={`flex gap-2 px-5 w-full h-9 items-center p-2 text-left rounded-md hover:bg-gray-200 hover:text-gray-700 transition-all duration-300 ${config.routeComparison ? 'text-gray-700' : 'text-gray-500'}`}>
              <DynamicIcon color={config.routeComparison ? '#3b82f6' : '#9ca3af'} />
              <span className={`ml-2`}>{config.title.ru}</span>
            </button>
          </Link>
        )
      })}
    </nav>
  )
}

export default Menu;
