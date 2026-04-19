// portfolio.js

// Color palette for project accent bars
const projectColors = [
    'rgb(66, 135, 245)',  // Blue
    'rgb(249, 116, 21)',  // Orange
    'rgb(34, 195, 93)',   // Green
    'rgb(26, 128, 230)',  // Light Blue
    'rgb(226, 54, 112)',  // Pink
    'rgb(140, 71, 209)',  // Purple
    'rgb(242, 185, 13)',  // Yellow
    'rgb(153, 51, 204)',  // Violet
];

// Map data groups to technology tags
const techMap = {
    "ios": "Swift",
    "android": "Kotlin",
    "hybrid": "Flutter",
    "games": "Unity",
    "personal": "Personal"
};

let colorIndex = 0;

function getNextColor() {
    const color = projectColors[colorIndex % projectColors.length];
    colorIndex++;
    return color;
}

function createPortfolioItem(json, index) {
    const div = document.createElement('div');
    div.className = 'group relative bg-card border border-border/50 rounded-xl overflow-hidden transition-all duration-500 hover:border-border';
    div.setAttribute('data-groups', json.dataGroups.join(' '));

    const color = getNextColor();

    // Build tech tags from dataGroups
    const techTags = [];
    json.dataGroups.forEach(group => {
        if (techMap[group] && !techTags.includes(techMap[group])) {
            techTags.push(techMap[group]);
        }
    });

    // Build links HTML
    let linksHtml = '';
    if (json.links && json.links.length > 0) {
        json.links.forEach(link => {
            const linkText = link.name.toLowerCase().includes('app store') ? 'App Store' : 
                             link.name.toLowerCase().includes('google play') ? 'Google Play' : 
                             link.name;
            linksHtml += `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer"
                    class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-external-link w-4 h-4">
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14 21 3"></path>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    </svg>${linkText}
                </a>
            `;
        });
    }

    // Build tech tags HTML
    let tagsHtml = '';
    if (techTags.length > 0) {
        tagsHtml = '<div class="flex flex-wrap gap-2 mb-4">';
        techTags.forEach(tech => {
            tagsHtml += `<span class="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/50">${tech}</span>`;
        });
        tagsHtml += '</div>';
    }

    const svgIcon = techTags.includes('Unity')
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gamepad2-icon lucide-gamepad-2 w-6 h-6 text-muted-foreground/50">
                <line x1="6" x2="10" y1="11" y2="11"/>
                <line x1="8" x2="8" y1="9" y2="13"/>
                <line x1="15" x2="15.01" y1="12" y2="12"/>
                <line x1="18" x2="18.01" y1="10" y2="10"/>
                <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
            </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone w-6 h-6 text-muted-foreground/50">
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                <path d="M12 18h.01"></path>
            </svg>`;

    div.innerHTML = `
        <div class="h-1 w-full transition-all duration-500 group-hover:h-1.5" style="background: ${color};"></div>
        <div class="p-6">
            <div class="flex items-start justify-between mb-3">
                <h3 class="font-display font-bold text-lg text-foreground group-hover:text-accent transition-colors duration-300">${json.title}</h3>
                ${svgIcon}
            </div>
            <p class="text-muted-foreground text-sm leading-relaxed mb-4">${json.description || ''}</p>
            ${tagsHtml}
            ${linksHtml ? `<div class="flex gap-6 pt-2 border-t border-border/30">${linksHtml}</div>` : ''}
        </div>
    `;

    return div;
}

// Filter functionality
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.getElementById('portfolio-grid');
    const items = portfolioGrid.querySelectorAll('[data-groups]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(b => {
                b.classList.remove('bg-foreground', 'text-background', 'border-foreground');
                b.classList.add('bg-transparent', 'text-muted-foreground', 'border-border/50');
            });
            this.classList.remove('bg-transparent', 'text-muted-foreground', 'border-border/50');
            this.classList.add('bg-foreground', 'text-background', 'border-foreground');

            const group = this.getAttribute('data-group');

            items.forEach(item => {
                const groups = item.getAttribute('data-groups').split(' ');
                if (group === 'all' || groups.includes(group)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}


const jsonDataArray = [
    {
        "title": "OneFootball",
        "description": "Real-time football platform used by millions, delivering live scores, video content, and personalized experiences at scale.",
        "dataGroups": ["all", "ios", "android", "hybrid"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=de.motain.iliga" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/onefootball-resultados-futebol/id382002079" }
        ]
    },
    {
        "title": "Openlane Buyer",
        "description": "Mobile platform enabling seamless vehicle purchasing through large-scale online auctions.",
        "dataGroups": ["all", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/us/app/openlane-buyer/id1175036411" }
        ]
    },
    {
        "title": "Openlane Uploader",
        "description": "Mobile platform for individuals with inspector credentials to perform vehicle inspections.",
        "dataGroups": ["all", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/us/app/openlane-uploader/id1186571028" }
        ]
    },
    {
        "title": "Peek Camera v2 feature",
        "description": "In-app tool for Peek Mobile that uses 360° imagery and LiDAR to generate equirectangular images and connected panoramas, enabling seamless navigation across indoor spaces.",
        "dataGroups": ["all", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/in/app/peek-mobile/id1469535539" }
        ]
    },
    {
        "title": "Itaú cartões",
        "description": "High-scale banking app from biggest bank of Latam (Itaú) for managing credit cards, payments, and financial operations with performance and reliability. It has 10M+ active users on App Store.",
        "dataGroups": ["all", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/br/app/ita%C3%BA-cart%C3%B5es-de-cr%C3%A9dito/id394401915" }
        ]
    },
    {
        "title": "ShimmerFX",
        "description": "Lightweight iOS library for creating smooth and customizable loading animations.",
        "dataGroups": ["all", "personal", "ios"],
        "links": [
            { "name": "GitHub", "url": "https://github.com/leohsmedeiros/ShimmerFX" }
        ]
    },
    {
        "title": "My Mixtapez",
        "description": "Music streaming platform focused on hip-hop culture, delivering content to a large and engaged audience.",
        "dataGroups": ["all", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/us/app/my-mixtapez-rap-hip-hop/id525781368" }
        ]
    },
    {
        "title": "Bird Id",
        "description": "Cloud-based digital certificate platform (ICP-Brasil) enabling legally binding document signing, secure authentication with OTP, and full account/device management—all within a streamlined mobile experience.",
        "dataGroups": ["all", "hybrid"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=br.com.vaultid.apps.authenticator" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/birdid/id1450002184?l=en" }
        ]
    },
    {
        "title": "Crabki",
        "description": "Bluetooth-based access control app that allows users to securely open and close doors without physical keys or internet, designed for environments like Airbnb and hotels.",
        "dataGroups": ["all", "hybrid"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=com.crabki" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/crabki/id1537477957?l=en" }
        ]
    },
    {
        "title": "Konviva",
        "description": "Corporate learning platform delivering scalable education experiences across organizations.",
        "dataGroups": ["all", "hybrid"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=br.com.ilog.konviva.mobile.v1" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/konviva-mobile/id1341038233?l=en" }
        ]
    },
    {
        "title": "Beleza Até você",
        "description": "On-demand beauty services platform enabling users to book makeup, hair, and nail professionals for at-home appointments.",
        "dataGroups": ["all", "hybrid"],
        "links": [
            { "name": "Images", "url": "https://drive.google.com/drive/folders/1yUYqDUa_D-FZRzIQ2TnV_IBRkIdCWevE?usp=sharing" }
        ]
    },    
    {
        "title": "Assine Online",
        "description": "Digital signature platform that allows users to securely sign and manage contracts online, streamlining document workflows similar to DocuSign.",
        "dataGroups": ["all", "hybrid"],
        "links": [
            { "name": "Images", "url": "https://drive.google.com/drive/folders/1HBxwhSWKqmmikz9zUn7NNQmAItW3WhdB?usp=sharing" }
        ]
    },
    {
        "title": "Irvem Rider",
        "description": "Ride-hailing app enabling users to request trips, track drivers in real time, and manage ride history and payments through a seamless mobile experience.",
        "dataGroups": ["all", "android", "ios"],
        "links": [
            { "name": "Video 1", "url": "https://drive.google.com/file/d/1QQetbWwSfruzn6ZGI2iYg8MVIaHHN3Hk/view?usp=sharing" },
            { "name": "Video 2", "url": "https://drive.google.com/file/d/1591dYlJMnz01NaBprXk90vnP58rq1gKS/view?usp=sharing" }
        ]
    },
    {
        "title": "Irvem Driver",
        "description": "Driver-facing app featuring real-time tracking powered by a custom location engine, providing accurate positioning and efficient trip management.",
        "dataGroups": ["all", "android"],
        "links": [
            { "name": "Video", "url": "https://drive.google.com/file/d/1rprX_6QpR_H0ECM2ywLC7xef0rsHKIMR/view?usp=sharing" }
        ]
    },
    {
        "title": "Josh Journey",
        "description": "2D platformer released on Steam, combining polished gameplay with atmospheric storytelling.",
        "dataGroups": ["all", "games"],
        "links": [
            { "name": "Steam", "url": "https://store.steampowered.com/app/1383280/Josh_Journey_Darkness_Totems" }
        ]
    },
    {
        "title": "Perigos da net",
        "description": "Educational game designed to teach children about online risks—such as privacy, abuse, and scams—through age-appropriate storytelling and interactive gameplay.",
        "dataGroups": ["all", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=-doWpIhVIJI" }
        ]
    },
    {
        "title": "Tombo",
        "description": "Game jam entry recognized in PewDiePie’s competition, where players take on the role of a boss’s son bored with easy games, trying to creatively fail each level.",
        "dataGroups": ["all", "games"],
        "links":[
            { "name": "Video", "url": "https://www.youtube.com/watch?v=sQZy7SwdnVg" }
        ]
    },
    {
        "title": "Castle Defender",
        "description": "Music-based educational game combining tower defense mechanics with quizzes, where correct answers recharge resources to defend against enemies.",
        "dataGroups": ["all", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=Hu-XobiTGqk" }
        ]
    },
    {
        "title": "Space Mesh",
        "description": "Turn-based online strategy game (1v1) where players control fleets on a grid, balancing positioning and risk—closer targets are safer, but distance amplifies damage.",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            { "name": "In progress ...", "url": "#" }
        ]
    },
    {
        "title": "Caçadores de Lendas",
        "description": "Educational game inspired by Brazilian folklore, bringing cultural stories to life through interactive gameplay.",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=com.inovapps.CacadoresDeLendas&hl=pt_BR" },
            { "name": "App Store", "url": "https://apps.apple.com/id/app/ca%C3%A7adores-de-lendas/id1182252219"
            }
        ]
    },
    {
        "title": "Cosmo Rangers",
        "description": "Casual action game where each character has unique abilities, encouraging players to unlock, upgrade, and strategically choose heroes to survive increasingly challenging adventures.",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            { "name": "Trailer", "url": "https://www.youtube.com/watch?v=FlEwYzl0b1w" },
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=com.LeoMedeiros.CosmoRangerss&hl=pt_BR" }
        ]
    },
    {
        "title": "It's not a bird",
        "description": "Fast-paced tap-to-fly game where players must dodge relentless kamikaze birds and survive as long as possible.",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            { "name": "Trailer", "url": "https://www.youtube.com/watch?v=qesg-rmkU-4" },
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=com.LeonardoMedeiros.ItsNotaBird&hl=en_US&gl=US" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/its-not-a-bird/id983104174" }
        ]
    },
    {
        "title": "Till Death",
        "description": "Award-winning game jam project where two couples fight off an alien invasion during their wedding, surviving as long as possible. \“till death do us part.\”.",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=tsKSAoqT8YU" }
        ]
    },
    {
        "title": "Beer Lifter",
        "description": "Physics-based mini-game where players must balance drinking evenly from both sides—lean too far, and everything collapses.",
        "dataGroups": ["all", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=LDFPMplmnm4" }
        ]

    }
];


// Initialize portfolio - run after jsonDataArray is defined
(function() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) {
        console.error('Portfolio grid not found!');
        return;
    }
    
    jsonDataArray.forEach((jsonData, index) => {
        const portfolioItem = createPortfolioItem(jsonData, index);
        portfolioGrid.appendChild(portfolioItem);
    });

    // Initialize filter
    initPortfolioFilter();
    
    console.log('Portfolio initialized with ' + jsonDataArray.length + ' items');
})();
