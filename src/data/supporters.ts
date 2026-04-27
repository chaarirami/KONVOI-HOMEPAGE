import type { ImageMetadata } from 'astro';

import ventures1750 from '~/assets/images/supporters/1750-ventures.png';
import ifbInnovationsstarter from '~/assets/images/supporters/ifb-innovationsstarter.png';
import fueBsfz from '~/assets/images/supporters/fue-bsfz.jpg';
import aiStartupHub from '~/assets/images/supporters/ai-startup-hub.png';
import wipano from '~/assets/images/supporters/wipano.png';
import bmwk from '~/assets/images/supporters/bmwk.jpg';
import digitalHub from '~/assets/images/supporters/digital-hub.jpg';
import gateway49 from '~/assets/images/supporters/gateway49.jpg';
import invest from '~/assets/images/supporters/invest.png';
import techboost from '~/assets/images/supporters/techboost.png';
import hk100 from '~/assets/images/supporters/hk100.png';
import logistikInitiativeHamburg from '~/assets/images/supporters/logistik-initiative-hamburg.jpg';
import enterpriseEuropeNetwork from '~/assets/images/supporters/enterprise-europe-network.png';
import exist from '~/assets/images/supporters/exist.jpg';
import startupDock from '~/assets/images/supporters/startup-dock.png';

export interface Supporter {
  name: string;
  href: string;
  logo: ImageMetadata;
}

export const supporters: Supporter[] = [
  { name: '1750 Ventures', href: 'https://www.1750.ventures', logo: ventures1750 },
  { name: 'IFB Innovationsstarter', href: 'https://innovationsstarter.com', logo: ifbInnovationsstarter },
  { name: 'FuE BSFZ', href: 'https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerliche_Themengebiete/Forschungszulage/forschungszulage.html', logo: fueBsfz },
  { name: 'AI Startup Hub', href: 'https://www.aistartuphub.com', logo: aiStartupHub },
  { name: 'WIPANO', href: 'https://www.innovation-beratung-foerderung.de/INNO/Navigation/DE/WIPANO/wipano.html', logo: wipano },
  { name: 'BMWK', href: 'https://www.bafa.de/DE/Wirtschaft/Beratung_Finanzierung/Invest/invest_node.html', logo: bmwk },
  { name: 'Digital Hub Logistics & Commerce', href: 'https://www.digitalhub.hamburg', logo: digitalHub },
  { name: 'Gateway 49', href: 'https://www.gateway49.com/index.php', logo: gateway49 },
  { name: 'INVEST', href: 'https://www.bafa.de/DE/Wirtschaft/Beratung_Finanzierung/Invest/invest_node.html', logo: invest },
  { name: 'Techboost', href: 'https://telekomhilft.telekom.de/t5/TechBoost/ct-p/techboost', logo: techboost },
  { name: 'HK100', href: 'https://hk100.de', logo: hk100 },
  { name: 'Logistik-Initiative Hamburg', href: 'https://www.hamburg-logistik.net/blog/urbane-logistik-transport-mobilitaet/ueberall-sicher-parken-praeventive-sicherheitsloesung-fuer-lkw/', logo: logistikInitiativeHamburg },
  { name: 'Enterprise Europe Network', href: 'https://een.ec.europa.eu', logo: enterpriseEuropeNetwork },
  { name: 'EXIST', href: 'https://www.exist.de/DE/Home/inhalt.html', logo: exist },
  { name: 'Startup Dock', href: 'https://startupdock.de', logo: startupDock },
];
