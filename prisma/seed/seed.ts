// Este archivo contendrá el script que hará el seed de la base de datos
import { prisma } from "../prisma_client";
import bcrypt from "bcrypt";

const movies = [
  {
    title: "Alien",
    description: "A spaceship crew is hunted by a deadly alien creature.",
  },
  {
    title: "The Thing",
    description: "Researchers in Antarctica face a shape shifting monster.",
  },
  {
    title: "The Shining",
    description: "A writer loses his mind in an isolated haunted hotel.",
  },
  {
    title: "Get Out",
    description:
      "A young man uncovers a disturbing secret while visiting his partner family.",
  },
  {
    title: "The Godfather",
    description: "The son of a mafia boss is pulled into organized crime.",
  },
  {
    title: "Pulp Fiction",
    description:
      "Interconnected stories of crime, violence, and dark humor in Los Angeles.",
  },
  {
    title: "The Dark Knight",
    description: "Batman faces a chaotic criminal mastermind called the Joker.",
  },
  {
    title: "Inception",
    description: "A team enters dreams to plant an idea in a target mind.",
  },
  {
    title: "Interstellar",
    description:
      "Astronauts travel through space to find a new home for humanity.",
  },
  {
    title: "Blade Runner 2049",
    description:
      "A replicant hunter uncovers secrets that could change society.",
  },
  {
    title: "Arrival",
    description:
      "A linguist tries to communicate with mysterious alien visitors.",
  },
  {
    title: "The Matrix",
    description:
      "A hacker discovers reality is a simulation controlled by machines.",
  },
  {
    title: "Mad Max Fury Road",
    description:
      "A high speed escape across the desert against a warlord army.",
  },
  {
    title: "Gladiator",
    description: "A Roman general seeks revenge after betrayal and slavery.",
  },
  {
    title: "Braveheart",
    description: "A Scottish warrior leads a rebellion for freedom.",
  },
  {
    title: "Saving Private Ryan",
    description: "Soldiers risk everything to rescue a paratrooper during war.",
  },
  {
    title: "Dunkirk",
    description:
      "Allied troops attempt evacuation while trapped on French beaches.",
  },
  {
    title: "1917",
    description:
      "Two soldiers race against time to deliver a life saving message.",
  },
  {
    title: "The Lord of the Rings The Fellowship of the Ring",
    description: "A group begins a perilous quest to destroy a cursed ring.",
  },
  {
    title: "The Lord of the Rings The Two Towers",
    description: "The fellowship is split while war rises across Middle Earth.",
  },
  {
    title: "The Lord of the Rings The Return of the King",
    description: "Final battles decide the fate of Middle Earth.",
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    description: "A young wizard returns to school and faces dark revelations.",
  },
  {
    title: "Fantastic Beasts and Where to Find Them",
    description: "A magizoologist chases magical creatures loose in a city.",
  },
  {
    title: "Pan's Labyrinth",
    description: "A girl finds a dark fantasy world during a brutal conflict.",
  },
  {
    title: "Spirited Away",
    description: "A girl enters a spirit world to save her parents.",
  },
  {
    title: "The Exorcist",
    description:
      "A young girl is possessed by a demonic entity, and her mother seeks the help of two priests to save her.",
  },
  {
    title: "Toy Story",
    description: "Toys come to life and deal with friendship and jealousy.",
  },
  {
    title: "Finding Nemo",
    description: "A timid fish crosses the ocean to rescue his son.",
  },
  {
    title: "Coco",
    description: "A boy enters the land of the dead through music and memory.",
  },
  {
    title: "Ratatouille",
    description: "A rat with culinary talent dreams of becoming a chef.",
  },
  {
    title: "The Grand Budapest Hotel",
    description: "A concierge and his apprentice become involved in a mystery.",
  },
  {
    title: "Forrest Gump",
    description: "A kind man witnesses key moments of modern history.",
  },
  {
    title: "The Social Network",
    description:
      "The rise of a social platform brings ambition and legal conflict.",
  },
  {
    title: "Whiplash",
    description:
      "A young drummer faces extreme pressure from a ruthless instructor.",
  },
  {
    title: "La La Land",
    description: "Two artists chase dreams while their romance evolves.",
  },
  {
    title: "Amelie",
    description: "A shy woman in Paris quietly improves the lives of others.",
  },
  {
    title: "Her",
    description:
      "A lonely writer falls in love with an intelligent operating system.",
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    description: "A couple erases memories of each other and confronts love.",
  },
  {
    title: "Parasite",
    description:
      "A poor family infiltrates a wealthy household with hidden motives.",
  },
  {
    title: "Prisoners",
    description:
      "A father takes desperate actions after his daughter disappears.",
  },
  {
    title: "Zodiac",
    description:
      "Journalists and detectives obsess over a mysterious serial killer.",
  },
  {
    title: "Gone Girl",
    description: "A husband becomes suspect when his wife vanishes.",
  },
  {
    title: "Se7en",
    description: "Two detectives hunt a killer inspired by deadly sins.",
  },
  {
    title: "No Country for Old Men",
    description: "A hunter finds money and is chased by a relentless assassin.",
  },
  {
    title: "Sicario",
    description: "An idealistic agent joins a covert war against drug cartels.",
  },
  {
    title: "John Wick",
    description: "A retired hitman returns for revenge after personal loss.",
  },
  {
    title: "Mission Impossible Fallout",
    description: "An agent races to stop a global catastrophe.",
  },
  {
    title: "Top Gun Maverick",
    description:
      "A veteran pilot trains a new generation for a dangerous mission.",
  },
  {
    title: "Ford v Ferrari",
    description: "A designer and a driver challenge a racing giant at Le Mans.",
  },
  {
    title: "A Quiet Place",
    description: "A family survives in silence while monsters hunt by sound.",
  },
];

