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
        "Aux fins de la présente Politique de confidentialité, les termes ci-après ont la signification suivante. Lorsqu'un terme est défini au singulier, il s'entend également au pluriel et inversement lorsque le contexte l'exige.",
      ],
      list: [
        "<strong>« SDS-RH » ou « Plateforme » :</strong> désigne le logiciel de gestion des ressources humaines proposé en mode SaaS (Software as a Service), édité par Shalom Digital Solutions.",
        "<strong>« Éditeur » :</strong> désigne Shalom Digital Solutions, propriétaire et exploitant de la plateforme SDS-RH.",
        "<strong>« Organisation » ou « Client » :</strong> toute personne morale, entreprise, administration publique, collectivité, ONG, établissement scolaire, établissement de santé ou toute autre structure utilisant SDS-RH pour gérer ses ressources humaines.",
        "<strong>« Utilisateur » :</strong> toute personne physique autorisée à accéder à SDS-RH, notamment le Super Administrateur, l'Administrateur, le Responsable RH, le Manager, le Comptable, le Recruteur ou l'Employé.",
        "<strong>« Personne concernée » :</strong> toute personne physique dont les données personnelles sont traitées dans SDS-RH.",
        "<strong>« Données à caractère personnel » :</strong> toute information se rapportant directement ou indirectement à une personne physique identifiée ou identifiable.",
        "<strong>« Données sensibles » :</strong> toute donnée bénéficiant d'une protection particulière en vertu de la législation applicable, notamment les données relatives à la santé, aux sanctions disciplinaires, aux informations biométriques lorsqu'elles sont utilisées, ainsi qu'à toute autre catégorie reconnue comme sensible par la réglementation.",
        "<strong>« Traitement » :</strong> toute opération réalisée sur des données personnelles, notamment la collecte, l'enregistrement, l'organisation, la conservation, la consultation, la modification, la transmission, l'archivage ou la suppression.",
        "<strong>« Responsable du traitement » :</strong> l'Organisation cliente qui détermine les finalités et les moyens des traitements réalisés sur les données de ses employés.",
        "<strong>« Sous-traitant » :</strong> SDS-RH, lorsqu'il traite les données personnelles pour le compte de l'Organisation conformément aux présentes.",
        "<strong>« Espace de travail » ou « Tenant » :</strong> environnement informatique isolé réservé à une Organisation cliente.",
        "<strong>« Service » :</strong> l'ensemble des fonctionnalités proposées par SDS-RH."
      ],
    },
    { id: 'art2', number: 'Article 2 —', title: 'Objet de la Politique de confidentialité',
      paragraphs: [
        "La présente Politique de confidentialité décrit les modalités selon lesquelles SDS-RH collecte, utilise, stocke, protège, partage et supprime les données personnelles traitées dans le cadre de la fourniture de ses services.",
        "Elle informe les Organisations clientes, leurs employés, leurs collaborateurs ainsi que tout utilisateur autorisé de leurs droits concernant leurs données personnelles et des engagements pris par SDS-RH afin d'assurer un niveau élevé de sécurité, de confidentialité et de transparence.",
        "Cette Politique fait partie intégrante des Conditions Générales d'Utilisation et de Vente de SDS-RH. En cas de contradiction entre les présentes dispositions et les CGUV concernant la protection des données personnelles, les dispositions de la présente Politique prévalent."
      ],
    },
    { id: 'art3', number: 'Article 3 —', title: "Champ d'application",
      paragraphs: [
        "La présente Politique s'applique à toutes les données personnelles traitées par SDS-RH dans le cadre de l'utilisation de la Plateforme, quel que soit le pays d'établissement de l'Organisation cliente.",
        "Elle couvre notamment les traitements relatifs à la gestion administrative du personnel, au recrutement, à la paie, aux congés, aux absences, aux évaluations de performance, aux formations, aux documents RH, aux signatures électroniques, aux rapports statistiques ainsi qu'aux fonctionnalités d'intelligence artificielle intégrées à SDS-RH.",
        "Chaque Organisation demeure responsable des traitements qu'elle réalise sur les données de ses employés conformément à la législation qui lui est applicable. SDS-RH agit principalement en qualité de sous-traitant et n'utilise les données que pour fournir les services prévus au contrat."
      ],
    },
  ]},
  { title: 'Titre II — Responsable du traitement', articles: [
    { id: 'art4', number: 'Article 4 —', title: 'Identification du responsable du traitement',
      paragraphs: [
        "Les traitements de données réalisés au sein de chaque espace de travail sont effectués sous la responsabilité exclusive de l'Organisation cliente qui détermine les finalités poursuivies ainsi que les catégories de données enregistrées.",
        "Shalom Digital Solutions, éditeur de SDS-RH, intervient principalement comme sous-traitant technique en mettant à disposition une infrastructure sécurisée permettant le stockage, le traitement et la gestion des données personnelles pour le compte de ses clients.",
        "Dans certains cas limitativement prévus, notamment la gestion des comptes utilisateurs, la facturation, le support technique, la prévention de la fraude, la sécurité informatique et le respect des obligations légales, Shalom Digital Solutions peut agir en qualité de responsable de traitement indépendant."
      ],
    },
    { id: 'art5', number: 'Article 5 —', title: 'Coordonnées et contact',
      paragraphs: [
        "Toute question relative à la protection des données personnelles peut être adressée à Shalom Digital Solutions par courrier électronique ou par tout autre moyen de communication indiqué sur le site officiel de SDS-RH.",
        "Les demandes d'exercice des droits des personnes concernées sont traitées dans les meilleurs délais conformément aux exigences légales applicables.",
        "Les coordonnées administratives de l'Éditeur figurent dans les Mentions légales de la Plateforme et sont régulièrement mises à jour."
      ],
      list: [
        "<strong>Éditeur :</strong> Shalom Digital Solutions",
        "<strong>Plateforme :</strong> SDS-RH",
        "<strong>Email :</strong> contact@sds-rh.bj",
        "<strong>Adresse :</strong> <span class='placeholder'>À compléter</span>",
        "<strong>Téléphone :</strong> <span class='placeholder'>À compléter</span>"
      ],
    },
  ]},
  { title: 'Titre III — Données collectées', articles: [
    { id: 'art6', number: 'Article 6 —', title: 'Catégories de données collectées',
      paragraphs: [
        "Dans le cadre de la fourniture de ses services, SDS-RH peut traiter différentes catégories de données personnelles nécessaires au fonctionnement normal de la Plateforme.",
        "Seules les données strictement nécessaires aux finalités poursuivies sont collectées conformément au principe de minimisation des données."
      ],
      list: [
        "Informations d'identification.",
        "Informations professionnelles.",
        "Informations contractuelles.",
        "Informations salariales.",
        "Informations administratives.",
        "Documents RH.",
        "Historique des actions réalisées dans la Plateforme.",
        "Informations de connexion.",
        "Informations techniques relatives aux appareils utilisés.",
        "Préférences utilisateur."
      ],
    },
    { id: 'art7', number: 'Article 7 —', title: 'Données fournies par les Organisations',
      paragraphs: [
        "L'Organisation cliente est seule responsable des informations qu'elle importe ou saisit dans SDS-RH.",
        "Ces informations peuvent notamment concerner les employés, les candidats, les consultants, les stagiaires, les prestataires ou toute autre personne dont la gestion est assurée au moyen de la Plateforme."
      ],
      list: [
        "Nom et prénom.",
        "Photo.",
        "Sexe.",
        "Date et lieu de naissance.",
        "Adresse.",
        "Téléphone.",
        "Adresse électronique.",
        "Nationalité.",
        "Situation matrimoniale.",
        "Personne à contacter en cas d'urgence.",
        "Fonction.",
        "Département.",
        "Service.",
        "Contrat de travail.",
        "Salaire.",
        "Prime.",
        "Congés.",
        "Absences.",
        "Documents administratifs.",
        "Évaluations.",
        "Formations.",
        "Historique professionnel."
      ],
    },
    { id: 'art8', number: 'Article 8 —', title: 'Données techniques collectées automatiquement',
      paragraphs: [
        "Lors de l'utilisation de SDS-RH, certaines données techniques sont collectées automatiquement afin d'assurer la sécurité de la Plateforme, d'améliorer ses performances et de prévenir les accès non autorisés.",
        "Ces informations sont principalement utilisées à des fins de cybersécurité, d'administration système, de journalisation et de diagnostic."
      ],
      list: [
        "Adresse IP.",
        "Navigateur Internet.",
        "Système d'exploitation.",
        "Identifiant de session.",
        "Date et heure de connexion.",
        "Historique des authentifications.",
        "Journal des opérations réalisées.",
        "Cookies techniques.",
        "Préférences d'affichage.",
        "Informations relatives aux erreurs applicatives."
      ],
    },
  ]},
  { title: 'Titre IV — Finalités des traitements', articles: [
    { id: 'art9', number: 'Article 9 —', title: 'Finalités des traitements de données',
      paragraphs: [
        "SDS-RH traite les données à caractère personnel exclusivement dans le cadre de la fourniture de ses services de gestion des ressources humaines et pour répondre aux besoins opérationnels des Organisations clientes. Les traitements réalisés poursuivent des finalités déterminées, explicites et légitimes conformément aux principes du Code du numérique de la République du Bénin.",
        "Aucune donnée personnelle n'est collectée ou utilisée pour une finalité incompatible avec celles décrites dans la présente Politique. Lorsqu'une nouvelle finalité nécessiterait un traitement supplémentaire, les Organisations concernées en sont informées préalablement."
      ],
      list: [
        "Créer, administrer et sécuriser les comptes utilisateurs.",
        "Permettre l'authentification des utilisateurs.",
        "Gérer les espaces de travail des Organisations clientes.",
        "Administrer les dossiers des employés.",
        "Assurer la gestion des contrats de travail.",
        "Calculer les rémunérations, primes, retenues et cotisations.",
        "Gérer les congés, absences, permissions et heures supplémentaires.",
        "Produire les bulletins de paie et autres documents RH.",
        "Suivre les campagnes de recrutement.",
        "Administrer les candidatures et les entretiens.",
        "Organiser les formations professionnelles.",
        "Suivre les évaluations de performance.",
        "Générer des statistiques et tableaux de bord RH.",
        "Assurer la gestion documentaire.",
        "Permettre la signature électronique des documents.",
        "Envoyer des notifications et rappels automatiques.",
        "Réaliser des sauvegardes de sécurité.",
        "Détecter les anomalies techniques ou tentatives de fraude.",
        "Garantir la traçabilité des opérations réalisées dans la Plateforme.",
        "Respecter les obligations légales et réglementaires applicables.",
        "Améliorer la qualité, les performances et l'expérience utilisateur de SDS-RH."
      ],
    },
  ]},
  { title: 'Titre V — Bases juridiques des traitements', articles: [
    { id: 'art10', number: 'Article 10 —', title: 'Fondements juridiques des traitements',
      paragraphs: [
        "Chaque traitement de données personnelles réalisé par SDS-RH repose sur une base juridique clairement identifiée conformément au Code du numérique de la République du Bénin.",
        "Selon les traitements concernés, SDS-RH intervient soit comme sous-traitant agissant sur instruction de l'Organisation cliente, soit comme responsable de traitement pour ses propres obligations administratives, contractuelles ou légales."
      ],
      list: [
        "<strong>Exécution du contrat :</strong> fourniture des services SDS-RH aux Organisations clientes.",
        "<strong>Obligations légales :</strong> conservation de certaines informations comptables, fiscales ou administratives.",
        "<strong>Intérêt légitime :</strong> amélioration continue de la plateforme, prévention de la fraude, cybersécurité et protection des systèmes d'information.",
        "<strong>Consentement :</strong> lorsque celui-ci est exigé par la réglementation, notamment pour certaines communications ou fonctionnalités facultatives.",
        "<strong>Protection des intérêts vitaux :</strong> lorsque cela est nécessaire afin de protéger la vie ou la sécurité d'une personne.",
        "<strong>Mission d'intérêt public :</strong> lorsque la législation applicable l'impose à certaines Organisations clientes."
      ],
    },
  ]},
  { title: 'Titre VI — Sécurité, confidentialité et protection des données', articles: [
    { id: 'art11', number: 'Article 11 —', title: 'Mesures de sécurité',
      paragraphs: [
        "La protection des données personnelles constitue une priorité permanente pour SDS-RH. Des mesures techniques et organisationnelles appropriées sont mises en œuvre afin de préserver la confidentialité, l'intégrité, la disponibilité et la résilience des systèmes de traitement.",
        "Ces mesures sont régulièrement évaluées, renforcées et adaptées à l'évolution des risques de cybersécurité ainsi qu'à l'état de l'art."
      ],
      list: [
        "Chiffrement des communications via le protocole HTTPS/TLS.",
        "Chiffrement des mots de passe selon des algorithmes robustes.",
        "Isolation logique des espaces de travail (architecture Multi-Tenant).",
        "Gestion des accès basée sur les rôles (RBAC).",
        "Authentification sécurisée des utilisateurs.",
        "Journalisation des connexions et des opérations sensibles.",
        "Sauvegardes automatiques régulières.",
        "Restauration des données en cas d'incident.",
        "Protection contre les attaques informatiques courantes.",
        "Détection des tentatives d'accès non autorisées.",
        "Limitation des privilèges administratifs.",
        "Surveillance de l'infrastructure informatique.",
        "Mises à jour régulières des composants logiciels.",
        "Protection des bases de données contre les accès illicites.",
        "Procédures internes de gestion des incidents de sécurité."
      ],
    },
    { id: 'art12', number: 'Article 12 —', title: 'Confidentialité et accès aux données',
      paragraphs: [
        "Les données personnelles traitées dans SDS-RH ne sont accessibles qu'aux personnes dûment autorisées et uniquement dans la limite des missions qui leur sont confiées.",
        "Les collaborateurs de Shalom Digital Solutions susceptibles d'intervenir dans le cadre de l'assistance technique ou de la maintenance sont soumis à une obligation stricte de confidentialité. Ils n'accèdent aux données des clients qu'en cas de nécessité technique, sur demande ou avec l'autorisation de l'Organisation concernée lorsque cela est requis.",
        "SDS-RH s'interdit toute consultation, utilisation, reproduction, divulgation ou exploitation des données personnelles des Organisations clientes à des fins commerciales ou publicitaires."
      ],
    },
    { id: 'art13', number: 'Article 13 —', title: 'Gestion des violations de données personnelles',
      paragraphs: [
        "Toute violation de données personnelles susceptible d'engendrer un risque pour les droits et libertés des personnes concernées fait l'objet d'une procédure interne de gestion des incidents.",
        "Lorsqu'une violation est confirmée, SDS-RH prend toutes les mesures raisonnables pour limiter ses conséquences, rétablir la sécurité des systèmes concernés et informer, lorsque la réglementation l'impose, les Organisations clientes ainsi que les autorités compétentes.",
        "Chaque incident fait l'objet d'une analyse afin d'identifier son origine, d'évaluer ses impacts et de mettre en œuvre les mesures correctives destinées à prévenir sa réapparition."
      ],
      list: [
        "Détection et qualification de l'incident.",
        "Analyse des systèmes concernés.",
        "Isolation des éléments compromis.",
        "Correction des vulnérabilités identifiées.",
        "Notification des Organisations concernées lorsque cela est nécessaire.",
        "Documentation complète de l'incident.",
        "Mise en œuvre d'actions correctives et préventives."
      ],
    },
  ]},
  { title: 'Titre VII — Communication et partage des données', articles: [
    { id: 'art14', number: 'Article 14 —', title: 'Principe de confidentialité',
      paragraphs: [
        "Les données personnelles traitées au sein de la plateforme SDS-RH demeurent confidentielles. Elles ne sont ni vendues, ni louées, ni cédées, ni échangées à des fins commerciales.",
        "SDS-RH limite strictement l'accès aux données aux personnes habilitées et aux prestataires dont l'intervention est nécessaire à la fourniture du service, dans le respect des obligations contractuelles et légales applicables.",
        "Toute communication de données personnelles est effectuée conformément au principe de minimisation, selon lequel seules les informations strictement nécessaires sont transmises."
      ],
    },
    { id: 'art15', number: 'Article 15 —', title: 'Destinataires des données',
      paragraphs: [
        "Selon les fonctionnalités utilisées, les données personnelles peuvent être accessibles uniquement aux destinataires autorisés suivants :"
      ],
      list: [
        "Les administrateurs désignés par l'Organisation cliente.",
        "Les responsables des ressources humaines.",
        "Les managers autorisés.",
        "Les employés pour leurs propres informations personnelles.",
        "Les collaborateurs habilités de Shalom Digital Solutions dans le cadre du support technique.",
        "Les prestataires d'hébergement informatique.",
        "Les prestataires de paiement électronique.",
        "Les fournisseurs de messagerie électronique.",
        "Les services de notifications SMS ou WhatsApp lorsqu'ils sont activés.",
        "Les autorités administratives ou judiciaires légalement compétentes lorsqu'une obligation légale l'impose."
      ],
    },
    { id: 'art16', number: 'Article 16 —', title: 'Sous-traitants et prestataires techniques',
      paragraphs: [
        "SDS-RH peut faire appel à des sous-traitants spécialisés afin d'assurer certaines prestations nécessaires au fonctionnement de la plateforme, notamment l'hébergement, les sauvegardes, les paiements électroniques, les services de messagerie ou les notifications.",
        "Chaque sous-traitant est sélectionné pour ses garanties en matière de sécurité, de confidentialité et de conformité réglementaire. Des engagements contractuels appropriés sont conclus afin d'assurer un niveau de protection équivalent à celui prévu par la présente Politique.",
        "SDS-RH demeure responsable du choix de ses sous-traitants et veille à ce qu'ils n'utilisent les données personnelles que pour les finalités expressément prévues."
      ],
    },
    { id: 'art17', number: 'Article 17 —', title: 'Transfert international des données',
      paragraphs: [
        "Lorsque certains services nécessitent un hébergement ou un traitement des données en dehors de la République du Bénin, SDS-RH veille à ce que ces transferts soient réalisés conformément à la réglementation applicable et dans des conditions assurant un niveau de protection approprié.",
        "Lorsque la législation l'exige, des garanties contractuelles, techniques ou organisationnelles sont mises en place afin d'assurer la confidentialité et la sécurité des données transférées.",
        "Les Organisations clientes peuvent obtenir des informations complémentaires sur les transferts internationaux en adressant une demande au service chargé de la protection des données."
      ],
    },
  ]},
  { title: 'Titre VIII — Conservation et suppression des données', articles: [
    { id: 'art18', number: 'Article 18 —', title: 'Durée de conservation',
      paragraphs: [
        "Les données personnelles sont conservées uniquement pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, sauf lorsqu'une durée de conservation plus longue est imposée par une obligation légale ou réglementaire.",
        "Les durées de conservation sont régulièrement réévaluées afin de garantir leur adéquation avec les besoins opérationnels des Organisations clientes."
      ],
      list: [
        "<strong>Données des comptes utilisateurs :</strong> pendant toute la durée du compte puis selon les obligations légales applicables.",
        "<strong>Dossiers des employés :</strong> pendant la durée de la relation professionnelle puis pendant la durée d'archivage définie par la réglementation.",
        "<strong>Données de paie :</strong> conformément aux obligations comptables, fiscales et sociales applicables.",
        "<strong>Journaux de connexion :</strong> durée limitée aux besoins de sécurité informatique.",
        "<strong>Sauvegardes :</strong> conservation selon la politique interne de continuité d'activité.",
        "<strong>Documents RH :</strong> jusqu'à leur suppression par l'Organisation ou expiration des obligations légales."
      ],
    },
    { id: 'art19', number: 'Article 19 —', title: 'Suppression et réversibilité',
      paragraphs: [
        "À la demande de l'Organisation cliente ou à l'expiration du contrat, SDS-RH met à disposition les moyens permettant de récupérer les données dans un format couramment utilisé, sous réserve des limitations prévues par les CGUV.",
        "À l'issue de la période de réversibilité, les données sont supprimées ou anonymisées de manière sécurisée, sauf lorsqu'une conservation demeure imposée par la loi.",
        "Les opérations de suppression tiennent compte des contraintes techniques liées aux sauvegardes et aux mécanismes de continuité de service."
      ],
    },
  ]},
  { title: 'Titre IX — Cookies et technologies similaires', articles: [
    { id: 'art20', number: 'Article 20 —', title: 'Utilisation des cookies',
      paragraphs: [
        "SDS-RH utilise des cookies et des technologies similaires afin d'assurer le bon fonctionnement de la plateforme, d'améliorer l'expérience utilisateur et de renforcer la sécurité des connexions.",
        "Les cookies ne permettent pas, à eux seuls, d'identifier directement une personne physique. Ils contribuent notamment au maintien des sessions de connexion, à la mémorisation des préférences utilisateur et à l'amélioration des performances."
      ],
    },
    { id: 'art21', number: 'Article 21 —', title: 'Catégories de cookies',
      paragraphs: [
        "Selon les fonctionnalités utilisées, SDS-RH peut recourir aux catégories de cookies suivantes :"
      ],
      list: [
        "<strong>Cookies strictement nécessaires :</strong> indispensables au fonctionnement de la plateforme.",
        "<strong>Cookies de sécurité :</strong> prévention des accès frauduleux et protection des comptes.",
        "<strong>Cookies de session :</strong> maintien de l'authentification pendant la navigation.",
        "<strong>Cookies de préférences :</strong> mémorisation des paramètres d'affichage et de langue.",
        "<strong>Cookies de performance :</strong> amélioration des performances techniques.",
        "<strong>Cookies statistiques :</strong> mesure de fréquentation sous forme agrégée lorsque cette fonctionnalité est activée."
      ],
    },
    { id: 'art22', number: 'Article 22 —', title: 'Gestion des cookies',
      paragraphs: [
        "Les utilisateurs peuvent gérer ou supprimer certains cookies directement depuis les paramètres de leur navigateur Internet.",
        "Le refus de certains cookies peut toutefois limiter le fonctionnement normal de certaines fonctionnalités de la plateforme, notamment celles relatives à l'authentification et à la personnalisation de l'interface.",
        "Lorsque la réglementation impose le recueil du consentement pour certaines catégories de cookies, celui-ci est demandé avant leur dépôt."
      ],
    },
  ]},
  { title: 'Titre X — Droits des personnes concernées', articles: [
    { id: 'art23', number: 'Article 23 —', title: 'Droits des personnes concernées',
      paragraphs: [
        "Toute personne concernée par un traitement de données personnelles réalisé au moyen de la plateforme SDS-RH bénéficie des droits reconnus par la législation applicable en matière de protection des données personnelles.",
        "Lorsque SDS-RH intervient en qualité de sous-traitant, les demandes relatives à ces droits sont, en principe, transmises à l'Organisation cliente agissant comme responsable du traitement. SDS-RH apporte toute l'assistance raisonnablement nécessaire afin de permettre au responsable du traitement de répondre aux demandes dans les délais légaux."
      ],
      list: [
        "<strong>Droit à l'information :</strong> être informé de manière claire sur les traitements réalisés.",
        "<strong>Droit d'accès :</strong> obtenir la confirmation que des données personnelles sont traitées et en recevoir une copie lorsque les conditions légales sont réunies.",
        "<strong>Droit de rectification :</strong> demander la correction de données inexactes ou incomplètes.",
        "<strong>Droit à l'effacement :</strong> solliciter la suppression des données lorsque les conditions prévues par la loi sont remplies.",
        "<strong>Droit à la limitation du traitement :</strong> demander la suspension temporaire de certains traitements.",
        "<strong>Droit d'opposition :</strong> s'opposer, dans les cas prévus par la réglementation, à certains traitements fondés sur l'intérêt légitime.",
        "<strong>Droit à la portabilité :</strong> récupérer les données dans un format structuré lorsqu'il est applicable.",
        "<strong>Droit de retirer son consentement :</strong> lorsque le traitement repose sur le consentement."
      ],
    },
    { id: 'art24', number: 'Article 24 —', title: 'Exercice des droits',
      paragraphs: [
        "Toute demande relative à l'exercice des droits peut être adressée à l'Organisation cliente ou, lorsque cela est approprié, directement à Shalom Digital Solutions.",
        "Afin de préserver la confidentialité des informations, SDS-RH peut demander toute justification raisonnable permettant de vérifier l'identité du demandeur avant de communiquer des données personnelles.",
        "Les demandes sont traitées dans les meilleurs délais et conformément aux délais prévus par la réglementation applicable."
      ],
    },
    { id: 'art25', number: 'Article 25 —', title: 'Réclamations',
      paragraphs: [
        "Toute personne estimant que le traitement de ses données personnelles porte atteinte à ses droits peut adresser une réclamation à l'Organisation concernée ou à Shalom Digital Solutions.",
        "Lorsque la personne concernée estime que ses droits n'ont pas été respectés, elle peut également saisir l'Autorité de Protection des Données Personnelles (APDP) de la République du Bénin ou toute autre autorité compétente conformément à la législation applicable."
      ],
    },
  ]},
  { title: 'Titre XI — Intelligence artificielle et traitements automatisés', articles: [
    { id: 'art26', number: 'Article 26 —', title: 'Assistant intelligent SDS-RH',
      paragraphs: [
        "Certaines fonctionnalités de SDS-RH reposent sur des technologies d'intelligence artificielle destinées à assister les utilisateurs dans leurs activités de gestion des ressources humaines.",
        "Ces fonctionnalités peuvent notamment contribuer à la rédaction de documents, à l'analyse de certaines informations, à la génération de rapports, à la production de statistiques ou à la formulation de recommandations destinées à faciliter le travail des utilisateurs.",
        "Les résultats produits par l'assistant intelligent constituent une aide à la décision et ne remplacent jamais l'analyse, la validation ou la responsabilité des utilisateurs ou de l'Organisation cliente."
      ],
    },
    { id: 'art27', number: 'Article 27 —', title: "Protection des données utilisées par l'intelligence artificielle",
      paragraphs: [
        "SDS-RH met en œuvre les mesures nécessaires afin que les fonctionnalités d'intelligence artificielle respectent les principes de confidentialité, de sécurité et de minimisation des données.",
        "Les données traitées dans les espaces de travail des Organisations clientes ne sont ni vendues, ni exploitées à des fins publicitaires.",
        "Sauf autorisation expresse du Client ou obligation légale contraire, les données des Organisations clientes ne sont pas utilisées pour entraîner des modèles d'intelligence artificielle destinés à d'autres clients.",
        "Chaque Organisation demeure libre d'activer, de désactiver ou de limiter certaines fonctionnalités d'intelligence artificielle lorsqu'elles sont proposées comme fonctionnalités optionnelles."
      ],
    },
  ]},
  { title: 'Titre XII — Dispositions finales', articles: [
    { id: 'art28', number: 'Article 28 —', title: 'Modification de la Politique de confidentialité',
      paragraphs: [
        "Shalom Digital Solutions se réserve le droit de modifier la présente Politique de confidentialité afin de tenir compte des évolutions législatives, réglementaires, techniques ou fonctionnelles de la plateforme SDS-RH.",
        "Toute modification substantielle est portée à la connaissance des Organisations clientes par courrier électronique, notification sur la plateforme ou tout autre moyen approprié avant son entrée en vigueur.",
        "La poursuite de l'utilisation de SDS-RH après l'entrée en vigueur des modifications vaut prise de connaissance de la nouvelle version de la Politique."
      ],
    },
    { id: 'art29', number: 'Article 29 —', title: 'Droit applicable',
      paragraphs: [
        "La présente Politique de confidentialité est régie par le droit de la République du Bénin, notamment les dispositions du Livre V du Code du numérique relatives à la protection des données à caractère personnel, sans préjudice des autres règles nationales ou internationales applicables.",
        "Lorsque certaines Organisations clientes sont soumises à des réglementations particulières, elles demeurent responsables du respect de leurs propres obligations légales."
      ],
    },
    { id: 'art30', number: 'Article 30 —', title: 'Contact',
      paragraphs: [
        "Pour toute question relative à la présente Politique de confidentialité ou au traitement des données personnelles réalisé dans SDS-RH, les utilisateurs peuvent contacter Shalom Digital Solutions aux coordonnées figurant sur la plateforme.",
        "Les demandes relatives à la protection des données personnelles sont examinées avec diligence et confidentialité."
      ],
      list: [
        "<strong>Éditeur :</strong> Shalom Digital Solutions",
        "<strong>Plateforme :</strong> SDS-RH",
        "<strong>Email :</strong> contact@sds-rh.bj",
        "<strong>Téléphone :</strong> <span class='placeholder'>À compléter</span>",
        "<strong>Adresse :</strong> <span class='placeholder'>À compléter</span>"
      ],
    },
  ]},
];

