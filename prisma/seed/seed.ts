// Este archivo contendrá el script que hará el seed de la base de datos
import { prisma } from "../prisma_client";

const movies = [
    { title: "Alien", description: "A spaceship crew is hunted by a deadly alien creature." },
    { title: "The Thing", description: "Researchers in Antarctica face a shape shifting monster." },
    { title: "The Shining", description: "A writer loses his mind in an isolated haunted hotel." },
    { title: "Get Out", description: "A young man uncovers a disturbing secret while visiting his partner family." },
    { title: "The Godfather", description: "The son of a mafia boss is pulled into organized crime." },
    { title: "Pulp Fiction", description: "Interconnected stories of crime, violence, and dark humor in Los Angeles." },
    { title: "The Dark Knight", description: "Batman faces a chaotic criminal mastermind called the Joker." },
    { title: "Inception", description: "A team enters dreams to plant an idea in a target mind." },
    { title: "Interstellar", description: "Astronauts travel through space to find a new home for humanity." },
    { title: "Blade Runner 2049", description: "A replicant hunter uncovers secrets that could change society." },
    { title: "Arrival", description: "A linguist tries to communicate with mysterious alien visitors." },
    { title: "The Matrix", description: "A hacker discovers reality is a simulation controlled by machines." },
    { title: "Mad Max Fury Road", description: "A high speed escape across the desert against a warlord army." },
    { title: "Gladiator", description: "A Roman general seeks revenge after betrayal and slavery." },
    { title: "Braveheart", description: "A Scottish warrior leads a rebellion for freedom." },
    { title: "Saving Private Ryan", description: "Soldiers risk everything to rescue a paratrooper during war." },
    { title: "Dunkirk", description: "Allied troops attempt evacuation while trapped on French beaches." },
    { title: "1917", description: "Two soldiers race against time to deliver a life saving message." },
    { title: "The Lord of the Rings The Fellowship of the Ring", description: "A group begins a perilous quest to destroy a cursed ring." },
    { title: "The Lord of the Rings The Two Towers", description: "The fellowship is split while war rises across Middle Earth." },
    { title: "The Lord of the Rings The Return of the King", description: "Final battles decide the fate of Middle Earth." },
    { title: "Harry Potter and the Prisoner of Azkaban", description: "A young wizard returns to school and faces dark revelations." },
    { title: "Fantastic Beasts and Where to Find Them", description: "A magizoologist chases magical creatures loose in a city." },
    { title: "Pan's Labyrinth", description: "A girl finds a dark fantasy world during a brutal conflict." },
    { title: "Spirited Away", description: "A girl enters a spirit world to save her parents." },
    { title: "The Exorcist", description: "A young girl is possessed by a demonic entity, and her mother seeks the help of two priests to save her." },
    { title: "Toy Story", description: "Toys come to life and deal with friendship and jealousy." },
    { title: "Finding Nemo", description: "A timid fish crosses the ocean to rescue his son." },
    { title: "Coco", description: "A boy enters the land of the dead through music and memory." },
    { title: "Ratatouille", description: "A rat with culinary talent dreams of becoming a chef." },
    { title: "The Grand Budapest Hotel", description: "A concierge and his apprentice become involved in a mystery." },
    { title: "Forrest Gump", description: "A kind man witnesses key moments of modern history." },
    { title: "The Social Network", description: "The rise of a social platform brings ambition and legal conflict." },
    { title: "Whiplash", description: "A young drummer faces extreme pressure from a ruthless instructor." },
    { title: "La La Land", description: "Two artists chase dreams while their romance evolves." },
    { title: "Amelie", description: "A shy woman in Paris quietly improves the lives of others." },
    { title: "Her", description: "A lonely writer falls in love with an intelligent operating system." },
    { title: "Eternal Sunshine of the Spotless Mind", description: "A couple erases memories of each other and confronts love." },
    { title: "Parasite", description: "A poor family infiltrates a wealthy household with hidden motives." },
    { title: "Prisoners", description: "A father takes desperate actions after his daughter disappears." },
    { title: "Zodiac", description: "Journalists and detectives obsess over a mysterious serial killer." },
    { title: "Gone Girl", description: "A husband becomes suspect when his wife vanishes." },
    { title: "Se7en", description: "Two detectives hunt a killer inspired by deadly sins." },
    { title: "No Country for Old Men", description: "A hunter finds money and is chased by a relentless assassin." },
    { title: "Sicario", description: "An idealistic agent joins a covert war against drug cartels." },
    { title: "John Wick", description: "A retired hitman returns for revenge after personal loss." },
    { title: "Mission Impossible Fallout", description: "An agent races to stop a global catastrophe." },
    { title: "Top Gun Maverick", description: "A veteran pilot trains a new generation for a dangerous mission." },
    { title: "Ford v Ferrari", description: "A designer and a driver challenge a racing giant at Le Mans." },
    { title: "A Quiet Place", description: "A family survives in silence while monsters hunt by sound." }
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

    // await prisma.provincia.createMany({
    //     data: [
    //         {
    //             id: 1,
    //             nombre: "Murcia"
    //         },
    //         {
    //             id: 2,
    //             nombre: "Alicante"
    //         }
    //     ]
    // });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

