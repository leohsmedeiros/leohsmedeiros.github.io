// portfolio.js
// ---------------------------------------------------------------
// Portfolio content only. Rendering lives in main.js.
//
// Each item:
//   title        (required)
//   imageSrc     (optional) path to the thumbnail
//   description  (optional) short text shown on the card
//   dataGroups   filter groups: ios, android, hybrid, games, personal
//                "available" adds an "Available" badge on the card
//                ("all" is optional — every item shows under All)
//   links        [{ name, url }]  — url "#" renders as a non-clickable label
// ---------------------------------------------------------------

const jsonDataArray = [
    {
        "title": "OneFootball",
        "imageSrc": "assets/images/onefootball.webp",
        "description": "Real-time football platform used by millions, delivering live scores, video content, and personalized experiences at scale.",
        "dataGroups": ["all", "available", "ios", "android", "hybrid"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=de.motain.iliga" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/onefootball-resultados-futebol/id382002079" }
        ]
    },
    {
        "title": "Openlane Buyer",
        "imageSrc": "assets/images/openlane_buyer.png",
        "description": "Mobile platform enabling seamless vehicle purchasing through large-scale online auctions.",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/us/app/openlane-buyer/id1175036411" }
        ]
    },
    {
        "title": "Openlane Uploader",
        "imageSrc": "assets/images/openlane_uploader.png",
        "description": "Mobile platform for individuals with inspector credentials to perform vehicle inspections.",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/us/app/openlane-uploader/id1186571028" }
        ]
    },
    {
        "title": "Peek Mobile",
        "imageSrc": "assets/images/peek.png",
        "description": "In-app camera tool that uses 360° imagery and LiDAR to generate equirectangular images and connected panoramas, enabling seamless navigation across indoor spaces.",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/in/app/peek-mobile/id1469535539" }
        ]
    },
    {
        "title": "Itaú cartões",
        "imageSrc": "assets/images/itau_cartoes.png",
        "description": "High-scale banking app from the biggest bank in Latam for managing credit cards, payments and financial operations with performance and reliability. 10M+ active users.",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/br/app/ita%C3%BA-cart%C3%B5es-de-cr%C3%A9dito/id394401915" }
        ]
    },
    {
        "title": "Open Source Library: ShimmerFX",
        "imageSrc": "assets/images/ShimmerFX-simulation.gif",
        "description": "Lightweight iOS library for creating smooth and customizable loading animations.",
        "dataGroups": ["all", "available", "personal", "ios"],
        "links": [
            { "name": "GitHub", "url": "https://github.com/leohsmedeiros/ShimmerFX" }
        ]
    },
    {
        "title": "My Mixtapez: Rap & Hip Hop",
        "imageSrc": "assets/images/my_mixtapez.png",
        "description": "Music streaming platform focused on hip-hop culture, delivering content to a large and engaged audience.",
        "dataGroups": ["all", "available", "ios"],
        "links": [
            { "name": "App Store", "url": "https://apps.apple.com/us/app/my-mixtapez-rap-hip-hop/id525781368" }
        ]
    },
    {
        "title": "Bird Id",
        "imageSrc": "assets/images/bird_id.png",
        "description": "Cloud-based digital certificate platform (ICP-Brasil) enabling legally binding document signing, secure OTP authentication, and full account/device management.",
        "dataGroups": ["all", "available", "hybrid"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=br.com.vaultid.apps.authenticator" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/birdid/id1450002184?l=en" }
        ]
    },
    {
        "title": "Crabki",
        "imageSrc": "assets/images/crabki.png",
        "description": "Bluetooth-based access control app to securely open and close doors without physical keys or internet, designed for Airbnb and hotels.",
        "dataGroups": ["all", "available", "hybrid"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=com.crabki" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/crabki/id1537477957?l=en" }
        ]
    },
    {
        "title": "Konviva",
        "imageSrc": "assets/images/konviva.png",
        "description": "Corporate learning platform delivering scalable education experiences across organizations.",
        "dataGroups": ["all", "available", "hybrid"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=br.com.ilog.konviva.mobile.v1" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/konviva-mobile/id1341038233?l=en" }
        ]
    },
    {
        "title": "Beleza até você",
        "imageSrc": "assets/images/beleza_ate_voce.jpg",
        "description": "On-demand beauty services platform to book makeup, hair and nail professionals for at-home appointments.",
        "dataGroups": ["all", "hybrid"],
        "links": [
            { "name": "Images", "url": "https://drive.google.com/drive/folders/1yUYqDUa_D-FZRzIQ2TnV_IBRkIdCWevE?usp=sharing" }
        ]
    },
    {
        "title": "Assine Online",
        "imageSrc": "assets/images/assine_online.jpg",
        "description": "Digital signature platform to securely sign and manage contracts online, streamlining document workflows similar to DocuSign.",
        "dataGroups": ["all", "hybrid"],
        "links": [
            { "name": "Images", "url": "https://drive.google.com/drive/folders/1HBxwhSWKqmmikz9zUn7NNQmAItW3WhdB?usp=sharing" }
        ]
    },
    {
        "title": "Irvem Rider",
        "imageSrc": "assets/images/irvem_rider.png",
        "description": "Ride-hailing app to request trips, track drivers in real time, and manage ride history and payments.",
        "dataGroups": ["all", "android", "ios"],
        "links": [
            { "name": "Video 1", "url": "https://drive.google.com/file/d/1QQetbWwSfruzn6ZGI2iYg8MVIaHHN3Hk/view?usp=sharing" },
            { "name": "Video 2", "url": "https://drive.google.com/file/d/1591dYlJMnz01NaBprXk90vnP58rq1gKS/view?usp=sharing" }
        ]
    },
    {
        "title": "Irvem Driver",
        "imageSrc": "assets/images/irvem_driver.png",
        "description": "Driver-facing app with real-time tracking powered by a custom location engine, providing accurate positioning and efficient trip management.",
        "dataGroups": ["all", "android"],
        "links": [
            { "name": "Video", "url": "https://drive.google.com/file/d/1rprX_6QpR_H0ECM2ywLC7xef0rsHKIMR/view?usp=sharing" }
        ]
    },
    {
        "title": "Josh Journey: Darkness Totems",
        "imageSrc": "assets/images/josh_journey.jpg",
        "description": "2D platformer released on Steam, combining polished gameplay with atmospheric storytelling.",
        "dataGroups": ["all", "available", "games"],
        "links": [
            { "name": "Steam", "url": "https://store.steampowered.com/app/1383280/Josh_Journey_Darkness_Totems" }
        ]
    },
    {
        "title": "Perigos da net",
        "imageSrc": "assets/images/perigos_da_net.jpeg",
        "description": "Educational game that teaches children about online risks — privacy, abuse and scams — through age-appropriate storytelling and interactive gameplay.",
        "dataGroups": ["all", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=-doWpIhVIJI" }
        ]
    },
    {
        "title": "Tombo and the quest for the game over",
        "imageSrc": "assets/images/tombo.jpeg",
        "description": "Game jam entry recognized in PewDiePie’s competition: play the boss’s son, bored with easy games, trying to creatively fail each level.",
        "dataGroups": ["all", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=sQZy7SwdnVg" }
        ]
    },
    {
        "title": "Castle Defender",
        "imageSrc": "assets/images/castle_defender.png",
        "description": "Music-based educational game combining tower defense with quizzes — correct answers recharge resources to defend against enemies.",
        "dataGroups": ["all", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=Hu-XobiTGqk" }
        ]
    },
    {
        "title": "Space Mesh",
        "imageSrc": "assets/images/space_mesh.jpg",
        "description": "Turn-based online 1v1 strategy game where players control fleets on a grid — closer targets are safer, but distance amplifies damage.",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            { "name": "In progress ...", "url": "#" },
            { "name": "Video", "url": "https://www.youtube.com/watch?v=C0K2WeIF2CY" }
        ]
    },
    {
        "title": "Caçadores de Lendas",
        "imageSrc": "assets/images/cacadores_de_lendas.jpg",
        "description": "Educational game inspired by Brazilian folklore, bringing cultural stories to life through interactive gameplay.",
        "dataGroups": ["all", "available", "personal", "games"],
        "links": [
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=com.inovapps.CacadoresDeLendas&hl=pt_BR" },
            { "name": "App Store", "url": "https://apps.apple.com/id/app/ca%C3%A7adores-de-lendas/id1182252219" }
        ]
    },
    {
        "title": "Cosmo Rangers",
        "imageSrc": "assets/images/cosmo_rangers.jpeg",
        "description": "Casual action game where each character has unique abilities — unlock, upgrade and choose heroes to survive increasingly challenging adventures.",
        "dataGroups": ["all", "available", "personal", "games"],
        "links": [
            { "name": "Trailer", "url": "https://www.youtube.com/watch?v=FlEwYzl0b1w" },
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=com.LeoMedeiros.CosmoRangerss&hl=pt_BR" }
        ]
    },
    {
        "title": "Till Death",
        "imageSrc": "assets/images/till_death.png",
        "description": "Award-winning game jam project where two couples fight off an alien invasion during their wedding — “till death do us part.”",
        "dataGroups": ["all", "personal", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=tsKSAoqT8YU" }
        ]
    },
    {
        "title": "It's not a bird",
        "imageSrc": "assets/images/its_not_a_bird.png",
        "description": "Fast-paced tap-to-fly game: dodge relentless kamikaze birds and survive as long as possible.",
        "dataGroups": ["all", "available", "personal", "games"],
        "links": [
            { "name": "Trailer", "url": "https://www.youtube.com/watch?v=qesg-rmkU-4" },
            { "name": "Google Play", "url": "https://play.google.com/store/apps/details?id=com.LeonardoMedeiros.ItsNotaBird&hl=en_US&gl=US" },
            { "name": "App Store", "url": "https://apps.apple.com/br/app/its-not-a-bird/id983104174" }
        ]
    },
    {
        "title": "Beer Lifter",
        "imageSrc": "assets/images/beer_lifter.png",
        "description": "Physics-based mini-game: balance drinking evenly from both sides — lean too far, and everything collapses.",
        "dataGroups": ["all", "games"],
        "links": [
            { "name": "Video", "url": "https://www.youtube.com/watch?v=LDFPMplmnm4" }
        ]
    }
];