const toc = [
  ['Titre I — Dispositions générales', [['art1', 'Art. 1 — Définitions'], ['art2', 'Art. 2 — Objet'], ['art3', "Art. 3 — Champ d'application"]]],
  ['Titre II — Responsable du traitement', [['art4', 'Art. 4 — Identification du responsable'], ['art5', 'Art. 5 — Coordonnées et contact']]],
  ['Titre III — Données collectées', [['art6', 'Art. 6 — Catégories de données'], ['art7', 'Art. 7 — Données fournies par les Organisations'], ['art8', 'Art. 8 — Données techniques']]],
  ['Titre IV — Finalités des traitements', [['art9', 'Art. 9 — Finalités des traitements']]],
  ['Titre V — Bases juridiques des traitements', [['art10', 'Art. 10 — Fondements juridiques']]],
  ['Titre VI — Sécurité, confidentialité et protection', [['art11', 'Art. 11 — Mesures de sécurité'], ['art12', 'Art. 12 — Confidentialité et accès'], ['art13', 'Art. 13 — Violations de données']]],
  ['Titre VII — Communication et partage des données', [['art14', 'Art. 14 — Principe de confidentialité'], ['art15', 'Art. 15 — Destinataires des données'], ['art16', 'Art. 16 — Sous-traitants'], ['art17', 'Art. 17 — Transfert international']]],
  ['Titre VIII — Conservation et suppression', [['art18', 'Art. 18 — Durée de conservation'], ['art19', 'Art. 19 — Suppression et réversibilité']]],
  ['Titre IX — Cookies et technologies similaires', [['art20', 'Art. 20 — Utilisation des cookies'], ['art21', 'Art. 21 — Catégories de cookies'], ['art22', 'Art. 22 — Gestion des cookies']]],
  ['Titre X — Droits des personnes concernées', [['art23', 'Art. 23 — Droits des personnes concernées'], ['art24', 'Art. 24 — Exercice des droits'], ['art25', 'Art. 25 — Réclamations']]],
  ['Titre XI — Intelligence artificielle', [['art26', 'Art. 26 — Assistant intelligent SDS-RH'], ['art27', 'Art. 27 — Protection des données IA']]],
  ['Titre XII — Dispositions finales', [['art28', 'Art. 28 — Modification de la Politique'], ['art29', 'Art. 29 — Droit applicable'], ['art30', 'Art. 30 — Contact']]]
] as const;