async function main() {
  /*
   *  Usa esto de ejemplo. Los polígonos los tendrás que insertar usando raw queries
   *  documentación: https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries
   *
   *  Para hacerlo de forma cómoda, puedes usar la función ST_GeomFromGeoJSON de PostGIS usando el atributo
   *  "geometry" de cada Feature de la FeatureCollection que te genere la herramienta de dibujo.
   *  Puedes consultar la documentación de la función de PostGIS aquí:
   *  https://postgis.net/docs/ST_GeomFromGeoJSON.html
   *
   *  Puedes crear polígonos fácilmente mediante esta herramienta de dibujo: https://geojson.io/#map=5/39.25/-5.56
   *
   *  Para las tablas que no contienen geometrías, puedes usar el cliente de prisma de manera normal. Puedes consultar
   *  las opciones de CRUD en la documentación oficial de prisma: https://www.prisma.io/docs/orm/prisma-client/queries/crud
   */

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 1. PROVINCIAS
  await prisma.provincia.createMany({
    data: [{ nombre: "Murcia" }, { nombre: "Alicante" }],
  });

  // 2. MUNICIPIOS
  await prisma.municipio.createMany({
    data: [
      { nombre: "Murcia", provinciaId: 1 },
      { nombre: "Cartagena", provinciaId: 1 },
      { nombre: "Lorca", provinciaId: 1 },
      { nombre: "Alicante", provinciaId: 2 },
      { nombre: "Elche", provinciaId: 2 },
      { nombre: "Águilas", provinciaId: 1 },
      { nombre: "Molina de Segura", provinciaId: 1 },
      { nombre: "Orihuela", provinciaId: 2 },
      { nombre: "Torrevieja", provinciaId: 2 },
    ],
  });

  // 3. CULTIVOS
  await prisma.cultivo.createMany({
    data: [
      { nombre: "Trigo" },
      { nombre: "Maíz" },
      { nombre: "Olivo" },
      { nombre: "Vid" },
      { nombre: "Limón" },
      { nombre: "Almendro" },
      { nombre: "Cebada" },
    ],
  });

  // 4. USUARIOS
  // Note: passwords would be hashed with bcrypt in production
  await prisma.usuario.createMany({
    data: [
      {
        nombre: "Carlos García",
        email: "carlos@example.com",
        password: hashedPassword,
      },
      {
        nombre: "María López",
        email: "maria@example.com",
        password: hashedPassword,
      },
      {
        nombre: "Pedro Martínez",
        email: "pedro@example.com",
        password: hashedPassword,
      },
      {
        nombre: "María Saez",
        email: "marias@example.com",
        password: hashedPassword,
      },
      {
        nombre: "Luis Fernández",
        email: "luis@example.com",
        password: hashedPassword,
      },
      {
        nombre: "Laura Torres",
        email: "laura@example.com",
        password: hashedPassword,
      },
      {
        nombre: "Scott Martin",
        email: "scott@example.com",
        password: hashedPassword,
      },
      {
        nombre: "Elena Ruiz",
        email: "elena@example.com",
        password: hashedPassword,
      },
      {
        nombre: "Miguel Herrera",
        email: "miguel@example.com",
        password: hashedPassword,
      },
      {
        nombre: "Carmen Jiménez",
        email: "carmen@example.com",
        password: hashedPassword,
      },
    ],
  });

  //4b. PROFILES — one per usuario with avatar image from dicebear API
  // Note: Elena, Miguel and Carmen have no profile
  // to test the fallback initial letter avatar
  await prisma.profile.createMany({
    data: [
      {
        usuarioId: 1,
        imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Carlos",
      },
      {
        usuarioId: 2,
        imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Maria",
      },
      {
        usuarioId: 3,
        imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Pedro",
      },
      {
        usuarioId: 4,
        imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=MariaS",
      },
      {
        usuarioId: 5,
        imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Luis",
      },
      {
        usuarioId: 6,
        imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Laura",
      },
      {
        usuarioId: 7,
        imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Scott",
      },
    ],
  });

  // 5. PARCELAS — raw SQL required for geometry
  // Parcela 1 — Carlos García (1), Murcia (1)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      1, 1, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.2243913005820843,37.880872659465595],[-1.2248093737287888,37.869928713483475],[-1.209895786527909,37.87167132567539],[-1.2160404030794894,37.88107815659761],[-1.2243913005820843,37.880872659465595]]]}')
    )
  `;

  // Parcela 2 — María López (2), Cartagena (2)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      2, 2, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9817124102975185,37.951830664231835],[-0.9836474736786442,37.944258099048014],[-0.9785550722625089,37.94240918635778],[-0.9751388226436006,37.94583244818179],[-0.9748420629707653,37.95085438803622],[-0.9817124102975185,37.951830664231835]]]}')
    )
  `;

  // Parcela 3 — Pedro Martínez (3), Lorca (3)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      3, 3, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.0897215712433876,37.58649591808829],[-1.0903562421458162,37.58347825029382],[-1.0894677028824162,37.58339442444222],[-1.0885791636189879,37.58600974654371],[-1.0889811218578416,37.58642886013297],[-1.0897215712433876,37.58649591808829]]]}')
    )
  `;

  // Parcela 4 — Maria Saez (4), Cartagena (2)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      4, 2, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9340228911632948,37.72943095306856],[-0.9363922836873257,37.72648613582787],[-0.9211556725528283,37.723071858709645],[-0.9204787236608354,37.724410946129126],[-0.9340228911632948,37.72943095306856]]]}')
    )
  `;

  // Parcela 5 — Luis Fernández (5), Murcia (1)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      5, 1, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9218042651208123,37.77359804923948],[-0.9088586517156614,37.766303379904315],[-0.9067426352367534,37.76790933446374],[-0.9149524804347493,37.775938222458024],[-0.9218042651208123,37.77359804923948]]]}')
    )
  `;

  // Parcela 6 — Laura Torres (6), Lorca (3)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      6, 3, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.8334431705578993,37.856292307752696],[-0.8165920872465904,37.844325824560286],[-0.8139649700930534,37.84820508994257],[-0.8301443239494404,37.85896397096137],[-0.8334431705578993,37.856292307752696]]]}')
    )
  `;

  // Parcela 7 — Scott Martin (7), Alicante (4)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      7, 4, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.5926419977597561,38.33513359451129],[-0.5763174534336883,38.32846422743734],[-0.5751199375962699,38.33500694497798],[-0.5926419977597561,38.33513359451129]]]}')
    )
  `;

  // Parcela 8 — Carlos García (1), Torrevieja (9)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      1, 9, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.6970687965919353,37.98367142197097],[-0.6964919192572552,37.98243131606421],[-0.6903034864456856,37.9829689135975],[-0.6911950000016986,37.98445691836328],[-0.6970687965919353,37.98367142197097]]]}')
    )
  `;

  // Parcela 9 — María López (2), Torrevieja (9)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      2, 9, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.6895168991882201,38.0059059598741],[-0.6876814459145351,38.00053383033497],[-0.6826470093644446,38.002393574560216],[-0.6873666745996729,38.00615382718203],[-0.6895168991882201,38.0059059598741]]]}')
    )
  `;

  // Parcela 10 — María López (2), Águilas (6)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      2, 6, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.6063442757188682,37.421264832644894],[-1.606227865486403,37.42076559156955],[-1.600942840933385,37.416568136830705],[-1.5992432515396615,37.41880557590484],[-1.6018275586999948,37.422392735412544],[-1.6063442757188682,37.421264832644894]]]}')
    )
  `;

  // Parcela 11 — Maria Saez (4), Águilas (6)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      4, 6, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.6019672543220622,37.43085863853513],[-1.6009661263230441,37.42937958557607],[-1.5989173062319821,37.42747526185825],[-1.5924448973079848,37.42211331352905],[-1.594260896934145,37.430988054278615],[-1.596309717025207,37.43182000728743],[-1.5988707421389847,37.431579666256894],[-1.6019672543220622,37.43085863853513]]]}')
    )
  `;

  // Parcela 12 — Miguel Herrera (9), Molina de Segura (7)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      9, 7, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.1940131017738622,38.076628664817946],[-1.1873065846855013,38.072202064211496],[-1.18318421528636,38.07515515350707],[-1.1871942404989966,38.080133738521965],[-1.1940131017738622,38.076628664817946]]]}')
    )
  `;

  // Parcela 13 — Miguel Herrera (9), Orihuela (8)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      9, 8, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9412011902971642,38.09698406386701],[-0.9360737996419459,38.09796462233521],[-0.9347320898839939,38.0997369706574],[-0.9354988571460296,38.10034025744173],[-0.9390927783709344,38.09841706294199],[-0.9412011902971642,38.09698406386701]]]}')
    )
  `;

  // Parcela 14 — Carmen Jiménez (10), Orihuela (8)
  await prisma.$executeRaw`
    INSERT INTO "Parcela" ("usuarioId", "municipioId", geom) VALUES (
      10, 8, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9547086433061338,38.09999889430452],[-0.9561969419077343,38.09762468537349],[-0.9489146763084193,38.097511604089306],[-0.9488174474010975,38.09909447707216],[-0.9547086433061338,38.09999889430452]]]}')
    )
  `;

  // 6. RECINTOS — raw SQL required for geometry
  // Each recinto must be ST_Within its parcela

  // Recintos for Parcela 1 (Carlos, Murcia)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      1, 1, '2024-03-01T00:00:00Z', '2024-08-01T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.2235210180282934,37.87984205455132],[-1.2235210180282934,37.877650716779144],[-1.2197915665625771,37.877650716779144],[-1.2197915665625771,37.87984205455132],[-1.2235210180282934,37.87984205455132]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      1, 2, '2024-04-01T00:00:00Z', '2024-09-01T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.2188619275979704,37.87439211688111],[-1.2188619275979704,37.87228756411396],[-1.214298064880012,37.87228756411396],[-1.214298064880012,37.87439211688111],[-1.2188619275979704,37.87439211688111]]]}')
    )
  `;

  // Recintos for Parcela 2 (María, Cartagena)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      2, 3, '2024-02-01T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9810193598864885,37.95093065463921],[-0.9814584958886883,37.947903375900864],[-0.9785130823061081,37.94809991649609],[-0.9788487261725436,37.950236037542524],[-0.9810193598864885,37.95093065463921]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      2, 4, '2024-05-01T00:00:00Z', '2024-10-01T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9788735463268665,37.94610639029413],[-0.9791549755492497,37.943023840711334],[-0.9764438634003056,37.94617424889863],[-0.9788735463268665,37.94610639029413]]]}')
    )
  `;

  // Recintos for Parcela 3 (Pedro, Lorca)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      3, 5, '2024-01-15T00:00:00Z', '2024-06-15T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.0895734813018407,37.58614386312938],[-1.0895734813018407,37.585473277686376],[-1.0890022774902661,37.585473277686376],[-1.0890022774902661,37.58614386312938],[-1.0895734813018407,37.58614386312938]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      3, 6, '2024-03-15T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.089869661056298,37.58485298077322],[-1.0901235294172693,37.58372972726269],[-1.0896157926953265,37.58381355273676],[-1.0892561458512944,37.58478592133788],[-1.089869661056298,37.58485298077322]]]}')
    )
  `;

  // Recinto for Parcela 4 (MariaS, Cartagena)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      4, 7, '2024-02-15T00:00:00Z', '2024-07-15T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9338534870029207,37.72829335506141],[-0.9338534870029207,37.72641924798127],[-0.9315684063327865,37.72641924798127],[-0.9315684063327865,37.72829335506141],[-0.9338534870029207,37.72829335506141]]]}')
    )
  `;

  // Recintos for Parcela 5 (Luis, Murcia)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      5, 1, '2024-04-15T00:00:00Z', '2024-09-15T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9173213456976441,37.77419958930595],[-0.9173213456976441,37.771590369606045],[-0.9133449387347525,37.771590369606045],[-0.9133449387347525,37.77419958930595],[-0.9173213456976441,37.77419958930595]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      5, 3, '2024-05-15T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9115676360568443,37.76971682314189],[-0.9115679373511796,37.76831288931541],[-0.9088588717169159,37.767106703381785],[-0.9086052600372341,37.7687798145697],[-0.9115676360568443,37.76971682314189]]]}')
    )
  `;

  // Recintos for Parcela 6 (Laura, Lorca)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      6, 2, '2024-03-01T00:00:00Z', '2024-08-15T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.8314133471681089,37.856493275485846],[-0.8314133471681089,37.85502483627363],[-0.8275211020667825,37.85502483627363],[-0.8275211020667825,37.856493275485846],[-0.8314133471681089,37.856493275485846]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      6, 4, '2024-06-01T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.8218469236421981,37.851015013735875],[-0.8219310934880184,37.84880843944208],[-0.8174403243540382,37.84740318856221],[-0.8170171993754138,37.84914217371791],[-0.8218469236421981,37.851015013735875]]]}')
    )
  `;

  // Recintos for Parcela 7 (Scott, Alicante)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      7, 5, '2024-04-01T00:00:00Z', '2024-09-01T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.5810805396151579,38.33420448831481],[-0.577507685510227,38.33019922769304],[-0.5766538400415016,38.33380436733654],[-0.5810805396151579,38.33420448831481]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      7, 6, '2024-05-01T00:00:00Z', '2024-10-15T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.586185673947142,38.33446999527422],[-0.5822727099746032,38.33193441666529],[-0.5822721004113021,38.33420432268852],[-0.586185673947142,38.33446999527422]]]}')
    )
  `;

  // Recinto for Parcela 8 (Carlos, Torrevieja)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      8, 3, '2024-03-01T00:00:00Z', '2024-09-01T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.6915093118937534,37.98404447976918],[-0.6963342806879496,37.98342416058361],[-0.6962293986465795,37.98309346227937],[-0.6913519833089481,37.983259127705395],[-0.6915093118937534,37.98404447976918]]]}')
    )
  `;

  // Recinto for Parcela 9 (María, Torrevieja)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      9, 4, '2024-04-01T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.6879432046897307,38.002353390191956],[-0.6874187611672653,38.00107238669051],[-0.6834858067435903,38.00235291080634],[-0.6845346376973112,38.00346856715302],[-0.6879432046897307,38.002353390191956]]]}')
    )
  `;

  // Recintos for Parcela 10 (María, Águilas)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      10, 1, '2024-02-01T00:00:00Z', '2024-07-01T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.6059717629750594,37.42119087121414],[-1.6059717629750594,37.42072861061675],[-1.6049939170225116,37.42009993162485],[-1.6012687895842532,37.42107992893099],[-1.601943968932403,37.422189344365776],[-1.6059717629750594,37.42119087121414]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      10, 2, '2024-03-01T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.6011523793517881,37.4208025725041],[-1.6040160710699354,37.41954521048427],[-1.6011058152587907,37.4172523195103],[-1.5997321745159638,37.41882406685836],[-1.6011523793517881,37.4208025725041]]]}')
    )
  `;

  // Recinto for Parcela 11 (MariaS, Águilas)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      11, 5, '2024-05-01T00:00:00Z', '2024-10-01T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.601245510880915,37.430729222567834],[-1.5996856137661268,37.428603071074235],[-1.5949593583288504,37.42897284088916],[-1.5946334096779822,37.430729222567834],[-1.5979394602794343,37.43137630016673],[-1.601245510880915,37.430729222567834]]]}')
    )
  `;

  // Recinto for Parcela 12 (Miguel, Molina de Segura)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      12, 6, '2024-04-01T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-1.191426468467938,38.07662867692284],[-1.1875412351708121,38.073954266924545],[-1.185070278083714,38.075061858130766],[-1.1875521141108436,38.07856627451011],[-1.191426468467938,38.07662867692284]]]}')
    )
  `;

  // Recintos for Parcela 13 (Miguel, Orihuela)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      13, 7, '2024-03-15T00:00:00Z', '2024-08-15T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9395240311667408,38.09766292903046],[-0.9369363823156505,38.098002309315376],[-0.9369364144551469,38.0989827369327],[-0.9395240311667408,38.09766292903046]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      13, 1, '2024-05-01T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9365530330311174,38.09939757838666],[-0.936169656926694,38.098643398528424],[-0.9352592025726665,38.09951071373345],[-0.9355467324010363,38.099925505837604],[-0.9365530330311174,38.09939757838666]]]}')
    )
  `;

  // Recintos for Parcela 14 (Carmen, Orihuela)
  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      14, 3, '2024-04-15T00:00:00Z', '2024-09-15T00:00:00Z',
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9543261345198744,38.09947139431438],[-0.9554782133044171,38.09788859516303],[-0.9530826127994487,38.09781316699099],[-0.9529369741715072,38.099282916033474],[-0.9543261345198744,38.09947139431438]]]}')
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "Recinto" ("parcelaId", "cultivoId", "fechaSiembra", "fechaCosecha", geom) VALUES (
      14, 4, '2024-06-01T00:00:00Z', NULL,
      ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-0.9521228007829166,38.0991698865152],[-0.9524118592335356,38.09785086569997],[-0.9496810702537459,38.09788858727407],[-0.9493925285950979,38.09875530435488],[-0.9521228007829166,38.0991698865152]]]}')
    )
  `;

  // 7. MOVIES — titles and descriptions only
  // Placeholder embeddings (as only needed for Task 5B)
  for (const movie of movies) {
    await prisma.$executeRaw`
    INSERT INTO "Movie" (title, description, embedding)
    VALUES (
      ${movie.title},
      ${movie.description},
      ${"[" + Array(384).fill(0).join(",") + "]"}::vector
    )
  `;
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
