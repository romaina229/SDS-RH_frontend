import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Article = {
  id: string;
  number: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
};

const sections: Array<{ title: string; articles: Article[] }> = [
  { title: 'Titre I — Dispositions générales', articles: [
    { id: 'art1', number: 'Article 1 —', title: 'Définitions',
      paragraphs: [
        'Au sens des présentes CGUV, les termes ci-après ont la signification suivante :',
      ],
      list: [
        "<strong>« Plateforme » :</strong> le logiciel SaaS SDS-RH, accessible via un navigateur internet, comprenant l'ensemble de ses modules, interfaces et services associés.",
        '<strong>« Organisation » ou « Client » :</strong> toute personne morale (PME, ONG, entreprise privée, institution publique, école, hôpital ou toute autre structure) qui crée un espace de travail sur la Plateforme.',
        "<strong>« Espace de travail » ou « Tenant » :</strong> l'environnement numérique isolé et sécurisé propre à chaque Organisation, au sein duquel sont hébergées ses données.",
        "<strong>« Utilisateur » :</strong> toute personne physique autorisée par le Client à accéder à l'Espace de travail, quel que soit son rôle (Super Administrateur, Administrateur, Manager, Employé).",
        "<strong>« Données du Client » :</strong> l'ensemble des données, informations et contenus téléversés, saisis ou générés par le Client et ses Utilisateurs au sein de l'Espace de travail, y compris les données à caractère personnel de leurs employés.",
        "<strong>« Formule » ou « Offre » :</strong> le plan d'abonnement souscrit par le Client (Gratuit, Starter, Standard, Business ou Enterprise) tel que décrit sur la page tarifaire de la Plateforme.",
        '<strong>« Parties » :</strong> SDS-RH et le Client, pris ensemble ou séparément.',
      ],
    },
    { id: 'art2', number: 'Article 2 —', title: 'Objet',
      paragraphs: [
        "Les présentes CGUV ont pour objet de définir les conditions et modalités selon lesquelles SDS-RH met la Plateforme à disposition du Client, ainsi que les droits et obligations respectifs des Parties dans ce cadre, incluant les conditions financières applicables à la souscription d'une Formule payante.",
      ],
      list: [
      ],
    },
    { id: 'art3', number: 'Article 3 —', title: "Champ d'application et acceptation",
      paragraphs: [
        "Les présentes CGUV s'appliquent à toute création de compte et à toute utilisation de la Plateforme, sans restriction ni réserve. Elles priment sur tout autre document, sauf conditions particulières négociées et signées entre les Parties (notamment pour la Formule Enterprise). La création d'un compte, matérialisée par le clic sur la case « J'accepte les conditions générales d'utilisation et la politique de confidentialité », vaut acceptation pleine et entière des présentes CGUV par le Client et engage l'Organisation qu'il représente.",
        "Le Client déclare disposer de la capacité juridique et, le cas échéant, des pouvoirs nécessaires pour engager l'Organisation au nom de laquelle il crée l'Espace de travail.",
      ],
      list: [
      ],
    },
    { id: 'art4', number: 'Article 4 —', title: 'Mentions légales et contact',
      paragraphs: [
        "Éditeur : <span class='placeholder'>[Dénomination sociale]</span> — RCCM Cotonou n° <span class='placeholder'>[...]</span> — IFU n° <span class='placeholder'>[...]</span> — Siège social : <span class='placeholder'>[adresse]</span>, Cotonou, République du Bénin — Représentant légal : <span class='placeholder'>[Nom, qualité]</span> — Courriel : contact@sds-rh.bj — Téléphone : <span class='placeholder'>[+229 ...]</span>. Hébergement : les données sont hébergées par <span class='placeholder'>[nom de l’hébergeur]</span>, dont les coordonnées sont communiquées sur demande.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre II — Accès au service et gestion des comptes', articles: [
    { id: 'art5', number: 'Article 5 —', title: 'Création de compte et architecture multi-tenant',
      paragraphs: [
        "L'accès à la Plateforme suppose la création d'un compte Organisation par un représentant habilité du Client, qui devient de fait le premier Administrateur de l'Espace de travail. SDS-RH repose sur une architecture technique multi-tenant : chaque Organisation dispose d'un Espace de travail logiquement isolé, dont les données ne sont accessibles à aucune autre Organisation cliente. Le Client est seul responsable de l'exactitude des informations fournies lors de l'inscription et de leur mise à jour.",
      ],
      list: [
      ],
    },
    { id: 'art6', number: 'Article 6 —', title: "Niveaux d'accès et rôles utilisateurs",
      paragraphs: [
        "La Plateforme distingue quatre niveaux d'accès : Super Administrateur (gestion globale, réservée à SDS-RH), Administrateur de l'Organisation, Manager et Employé. Le Client est responsable de l'attribution des rôles à ses Utilisateurs et des conséquences de toute délégation d'accès à des données sensibles (paie, dossiers du personnel, documents RH).",
      ],
      list: [
      ],
    },
    { id: 'art7', number: 'Article 7 —', title: 'Sécurité des accès et identifiants',
      paragraphs: [
        "Chaque Utilisateur est responsable de la confidentialité de ses identifiants de connexion (adresse électronique et mot de passe). Le Client s'engage à informer SDS-RH sans délai de toute perte, vol ou utilisation non autorisée d'un compte. SDS-RH ne pourra être tenue responsable des conséquences résultant d'une négligence du Client ou de ses Utilisateurs dans la préservation de leurs identifiants.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre III — Description des services', articles: [
    { id: 'art8', number: 'Article 8 —', title: 'Modules et fonctionnalités',
      paragraphs: [
        "Selon la Formule souscrite, le Client accède à tout ou partie des dix modules fonctionnels de la Plateforme : Employés, Contrats, Présence, Congés, Paie, Recrutement, Formation, Performance, Documents RH et Rapports, ainsi qu'aux fonctionnalités différenciantes (multi-devises, cotisations sociales configurables par pays, jours fériés localisés, interface bilingue français/anglais, assistant IA appliqué aux ressources humaines, signature électronique).",
      ],
      list: [
      ],
    },
    { id: 'art9', number: 'Article 9 —', title: 'Essai gratuit',
      paragraphs: [
        "Les Formules payantes (Starter, Standard, Business) peuvent être précédées d'une période d'essai gratuit de quatorze (14) jours calendaires, sans engagement, permettant au Client de tester les fonctionnalités correspondantes. À l'expiration de la période d'essai, à défaut de résiliation, le Client est facturé selon la Formule et le cycle de facturation sélectionnés lors de l'inscription. La Formule Gratuite n'est pas soumise à une période d'essai et peut être utilisée sans limite de durée dans les limites de ses fonctionnalités.",
      ],
      list: [
      ],
    },
    { id: 'art10', number: 'Article 10 —', title: 'Évolution du service',
      paragraphs: [
        "SDS-RH se réserve le droit de faire évoluer la Plateforme (ajout, modification ou retrait de fonctionnalités mineures) afin d'en améliorer la performance, la sécurité ou l'ergonomie, sans que cela ne constitue une modification substantielle des présentes CGUV. Toute évolution majeure susceptible de réduire significativement les fonctionnalités d'une Formule souscrite fera l'objet d'une information préalable au Client avec un préavis raisonnable.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre IV — Conditions financières', articles: [
    { id: 'art11', number: 'Article 11 —', title: 'Formules et tarification',
      paragraphs: [
        "La Plateforme propose cinq Formules dont le tarif est fonction de l'effectif géré par l'Organisation : Gratuit (jusqu'à 5 employés), Starter (6 à 20 employés), Standard (21 à 50 employés), Business (51 à 150 employés) et Enterprise (plus de 150 employés, sur devis). Les tarifs en vigueur sont ceux affichés sur la page « Tarifs » de la Plateforme au moment de la souscription, exprimés au choix du Client en Francs CFA (FCFA), en Euros (EUR) ou en Dollars américains (USD), les montants en EUR et USD étant donnés à titre indicatif sur la base d'un taux de conversion pouvant être ajusté.",
      ],
      list: [
      ],
    },
    { id: 'art12', number: 'Article 12 —', title: 'Modalités de paiement',
      paragraphs: [
        "Le règlement des Formules payantes s'effectue par les moyens de paiement proposés sur la Plateforme, notamment FedaPay, Kkiapay (paiement mobile money adapté à l'Afrique de l'Ouest), carte bancaire (Visa, Mastercard), PayPal, ou virement bancaire pour les Formules Business et Enterprise. Le Client garantit disposer des autorisations nécessaires à l'utilisation du moyen de paiement choisi. Toute transaction fait l'objet d'une confirmation par voie électronique.",
      ],
      list: [
      ],
    },
    { id: 'art13', number: 'Article 13 —', title: 'Cycle de facturation et renouvellement',
      paragraphs: [
        'Le Client choisit, lors de la souscription, entre deux cycles de facturation :',
      ],
      list: [
        "<strong>Facturation mensuelle :</strong> sans engagement de durée, la facturation intervient au début de chaque mois d'abonnement et l'abonnement se renouvelle tacitement chaque mois sauf résiliation.",
        "<strong>Facturation annuelle :</strong> engagement de douze (12) mois consécutifs assorti d'une remise indicative de l'ordre de 17 % (soit deux mois offerts), facturée en une seule fois en début de période ; l'abonnement se renouvelle tacitement pour une durée équivalente sauf notification de résiliation adressée au moins sept (7) jours avant l'échéance.",
      ],
    },
    { id: 'art14', number: 'Article 14 —', title: 'Défaut de paiement',
      paragraphs: [
        "À défaut de paiement à l'échéance, SDS-RH adresse une notification au Client. Passé un délai de sept (7) jours à compter de cette notification sans régularisation, SDS-RH pourra suspendre l'accès aux fonctionnalités payantes de l'Espace de travail, sans préjudice de son droit de résilier l'abonnement conformément à l'Article 26. Les Données du Client restent accessibles en lecture seule pendant la durée de la suspension, dans la limite prévue à l'Article 28.",
      ],
      list: [
      ],
    },
    { id: 'art15', number: 'Article 15 —', title: 'Changement de Formule et prorata',
      paragraphs: [
        "Le Client peut à tout moment demander une mise à niveau (upgrade) ou une rétrogradation (downgrade) de sa Formule depuis son espace d'administration. Toute mise à niveau est facturée au prorata temporis de la période restant à courir ; toute rétrogradation prend effet à l'échéance de la période en cours, sans remboursement de la différence déjà facturée, sauf dispositions contraires prévues par une offre commerciale spécifique.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre V — Obligations des parties', articles: [
    { id: 'art16', number: 'Article 16 —', title: 'Obligations du Client',
      paragraphs: [
        "Le Client s'engage à :",
      ],
      list: [
        'utiliser la Plateforme conformément à sa destination et aux lois et règlements en vigueur en République du Bénin ;',
        "garantir l'exactitude, la licéité et la mise à jour des données saisies dans son Espace de travail, notamment les données à caractère personnel de ses employés ;",
        "obtenir, le cas échéant, l'ensemble des autorisations et informations nécessaires auprès de ses employés préalablement à l'enregistrement de leurs données dans la Plateforme ;",
        "ne pas utiliser la Plateforme à des fins frauduleuses, portant atteinte aux droits de tiers, ou de nature à compromettre la sécurité ou l'intégrité du service ;",
        "s'acquitter du paiement des sommes dues selon la Formule et le cycle de facturation souscrits.",
      ],
    },
    { id: 'art17', number: 'Article 17 —', title: 'Obligations de SDS-RH',
      paragraphs: [
        "SDS-RH s'engage à :",
      ],
      list: [
        'mettre en œuvre les moyens raisonnables pour assurer la disponibilité, la performance et la sécurité de la Plateforme ;',
        "garantir l'isolation stricte des données entre Organisations clientes conformément à l'architecture multi-tenant décrite à l'Article 5 ;",
        'traiter les données à caractère personnel conformément à la Politique de confidentialité et au Code du numérique ;',
        "informer le Client de toute interruption programmée susceptible d'affecter significativement l'accès au service ;",
        'assurer un support technique adapté au niveau de la Formule souscrite (communautaire, email, prioritaire ou dédié selon la Formule).',
      ],
    },
    { id: 'art18', number: 'Article 18 —', title: 'Propriété intellectuelle',
      paragraphs: [
        "La Plateforme, son code source, son architecture, ses interfaces, sa charte graphique, sa marque « SDS-RH » et l'ensemble des éléments qui la composent demeurent la propriété exclusive de SDS-RH ou de ses concédants et sont protégés par le droit de la propriété intellectuelle applicable en République du Bénin et dans l'espace OAPI (Organisation Africaine de la Propriété Intellectuelle). Les présentes CGUV n'emportent aucune cession de droits de propriété intellectuelle au profit du Client, lequel bénéficie uniquement d'un droit d'usage personnel, non exclusif et non cessible de la Plateforme, pour la durée de son abonnement.",
      ],
      list: [
      ],
    },
    { id: 'art19', number: 'Article 19 —', title: "Propriété et licence d'utilisation des Données du Client",
      paragraphs: [
        "Les Données du Client demeurent la propriété exclusive du Client. SDS-RH bénéficie d'une licence limitée, non exclusive, d'utilisation desdites données à la seule fin de fournir, maintenir, sécuriser et améliorer le service, dans le strict respect de la Politique de confidentialité. SDS-RH ne cède, ne vend ni ne loue les Données du Client à des tiers à des fins commerciales.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre VI — Données personnelles, hébergement et sécurité', articles: [
    { id: 'art20', number: 'Article 20 —', title: 'Protection des données à caractère personnel',
      paragraphs: [
        "Le traitement des données à caractère personnel réalisé dans le cadre de l'utilisation de la Plateforme est régi par la Politique de confidentialité de SDS-RH, partie intégrante des présentes CGUV, elle-même établie conformément au Livre V (« Protection des données à caractère personnel », articles 379 à 490) du Code du numérique et aux prescriptions de l'Autorité de Protection des Données Personnelles (APDP) du Bénin. Le Client agit en qualité de responsable de traitement pour les données de ses propres employés ; SDS-RH agit en qualité de sous-traitant au sens du Code du numérique.",
      ],
      list: [
      ],
    },
    { id: 'art21', number: 'Article 21 —', title: 'Hébergement et sécurité technique',
      paragraphs: [
        "Les Données du Client sont hébergées sur une infrastructure sécurisée faisant l'objet de sauvegardes régulières. SDS-RH met en œuvre des mesures techniques et organisationnelles raisonnables (chiffrement des échanges, cloisonnement logique des Espaces de travail, gestion des accès par rôle, journalisation) destinées à préserver la confidentialité, l'intégrité et la disponibilité des données, conformément à l'état de l'art et aux exigences du Code du numérique en matière de cybersécurité.",
      ],
      list: [
      ],
    },
    { id: 'art22', number: 'Article 22 —', title: 'Disponibilité et maintenance',
      paragraphs: [
        "SDS-RH s'efforce d'assurer une disponibilité continue de la Plateforme, sans toutefois garantir une disponibilité de 100 %, compte tenu des aléas inhérents à tout service en ligne. Des opérations de maintenance programmée peuvent entraîner une interruption temporaire d'accès ; elles sont, sauf urgence, annoncées au Client avec un préavis raisonnable. Les Formules Business et Enterprise peuvent bénéficier d'engagements de niveau de service (SLA) spécifiques, définis dans des conditions particulières.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre VII — Responsabilité et garanties', articles: [
    { id: 'art23', number: 'Article 23 —', title: 'Limitation de responsabilité',
      paragraphs: [
        "SDS-RH ne saurait être tenue responsable des dommages indirects (perte de chiffre d'affaires, perte de chance, atteinte à l'image, etc.) subis par le Client du fait de l'utilisation ou de l'impossibilité d'utiliser la Plateforme. Dans les limites autorisées par le droit béninois, la responsabilité totale de SDS-RH au titre des présentes CGUV, tous préjudices confondus, est plafonnée au montant des sommes effectivement versées par le Client au cours des douze (12) mois précédant le fait générateur du dommage.",
      ],
      list: [
      ],
    },
    { id: 'art24', number: 'Article 24 —', title: 'Garanties',
      paragraphs: [
        "SDS-RH garantit que la Plateforme est conforme à sa documentation fonctionnelle. Cette garantie ne s'applique pas en cas d'utilisation non conforme, de modification non autorisée, ou de dommage résultant d'un cas de force majeure ou du fait d'un tiers. Le Client demeure seul responsable de la conformité de ses pratiques RH internes (droit du travail, cotisations sociales, fiscalité) : la Plateforme est un outil d'aide à la gestion et ne saurait se substituer à un conseil juridique, comptable ou social.",
      ],
      list: [
      ],
    },
    { id: 'art25', number: 'Article 25 —', title: 'Force majeure',
      paragraphs: [
        "Aucune des Parties ne pourra être tenue responsable d'un manquement à ses obligations résultant d'un cas de force majeure, tel que reconnu par la jurisprudence et le droit OHADA, incluant notamment les catastrophes naturelles, coupures prolongées d'électricité ou de réseaux de télécommunications, actes des autorités publiques, ou toute circonstance échappant au contrôle raisonnable de la Partie concernée.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre VIII — Suspension, résiliation et réversibilité', articles: [
    { id: 'art26', number: 'Article 26 —', title: 'Suspension et résiliation pour manquement',
      paragraphs: [
        "En cas de manquement grave du Client à ses obligations (notamment défaut de paiement non régularisé, usage frauduleux ou illicite de la Plateforme), SDS-RH pourra, après mise en demeure restée infructueuse pendant sept (7) jours, suspendre puis résilier l'accès à la Plateforme, sans préjudice de tout dommage et intérêt auquel SDS-RH pourrait prétendre.",
      ],
      list: [
      ],
    },
    { id: 'art27', number: 'Article 27 —', title: "Résiliation à l'initiative du Client",
      paragraphs: [
        "Le Client peut résilier son abonnement à tout moment depuis son espace d'administration. Pour la Formule Mensuelle, la résiliation prend effet à la fin de la période en cours, sans remboursement de la période déjà facturée. Pour la Formule Annuelle, la résiliation en cours d'engagement n'ouvre pas droit à remboursement, sauf notification adressée au moins sept (7) jours avant la date de renouvellement automatique, qui empêche ce renouvellement pour la période suivante.",
      ],
      list: [
      ],
    },
    { id: 'art28', number: 'Article 28 —', title: 'Réversibilité et restitution des données',
      paragraphs: [
        "À l'issue de la résiliation ou de la suspension prolongée d'un Espace de travail, le Client dispose d'un délai de trente (30) jours calendaires pour exporter ses Données du Client au format usuel (PDF, Excel) directement depuis la Plateforme, ou en formuler la demande auprès du support. Passé ce délai, SDS-RH procède à la suppression définitive des données de l'Espace de travail concerné, sous réserve des durées de conservation légales rappelées dans la Politique de confidentialité.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre IX — Dispositions diverses', articles: [
    { id: 'art29', number: 'Article 29 —', title: 'Sous-traitance',
      paragraphs: [
        "SDS-RH peut recourir à des prestataires techniques (hébergement, paiement, messagerie, notifications SMS/WhatsApp) pour l'exécution du service, sous réserve que ces prestataires présentent des garanties suffisantes en matière de sécurité et de confidentialité et soient tenus par des obligations contractuelles au moins équivalentes à celles prévues aux présentes CGUV.",
      ],
      list: [
      ],
    },
    { id: 'art30', number: 'Article 30 —', title: 'Modification des CGUV',
      paragraphs: [
        "SDS-RH se réserve le droit de modifier les présentes CGUV, notamment pour tenir compte d'évolutions légales, réglementaires ou fonctionnelles. Toute modification substantielle est notifiée au Client par courrier électronique ou notification au sein de la Plateforme, avec un préavis minimum de quinze (15) jours avant son entrée en vigueur. La poursuite de l'utilisation de la Plateforme après cette date vaut acceptation des CGUV modifiées.",
      ],
      list: [
      ],
    },
    { id: 'art31', number: 'Article 31 —', title: 'Cession',
      paragraphs: [
        "Le Client ne peut céder ou transférer les droits et obligations résultant des présentes CGUV sans l'accord écrit préalable de SDS-RH. SDS-RH peut céder les présentes CGUV dans le cadre d'une opération de fusion, cession ou restructuration, sous réserve d'en informer le Client.",
      ],
      list: [
      ],
    },
    { id: 'art32', number: 'Article 32 —', title: 'Nullité partielle',
      paragraphs: [
        "Si une clause des présentes CGUV est déclarée nulle ou inapplicable par une juridiction compétente, les autres clauses conservent leur pleine force et effet. Les Parties s'efforceront de remplacer la clause invalidée par une clause valide se rapprochant le plus possible de son intention initiale.",
      ],
      list: [
      ],
    },
    { id: 'art33', number: 'Article 33 —', title: 'Non-renonciation',
      paragraphs: [
        "Le fait pour l'une des Parties de ne pas se prévaloir d'un manquement de l'autre Partie à l'une de ses obligations ne saurait être interprété pour l'avenir comme une renonciation à l'obligation en cause.",
      ],
      list: [
      ],
    },
    { id: 'art34', number: 'Article 34 —', title: 'Notifications',
      paragraphs: [
        "Toute notification requise au titre des présentes CGUV est valablement effectuée par courrier électronique à l'adresse déclarée par le Client lors de son inscription, ou par notification affichée au sein de la Plateforme.",
      ],
      list: [
      ],
    },
  ]},
  { title: 'Titre X — Droit applicable et règlement des litiges', articles: [
    { id: 'art35', number: 'Article 35 —', title: 'Langue',
      paragraphs: [
        "Les présentes CGUV sont rédigées en français. Une version anglaise, accessible depuis la Plateforme, est fournie à titre informatif ; en cas de divergence d'interprétation, la version française fait foi.",
      ],
      list: [
      ],
    },
    { id: 'art36', number: 'Article 36 —', title: 'Droit applicable et juridiction compétente',
      paragraphs: [
        "Les présentes CGUV sont soumises au droit de la République du Bénin, y compris les Actes uniformes de l'Organisation pour l'Harmonisation en Afrique du Droit des Affaires (OHADA) applicables aux relations commerciales entre les Parties. À défaut de résolution amiable dans les conditions de l'Article 37, tout litige relatif à la validité, l'interprétation ou l'exécution des présentes CGUV relève de la compétence exclusive des juridictions de Cotonou, République du Bénin, sauf disposition d'ordre public contraire.",
      ],
      list: [
      ],
    },
    { id: 'art37', number: 'Article 37 —', title: 'Règlement amiable et réclamations',
      paragraphs: [
        "En cas de différend, les Parties s'efforcent de rechercher une solution amiable avant toute action contentieuse. Toute réclamation peut être adressée au support de SDS-RH à l'adresse contact@sds-rh.bj. Les réclamations relatives au traitement des données à caractère personnel peuvent également être portées devant l'Autorité de Protection des Données Personnelles (APDP) du Bénin, conformément à l'Article 21 de la Politique de confidentialité.",
      ],
      list: [
      ],
    },
  ]},
];

const toc = [
  ['Titre I — Dispositions générales', [['art1', 'Art. 1 — Définitions'], ['art2', 'Art. 2 — Objet'], ['art3', "Art. 3 — Champ d'application"], ['art4', 'Art. 4 — Mentions légales']]],
  ['Titre II — Accès au service et gestion des comptes', [['art5', 'Art. 5 — Création de compte'], ['art6', 'Art. 6 — Rôles utilisateurs'], ['art7', 'Art. 7 — Sécurité des accès']]],
  ['Titre III — Description des services', [['art8', 'Art. 8 — Modules et fonctionnalités'], ['art9', 'Art. 9 — Essai gratuit'], ['art10', 'Art. 10 — Évolution du service']]],
  ['Titre IV — Conditions financières', [['art11', 'Art. 11 — Formules et tarification'], ['art12', 'Art. 12 — Modalités de paiement'], ['art13', 'Art. 13 — Cycle de facturation'], ['art14', 'Art. 14 — Défaut de paiement'], ['art15', 'Art. 15 — Changement de formule']]],
  ['Titre V — Obligations des parties', [['art16', 'Art. 16 — Obligations du Client'], ['art17', 'Art. 17 — Obligations de SDS-RH'], ['art18', 'Art. 18 — Propriété intellectuelle'], ['art19', 'Art. 19 — Données du Client']]],
  ['Titre VI — Données personnelles, hébergement et sécurité', [['art20', 'Art. 20 — Protection des données'], ['art21', 'Art. 21 — Hébergement et sécurité'], ['art22', 'Art. 22 — Disponibilité et maintenance']]],
  ['Titre VII — Responsabilité et garanties', [['art23', 'Art. 23 — Limitation de responsabilité'], ['art24', 'Art. 24 — Garanties'], ['art25', 'Art. 25 — Force majeure']]],
  ['Titre VIII — Suspension, résiliation et réversibilité', [['art26', 'Art. 26 — Suspension pour manquement'], ['art27', 'Art. 27 — Résiliation par le Client'], ['art28', 'Art. 28 — Réversibilité des données']]],
  ['Titre IX — Dispositions diverses', [['art29', 'Art. 29 — Sous-traitance'], ['art30', 'Art. 30 — Modification des CGUV'], ['art31', 'Art. 31 — Cession'], ['art32', 'Art. 32 — Nullité partielle'], ['art33', 'Art. 33 — Non-renonciation'], ['art34', 'Art. 34 — Notifications']]],
  ['Titre X — Droit applicable et règlement des litiges', [['art35', 'Art. 35 — Langue'], ['art36', 'Art. 36 — Droit et juridiction'], ['art37', 'Art. 37 — Règlement amiable']]]
] as const;

const legalHtml = (value: string) => ({ __html: value });

const ConditionsDUtilisation: React.FC = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F6FB] text-[#14132B]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .legal-title, .legal-heading, .legal-nav-title, .legal-logo {
          font-family: 'Space Grotesk', sans-serif;
        }
        .legal-mono { font-family: 'IBM Plex Mono', monospace; }
        .legal-content p, .legal-content li { text-align: justify; }
        .legal-content a { color: #5B4FE8; font-weight: 600; }
        .legal-content a:hover { text-decoration: underline; }
        .legal-content .placeholder {
          background: #FBF7EC;
          color: #6B5A28;
          padding: 1px 5px;
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: .92em;
        }
      `}</style>

      <header className="sticky top-0 z-50 bg-[#191A3D] py-4">
        <div className="max-w-[1180px] mx-auto px-7 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 96 96" width="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="14" y="58" width="20" height="20" rx="6.5" fill="#5B4FE8" />
              <rect x="38" y="40" width="25" height="25" rx="7.5" fill="#4A3FD6" />
              <rect x="64" y="16" width="30" height="30" rx="8.5" fill="#17C8A6" />
            </svg>
            <span className="legal-logo font-bold text-[19px] text-white">SDS<span className="text-[#17C8A6]">·</span>RH</span>
          </Link>
          <Link to="/" className="text-[#C7C5E8] text-[13.5px] font-medium hover:text-white">
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      <section className="bg-white border-b border-[#E4E1F5] py-12">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="inline-flex legal-mono text-xs uppercase tracking-wider text-[#5B4FE8] bg-[#5B4FE8]/10 border border-[#5B4FE8]/25 px-3 py-1.5 rounded-full mb-4">
            Document contractuel
          </div>
          <h1 className="legal-title text-[clamp(26px,3.6vw,38px)] font-bold text-[#191A3D] tracking-tight mb-3.5 max-w-[760px]">
            Conditions Générales d'Utilisation et de Vente
          </h1>
          <p className="text-[#6B6890] text-[15.5px] max-w-[680px]">
            Les présentes CGUV régissent l'accès et l'utilisation de la plateforme SDS-RH par toute organisation cliente et ses utilisateurs autorisés. Elles s'appliquent dès la création d'un compte sur la plateforme.
          </p>
          <div className="flex gap-5 flex-wrap mt-5 text-xs text-[#6B6890]">
            <span><b className="text-[#191A3D]">Version</b> 1.0</span>
            <span><b className="text-[#191A3D]">Applicable à compter du</b> 6 août 2026</span>
            <span><b className="text-[#191A3D]">Langue de référence</b> Français</span>
            <Link to="/confidentielle/politique-de-confidentialite">Voir la Politique de confidentialité →</Link>
          </div>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-7 grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-10 py-11 pb-[90px] items-start">
        <nav className="hidden lg:block sticky top-[88px] bg-white border border-[#E4E1F5] rounded-2xl p-[22px_20px] max-h-[calc(100vh-120px)] overflow-y-auto" aria-label="Sommaire">
          <h4 className="legal-mono text-xs uppercase tracking-wider text-[#6B6890] mb-3.5">Sommaire</h4>
          {toc.map(([title, links]) => (
            <React.Fragment key={title}>
              <div className="legal-nav-title text-[12.5px] font-bold text-[#191A3D] mt-4 mb-1.5 first:mt-0">{title}</div>
              {(links as unknown as Array<[string, string]>).map(([id, label]) => (
                <a key={id} href={`#${id}`} className="block text-[12.8px] text-[#6B6890] py-1 pl-2.5 border-l-2 border-[#E4E1F5] hover:text-[#5B4FE8] hover:border-[#5B4FE8]">
                  {label}
                </a>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <main className="legal-content bg-white border border-[#E4E1F5] rounded-2xl p-[44px_48px] max-[620px]:p-[30px_22px]">
          <p className="text-[15px] mb-5">
            <strong>Préambule.</strong> SDS-RH est une plateforme en ligne (« SaaS », Software as a Service) de gestion des ressources humaines, éditée par <span className="placeholder">Shalom Digital Solutions</span>, <span className="placeholder">Etablissement</span> de droit béninois au capital de <span className="placeholder">0</span> FCFA, immatriculée au Registre du Commerce et du Crédit Mobilier (RCCM) de Cotonou sous le numéro <span className="placeholder">[RCCM n°...]</span>, titulaire de l'Identifiant Fiscal Unique (IFU) <span className="placeholder">[IFU n°...]</span>, dont le siège social est situé <span className="placeholder">Togoudo</span>, Abomey-Calavi, République du Bénin (ci-après « SDS-RH », « l'Éditeur » ou « Nous »).
          </p>
          <p className="text-[15px] mb-5">
            Les présentes Conditions Générales d'Utilisation et de Vente (« CGUV ») régissent l'accès et l'utilisation de la plateforme SDS-RH par toute organisation cliente (« le Client », « l'Organisation ») et ses utilisateurs autorisés (« les Utilisateurs »). Elles s'inspirent des pratiques usuelles constatées chez les éditeurs de solutions RH comparables (Odoo RH, OrangeHRM, BambooHR) tout en intégrant les exigences du droit béninois, notamment la loi n° 2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin, modifiée par la loi n° 2020-35 du 6 janvier 2021 (ci-après « le Code du numérique »).
          </p>

          <div className="bg-[#F0FCFA] border border-[#BEEFE3] rounded-xl p-4 text-[13px] text-[#0B4A3E] my-[22px]">
            <b className="text-[#08322A]">ℹ Note.</b> Ce document est un modèle de référence, construit à partir des pratiques usuelles du marché SaaS RH et de la réglementation béninoise applicable.
          </div>

          {sections.map((section) => (
            <React.Fragment key={section.title}>
              <h2 className="legal-heading text-[21px] font-bold text-[#191A3D] mt-[46px] mb-[18px] pb-3 border-b-2 border-[#5B4FE8] scroll-mt-[90px]">
                {section.title}
              </h2>
              {section.articles.map((article) => (
                <article id={article.id} key={article.id} className="scroll-mt-[90px] my-7">
                  <h3 className="legal-heading text-[16.5px] font-bold text-[#191A3D] flex gap-2 flex-wrap">
                    <span className="text-[#5B4FE8]">{article.number}</span>
                    {article.title}
                  </h3>
                  {article.paragraphs?.map((paragraph, index) => (
                    <p key={index} className="text-[14.5px] text-[#14132B] my-2.5" dangerouslySetInnerHTML={legalHtml(paragraph)} />
                  ))}
                  {article.list && article.list.length > 0 && (
                    <ul className="my-2.5 pl-5 list-disc">
                      {article.list.map((item, index) => (
                        <li key={index} className="text-[14.5px] text-[#14132B] mb-2" dangerouslySetInnerHTML={legalHtml(item)} />
                      ))}
                    </ul>
                  )}
                </article>
              ))}

              {section.title === 'Titre VI — Données personnelles, hébergement et sécurité' && (
                <p className="text-[14.5px] text-[#14132B] my-2.5">
                  Pour consulter la politique complète : <Link to="/confidentielle/politique-de-confidentialite">Politique de confidentialité</Link>.
                </p>
              )}
            </React.Fragment>
          ))}

          <div className="bg-[#F0FCFA] border border-[#BEEFE3] rounded-xl p-4 text-[13px] text-[#0B4A3E] mt-10">
            <b className="text-[#08322A]">Fin des Conditions Générales d'Utilisation et de Vente.</b> Pour toute question, contactez-nous à contact@sds-rh.bj.
          </div>
        </main>
      </div>

      <a
        href="#"
        onClick={scrollTop}
        aria-label="Retour en haut"
        className={`fixed right-[26px] bottom-[26px] bg-[#5B4FE8] text-white w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-xl transition-all duration-200 ${showTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        ↑
      </a>

      <footer className="bg-[#101124] text-[#8683B8] py-[30px] text-center text-xs">
        <div className="max-w-[1180px] mx-auto px-7">
          <div>
            <Link to="/" className="text-[#B9B6E3] mx-2 hover:text-white">Accueil</Link>·
            <Link to="/confidentielle/politique-de-confidentialite" className="text-[#B9B6E3] mx-2 hover:text-white">Politique de confidentialité</Link>·
            <Link to="/register" className="text-[#B9B6E3] mx-2 hover:text-white">Créer un compte</Link>
          </div>
          <div className="mt-3">© 2026 SDS-RH. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
};

export default ConditionsDUtilisation;
