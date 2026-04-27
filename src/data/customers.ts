import type { ImageMetadata } from 'astro';

import quehenberger from '~/assets/images/customers/quehenberger.png';
import aircargoTransport from '~/assets/images/customers/aircargo-transport.png';
import logInCz from '~/assets/images/customers/log-in-cz.png';
import stiFreightManagement from '~/assets/images/customers/sti-freight-management.png';
import kipferLogistik from '~/assets/images/customers/kipfer-logistik.png';
import jjxLogistics from '~/assets/images/customers/jjx-logistics.png';
import huetter from '~/assets/images/customers/huetter.png';
import schumacherGruppe from '~/assets/images/customers/schumacher-gruppe.png';
import greilmeier from '~/assets/images/customers/greilmeier.png';
import lgi from '~/assets/images/customers/lgi.png';
import emde from '~/assets/images/customers/emde.png';
import urbaneoo from '~/assets/images/customers/urbaneoo.jpg';
import zemmi from '~/assets/images/customers/zemmi.png';
import vemo from '~/assets/images/customers/vemo.jpg';
import ktnrsGrossmann from '~/assets/images/customers/ktnrs-grossmann.png';

export interface Customer {
  name: string;
  href: string;
  logo: ImageMetadata;
}

export const customers: Customer[] = [
  { name: 'Quehenberger Logistics', href: 'https://www.quehenberger.com/de', logo: quehenberger },
  { name: 'Aircargo Transport', href: 'https://www.aircargo-transport.eu/', logo: aircargoTransport },
  { name: 'LOG-IN CZ', href: 'https://www.login-logistik.cz/', logo: logInCz },
  { name: 'STI Freight Management', href: 'https://www.sti-freight-management.com/de/index.php', logo: stiFreightManagement },
  { name: 'Kipfer Logistik', href: 'https://kipfer-logistik.ch/', logo: kipferLogistik },
  { name: 'JJX Logistics', href: 'https://www.jjxlogistics.co.uk/', logo: jjxLogistics },
  { name: 'Hütter Spedition', href: 'https://huetter-spedition.de', logo: huetter },
  { name: 'Schumacher Gruppe', href: 'https://schumacher.ac', logo: schumacherGruppe },
  { name: 'Greilmeier Spedition & Logistik', href: 'https://www.greilmeier.de/', logo: greilmeier },
  { name: 'LGI', href: 'https://lgigroup.com/de-de/', logo: lgi },
  { name: 'emde Speditions GmbH', href: 'https://modelogistik-emde.de/', logo: emde },
  { name: 'urbaneoo', href: 'https://www.urbaneoo.de', logo: urbaneoo },
  { name: 'zemmi', href: 'https://www.zemmi.de/', logo: zemmi },
  { name: 'VEMO Logistik', href: 'https://www.vemo-logistik.de/', logo: vemo },
  { name: 'KTNRS Grossmann Group', href: 'https://ktn-rslog.eu/wp/', logo: ktnrsGrossmann },
];
