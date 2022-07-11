import {
	BoulderData,
	Name,
	Image,
	TrackData,
	Description,
	Difficulty,
	ClimbTechniques,
	SectorData,
	TopoData,
	Amenities,
	TopoStatus,
	TopoType,
	RockTypes,
	TopoAccess,
	Topo,
	Parking,
	StringBetween,
	Manager,
	UUID,
	Reception,
	Waypoint,
	Email,
	User,
} from "types";
import { v4 as uuid } from "uuid";

// Note: use UUIDs everywhere for proper testing with the DB

export const fakeTopoUUID = "0c5f28eb-8dde-4e1b-8fe0-d034031a3966" as UUID;

export const fakeAdmin: User & { password: string } = {
	id: uuid(), // will be changed anyways,
	userName: "SuperAdmin" as Name,
	email: "superadmin@kayoo.fr" as Email,
	password: "Kayoo1234",
	role: "ADMIN",
};

export const images: Image[] = [
	{
		id: "08f005e1-d68d-439c-74c8-129393e10b00" as UUID,
		ratio: 4592 / 3064,
		placeholder:
			"data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAJRAAAgEDAwIHAAAAAAAAAAAAAQMCBAURAAYSMlEhIiUxQWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAL/xAAYEQEAAwEAAAAAAAAAAAAAAAABAAIRYf/aAAwDAQACEQMRAD8Ae3Jv1j6ZVoD2UQbybN62dXx+jBwfvOpFW5qi2BMbnOFziiM3ok2XmkMR5Yl2GRIZ7aSXaLfWbXq6x9Io1aqJrFujHhOEo9JBGMY1km2fVppfcials4shIsOQQQM+HtqCzm7FAuHZ/9k=",
	},
	{
		id: "10412040-08fd-4458-03d0-e05d5a841600" as UUID,
		ratio: 1920 / 2878,
		placeholder:
			"data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQAAsDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMFB//EACEQAAICAQQCAwAAAAAAAAAAAAECAwQRAAYSIRMxIkFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAXEQEBAQEAAAAAAAAAAAAAAAABAAMT/9oADAMBAAIRAxEAPwBku9bsUUcO3nhp27tsTzSIfKWdnL8C7DuNBnrHeCT70WN1bENmdrVF2neV3cw10dMliTxYr2O9ZJHdS34mld4iquSYmA5lgFx39Y5ev3U67tiKxZaRbMcQYD4cgMdAegdS7BMyW//Z",
	},
	{
		id: "1197c296-0ba4-4274-f559-14978c338100" as UUID,
		ratio: 1334 / 2000,
		placeholder:
			"data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQb/xAAjEAACAQMDBAMAAAAAAAAAAAABAgQDBREAITEGEhNBBxRx/8QAFQEBAQAAAAAAAAAAAAAAAAAABAX/xAAaEQACAgMAAAAAAAAAAAAAAAACAwARARIh/9oADAMBAAIRAxEAPwArpy7z6NilzouG+nVWqCCSyOpDZ/fW+2j7N8x3WtKDXaBBa3s/kdKaHuXJ3Yn3gnODtpSeogW2c0MeE7PhNgSOMjg6gOs49GK1Yxqa0g0V3ITYd3YTnHHOpQOIL1zGMRy5/9k=",
	},
];

// export const lines: Line[] = [
//     // Line 0, track 0
//     {
//         id: uuid(),
//         index: 0,
//         imageId: images[1].id,
//         points: [
//             [2044, 1948],
//             [2125, 770],
//             [1764, 55],
//             [1717, 1349],
//             [2269, 1200]
//         ],
//         hand1: [1050, 620],
//     },
//     // Line 1, track 1
//     {
//         id: uuid(),
//         index: 1,
//         imageId: images[1].id,
//         points: [
//             [2207, 1942],
//             [2262, 787],
//             [1901, 51]
//         ],
//         forbidden: [
//             [[1200, 50],
//             [1650, 50],
//             [1650, 400],
//             [1200, 400]],
//         ],
//         foot1: [600, 250],
//     }
// ]

export const tracks: TrackData[] = [
	// Track 0, boulder 0
	{
		id: uuid(),
		index: 0,
		name: "Passage 1" as Name,
		grade: "4+",
		reception: Reception.OK,
		techniques: ClimbTechniques.Adherence,
		description: "Une petite montée facile" as Description,

		isTraverse: false,
		isSittingStart: true,
		mustSee: true,

		lines: [],
		ratings: [],
		creatorId: fakeAdmin.id,
		hasMantle: false,
	},
	// Track 1, boulder 0
	{
		id: uuid(),
		index: 1,
		name: "Passage 2" as Name,
		description:
			"Le départ assis est sévère mais le reste de la voie est trivial" as Description,
		height: 2,
		grade: "6a",
		reception: Reception.OK,
		// -> Bitflag example
		techniques: ClimbTechniques.Adherence | ClimbTechniques.Pince,

		isTraverse: true,
		isSittingStart: false,
		mustSee: false,

		lines: [],
		ratings: [],
		creatorId: fakeAdmin.id,
		hasMantle: false,
	},
];