const legalHtml = (value: string) => ({ __html: value });

const PolitiqueDeConfidentialite: React.FC = () => {
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
            Politique de confidentialité
          </h1>
          <p className="text-[#6B6890] text-[15.5px] max-w-[680px]">
            La présente Politique de confidentialité décrit les modalités selon lesquelles SDS-RH collecte, utilise, stocke, protège, partage et supprime les données personnelles traitées dans le cadre de la fourniture de ses services de gestion des ressources humaines.
          </p>
          <div className="flex gap-5 flex-wrap mt-5 text-xs text-[#6B6890]">
            <span><b className="text-[#191A3D]">Version</b> 1.0</span>
            <span><b className="text-[#191A3D]">Applicable à compter du</b> 6 août 2026</span>
            <span><b className="text-[#191A3D]">Langue de référence</b> Français</span>
            <Link to="/confidentielle/conditions-d-utilisation">Voir les CGUV →</Link>
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
            La présente Politique de confidentialité complète les Conditions Générales d'Utilisation et de Vente (« CGUV ») de SDS-RH et précise les engagements de l'Éditeur en matière de protection des données à caractère personnel, conformément à la loi n° 2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin, modifiée par la loi n° 2020-35 du 6 janvier 2021 (ci-après « le Code du numérique »), notamment son Livre V relatif à la protection des données à caractère personnel.
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

              {section.title === 'Titre VII — Communication et partage des données' && (
                <p className="text-[14.5px] text-[#14132B] my-2.5">
                  Pour consulter le contrat complet : <Link to="/legal/conditions-generales-utilisation-vente">Conditions Générales d'Utilisation et de Vente</Link>.
                </p>
              )}
            </React.Fragment>
          ))}

          <div className="bg-[#F0FCFA] border border-[#BEEFE3] rounded-xl p-4 text-[13px] text-[#0B4A3E] mt-10">
            <b className="text-[#08322A]">Fin de la Politique de confidentialité.</b> Pour toute question, contactez-nous à contact@sds-rh.bj.
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
            <Link to="/confidentielle/conditions-d-utilisation" className="text-[#B9B6E3] mx-2 hover:text-white">Conditions Générales d'Utilisation et de Vente</Link>·
            <Link to="/register" className="text-[#B9B6E3] mx-2 hover:text-white">Créer un compte</Link>
          </div>
          <div className="mt-3">© 2026 SDS-RH. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
};

export default PolitiqueDeConfidentialite;