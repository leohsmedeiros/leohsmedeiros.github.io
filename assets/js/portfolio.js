// portfolio.js
function createPortfolioItem(json) {
    const li = document.createElement('li');
    li.className = 'portfolio-item';
    li.setAttribute('data-groups', json.dataGroups.join(' '));

    const figure = document.createElement('figure');
    figure.className = 'portfolio-item-background';

    const img = document.createElement('img');
    img.src = json.imageSrc;
    img.alt = '';

    const divContainerLink = document.createElement('div');
    divContainerLink.className = 'portfolio-items-container-link';

    const divIconbox = document.createElement('div');
    divIconbox.className = 'iconbox-icon';

    // Mapping dataGroups to icon classes
    const iconMap = {
        "available": "fa-solid fa-store",
        "ios": "devicon-apple-plain",
        "android": "devicon-android-plain",
        "personal": "fa-solid fa-circle-user",
        "games": "devicon-unity-original",
        "hybrid": "devicon-flutter-plain"
    };

    json.dataGroups.forEach(group => {
        if (iconMap[group]) {
            const divChildIcon = document.createElement('div');
            divChildIcon.className = 'child';

            const spanIcon = document.createElement('span');
            spanIcon.className = iconMap[group];

            divChildIcon.appendChild(spanIcon);
            divIconbox.appendChild(divChildIcon);
        }
    });

    const divSpacer = document.createElement('div');
    divSpacer.className = 'spacer';

    const divChildText = document.createElement('div');
    divChildText.className = 'child';

    const pText = document.createElement('p');
    pText.textContent = json.title;

    divChildText.appendChild(pText);

    divIconbox.appendChild(divSpacer);
    divIconbox.appendChild(divChildText);

    divContainerLink.appendChild(divIconbox);

    const figcaption = document.createElement('figcaption');
    const divCaptionInner = document.createElement('div');
    divCaptionInner.className = 'caption-inner';

    const ul = document.createElement('ul');

    const liTitle = document.createElement('li');
    liTitle.className = 'portfolio-item-title';

    const h3 = document.createElement('h3');
    h3.textContent = json.title;

    liTitle.appendChild(h3);
    ul.appendChild(liTitle);

    json.links.forEach(link => {
        const liLink = document.createElement('li');
        liLink.className = 'portfolio-item-title';
        liLink.onclick = function() { location.href = link.url };

        const pLink = document.createElement('p');
        const uLink = document.createElement('u');
        uLink.textContent = link.name;

        pLink.appendChild(uLink);
        liLink.appendChild(pLink);
        ul.appendChild(liLink);
    });

    divCaptionInner.appendChild(ul);
    figcaption.appendChild(divCaptionInner);

    figure.appendChild(img);
    figure.appendChild(divContainerLink);
    figure.appendChild(figcaption);

    li.appendChild(figure);

    return li;
}

// This function will be called after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    jsonDataArray.forEach(jsonData => {
        const portfolioItem = createPortfolioItem(jsonData);
        document.getElementById('portfolio-list').appendChild(portfolioItem);
    });
});