export const boulders: BoulderData[] = [
	{
		id: uuid(),
		liked: false,
		name: "PearlHarbor" as Name,
		location: [4.605412, 45.70201],
		isHighball: true,
		mustSee: false,
		dangerousDescent: false,
		// avoid duplicate IDs during DB tests
		images: [images[0], images[1], images[2]],
		tracks,
	},
	// no image, no tracks in the other boulders to avoid duplicate IDs
	// correctly fixing duplicate IDs with proper foreign key relations
	// is painful (*cries in DB tests*)
	{
		id: uuid(),
		liked: false,
		name: "Mystiquette" as Name,
		location: [4.606412, 45.70401],
		isHighball: true,
		mustSee: false,
		dangerousDescent: false,
		images: [],
		tracks: [],
		// images: [changeId(images[0]), changeId(images[1]), changeId(images[2])],
		// tracks
	},
	{
		id: uuid(),
		liked: false,
		name: "Hoummmmous" as Name,
		location: [4.606712, 45.70461],
		isHighball: true,
		mustSee: false,
		dangerousDescent: false,
		images: [],
		tracks: [],
		// images: [changeId(images[0]), changeId(images[1]), changeId(images[2])],
		// tracks
	},
	{
		id: uuid(),
		liked: false,
		name: "SupremeNTM" as Name,
		location: [4.608712, 45.70661],
		isHighball: false,
		mustSee: true,
		dangerousDescent: true,
		images: [],
		tracks: [],
		// images: [changeId(images[0]), changeId(images[1])],
		// tracks
	},
];

export const sectors: SectorData[] = [
	{
		id: uuid(),
		index: 0,
		name: "ABO" as Name,
		path: [
			[4.604512, 45.70101],
			[4.608712, 45.70401],
			[4.606912, 45.70661],
		],
		boulders: [boulders[0].id, boulders[1].id, boulders[2].id],
	},
];

export const access: TopoAccess[] = [
	{
		id: uuid(),
		duration: 15,
		difficulty: Difficulty.OK,
		steps: [
			{
				description:
					"Depuis le parking, prendre le sentier qui monte dans la continuité de la route. Après 12-15min de marche, vous arriverez à une esplanade d'herbe surmontant une petite falaise (où il est possible de faire de l'initiation). Un panneau indique le site d'escalade à l'entrée de l'esplanade.\nDepuis l'esplanade, prendre le sentier qui part derrière le panneau pour monter vers les premiers blocs." as Description,
				image: images[0],
			},
			{
				description:
					"Et ceci est une autre étape incroyable pour s'approcher du spot." as Description,
				image: images[1],
			},
		],
	},
	{
		id: uuid(),
		duration: 25,
		difficulty: Difficulty.OK,
		steps: [
			{
				description:
					"Depuis le parking, prendre le sentier qui monte dans la continuité de la route. Après 12-15min de marche, vous arriverez à une esplanade d'herbe surmontant une petite falaise (où il est possible de faire de l'initiation). Un panneau indique le site d'escalade à l'entrée de l'esplanade.\nDepuis l'esplanade, prendre le sentier qui part derrière le panneau pour monter vers les premiers blocs." as Description,
				image: images[0],
			},
			{
				description:
					"Et ceci est une autre étape incroyable pour s'approcher du spot." as Description,
				image: images[1],
			},
		],
	},
];

export const parkings: Parking[] = [
	{
		id: uuid(),
		spaces: 80,
		location: [4.607274, 45.701321],
		name: "Parking 1" as StringBetween<1, 255>,
		description:
			"Le parking de Rocher Canon est facile d’accès depuis la N12. Attention toutefois, beaucoup de GPS indique un itinéraire qui passe à travers la forêt et qui est en fait fermé. Il faut bien arriver par la N12. " as StringBetween<
				1,
				5000
			>,
		image: images[1],
	},
];

export const managers: Manager[] = [
	{
		id: uuid(),
		name: "La dégaine" as Name,
		image: images[2],
		contactName: "Jérôme Foobar" as Name,
		contactPhone: "06 69 43 44 92" as Name,
		contactMail: "ladegaine@ladegaine.com" as Email,
		address: "Maison des Arts, Chemin de la Ferrière" as Name,
		zip: 69260,
		city: "Charbonnières-les-Bains" as Name,
	},
];

export const waypoints: Waypoint[] = [
	{
		id: uuid(),
		image: images[0],
		name: "Pont de pierre" as Name,
		location: [4.605462, 45.70256],
		description:
			"C'est un joli petit pont tout mignon qui permet de traverser une rivière ... DE SANNNNNG GNIAHAHAHAHA !!!" as Description,
	},
];

export const fakeTopov2: TopoData = {
	id: fakeTopoUUID,
	name: "Yzéron" as Name,
	liked: false,
	description:
		"Le site d'Yzéron est situé sur le massif de Py froid à environ 800m d'altitude. Il est le plus grand site de bloc de la région Lyonnaise avec une grande diversité de profil (dévers, dalle, réta...). L'esplanade sépare la plus grande partie du site en amont, et une falaise idéale pour l'initiation, située en contrebas. La forêt protège une bonne partie du site contre les aléas météorologiques ce qui, combiné à l'altitude, permet la pratique de la grimpe toute l'année." as Description,
	status: TopoStatus.Draft,
	type: TopoType.Boulder,

	modified: new Date().toISOString(),

	altitude: 775,
	closestCity: "Yzéron" as Name,
	location: [4.607264, 45.701356],

	forbidden: false,
	amenities:
		Amenities.AdaptedToChildren | Amenities.Waterspot | Amenities.PicnicArea,
	// the real topo doesn't have composite rock, but this allows us to test the bitflag
	rockTypes: RockTypes.Gneiss | RockTypes.Composite,

	danger: "Il y a beaucoup de pentes" as Description,

	image: images[0],
	creator: fakeAdmin,

	sectors: sectors,
	boulders: boulders,
	lonelyBoulders: [boulders[3].id],
	waypoints: waypoints,
	parkings: parkings,
	accesses: access,
	managers: managers,
};

// export const quarkTopo: Quark<Topo> = editTopo(fakeTopov2);
