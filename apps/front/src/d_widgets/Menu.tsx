import {Link, useRoute} from "wouter";
import {CalendarIcon, DocumentIcon, PawIcon, GraphIcon, PersonIcon, ContactsIcon, IconProps} from "../g_shared/icons";
import * as React from "react";
import {Paths} from "../g_shared/constants/routes";

const Menu = ({isDesktop}: {isDesktop: boolean}) => {
  const [matchDogsRoutes] = useRoute('/app/dogs/*?')
  const [matchLittersRoutes] = useRoute('/app/litters/*?')
  const [matchEventsRoutes] = useRoute('/app/events/*?')
  const [matchProfileRoutes] = useRoute(Paths.profile)
  const [matchContactsRoutes] = useRoute(Paths.contacts)
  const [matchDocumentsRoutes] = useRoute(Paths.documents)
  const [matchPedigreesRoutes] = useRoute(Paths.pedigrees)

  const DesktopMenuConfig: {
    icon: (props: IconProps) => JSX.Element,
    to: string,
    title: { ru: string, en: string },
    routeComparison: boolean
  }[] = [
    {
      icon: PersonIcon,
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
      routeComparison: matchEventsRoutes
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

  if (isDesktop) {
    return (
      <nav className="grid-area-nav py-4 px-2 flex flex-col justify-start">
        {DesktopMenuConfig.map(config => {
          const DynamicIcon = config.icon
          return (
            <Link to={config.to}>
              <button className="flex mb-3 px-5 w-full h-9 items-center p-2 text-left border-2 border-yellow-500 rounded-3xl">
                <DynamicIcon color={config.routeComparison ? '#e4b33a' : '#4c4c4c'} />
                <span className="ml-2">{config.title.ru}</span>
              </button>
            </Link>
          )
        })}
      </nav>
    )
  }

  const MobileMenuConfig: {
    icon: (props: IconProps) => JSX.Element,
    to: string,
    routeComparison: boolean
  }[] = [
    {
      icon: PersonIcon,
      to: Paths.profile,
      routeComparison: matchProfileRoutes || matchContactsRoutes
    },
    {
      icon: PawIcon,
      to: Paths.dogs,
      routeComparison: matchDogsRoutes || matchLittersRoutes
    },
    {
      icon: CalendarIcon,
      to: Paths.events,
      routeComparison: matchEventsRoutes
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

  return (
    <nav className="grid-area-nav h-16 flex items-center justify-around border-t border-gray-200">
      {MobileMenuConfig.map(config => {
        const DynamicIcon = config.icon
        return (
          <Link to={config.to}>
            <button className="p-2">
              <DynamicIcon color={config.routeComparison ? '#e4b33a' : '#4c4c4c'} />
            </button>
          </Link>
        )
      })}
    </nav>
  )
}

export default Menu;