const jsonDataArray = [
    {
        "title": "OneFootball",
        "imageSrc": "assets/images/onefootball.webp",
        "dataGroups": ["all", "available", "ios", "android", "hybrid"],
        "links": [
            {
                "name": "Google Play",
                "url": "https://play.google.com/store/apps/details?id=de.motain.iliga"
            },
            {
                "name": "App Store",
                "url": "https://apps.apple.com/br/app/onefootball-resultados-futebol/id382002079"
            }
        ]
    },
    {
        "title": "Openlane Buyer",
        "imageSrc": "assets/images/openlane_buyer.png",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            {
                "name": "App Store",
                "url": "https://apps.apple.com/us/app/openlane-buyer/id1175036411"
            }
        ]
    },
    {
        "title": "Openlane Uploader",
        "imageSrc": "assets/images/openlane_uploader.png",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            {
                "name": "App Store",
                "url": "https://apps.apple.com/us/app/openlane-uploader/id1186571028"
            }
        ]
    },
    {
        "title": "Peek Mobile",
        "imageSrc": "assets/images/peek.png",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            {
                "name": "App Store",
                "url": "https://apps.apple.com/in/app/peek-mobile/id1469535539"
            }
        ]
    },
    {
        "title": "Itaú cartões",
        "imageSrc": "assets/images/itau_cartoes.png",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            {
                "name": "App Store",
                "url": "https://apps.apple.com/br/app/ita%C3%BA-cart%C3%B5es-de-cr%C3%A9dito/id394401915"
            }
        ]
    },
    {
        "title": "Open Source Library: ShimmerFX",
        "imageSrc": "assets/images/ShimmerFX-simulation.gif",
        "dataGroups": ["all", "available", "personal", "ios"],
        "links": [
            {
                "name": "GitHub",
                "url": "https://github.com/leohsmedeiros/ShimmerFX"
            }
        ]
    },
    {
        "title": "My Mixtapez: Rap & Hip Hop",
        "imageSrc": "assets/images/my_mixtapez.png",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            {
                "name": "App Store",
                "url": "https://apps.apple.com/us/app/my-mixtapez-rap-hip-hop/id525781368"
            }
        ]
    },
    {
        "title": "Bird Id",
        "imageSrc": "assets/images/bird_id.png",
        "dataGroups": ["all", "available", "hybrid"],
        "links": [
            {
                "name": "Google Play",
                "url": "https://play.google.com/store/apps/details?id=br.com.vaultid.apps.authenticator"
            },
            {
                "name": "App Store",
                "url": "https://apps.apple.com/br/app/birdid/id1450002184?l=en"
            }
        ]
    },
    {
        "title": "Crabki",
        "imageSrc": "assets/images/crabki.png",
        "dataGroups": ["all", "available", "hybrid"],
        "links": [
            {
                "name": "Google Play",
                "url": "https://play.google.com/store/apps/details?id=com.crabki"
            },
            {
                "name": "App Store",
                "url": "https://apps.apple.com/br/app/crabki/id1537477957?l=en"
            }
        ]
    },
    {
        "title": "Konviva",
        "imageSrc": "assets/images/konviva.png",
        "dataGroups": ["all", "available", "hybrid"],
        "links": [
            {
                "name": "Google Play",
                "url": "https://play.google.com/store/apps/details?id=br.com.ilog.konviva.mobile.v1"
            },
            {
                "name": "App Store",
                "url": "https://apps.apple.com/br/app/konviva-mobile/id1341038233?l=en"
            }
        ]
    },
    {
        "title": "Beleza até você",
        "imageSrc": "assets/images/beleza_ate_voce.jpg",
        "dataGroups": ["all", "hybrid"],
        "links": [
            {
                "name": "Images",
                "url": "https://drive.google.com/drive/folders/1yUYqDUa_D-FZRzIQ2TnV_IBRkIdCWevE?usp=sharing"
            }
        ]
    },
    {
        "title": "Assine Online",
        "imageSrc": "assets/images/assine_online.jpg",
        "dataGroups": ["all", "hybrid"],
        "links": [
            {
                "name": "Images",
                "url": "https://drive.google.com/drive/folders/1HBxwhSWKqmmikz9zUn7NNQmAItW3WhdB?usp=sharing"
            }
        ]
    },
    {
        "title": "Irvem Rider",
        "imageSrc": "assets/images/irvem_rider.png",
        "dataGroups": ["all", "android", "ios"],
        "links": [
            {
                "name": "Video 1",
                "url": "https://drive.google.com/file/d/1QQetbWwSfruzn6ZGI2iYg8MVIaHHN3Hk/view?usp=sharing"
            },
            {
                "name": "Video 2",
                "url": "https://drive.google.com/file/d/1591dYlJMnz01NaBprXk90vnP58rq1gKS/view?usp=sharing"
            }
        ]
    },
    {
        "title": "Irvem Driver",
        "imageSrc": "assets/images/irvem_driver.png",
        "dataGroups": ["all", "android"],
        "links": [
            {
                "name": "Video",
                "url": "https://drive.google.com/file/d/1rprX_6QpR_H0ECM2ywLC7xef0rsHKIMR/view?usp=sharing"
            }
        ]
    },
    {
        "title": "Josh Journey: Darkness Totems",
        "imageSrc": "assets/images/josh_journey.jpg",
        "dataGroups": ["all", "available", "games"],
        "links": [
            {
                "name": "Steam",
                "url": "https://store.steampowered.com/app/1383280/Josh_Journey_Darkness_Totems"
            }
        ]
    },
    {
        "title": "Perigos da net",
        "imageSrc": "assets/images/perigos_da_net.jpeg",
        "dataGroups": ["all", "games"],
        "links": [
            {
                "name": "Video",
                "url": "https://www.youtube.com/watch?v=-doWpIhVIJI"
            }
        ]
    },
    {
        "title": "Tombo and the quest for the game over",
        "imageSrc": "assets/images/tombo.jpeg",
        "dataGroups": ["all", "games"],
        "links": [
            {
                "name": "Video",
                "url": "https://www.youtube.com/watch?v=sQZy7SwdnVg"
            }
        ]
    },
    {
        "title": "Castle Defender",
        "imageSrc": "assets/images/castle_defender.png",
        "dataGroups": ["all", "games"],
        "links": [
            {
                "name": "Video",
                "url": "https://www.youtube.com/watch?v=Hu-XobiTGqk"
            }
        ]
    },
    {
        "title": "Space Mesh",
        "imageSrc": "assets/images/space_mesh.jpg",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            {
                "name": "In progress ...",
                "url": "#"
            }
        ]
    },
    {
        "title": "Caçadores de Lendas",
        "imageSrc": "assets/images/cacadores_de_lendas.jpg",
        "dataGroups": ["all", "available", "personal", "games"],
        "links": [
            {
                "name": "Google Play",
                "url": "https://play.google.com/store/apps/details?id=com.inovapps.CacadoresDeLendas&hl=pt_BR"
            },
            {
                "name": "App Store",
                "url": "https://apps.apple.com/id/app/ca%C3%A7adores-de-lendas/id1182252219"
            }
        ]
    },
    {
        "title": "Cosmo Rangers",
        "imageSrc": "assets/images/cosmo_rangers.jpeg",
        "dataGroups": ["all", "available", "personal", "games"],
        "links": [
            {
                "name": "Trailer",
                "url": "https://www.youtube.com/watch?v=FlEwYzl0b1w"
            },
            {
                "name": "Google Play",
                "url": "https://play.google.com/store/apps/details?id=com.LeoMedeiros.CosmoRangerss&hl=pt_BR"
            }
        ]
    },
    {
        "title": "Till Death",
        "imageSrc": "assets/images/till_death.png",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            {
                "name": "Video",
                "url": "https://www.youtube.com/watch?v=tsKSAoqT8YU"
            }
        ]
    },
    {
        "title": "It's not a bird",
        "imageSrc": "assets/images/its_not_a_bird.png",
        "dataGroups": ["all", "available", "personal", "games"],
        "links": [
            {
                "name": "Trailer",
                "url": "https://www.youtube.com/watch?v=qesg-rmkU-4"
            },
            {
                "name": "Google Play",
                "url": "https://play.google.com/store/apps/details?id=com.LeonardoMedeiros.ItsNotaBird&hl=en_US&gl=US"
            },
            {
                "name": "App Store",
                "url": "https://apps.apple.com/br/app/its-not-a-bird/id983104174"
            }
        ]
    },
    {
        "title": "Beer Lifter",
        "imageSrc": "assets/images/beer_lifter.png",
        "dataGroups": ["all", "games"],
        "links": [
            {
                "name": "Video",
                "url": "https://www.youtube.com/watch?v=LDFPMplmnm4"
            }
        ]
    }
];
