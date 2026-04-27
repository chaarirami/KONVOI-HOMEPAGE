import type { ImageMetadata } from 'astro';

import tapa from '~/assets/images/press/tapa.jpg';
import dvz from '~/assets/images/press/dvz.png';
import clusterForLogistics from '~/assets/images/press/cluster-for-logistics.png';
import startupCityHamburg from '~/assets/images/press/startup-city-hamburg.png';
import hamburgerAbendblatt from '~/assets/images/press/hamburger-abendblatt.jpg';
import svg from '~/assets/images/press/svg.png';
import kroneTv from '~/assets/images/press/krone-tv.png';
import futureHamburg from '~/assets/images/press/future-hamburg.png';
import businessAndPeople from '~/assets/images/press/business-and-people.jpg';
import ndr from '~/assets/images/press/ndr.png';

export interface PressEntry {
  name: string;
  href: string;
  logo: ImageMetadata;
}

export const pressLogos: PressEntry[] = [
  { name: 'TAPA Premier Partner 2026', href: 'https://tapaemea.org/organization/tapa-emea-premier-partners/', logo: tapa },
  { name: 'DVZ', href: 'https://www.dvz.de/unternehmen/detail/news/praeventiv-gegen-diebstahl.html', logo: dvz },
  { name: 'Cluster for Logistics', href: 'https://www.clusterforlogistics.lu/blog/httpswwwclusterforlogisticslublognews-5-5/shaping-tomorrow-s-transport-and-logistics-solutions-15', logo: clusterForLogistics },
  { name: 'Startup City Hamburg', href: 'https://www.youtube.com/watch?v=8n4WJyXVAnE', logo: startupCityHamburg },
  { name: 'Hamburger Abendblatt', href: 'https://www.abendblatt.de/hamburg/harburg/article238628911/Gegen-Diebe-Harburger-Startup-will-Lkw-sicherer-machen.html', logo: hamburgerAbendblatt },
  { name: 'SVG', href: 'https://www.svg-hessen.de/media/hvs_23_01/4-5/', logo: svg },
  { name: 'Krone TV', href: 'https://www.youtube.com/watch?v=dMwh4tJRnwI', logo: kroneTv },
  { name: 'Future Hamburg', href: 'https://www.youtube.com/watch?v=Ea_P7xxnL1I', logo: futureHamburg },
  { name: 'Business & People', href: 'https://www.business-people-magazin.de/people/kolumne/digital-kolumne/so-werden-lkw-diebe-abgeschreckt-28910/', logo: businessAndPeople },
  { name: 'NDR', href: 'https://www.youtube.com/watch?v=UCrg7erK-dc', logo: ndr },
];
