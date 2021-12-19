import { Sector, Topo, TopoStatus } from "types";

const sectors: Sector[] = [
    {
        "id": 2,
        "name": "ABO",
        "description": undefined,
        "boulders": [
            {
                "id": 15,
                "name": "Pearl Harbor",
                "location": {
                    "lat": 45.70201,
                    "lng": 4.605412
                },
                "isHighBall": true,
                "hasDangerousDescent": true,
                "isMustSee": false,
                "orderIndex": 1,
                "images": [
                    {
                        "id": 16,
                        "url": "/public/uploads/boulder/image/5b558375709fbbacae9e5dcb746c8e10e7fa083f.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 8,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "Une petite montée facile",
                        "techniqueIds": [
                            1
                        ],
                        "lines": [
                            {
                                "id": 5,
                                "boulderImageId": 16,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 110,
                                        "posX": 299.99,
                                        "posY": 286.54
                                    },
                                    {
                                        "id": 133,
                                        "posX": 312.99,
                                        "posY": 113.54
                                    },
                                    {
                                        "id": 134,
                                        "posX": 258.99,
                                        "posY": 8.54
                                    }
                                ],
                                "handDeparturePoints": [
                                    {
                                        "id": 135,
                                        "posX": 251.99,
                                        "posY": 197.54
                                    },
                                    {
                                        "id": 136,
                                        "posX": 333.99,
                                        "posY": 176.54
                                    }
                                ],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4+",
                        "note": 3.9,
                        "receptionId": 1
                    },
                    {
                        "id": 12,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "Le départ assis est sévère mais le reste de la voie est trivial",
                        "techniqueIds": [
                            1
                        ],
                        "height": 2,
                        "lines": [
                            {
                                "id": 6,
                                "boulderImageId": 16,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 137,
                                        "posX": 323.99,
                                        "posY": 285.54
                                    },
                                    {
                                        "id": 142,
                                        "posX": 331.99,
                                        "posY": 115.54
                                    },
                                    {
                                        "id": 143,
                                        "posX": 278.99,
                                        "posY": 7.54
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6a",
                        "receptionId": 1
                    }
                ]
            },
            {
                "id": 16,
                "name": "Gaêllys",
                "location": {
                    "lat": 45.702065,
                    "lng": 4.605291
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 2,
                "images": [
                    {
                        "id": 243,
                        "url": "/public/uploads/boulder/image/42c98cfbc55c124196a59bf9003b2416e84df581.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 927,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 646,
                                "boulderImageId": 243,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7073,
                                        "posX": 333.33,
                                        "posY": 413.47
                                    },
                                    {
                                        "id": 7076,
                                        "posX": 298.33,
                                        "posY": 92.47
                                    },
                                    {
                                        "id": 7077,
                                        "posX": 266.33,
                                        "posY": 11.47
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 143,
                                        "points": [
                                            {
                                                "id": 7078,
                                                "posX": 213.33,
                                                "posY": 53.47
                                            },
                                            {
                                                "id": 7079,
                                                "posX": 245.33,
                                                "posY": 200.47
                                            },
                                            {
                                                "id": 7080,
                                                "posX": 211.33,
                                                "posY": 405.47
                                            },
                                            {
                                                "id": 7081,
                                                "posX": 134.33,
                                                "posY": 226.47
                                            },
                                            {
                                                "id": 7082,
                                                "posX": 213.33,
                                                "posY": 53.47
                                            }
                                        ]
                                    },
                                    {
                                        "id": 148,
                                        "points": [
                                            {
                                                "id": 7103,
                                                "posX": 400.33,
                                                "posY": 108.47
                                            },
                                            {
                                                "id": 7104,
                                                "posX": 576.33,
                                                "posY": 269.47
                                            },
                                            {
                                                "id": 7105,
                                                "posX": 502.33,
                                                "posY": 396.47
                                            },
                                            {
                                                "id": 7106,
                                                "posX": 397.33,
                                                "posY": 207.47
                                            },
                                            {
                                                "id": 7113,
                                                "posX": 400.33,
                                                "posY": 108.47
                                            }
                                        ]
                                    },
                                ]
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6b"
                    },
                    {
                        "id": 928,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": true,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 647,
                                "boulderImageId": 243,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10419,
                                        "posX": 388.72,
                                        "posY": 400.27
                                    },
                                    {
                                        "id": 10420,
                                        "posX": 261.72,
                                        "posY": 267.27
                                    },
                                    {
                                        "id": 10421,
                                        "posX": 244.72,
                                        "posY": 133.27
                                    },
                                    {
                                        "id": 10422,
                                        "posX": 257.72,
                                        "posY": 43.27
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5b"
                    },
                    {
                        "id": 931,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 648,
                                "boulderImageId": 243,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7137,
                                        "posX": 407.33,
                                        "posY": 375.5
                                    },
                                    {
                                        "id": 7149,
                                        "posX": 365.33,
                                        "posY": 112.5
                                    },
                                    {
                                        "id": 7150,
                                        "posX": 304.33,
                                        "posY": 38.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "4+"
                    }
                ]
            },
            {
                "id": 17,
                "name": "Hector Berlioz",
                "location": {
                    "lat": 45.702301,
                    "lng": 4.605275
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 3,
                "images": [
                    {
                        "id": 244,
                        "url": "/public/uploads/boulder/image/500883acb3a62f8b8c6bdb5fe7210d2bdf4b79fc.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 942,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 656,
                                "boulderImageId": 244,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7351,
                                        "posX": 50.08,
                                        "posY": 365.5
                                    },
                                    {
                                        "id": 7373,
                                        "posX": 26.08,
                                        "posY": 190.5
                                    },
                                    {
                                        "id": 7374,
                                        "posX": 115.08,
                                        "posY": 48.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "3+"
                    },
                    {
                        "id": 948,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 660,
                                "boulderImageId": 244,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7375,
                                        "posX": 124.08,
                                        "posY": 327.5
                                    },
                                    {
                                        "id": 7376,
                                        "posX": 174.08,
                                        "posY": 176.5
                                    },
                                    {
                                        "id": 7377,
                                        "posX": 156.08,
                                        "posY": 38.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "7a"
                    }
                ]
            },
            {
                "id": 18,
                "name": "ABOminable",
                "location": {
                    "lat": 45.702315,
                    "lng": 4.605294
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 4,
                "images": [
                    {
                        "id": 245,
                        "url": "/public/uploads/boulder/image/46ea25b910c2143a16e9ddfdfc0a49143e7aa77d.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 949,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 661,
                                "boulderImageId": 245,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7378,
                                        "posX": 236.33,
                                        "posY": 363.5
                                    },
                                    {
                                        "id": 7383,
                                        "posX": 293.33,
                                        "posY": 237.5
                                    },
                                    {
                                        "id": 7384,
                                        "posX": 413.33,
                                        "posY": 120.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "7b"
                    },
                    {
                        "id": 952,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 662,
                                "boulderImageId": 245,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7385,
                                        "posX": 398.33,
                                        "posY": 300.5
                                    },
                                    {
                                        "id": 7389,
                                        "posX": 385.33,
                                        "posY": 238.5
                                    },
                                    {
                                        "id": 7390,
                                        "posX": 307.33,
                                        "posY": 211.5
                                    },
                                    {
                                        "id": 7391,
                                        "posX": 283.33,
                                        "posY": 142.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 185,
                                        "points": [
                                            {
                                                "id": 7392,
                                                "posX": 434.33,
                                                "posY": 35.5
                                            },
                                            {
                                                "id": 7393,
                                                "posX": 459.33,
                                                "posY": 134.5
                                            },
                                            {
                                                "id": 7394,
                                                "posX": 422.33,
                                                "posY": 305.5
                                            },
                                            {
                                                "id": 7395,
                                                "posX": 379.33,
                                                "posY": 134.5
                                            },
                                            {
                                                "id": 7407,
                                                "posX": 434.33,
                                                "posY": 35.5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6a"
                    }
                ]
            },
            {
                "id": 3345,
                "name": "Petit Dulfer",
                "location": {
                    "lat": 45.702353,
                    "lng": 4.605317
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 5,
                "images": [
                    {
                        "id": 301,
                        "url": "/public/uploads/boulder/image/aa848fe59ca70da8313bc065696264ec58c5b746.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 953,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 952,
                                "boulderImageId": 301,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10288,
                                        "posX": 213.08,
                                        "posY": 377.5
                                    },
                                    {
                                        "id": 10293,
                                        "posX": 217.08,
                                        "posY": 156.5
                                    },
                                    {
                                        "id": 10294,
                                        "posX": 180.08,
                                        "posY": 13.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "3+"
                    },
                    {
                        "id": 966,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 953,
                                "boulderImageId": 301,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10295,
                                        "posX": 377.08,
                                        "posY": 361.5
                                    },
                                    {
                                        "id": 10300,
                                        "posX": 372.08,
                                        "posY": 175.5
                                    },
                                    {
                                        "id": 10301,
                                        "posX": 318.08,
                                        "posY": 24.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6b"
                    },
                    {
                        "id": 967,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 954,
                                "boulderImageId": 301,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10302,
                                        "posX": 623.08,
                                        "posY": 413.5
                                    },
                                    {
                                        "id": 10305,
                                        "posX": 572.08,
                                        "posY": 102.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6a+"
                    },
                    {
                        "id": 968,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 955,
                                "boulderImageId": 301,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10306,
                                        "posX": 669.08,
                                        "posY": 400.5
                                    },
                                    {
                                        "id": 10309,
                                        "posX": 626.08,
                                        "posY": 149.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "5c"
                    }
                ]
            },
            {
                "id": 3346,
                "name": "Le tombeau",
                "location": {
                    "lat": 45.702283,
                    "lng": 4.605083
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 6,
                "images": [
                    {
                        "id": 246,
                        "url": "/public/uploads/boulder/image/e6be4f215a5ddbe370bcc849e90874475a7979e8.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 969,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 663,
                                "boulderImageId": 246,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7413,
                                        "posX": 185.33,
                                        "posY": 380.5
                                    },
                                    {
                                        "id": 7422,
                                        "posX": 231.33,
                                        "posY": 247.5
                                    },
                                    {
                                        "id": 7423,
                                        "posX": 211.33,
                                        "posY": 113.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4+"
                    },
                    {
                        "id": 972,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 664,
                                "boulderImageId": 246,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7424,
                                        "posX": 443.33,
                                        "posY": 290.5
                                    },
                                    {
                                        "id": 7429,
                                        "posX": 410.33,
                                        "posY": 149.5
                                    },
                                    {
                                        "id": 7430,
                                        "posX": 323.33,
                                        "posY": 50.5
                                    }
                                ],
                                "handDeparturePoints": [
                                    {
                                        "id": 7431,
                                        "posX": 399.33,
                                        "posY": 184.5
                                    },
                                    {
                                        "id": 7432,
                                        "posX": 430.33,
                                        "posY": 170.5
                                    }
                                ],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 189,
                                        "points": [
                                            {
                                                "id": 7433,
                                                "posX": 509.33,
                                                "posY": 53.5
                                            },
                                            {
                                                "id": 7434,
                                                "posX": 517.33,
                                                "posY": 143.5
                                            },
                                            {
                                                "id": 7435,
                                                "posX": 482.33,
                                                "posY": 269.5
                                            },
                                            {
                                                "id": 7436,
                                                "posX": 445.33,
                                                "posY": 151.5
                                            },
                                            {
                                                "id": 7458,
                                                "posX": 509.33,
                                                "posY": 53.5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6b"
                    }
                ]
            },
            {
                "id": 3347,
                "name": "Dalle carrée",
                "location": {
                    "lat": 45.702249,
                    "lng": 4.604933
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 7,
                "images": [
                    {
                        "id": 247,
                        "url": "/public/uploads/boulder/image/6e68086a3173a8f1903d0c965b6b3b458a628850.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 973,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 964,
                                "boulderImageId": 247,
                                "boulderImageDimensions": {
                                    "width": 675,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10479,
                                        "posX": 134.72,
                                        "posY": 296.27
                                    },
                                    {
                                        "id": 10502,
                                        "posX": 465.72,
                                        "posY": 173.27
                                    },
                                    {
                                        "id": 10503,
                                        "posX": 503.72,
                                        "posY": 63.27
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6c"
                    },
                    {
                        "id": 976,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 666,
                                "boulderImageId": 247,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7475,
                                        "posX": 152.33,
                                        "posY": 254.5
                                    },
                                    {
                                        "id": 7484,
                                        "posX": 410.33,
                                        "posY": 180.5
                                    },
                                    {
                                        "id": 7485,
                                        "posX": 433.33,
                                        "posY": 139.5
                                    },
                                    {
                                        "id": 7486,
                                        "posX": 336.33,
                                        "posY": 90.5
                                    },
                                    {
                                        "id": 7487,
                                        "posX": 316.33,
                                        "posY": 48.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6c+"
                    },
                    {
                        "id": 977,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 671,
                                "boulderImageId": 247,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7495,
                                        "posX": 198.33,
                                        "posY": 355.5
                                    },
                                    {
                                        "id": 7496,
                                        "posX": 241.33,
                                        "posY": 51.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6a+"
                    },
                    {
                        "id": 979,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 965,
                                "boulderImageId": 247,
                                "boulderImageDimensions": {
                                    "width": 675,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10560,
                                        "posX": 268.72,
                                        "posY": 356.27
                                    },
                                    {
                                        "id": 10561,
                                        "posX": 298.72,
                                        "posY": 248.27
                                    },
                                    {
                                        "id": 10562,
                                        "posX": 324.72,
                                        "posY": 117.27
                                    },
                                    {
                                        "id": 10563,
                                        "posX": 342.72,
                                        "posY": 44.27
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "6b"
                    },
                    {
                        "id": 1309,
                        "creatorId": 3,
                        "name": "Passage 5",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 665,
                                "boulderImageId": 247,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10505,
                                        "posX": 521.72,
                                        "posY": 341.27
                                    },
                                    {
                                        "id": 10506,
                                        "posX": 534.72,
                                        "posY": 227.27
                                    },
                                    {
                                        "id": 10507,
                                        "posX": 537.72,
                                        "posY": 73.27
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 5,
                        "grade": "6a+"
                    }
                ]
            },
            {
                "id": 3348,
                "name": "Orphelin",
                "location": {
                    "lat": 45.702323,
                    "lng": 4.604916
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 8,
                "images": [
                    {
                        "id": 248,
                        "url": "/public/uploads/boulder/image/7f4099dc0ba275fc7f2272652f935364c1a58a68.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 980,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "Fissure interdite !",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 673,
                                "boulderImageId": 248,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7504,
                                        "posX": 161.08,
                                        "posY": 283.5
                                    },
                                    {
                                        "id": 7511,
                                        "posX": 251.08,
                                        "posY": 263.5
                                    },
                                    {
                                        "id": 7512,
                                        "posX": 260.08,
                                        "posY": 128.5
                                    }
                                ],
                                "handDeparturePoints": [
                                    {
                                        "id": 7513,
                                        "posX": 187.08,
                                        "posY": 229.5
                                    },
                                    {
                                        "id": 7514,
                                        "posX": 159.08,
                                        "posY": 227.5
                                    }
                                ],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 195,
                                        "points": [
                                            {
                                                "id": 7515,
                                                "posX": 192.08,
                                                "posY": 123.5
                                            },
                                            {
                                                "id": 7516,
                                                "posX": 166.08,
                                                "posY": 212.5
                                            },
                                            {
                                                "id": 7517,
                                                "posX": 124.08,
                                                "posY": 378.5
                                            },
                                            {
                                                "id": 7518,
                                                "posX": 139.08,
                                                "posY": 212.5
                                            },
                                            {
                                                "id": 7542,
                                                "posX": 192.08,
                                                "posY": 123.5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5a"
                    }
                ]
            },
            {
                "id": 3349,
                "name": "Famille nombreuse",
                "location": {
                    "lat": 45.702357,
                    "lng": 4.604918
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 9,
                "images": [
                    {
                        "id": 249,
                        "url": "/public/uploads/boulder/image/938b9d41fda9111b1ea83ae8055a9c351bf72f63.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 981,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 677,
                                "boulderImageId": 249,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7570,
                                        "posX": 155.33,
                                        "posY": 391.5
                                    },
                                    {
                                        "id": 7571,
                                        "posX": 336.33,
                                        "posY": 306.5
                                    },
                                    {
                                        "id": 7572,
                                        "posX": 426.33,
                                        "posY": 89.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4+"
                    },
                    {
                        "id": 982,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 678,
                                "boulderImageId": 249,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7573,
                                        "posX": 489.33,
                                        "posY": 394.5
                                    },
                                    {
                                        "id": 7578,
                                        "posX": 527.33,
                                        "posY": 188.5
                                    },
                                    {
                                        "id": 7579,
                                        "posX": 493.33,
                                        "posY": 26.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2
                    }
                ]
            }
        ],
        "wayPoints": []
    },
    {
        "id": 8,
        "name": "Historique",
        "description": "",
        "boulders": [
            {
                "id": 20,
                "name": "Dalle aux pitons",
                "location": {
                    "lat": 45.702526,
                    "lng": 4.605119
                },
                "isHighBall": false,
                "isMustSee": true,
                "orderIndex": 1,
                "images": [
                    {
                        "id": 15,
                        "url": "/public/uploads/boulder/image/15eb757e80d111f11bd402abd13cb167624e4a29.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 5,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "Aucun pied mais de bonnes mains qui raviront les doigts forts et acharnés.",
                        "techniqueIds": [
                            2,
                            13
                        ],
                        "height": 1.5,
                        "lines": [
                            {
                                "id": 2,
                                "boulderImageId": 15,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 48,
                                        "posX": 178.99,
                                        "posY": 354.54
                                    },
                                    {
                                        "id": 56,
                                        "posX": 562.99,
                                        "posY": 284.54
                                    }
                                ],
                                "handDeparturePoints": [
                                    {
                                        "id": 57,
                                        "posX": 180.99,
                                        "posY": 266.54
                                    },
                                    {
                                        "id": 58,
                                        "posX": 265.99,
                                        "posY": 230.54
                                    }
                                ],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5c",
                        "receptionId": 1
                    },
                    {
                        "id": 6,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "Un pas de traversée, puis une montée pas facile avec une petite pince qui abime les doigts",
                        "techniqueIds": [
                            6
                        ],
                        "height": 3,
                        "lines": [
                            {
                                "id": 3,
                                "boulderImageId": 15,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 59,
                                        "posX": 300.99,
                                        "posY": 340.54
                                    },
                                    {
                                        "id": 78,
                                        "posX": 456.99,
                                        "posY": 312.54
                                    },
                                    {
                                        "id": 79,
                                        "posX": 454.99,
                                        "posY": 206.54
                                    },
                                    {
                                        "id": 80,
                                        "posX": 455.99,
                                        "posY": 18.54
                                    }
                                ],
                                "handDeparturePoints": [
                                    {
                                        "id": 81,
                                        "posX": 278.99,
                                        "posY": 218.54
                                    },
                                    {
                                        "id": 82,
                                        "posX": 354.99,
                                        "posY": 243.54
                                    }
                                ],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 5,
                                        "points": [
                                            {
                                                "id": 83,
                                                "posX": 335.39,
                                                "posY": 10.54
                                            },
                                            {
                                                "id": 84,
                                                "posX": 324.59,
                                                "posY": 68.14
                                            },
                                            {
                                                "id": 85,
                                                "posX": 293.79,
                                                "posY": 219.34
                                            },
                                            {
                                                "id": 86,
                                                "posX": 278.59,
                                                "posY": 100.14
                                            },
                                            {
                                                "id": 94,
                                                "posX": 335.39,
                                                "posY": 10.54
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6c+",
                        "receptionId": 1
                    },
                    {
                        "id": 7,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "Une belle arrête avec un talon sympa à coincer.",
                        "techniqueIds": [
                            16
                        ],
                        "height": 3,
                        "lines": [
                            {
                                "id": 4,
                                "boulderImageId": 15,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 95,
                                        "posX": 547.99,
                                        "posY": 365.54
                                    },
                                    {
                                        "id": 106,
                                        "posX": 549.99,
                                        "posY": 150.54
                                    },
                                    {
                                        "id": 107,
                                        "posX": 501.99,
                                        "posY": 4.54
                                    }
                                ],
                                "handDeparturePoints": [
                                    {
                                        "id": 108,
                                        "posX": 516.99,
                                        "posY": 240.54
                                    },
                                    {
                                        "id": 109,
                                        "posX": 553.99,
                                        "posY": 204.54
                                    }
                                ],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6a+",
                        "receptionId": 1
                    }
                ]
            },
            {
                "id": 21,
                "name": "Le recoin",
                "location": {
                    "lat": 45.702467,
                    "lng": 4.605043
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 2,
                "images": [
                    {
                        "id": 300,
                        "url": "/public/uploads/boulder/image/1846ce7f9d73bd5b5c33cb5d4e2a4dfd59aa72d7.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1091,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 950,
                                "boulderImageId": 300,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10276,
                                        "posX": 260.08,
                                        "posY": 336.5
                                    },
                                    {
                                        "id": 10277,
                                        "posX": 273.08,
                                        "posY": 33.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4"
                    },
                    {
                        "id": 1092,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 951,
                                "boulderImageId": 300,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10278,
                                        "posX": 579.08,
                                        "posY": 286.5
                                    },
                                    {
                                        "id": 10285,
                                        "posX": 380.08,
                                        "posY": 232.5
                                    },
                                    {
                                        "id": 10286,
                                        "posX": 302.08,
                                        "posY": 237.5
                                    },
                                    {
                                        "id": 10287,
                                        "posX": 112.08,
                                        "posY": 91.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "4+"
                    }
                ]
            },
            {
                "id": 22,
                "name": "Le champi",
                "location": {
                    "lat": 45.702425,
                    "lng": 4.605092
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 3,
                "images": [
                    {
                        "id": 267,
                        "url": "/public/uploads/boulder/image/2237b0e6b7abd70c941e7dd1c77f795dff6354ff.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1095,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 753,
                                "boulderImageId": 267,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8362,
                                        "posX": 114.33,
                                        "posY": 277.5
                                    },
                                    {
                                        "id": 8363,
                                        "posX": 162.33,
                                        "posY": 69.5
                                    },
                                    {
                                        "id": 8364,
                                        "posX": 205.33,
                                        "posY": 10.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5a"
                    },
                    {
                        "id": 1098,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 754,
                                "boulderImageId": 267,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8365,
                                        "posX": 261.33,
                                        "posY": 348.5
                                    },
                                    {
                                        "id": 8374,
                                        "posX": 276.33,
                                        "posY": 120.5
                                    },
                                    {
                                        "id": 8375,
                                        "posX": 306.33,
                                        "posY": 8.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5b"
                    },
                    {
                        "id": 1101,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 755,
                                "boulderImageId": 267,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8376,
                                        "posX": 368.33,
                                        "posY": 316.5
                                    },
                                    {
                                        "id": 8398,
                                        "posX": 404.33,
                                        "posY": 159.5
                                    },
                                    {
                                        "id": 8399,
                                        "posX": 379.33,
                                        "posY": 22.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6a"
                    },
                    {
                        "id": 1107,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 759,
                                "boulderImageId": 267,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8400,
                                        "posX": 576.33,
                                        "posY": 282.5
                                    },
                                    {
                                        "id": 8401,
                                        "posX": 506.33,
                                        "posY": 91.5
                                    },
                                    {
                                        "id": 8402,
                                        "posX": 451.33,
                                        "posY": 41.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "4+"
                    }
                ]
            },
            {
                "id": 3350,
                "name": "Le tipi",
                "location": {
                    "lat": 45.702575,
                    "lng": 4.605283
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 4,
                "images": [
                    {
                        "id": 263,
                        "url": "/public/uploads/boulder/image/c64477d2a409f08395a8085a3dd0cf5e59b6c364.jpeg"
                    },
                    {
                        "id": 266,
                        "url": "/public/uploads/boulder/image/31cc0cf375a9706afcf468a537ab138758480b48.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1054,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 744,
                                "boulderImageId": 266,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8299,
                                        "posX": 28.08,
                                        "posY": 233.5
                                    },
                                    {
                                        "id": 8306,
                                        "posX": 63.08,
                                        "posY": 134.5
                                    },
                                    {
                                        "id": 8307,
                                        "posX": 192.08,
                                        "posY": 6.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5b"
                    },
                    {
                        "id": 1056,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 745,
                                "boulderImageId": 266,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8308,
                                        "posX": 210.08,
                                        "posY": 216.5
                                    },
                                    {
                                        "id": 8329,
                                        "posX": 140.08,
                                        "posY": 232.5
                                    },
                                    {
                                        "id": 8330,
                                        "posX": 75.08,
                                        "posY": 171.5
                                    },
                                    {
                                        "id": 8331,
                                        "posX": 114.08,
                                        "posY": 102.5
                                    },
                                    {
                                        "id": 8332,
                                        "posX": 196.08,
                                        "posY": 11.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6a+"
                    },
                    {
                        "id": 1059,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 746,
                                "boulderImageId": 263,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8333,
                                        "posX": 255.08,
                                        "posY": 301.5
                                    },
                                    {
                                        "id": 8340,
                                        "posX": 151.08,
                                        "posY": 240.5
                                    },
                                    {
                                        "id": 8341,
                                        "posX": 79.08,
                                        "posY": 214.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6a"
                    },
                    {
                        "id": 1061,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 747,
                                "boulderImageId": 263,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8342,
                                        "posX": 181.08,
                                        "posY": 364.5
                                    },
                                    {
                                        "id": 8348,
                                        "posX": 174.08,
                                        "posY": 85.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "4+"
                    }
                ]
            },
            {
                "id": 3351,
                "name": "La limace",
                "location": {
                    "lat": 45.702605,
                    "lng": 4.605279
                },
                "isHighBall": true,
                "isMustSee": false,
                "orderIndex": 5,
                "images": [
                    {
                        "id": 296,
                        "url": "/public/uploads/boulder/image/0d229cebd90b013d7faf8cfb24ffb036c891c739.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1066,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 923,
                                "boulderImageId": 296,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9778,
                                        "posX": 113.19,
                                        "posY": 362.5
                                    },
                                    {
                                        "id": 9783,
                                        "posX": 114.19,
                                        "posY": 172.5
                                    },
                                    {
                                        "id": 9784,
                                        "posX": 145.19,
                                        "posY": 27.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4"
                    },
                    {
                        "id": 1067,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 924,
                                "boulderImageId": 296,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9785,
                                        "posX": 229.19,
                                        "posY": 376.5
                                    },
                                    {
                                        "id": 9790,
                                        "posX": 202.19,
                                        "posY": 238.5
                                    },
                                    {
                                        "id": 9791,
                                        "posX": 167.19,
                                        "posY": 48.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "3+"
                    },
                    {
                        "id": 1068,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 925,
                                "boulderImageId": 296,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9792,
                                        "posX": 268.19,
                                        "posY": 300.5
                                    },
                                    {
                                        "id": 9797,
                                        "posX": 244.19,
                                        "posY": 174.5
                                    },
                                    {
                                        "id": 9798,
                                        "posX": 165.19,
                                        "posY": 58.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "3"
                    }
                ]
            },
            {
                "id": 3352,
                "name": "Le 5b/c",
                "location": {
                    "lat": 45.702632,
                    "lng": 4.605289
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 6,
                "images": [
                    {
                        "id": 297,
                        "url": "/public/uploads/boulder/image/9c4966c8f1aee81911d309cc34eefad857f7c1c6.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1069,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 926,
                                "boulderImageId": 297,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9799,
                                        "posX": 240.08,
                                        "posY": 386.5
                                    },
                                    {
                                        "id": 9802,
                                        "posX": 241.08,
                                        "posY": 59.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5c"
                    },
                    {
                        "id": 1093,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 927,
                                "boulderImageId": 297,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9803,
                                        "posX": 387.08,
                                        "posY": 365.5
                                    },
                                    {
                                        "id": 9808,
                                        "posX": 382.08,
                                        "posY": 204.5
                                    },
                                    {
                                        "id": 9809,
                                        "posX": 406.08,
                                        "posY": 105.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6a"
                    },
                    {
                        "id": 1094,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 928,
                                "boulderImageId": 297,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9810,
                                        "posX": 467.08,
                                        "posY": 360.5
                                    },
                                    {
                                        "id": 9817,
                                        "posX": 461.08,
                                        "posY": 207.5
                                    },
                                    {
                                        "id": 9818,
                                        "posX": 411.08,
                                        "posY": 108.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "3"
                    }
                ]
            },
            {
                "id": 3353,
                "name": "L'arête",
                "location": {
                    "lat": 45.702548,
                    "lng": 4.605391
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 7,
                "images": [
                    {
                        "id": 295,
                        "url": "/public/uploads/boulder/image/e0c31e876d02f9d063c6be80e1731a4fa5a8a065.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1053,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 922,
                                "boulderImageId": 295,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9756,
                                        "posX": 157.08,
                                        "posY": 336.5
                                    },
                                    {
                                        "id": 9775,
                                        "posX": 293.08,
                                        "posY": 140.5
                                    },
                                    {
                                        "id": 9776,
                                        "posX": 371.08,
                                        "posY": 90.5
                                    },
                                    {
                                        "id": 9777,
                                        "posX": 445.08,
                                        "posY": 22.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "3"
                    }
                ]
            },
            {
                "id": 3354,
                "name": "Pincette",
                "location": {
                    "lat": 45.702675,
                    "lng": 4.605431
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 8,
                "images": [
                    {
                        "id": 261,
                        "url": "/public/uploads/boulder/image/d9d6230ae4efda86acb09b021b1faf284a9eab43.jpeg"
                    }
                ],
                "tracks": []
            },
            {
                "id": 3355,
                "name": "La terreuse",
                "location": {
                    "lat": 45.702765,
                    "lng": 4.605573
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 9,
                "images": [
                    {
                        "id": 259,
                        "url": "/public/uploads/boulder/image/7ef99834f05ef7f8545361d5a0e08c59aeab0efa.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1039,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 725,
                                "boulderImageId": 259,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8237,
                                        "posX": 201.33,
                                        "posY": 416.5
                                    },
                                    {
                                        "id": 8240,
                                        "posX": 202.33,
                                        "posY": 57.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6c"
                    },
                    {
                        "id": 1042,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 726,
                                "boulderImageId": 259,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8241,
                                        "posX": 413.33,
                                        "posY": 400.5
                                    },
                                    {
                                        "id": 8258,
                                        "posX": 402.33,
                                        "posY": 148.5
                                    },
                                    {
                                        "id": 8259,
                                        "posX": 150.33,
                                        "posY": 113.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6b"
                    },
                    {
                        "id": 1047,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 729,
                                "boulderImageId": 259,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8260,
                                        "posX": 455.33,
                                        "posY": 387.5
                                    },
                                    {
                                        "id": 8261,
                                        "posX": 437.33,
                                        "posY": 145.5
                                    },
                                    {
                                        "id": 8262,
                                        "posX": 393.33,
                                        "posY": 33.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "5a+"
                    }
                ]
            },
            {
                "id": 3356,
                "name": "La fissure à Bibus",
                "location": {
                    "lat": 45.702764,
                    "lng": 4.605638
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 10,
                "images": [
                    {
                        "id": 299,
                        "url": "/public/uploads/boulder/image/c2d048c7ff8ec0e38eec0d424c7a7ae0faaf7153.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1011,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 942,
                                "boulderImageId": 299,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10239,
                                        "posX": 328.08,
                                        "posY": 406.5
                                    },
                                    {
                                        "id": 10240,
                                        "posX": 223.08,
                                        "posY": 33.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5c+"
                    },
                    {
                        "id": 1021,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 943,
                                "boulderImageId": 299,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10241,
                                        "posX": 371.08,
                                        "posY": 397.5
                                    },
                                    {
                                        "id": 10245,
                                        "posX": 329.08,
                                        "posY": 16.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5a+"
                    },
                    {
                        "id": 1026,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 944,
                                "boulderImageId": 299,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10246,
                                        "posX": 417.08,
                                        "posY": 395.5
                                    },
                                    {
                                        "id": 10248,
                                        "posX": 397.08,
                                        "posY": 25.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 404,
                                        "points": [
                                            {
                                                "id": 10249,
                                                "posX": 343.08,
                                                "posY": 192.5
                                            },
                                            {
                                                "id": 10250,
                                                "posX": 383.08,
                                                "posY": 232.5
                                            },
                                            {
                                                "id": 10251,
                                                "posX": 343.08,
                                                "posY": 272.5
                                            },
                                            {
                                                "id": 10252,
                                                "posX": 303.08,
                                                "posY": 232.5
                                            },
                                            {
                                                "id": 10253,
                                                "posX": 343.08,
                                                "posY": 192.5
                                            }
                                        ]
                                    },
                                    {
                                        "id": 405,
                                        "points": [
                                            {
                                                "id": 10254,
                                                "posX": 320.08,
                                                "posY": 92.5
                                            },
                                            {
                                                "id": 10255,
                                                "posX": 360.08,
                                                "posY": 132.5
                                            },
                                            {
                                                "id": 10256,
                                                "posX": 320.08,
                                                "posY": 172.5
                                            },
                                            {
                                                "id": 10257,
                                                "posX": 280.08,
                                                "posY": 132.5
                                            },
                                            {
                                                "id": 10258,
                                                "posX": 320.08,
                                                "posY": 92.5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6c"
                    },
                    {
                        "id": 1040,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 945,
                                "boulderImageId": 299,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10259,
                                        "posX": 482.08,
                                        "posY": 387.5
                                    },
                                    {
                                        "id": 10264,
                                        "posX": 459.08,
                                        "posY": 49.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "6a+"
                    },
                    {
                        "id": 1041,
                        "creatorId": 3,
                        "name": "Passage 5",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 946,
                                "boulderImageId": 299,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10265,
                                        "posX": 588.08,
                                        "posY": 337.5
                                    },
                                    {
                                        "id": 10270,
                                        "posX": 551.08,
                                        "posY": 102.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 5,
                        "grade": "6a+"
                    }
                ]
            },
            {
                "id": 3357,
                "name": "La dalle aux trous",
                "location": {
                    "lat": 45.702741,
                    "lng": 4.605689
                },
                "isHighBall": true,
                "isMustSee": false,
                "orderIndex": 11,
                "images": [
                    {
                        "id": 298,
                        "url": "/public/uploads/boulder/image/00467bd42af1443670883d647ab2301cc95a2a29.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1009,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 930,
                                "boulderImageId": 298,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9861,
                                        "posX": 374.08,
                                        "posY": 351.5
                                    },
                                    {
                                        "id": 9864,
                                        "posX": 356.08,
                                        "posY": 81.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5a+"
                    },
                    {
                        "id": 1010,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 931,
                                "boulderImageId": 298,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9865,
                                        "posX": 505.08,
                                        "posY": 374.5
                                    },
                                    {
                                        "id": 9875,
                                        "posX": 444.08,
                                        "posY": 72.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5c"
                    },
                    {
                        "id": 1304,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 937,
                                "boulderImageId": 298,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10223,
                                        "posX": 207.08,
                                        "posY": 363.5
                                    },
                                    {
                                        "id": 10224,
                                        "posX": 228.08,
                                        "posY": 187.5
                                    },
                                    {
                                        "id": 10225,
                                        "posX": 206.08,
                                        "posY": 64.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 396,
                                        "points": [
                                            {
                                                "id": 10175,
                                                "posX": 174.08,
                                                "posY": 51.5
                                            },
                                            {
                                                "id": 10176,
                                                "posX": 163.08,
                                                "posY": 212.5
                                            },
                                            {
                                                "id": 10177,
                                                "posX": 115.08,
                                                "posY": 379.5
                                            },
                                            {
                                                "id": 10178,
                                                "posX": 83.08,
                                                "posY": 212.5
                                            },
                                            {
                                                "id": 10226,
                                                "posX": 174.08,
                                                "posY": 51.5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6b"
                    }
                ]
            },
            {
                "id": 3358,
                "name": "La dalle aux boutons",
                "location": {
                    "lat": 45.70267494944844,
                    "lng": 4.605624002310416
                },
                "isHighBall": true,
                "isMustSee": false,
                "orderIndex": 12,
                "images": [
                    {
                        "id": 260,
                        "url": "/public/uploads/boulder/image/e50aadc6381cbff3dce65844ab56fe9e6151c6b3.jpeg"
                    }
                ],
                "tracks": []
            },
            {
                "id": 3359,
                "name": "Super pincette",
                "location": {
                    "lat": 45.702674,
                    "lng": 4.605581
                },
                "isHighBall": true,
                "isMustSee": false,
                "orderIndex": 13,
                "images": [
                    {
                        "id": 262,
                        "url": "/public/uploads/boulder/image/6e3f1d461754921e73b4578f4ea6760757c47703.jpeg"
                    }
                ],
                "tracks": []
            },
            {
                "id": 3360,
                "name": "Clochette chlorée chocolatée",
                "location": {
                    "lat": 45.702663,
                    "lng": 4.605757
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 14,
                "images": [
                    {
                        "id": 257,
                        "url": "/public/uploads/boulder/image/9aaa64316dd5a7c3d7fc4e4f85be4e286583aa50.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1000,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 698,
                                "boulderImageId": 257,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7933,
                                        "posX": 152.33,
                                        "posY": 271.5
                                    },
                                    {
                                        "id": 7938,
                                        "posX": 349.33,
                                        "posY": 251.5
                                    },
                                    {
                                        "id": 7939,
                                        "posX": 414.33,
                                        "posY": 56.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a"
                    },
                    {
                        "id": 1001,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 699,
                                "boulderImageId": 257,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7940,
                                        "posX": 501.33,
                                        "posY": 322.5
                                    },
                                    {
                                        "id": 7943,
                                        "posX": 450.33,
                                        "posY": 53.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "7a"
                    }
                ]
            },
            {
                "id": 3361,
                "name": "Sergio sur Mars",
                "location": {
                    "lat": 45.70255868302534,
                    "lng": 4.605595705522543
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 15,
                "images": [
                    {
                        "id": 256,
                        "url": "/public/uploads/boulder/image/53e9eca71ce3b6cb19e0f77c9ad21e899e3e9648.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 999,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 697,
                                "boulderImageId": 256,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7931,
                                        "posX": 311.33,
                                        "posY": 426.5
                                    },
                                    {
                                        "id": 7932,
                                        "posX": 295.33,
                                        "posY": 22.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4+"
                    }
                ]
            },
            {
                "id": 3362,
                "name": "Baltazar",
                "location": {
                    "lat": 45.702473,
                    "lng": 4.60558
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 16,
                "images": [
                    {
                        "id": 255,
                        "url": "/public/uploads/boulder/image/78c8c2f1a8914d69e63e5d9147f75ecb43f66580.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 998,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 693,
                                "boulderImageId": 255,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7748,
                                        "posX": 151.33,
                                        "posY": 232.5
                                    },
                                    {
                                        "id": 7749,
                                        "posX": 308.33,
                                        "posY": 212.5
                                    },
                                    {
                                        "id": 7750,
                                        "posX": 410.33,
                                        "posY": 122.5
                                    },
                                    {
                                        "id": 7751,
                                        "posX": 412.33,
                                        "posY": 21.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 221,
                                        "points": [
                                            {
                                                "id": 7752,
                                                "posX": 234.33,
                                                "posY": 50.5
                                            },
                                            {
                                                "id": 7753,
                                                "posX": 370.33,
                                                "posY": 8.5
                                            },
                                            {
                                                "id": 7754,
                                                "posX": 255.33,
                                                "posY": 90.5
                                            },
                                            {
                                                "id": 7755,
                                                "posX": 141.33,
                                                "posY": 167.5
                                            },
                                            {
                                                "id": 7905,
                                                "posX": 234.33,
                                                "posY": 50.5
                                            }
                                        ]
                                    },
                                    {
                                        "id": 250,
                                        "points": [
                                            {
                                                "id": 7906,
                                                "posX": 371.33,
                                                "posY": 288.5
                                            },
                                            {
                                                "id": 7907,
                                                "posX": 531.33,
                                                "posY": 381.5
                                            },
                                            {
                                                "id": 7908,
                                                "posX": 466.33,
                                                "posY": 438.5
                                            },
                                            {
                                                "id": 7909,
                                                "posX": 309.33,
                                                "posY": 400.5
                                            },
                                            {
                                                "id": 7910,
                                                "posX": 371.33,
                                                "posY": 288.5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a"
                    }
                ]
            },
            {
                "id": 3363,
                "name": "L'arrêt des fesses",
                "location": {
                    "lat": 45.702415,
                    "lng": 4.605642
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 17,
                "images": [
                    {
                        "id": 254,
                        "url": "/public/uploads/boulder/image/2d0c677b601379b1c822f0f9a1c59f8b5a6cd76b.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 994,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 689,
                                "boulderImageId": 254,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7677,
                                        "posX": 124.08,
                                        "posY": 316.5
                                    },
                                    {
                                        "id": 7682,
                                        "posX": 162.08,
                                        "posY": 93.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5b+"
                    },
                    {
                        "id": 997,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 690,
                                "boulderImageId": 254,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7683,
                                        "posX": 141.08,
                                        "posY": 306.5
                                    },
                                    {
                                        "id": 7685,
                                        "posX": 181.08,
                                        "posY": 92.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 210,
                                        "points": [
                                            {
                                                "id": 7686,
                                                "posX": 109.08,
                                                "posY": 68.5
                                            },
                                            {
                                                "id": 7687,
                                                "posX": 102.08,
                                                "posY": 185.5
                                            },
                                            {
                                                "id": 7688,
                                                "posX": 30.08,
                                                "posY": 350.5
                                            },
                                            {
                                                "id": 7689,
                                                "posX": 51.08,
                                                "posY": 196.5
                                            },
                                            {
                                                "id": 7696,
                                                "posX": 109.08,
                                                "posY": 68.5
                                            }
                                        ]
                                    },
                                    {
                                        "id": 215,
                                        "points": [
                                            {
                                                "id": 7712,
                                                "posX": 263.08,
                                                "posY": 72.5
                                            },
                                            {
                                                "id": 7713,
                                                "posX": 229.08,
                                                "posY": 225.5
                                            },
                                            {
                                                "id": 7714,
                                                "posX": 174.08,
                                                "posY": 333.5
                                            },
                                            {
                                                "id": 7715,
                                                "posX": 185.08,
                                                "posY": 209.5
                                            },
                                            {
                                                "id": 7722,
                                                "posX": 263.08,
                                                "posY": 72.5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6c"
                    }
                ]
            },
            {
                "id": 3364,
                "name": "Dalle",
                "location": {
                    "lat": 45.702385,
                    "lng": 4.605672
                },
                "isHighBall": true,
                "isMustSee": false,
                "orderIndex": 18,
                "images": [
                    {
                        "id": 252,
                        "url": "/public/uploads/boulder/image/cdd092672cbcb9db2d133c625caee6905ffe05a1.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 992,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 684,
                                "boulderImageId": 252,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7653,
                                        "posX": 191.08,
                                        "posY": 341.5
                                    },
                                    {
                                        "id": 7663,
                                        "posX": 107.08,
                                        "posY": 1.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [
                                    {
                                        "id": 7664,
                                        "posX": 153.08,
                                        "posY": 155.5
                                    },
                                    {
                                        "id": 7665,
                                        "posX": 135.08,
                                        "posY": 49.5
                                    },
                                    {
                                        "id": 7666,
                                        "posX": 111.08,
                                        "posY": -0.5
                                    }
                                ],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5b"
                    }
                ]
            },
            {
                "id": 3365,
                "name": "Le green",
                "location": {
                    "lat": 45.702359,
                    "lng": 4.605597
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 19,
                "images": [
                    {
                        "id": 253,
                        "url": "/public/uploads/boulder/image/b65e86d0a58798c6e1974987153de0e58b43cb89.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 993,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 688,
                                "boulderImageId": 253,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7674,
                                        "posX": 363.33,
                                        "posY": 410.5
                                    },
                                    {
                                        "id": 7675,
                                        "posX": 347.33,
                                        "posY": 140.5
                                    },
                                    {
                                        "id": 7676,
                                        "posX": 282.33,
                                        "posY": 38.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4"
                    }
                ]
            },
            {
                "id": 3366,
                "name": "Le 1ier bloc",
                "location": {
                    "lat": 45.702129,
                    "lng": 4.605803
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 20,
                "images": [
                    {
                        "id": 250,
                        "url": "/public/uploads/boulder/image/98b9524feefca7787fca84e63c1458ea71ec9c35.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 983,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 679,
                                "boulderImageId": 250,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7580,
                                        "posX": 165.33,
                                        "posY": 249.5
                                    },
                                    {
                                        "id": 7587,
                                        "posX": 301.33,
                                        "posY": 283.5
                                    },
                                    {
                                        "id": 7588,
                                        "posX": 357.33,
                                        "posY": 214.5
                                    },
                                    {
                                        "id": 7589,
                                        "posX": 336.33,
                                        "posY": 54.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6c"
                    },
                    {
                        "id": 984,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 680,
                                "boulderImageId": 250,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7590,
                                        "posX": 170.33,
                                        "posY": 314.5
                                    },
                                    {
                                        "id": 7599,
                                        "posX": 206.33,
                                        "posY": 142.5
                                    },
                                    {
                                        "id": 7600,
                                        "posX": 265.33,
                                        "posY": 42.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6a+"
                    },
                    {
                        "id": 987,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 681,
                                "boulderImageId": 250,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7601,
                                        "posX": 496.33,
                                        "posY": 347.5
                                    },
                                    {
                                        "id": 7606,
                                        "posX": 503.33,
                                        "posY": 181.5
                                    },
                                    {
                                        "id": 7607,
                                        "posX": 482.33,
                                        "posY": 82.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6a"
                    }
                ]
            },
            {
                "id": 3367,
                "name": "Traversée facile",
                "location": {
                    "lat": 45.702399,
                    "lng": 4.605772
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 21,
                "images": [
                    {
                        "id": 251,
                        "url": "/public/uploads/boulder/image/c74b37b29f0bb907f6d2d3752c92c0bce4940379.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 988,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 682,
                                "boulderImageId": 251,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10564,
                                        "posX": 278.72,
                                        "posY": 386.27
                                    },
                                    {
                                        "id": 10565,
                                        "posX": 189.72,
                                        "posY": 263.27
                                    },
                                    {
                                        "id": 10566,
                                        "posX": 380.72,
                                        "posY": 87.27
                                    },
                                    {
                                        "id": 10567,
                                        "posX": 441.72,
                                        "posY": 66.27
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4"
                    },
                    {
                        "id": 989,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 683,
                                "boulderImageId": 251,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 7615,
                                        "posX": 308.33,
                                        "posY": 361.5
                                    },
                                    {
                                        "id": 7619,
                                        "posX": 230.33,
                                        "posY": 255.5
                                    },
                                    {
                                        "id": 7620,
                                        "posX": 305.33,
                                        "posY": 141.5
                                    },
                                    {
                                        "id": 7621,
                                        "posX": 451.33,
                                        "posY": 77.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 204,
                                        "points": [
                                            {
                                                "id": 7622,
                                                "posX": 389.33,
                                                "posY": 40.5
                                            },
                                            {
                                                "id": 7623,
                                                "posX": 490.33,
                                                "posY": 44.5
                                            },
                                            {
                                                "id": 7624,
                                                "posX": 257.33,
                                                "posY": 146.5
                                            },
                                            {
                                                "id": 7625,
                                                "posX": 137.33,
                                                "posY": 186.5
                                            },
                                            {
                                                "id": 7647,
                                                "posX": 389.33,
                                                "posY": 40.5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5a+"
                    }
                ]
            },
            {
                "id": 4112,
                "name": "Le decimal",
                "location": {
                    "lat": 45.702534,
                    "lng": 4.605366
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 22,
                "images": [
                    {
                        "id": 304,
                        "url": "/public/uploads/boulder/image/4221537ff2d37aa17e89ca1b76602a497acfd9d3.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1305,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 961,
                                "boulderImageId": 304,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10347,
                                        "posX": 105.08,
                                        "posY": 396.5
                                    },
                                    {
                                        "id": 10348,
                                        "posX": 127.08,
                                        "posY": 100.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5a"
                    },
                    {
                        "id": 1307,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "Très dur..",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 962,
                                "boulderImageId": 304,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10349,
                                        "posX": 197.08,
                                        "posY": 376.5
                                    },
                                    {
                                        "id": 10352,
                                        "posX": 198.08,
                                        "posY": 30.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2
                    }
                ]
            }
        ],
        "wayPoints": []
    },
    {
        "id": 166,
        "name": "Ca coince",
        "description": "",
        "boulders": [
            {
                "id": 3368,
                "name": "Méthode marmotte",
                "location": {
                    "lat": 45.70266,
                    "lng": 4.605911
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 1,
                "images": [
                    {
                        "id": 294,
                        "url": "/public/uploads/boulder/image/fc2ba75a95f87c9a19ef12290c20ea2e20ea2e54.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1108,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 914,
                                "boulderImageId": 294,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9708,
                                        "posX": 172.08,
                                        "posY": 294.5
                                    },
                                    {
                                        "id": 9713,
                                        "posX": 154.08,
                                        "posY": 194.5
                                    },
                                    {
                                        "id": 9714,
                                        "posX": 191.08,
                                        "posY": 125.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4+"
                    },
                    {
                        "id": 1109,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 915,
                                "boulderImageId": 294,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9715,
                                        "posX": 384.08,
                                        "posY": 377.5
                                    },
                                    {
                                        "id": 9720,
                                        "posX": 327.08,
                                        "posY": 205.5
                                    },
                                    {
                                        "id": 9721,
                                        "posX": 342.08,
                                        "posY": 80.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6b+"
                    },
                    {
                        "id": 1117,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 916,
                                "boulderImageId": 294,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9745,
                                        "posX": 408.08,
                                        "posY": 388.5
                                    },
                                    {
                                        "id": 9746,
                                        "posX": 345.08,
                                        "posY": 208.5
                                    },
                                    {
                                        "id": 9747,
                                        "posX": 353.08,
                                        "posY": 86.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "7a+"
                    },
                    {
                        "id": 1118,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 920,
                                "boulderImageId": 294,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9748,
                                        "posX": 466.08,
                                        "posY": 370.5
                                    },
                                    {
                                        "id": 9749,
                                        "posX": 484.08,
                                        "posY": 166.5
                                    },
                                    {
                                        "id": 9750,
                                        "posX": 407.08,
                                        "posY": 100.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "7a"
                    },
                    {
                        "id": 1119,
                        "creatorId": 3,
                        "name": "Passage 5",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 921,
                                "boulderImageId": 294,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9751,
                                        "posX": 562.08,
                                        "posY": 262.5
                                    },
                                    {
                                        "id": 9754,
                                        "posX": 528.08,
                                        "posY": 132.5
                                    },
                                    {
                                        "id": 9755,
                                        "posX": 500.08,
                                        "posY": 84.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 5,
                        "grade": "5b"
                    }
                ]
            },
            {
                "id": 3369,
                "name": "Toit poffé",
                "location": {
                    "lat": 45.702673,
                    "lng": 4.605934
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 2,
                "images": [
                    {
                        "id": 268,
                        "url": "/public/uploads/boulder/image/8c8386110c64425b187dd9f811dac2a5b3dd231d.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1120,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 760,
                                "boulderImageId": 268,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8403,
                                        "posX": 460.33,
                                        "posY": 346.5
                                    },
                                    {
                                        "id": 8417,
                                        "posX": 269.33,
                                        "posY": 250.5
                                    },
                                    {
                                        "id": 8418,
                                        "posX": 143.33,
                                        "posY": 201.5
                                    },
                                    {
                                        "id": 8419,
                                        "posX": 152.33,
                                        "posY": 33.5
                                    }
                                ],
                                "handDeparturePoints": [
                                    {
                                        "id": 8420,
                                        "posX": 385.33,
                                        "posY": 279.5
                                    },
                                    {
                                        "id": 8421,
                                        "posX": 418.33,
                                        "posY": 297.5
                                    }
                                ],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6c"
                    }
                ]
            },
            {
                "id": 3370,
                "name": "Soucoupe",
                "location": {
                    "lat": 45.702713,
                    "lng": 4.605868
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 3,
                "images": [
                    {
                        "id": 269,
                        "url": "/public/uploads/boulder/image/41d8db37487a25fa42dc4af3b3516803ceac6ae3.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1121,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 761,
                                "boulderImageId": 269,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8422,
                                        "posX": 323.33,
                                        "posY": 289.5
                                    },
                                    {
                                        "id": 8425,
                                        "posX": 317.33,
                                        "posY": 103.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a"
                    }
                ]
            },
            {
                "id": 3371,
                "name": "La chaise du géant",
                "location": {
                    "lat": 45.702767,
                    "lng": 4.605911
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 4,
                "images": [
                    {
                        "id": 270,
                        "url": "/public/uploads/boulder/image/5969c3b8650b8cc4ad418a6c26ade0eab9a0d887.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1122,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 766,
                                "boulderImageId": 270,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8437,
                                        "posX": 158.08,
                                        "posY": 311.5
                                    },
                                    {
                                        "id": 8438,
                                        "posX": 275.08,
                                        "posY": 214.5
                                    },
                                    {
                                        "id": 8439,
                                        "posX": 238.08,
                                        "posY": 135.5
                                    },
                                    {
                                        "id": 8440,
                                        "posX": 172.08,
                                        "posY": 88.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6b"
                    },
                    {
                        "id": 1123,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 772,
                                "boulderImageId": 270,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8450,
                                        "posX": 182.08,
                                        "posY": 283.5
                                    },
                                    {
                                        "id": 8451,
                                        "posX": 224.08,
                                        "posY": 113.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5b+"
                    },
                    {
                        "id": 1126,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 773,
                                "boulderImageId": 270,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8452,
                                        "posX": 161.08,
                                        "posY": 258.5
                                    },
                                    {
                                        "id": 8457,
                                        "posX": 229.08,
                                        "posY": 249.5
                                    },
                                    {
                                        "id": 8458,
                                        "posX": 217.08,
                                        "posY": 199.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6b"
                    }
                ]
            },
            {
                "id": 3372,
                "name": "Electron libre",
                "location": {
                    "lat": 45.702926,
                    "lng": 4.605808
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 5,
                "images": [
                    {
                        "id": 271,
                        "url": "/public/uploads/boulder/image/f3d12bae5c457ead2fa075380c855f67647ad394.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1127,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 776,
                                "boulderImageId": 271,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8463,
                                        "posX": 73.33,
                                        "posY": 266.5
                                    },
                                    {
                                        "id": 8464,
                                        "posX": 369.33,
                                        "posY": 254.5
                                    },
                                    {
                                        "id": 8465,
                                        "posX": 630.33,
                                        "posY": 127.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5c+"
                    },
                    {
                        "id": 1128,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 777,
                                "boulderImageId": 271,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8466,
                                        "posX": 394.33,
                                        "posY": 326.5
                                    },
                                    {
                                        "id": 8469,
                                        "posX": 391.33,
                                        "posY": 129.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "3"
                    }
                ]
            },
            {
                "id": 3373,
                "name": "Hingballs le bucheron",
                "location": {
                    "lat": 45.703055035133936,
                    "lng": 4.605817091473554
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 6,
                "images": [
                    {
                        "id": 272,
                        "url": "/public/uploads/boulder/image/85485a84ce3b52c1b619e56f433489e104d6e959.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1129,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 778,
                                "boulderImageId": 272,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8470,
                                        "posX": 73.33,
                                        "posY": 279.5
                                    },
                                    {
                                        "id": 8479,
                                        "posX": 117.33,
                                        "posY": 144.5
                                    },
                                    {
                                        "id": 8480,
                                        "posX": 109.33,
                                        "posY": 29.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "3+"
                    },
                    {
                        "id": 1132,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "Départ sur les inversées, gros bacs interdits pour les mains et les pieds",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 779,
                                "boulderImageId": 272,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8481,
                                        "posX": 157.33,
                                        "posY": 338.5
                                    },
                                    {
                                        "id": 8486,
                                        "posX": 173.33,
                                        "posY": 145.5
                                    },
                                    {
                                        "id": 8487,
                                        "posX": 128.33,
                                        "posY": 27.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6a+"
                    },
                    {
                        "id": 1133,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 789,
                                "boulderImageId": 272,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8511,
                                        "posX": 333.33,
                                        "posY": 345.5
                                    },
                                    {
                                        "id": 8512,
                                        "posX": 328.33,
                                        "posY": 163.5
                                    },
                                    {
                                        "id": 8513,
                                        "posX": 299.33,
                                        "posY": 61.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "3"
                    },
                    {
                        "id": 1138,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 790,
                                "boulderImageId": 272,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8514,
                                        "posX": 500.33,
                                        "posY": 425.5
                                    },
                                    {
                                        "id": 8515,
                                        "posX": 447.33,
                                        "posY": 162.5
                                    },
                                    {
                                        "id": 8516,
                                        "posX": 387.33,
                                        "posY": 65.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "4"
                    },
                    {
                        "id": 1139,
                        "creatorId": 3,
                        "name": "Passage 5",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 791,
                                "boulderImageId": 272,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8517,
                                        "posX": 630.33,
                                        "posY": 356.5
                                    },
                                    {
                                        "id": 8522,
                                        "posX": 278.33,
                                        "posY": 293.5
                                    },
                                    {
                                        "id": 8523,
                                        "posX": 122.33,
                                        "posY": 161.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 5,
                        "grade": "4"
                    }
                ]
            },
            {
                "id": 3374,
                "name": "Sagouins boulder",
                "location": {
                    "lat": 45.702914545451165,
                    "lng": 4.605701756485914
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 7,
                "images": [],
                "tracks": [
                    {
                        "id": 1140,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [],
                        "orderIndex": 1,
                        "grade": "6b"
                    },
                    {
                        "id": 1141,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [],
                        "orderIndex": 2,
                        "grade": "6c"
                    }
                ]
            }
        ],
        "wayPoints": []
    },
    {
        "id": 167,
        "name": "Ancrage",
        "description": "",
        "boulders": [
            {
                "id": 3375,
                "name": "Numéro 8",
                "location": {
                    "lat": 45.70297615278535,
                    "lng": 4.606293368360683
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 1,
                "images": [
                    {
                        "id": 280,
                        "url": "/public/uploads/boulder/image/8bf8a3c30f6be6f9891b35b064f082382218f0bb.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1172,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 823,
                                "boulderImageId": 280,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8796,
                                        "posX": 381.33,
                                        "posY": 340.5
                                    },
                                    {
                                        "id": 8803,
                                        "posX": 348.33,
                                        "posY": 184.5
                                    },
                                    {
                                        "id": 8804,
                                        "posX": 144.33,
                                        "posY": 89.5
                                    },
                                    {
                                        "id": 8805,
                                        "posX": 127.33,
                                        "posY": 51.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a+"
                    }
                ]
            },
            {
                "id": 3376,
                "name": "La cabane du Voodoo",
                "location": {
                    "lat": 45.702961167214895,
                    "lng": 4.606432843229458
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 2,
                "images": [
                    {
                        "id": 279,
                        "url": "/public/uploads/boulder/image/721c5d1743f53529575e7960a4dca7919bf56786.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1169,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 820,
                                "boulderImageId": 279,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8773,
                                        "posX": 210.33,
                                        "posY": 338.5
                                    },
                                    {
                                        "id": 8778,
                                        "posX": 180.33,
                                        "posY": 266.5
                                    },
                                    {
                                        "id": 8779,
                                        "posX": 281.33,
                                        "posY": 62.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4+"
                    },
                    {
                        "id": 1170,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 821,
                                "boulderImageId": 279,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8780,
                                        "posX": 459.33,
                                        "posY": 353.5
                                    },
                                    {
                                        "id": 8787,
                                        "posX": 307.33,
                                        "posY": 235.5
                                    },
                                    {
                                        "id": 8788,
                                        "posX": 306.33,
                                        "posY": 99.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "3"
                    },
                    {
                        "id": 1171,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 822,
                                "boulderImageId": 279,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8789,
                                        "posX": 469.33,
                                        "posY": 333.5
                                    },
                                    {
                                        "id": 8794,
                                        "posX": 281.33,
                                        "posY": 197.5
                                    },
                                    {
                                        "id": 8795,
                                        "posX": 186.33,
                                        "posY": 114.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "3"
                    }
                ]
            },
            {
                "id": 3377,
                "name": "Numéro 6",
                "location": {
                    "lat": 45.70293494245683,
                    "lng": 4.606572318098232
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 3,
                "images": [
                    {
                        "id": 278,
                        "url": "/public/uploads/boulder/image/d50c168eee8cc297c308882f4e9ecd65a8143ba3.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1168,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 819,
                                "boulderImageId": 278,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8683,
                                        "posX": 579.33,
                                        "posY": 258.5
                                    },
                                    {
                                        "id": 8690,
                                        "posX": 360.33,
                                        "posY": 256.5
                                    },
                                    {
                                        "id": 8691,
                                        "posX": 274.33,
                                        "posY": 84.5
                                    }
                                ],
                                "handDeparturePoints": [
                                    {
                                        "id": 8692,
                                        "posX": 528.33,
                                        "posY": 220.5
                                    },
                                    {
                                        "id": 8693,
                                        "posX": 564.33,
                                        "posY": 229.5
                                    }
                                ],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 294,
                                        "points": [
                                            {
                                                "id": 8694,
                                                "posX": 484.33,
                                                "posY": 67.5
                                            },
                                            {
                                                "id": 8695,
                                                "posX": 646.33,
                                                "posY": 229.5
                                            },
                                            {
                                                "id": 8696,
                                                "posX": 601.33,
                                                "posY": 248.5
                                            },
                                            {
                                                "id": 8697,
                                                "posX": 440.33,
                                                "posY": 113.5
                                            },
                                            {
                                                "id": 8762,
                                                "posX": 484.33,
                                                "posY": 67.5
                                            }
                                        ]
                                    },
                                ]
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6b"
                    }
                ]
            },
            {
                "id": 3378,
                "name": "Big Shrek",
                "location": {
                    "lat": 45.70276260802675,
                    "lng": 4.606754708311245
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 4,
                "images": [
                    {
                        "id": 277,
                        "url": "/public/uploads/boulder/image/f4343a3cfd47ea8a1d4c3755706d972c01702774.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1152,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 804,
                                "boulderImageId": 277,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8595,
                                        "posX": 88.33,
                                        "posY": 267.5
                                    },
                                    {
                                        "id": 8642,
                                        "posX": 87.33,
                                        "posY": 204.5
                                    },
                                    {
                                        "id": 8643,
                                        "posX": 126.33,
                                        "posY": 165.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "3+"
                    },
                    {
                        "id": 1163,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "Suivre la fissure",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 811,
                                "boulderImageId": 277,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8644,
                                        "posX": 110.33,
                                        "posY": 276.5
                                    },
                                    {
                                        "id": 8645,
                                        "posX": 253.33,
                                        "posY": 240.5
                                    },
                                    {
                                        "id": 8646,
                                        "posX": 323.33,
                                        "posY": 251.5
                                    },
                                    {
                                        "id": 8647,
                                        "posX": 397.33,
                                        "posY": 226.5
                                    },
                                    {
                                        "id": 8648,
                                        "posX": 446.33,
                                        "posY": 201.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6a"
                    },
                    {
                        "id": 1164,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 812,
                                "boulderImageId": 277,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8649,
                                        "posX": 196.33,
                                        "posY": 343.5
                                    },
                                    {
                                        "id": 8654,
                                        "posX": 149.33,
                                        "posY": 271.5
                                    },
                                    {
                                        "id": 8655,
                                        "posX": 143.33,
                                        "posY": 179.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "4+"
                    },
                    {
                        "id": 1165,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 816,
                                "boulderImageId": 277,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8663,
                                        "posX": 226.33,
                                        "posY": 315.5
                                    },
                                    {
                                        "id": 8664,
                                        "posX": 196.33,
                                        "posY": 191.5
                                    },
                                    {
                                        "id": 8665,
                                        "posX": 256.33,
                                        "posY": 100.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "4"
                    },
                    {
                        "id": 1166,
                        "creatorId": 3,
                        "name": "Passage 5",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 817,
                                "boulderImageId": 277,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8666,
                                        "posX": 326.33,
                                        "posY": 340.5
                                    },
                                    {
                                        "id": 8671,
                                        "posX": 327.33,
                                        "posY": 216.5
                                    },
                                    {
                                        "id": 8672,
                                        "posX": 299.33,
                                        "posY": 105.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 5,
                        "grade": "6a"
                    },
                    {
                        "id": 1167,
                        "creatorId": 3,
                        "name": "Passage 6",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 818,
                                "boulderImageId": 277,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8673,
                                        "posX": 398.33,
                                        "posY": 304.5
                                    },
                                    {
                                        "id": 8680,
                                        "posX": 370.33,
                                        "posY": 197.5
                                    },
                                    {
                                        "id": 8681,
                                        "posX": 360.33,
                                        "posY": 114.5
                                    },
                                    {
                                        "id": 8682,
                                        "posX": 341.33,
                                        "posY": 82.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 6,
                        "grade": "5c"
                    }
                ]
            },
            {
                "id": 3379,
                "name": "International no hand contest",
                "location": {
                    "lat": 45.702736383175605,
                    "lng": 4.606588411352321
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 5,
                "images": [
                    {
                        "id": 293,
                        "url": "/public/uploads/boulder/image/68e6fc5c21e361e72ba36496840a706564a2ee06.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1173,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 910,
                                "boulderImageId": 293,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9680,
                                        "posX": 413.08,
                                        "posY": 361.5
                                    },
                                    {
                                        "id": 9687,
                                        "posX": 317.08,
                                        "posY": 288.5
                                    },
                                    {
                                        "id": 9688,
                                        "posX": 189.08,
                                        "posY": 226.5
                                    },
                                    {
                                        "id": 9689,
                                        "posX": 156.08,
                                        "posY": 199.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5b+"
                    },
                    {
                        "id": 1174,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 911,
                                "boulderImageId": 293,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9690,
                                        "posX": 433.08,
                                        "posY": 349.5
                                    },
                                    {
                                        "id": 9695,
                                        "posX": 262.08,
                                        "posY": 185.5
                                    },
                                    {
                                        "id": 9696,
                                        "posX": 163.08,
                                        "posY": 56.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6a"
                    },
                    {
                        "id": 1181,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "Sans les mains",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 912,
                                "boulderImageId": 293,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9697,
                                        "posX": 592.08,
                                        "posY": 342.5
                                    },
                                    {
                                        "id": 9702,
                                        "posX": 450.08,
                                        "posY": 175.5
                                    },
                                    {
                                        "id": 9703,
                                        "posX": 395.08,
                                        "posY": 96.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "5c"
                    },
                    {
                        "id": 1182,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 913,
                                "boulderImageId": 293,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9704,
                                        "posX": 532.08,
                                        "posY": 211.5
                                    },
                                    {
                                        "id": 9707,
                                        "posX": 312.08,
                                        "posY": 213.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "3"
                    }
                ]
            },
            {
                "id": 3380,
                "name": "Double homicide",
                "location": {
                    "lat": 45.702668947787615,
                    "lng": 4.606481122991726
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 6,
                "images": [
                    {
                        "id": 281,
                        "url": "/public/uploads/boulder/image/24034646d45fb04f3fba594a928bf15f9a329baa.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1183,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 824,
                                "boulderImageId": 281,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8806,
                                        "posX": 506.33,
                                        "posY": 183.5
                                    },
                                    {
                                        "id": 8811,
                                        "posX": 316.33,
                                        "posY": 79.5
                                    },
                                    {
                                        "id": 8812,
                                        "posX": 187.33,
                                        "posY": 68.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a+"
                    },
                    {
                        "id": 1184,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 828,
                                "boulderImageId": 281,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8820,
                                        "posX": 512.33,
                                        "posY": 181.5
                                    },
                                    {
                                        "id": 8821,
                                        "posX": 496.33,
                                        "posY": 112.5
                                    },
                                    {
                                        "id": 8822,
                                        "posX": 357.33,
                                        "posY": 19.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "3"
                    }
                ]
            },
            {
                "id": 3381,
                "name": "Chamonixe",
                "location": {
                    "lat": 45.70255280887312,
                    "lng": 4.606609869024441
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 7,
                "images": [
                    {
                        "id": 282,
                        "url": "/public/uploads/boulder/image/96b6eab408cb3ca47db81f49a264f56ecc972bcd.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1185,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 829,
                                "boulderImageId": 282,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8823,
                                        "posX": 267.33,
                                        "posY": 322.5
                                    },
                                    {
                                        "id": 8832,
                                        "posX": 190.33,
                                        "posY": 225.5
                                    },
                                    {
                                        "id": 8833,
                                        "posX": 140.33,
                                        "posY": 178.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "7a"
                    },
                    {
                        "id": 1190,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 832,
                                "boulderImageId": 282,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9326,
                                        "posX": 317.33,
                                        "posY": 293.47
                                    },
                                    {
                                        "id": 9327,
                                        "posX": 241.33,
                                        "posY": 204.47
                                    },
                                    {
                                        "id": 9328,
                                        "posX": 237.33,
                                        "posY": 133.47
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 323,
                                        "points": [
                                            {
                                                "id": 8918,
                                                "posX": 167.33,
                                                "posY": 167.47
                                            },
                                            {
                                                "id": 8919,
                                                "posX": 258.33,
                                                "posY": 239.47
                                            },
                                            {
                                                "id": 8920,
                                                "posX": 297.33,
                                                "posY": 308.47
                                            },
                                            {
                                                "id": 8921,
                                                "posX": 232.33,
                                                "posY": 241.47
                                            },
                                            {
                                                "id": 9329,
                                                "posX": 167.33,
                                                "posY": 167.47
                                            }
                                        ]
                                    },
                                ]
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "7a+"
                    }
                ]
            },
            {
                "id": 3382,
                "name": "Cubi",
                "location": {
                    "lat": 45.70270266549178,
                    "lng": 4.607001471540615
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 8,
                "images": [
                    {
                        "id": 276,
                        "url": "/public/uploads/boulder/image/a8638a9207428a23433ae9d904a2f6d79a206024.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1150,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 802,
                                "boulderImageId": 276,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8580,
                                        "posX": 20.08,
                                        "posY": 302.5
                                    },
                                    {
                                        "id": 8586,
                                        "posX": 181.08,
                                        "posY": 299.5
                                    },
                                    {
                                        "id": 8587,
                                        "posX": 276.08,
                                        "posY": 53.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a+"
                    },
                    {
                        "id": 1151,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 803,
                                "boulderImageId": 276,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8588,
                                        "posX": 155.08,
                                        "posY": 398.5
                                    },
                                    {
                                        "id": 8593,
                                        "posX": 171.08,
                                        "posY": 163.5
                                    },
                                    {
                                        "id": 8594,
                                        "posX": 141.08,
                                        "posY": 17.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6b"
                    }
                ]
            },
            {
                "id": 3383,
                "name": "Dinguodingue",
                "location": {
                    "lat": 45.70294618164031,
                    "lng": 4.606996107122585
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 9,
                "images": [
                    {
                        "id": 275,
                        "url": "/public/uploads/boulder/image/25300220883b60e7b6ce37693db533e18b128806.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1144,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 799,
                                "boulderImageId": 275,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8553,
                                        "posX": 404.33,
                                        "posY": 400.5
                                    },
                                    {
                                        "id": 8562,
                                        "posX": 371.33,
                                        "posY": 265.5
                                    },
                                    {
                                        "id": 8563,
                                        "posX": 241.33,
                                        "posY": 84.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "7b"
                    },
                    {
                        "id": 1147,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 800,
                                "boulderImageId": 275,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8564,
                                        "posX": 417.33,
                                        "posY": 386.5
                                    },
                                    {
                                        "id": 8571,
                                        "posX": 422.33,
                                        "posY": 166.5
                                    },
                                    {
                                        "id": 8572,
                                        "posX": 388.33,
                                        "posY": 25.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "7b"
                    },
                    {
                        "id": 1149,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 801,
                                "boulderImageId": 275,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8573,
                                        "posX": 489.33,
                                        "posY": 384.5
                                    },
                                    {
                                        "id": 8578,
                                        "posX": 505.33,
                                        "posY": 186.5
                                    },
                                    {
                                        "id": 8579,
                                        "posX": 482.33,
                                        "posY": 97.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "5c"
                    }
                ]
            },
            {
                "id": 3384,
                "name": "Champignon anatomique",
                "location": {
                    "lat": 45.70294992803434,
                    "lng": 4.60713021757333
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 10,
                "images": [
                    {
                        "id": 273,
                        "url": "/public/uploads/boulder/image/04d1e2b94c968d36e20b0075ad1b181dafe5c1df.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1142,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 797,
                                "boulderImageId": 273,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8537,
                                        "posX": 481.33,
                                        "posY": 269.5
                                    },
                                    {
                                        "id": 8538,
                                        "posX": 518.33,
                                        "posY": 182.5
                                    },
                                    {
                                        "id": 8539,
                                        "posX": 448.33,
                                        "posY": 88.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a"
                    }
                ]
            },
            {
                "id": 4086,
                "name": "Gros menton",
                "location": {
                    "lat": 45.70288498023109,
                    "lng": 4.607121584272256
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 11,
                "images": [
                    {
                        "id": 274,
                        "url": "/public/uploads/boulder/image/707d98cfaf904ef8d6f8d73aecd61b089952028f.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1143,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 798,
                                "boulderImageId": 274,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 8540,
                                        "posX": 440.33,
                                        "posY": 282.5
                                    },
                                    {
                                        "id": 8551,
                                        "posX": 288.33,
                                        "posY": 167.5
                                    },
                                    {
                                        "id": 8552,
                                        "posX": 132.33,
                                        "posY": 148.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "4"
                    }
                ]
            }
        ],
        "wayPoints": []
    },
    {
        "id": 168,
        "name": "L'oeuf",
        "description": "",
        "boulders": [
            {
                "id": 3385,
                "name": "R.A.S",
                "location": {
                    "lat": 45.70195,
                    "lng": 4.604685
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 1,
                "images": [
                    {
                        "id": 234,
                        "url": "/public/uploads/boulder/image/bc878ffb91c4f45499ca21930b1a9044e9509d8d.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 876,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 613,
                                "boulderImageId": 234,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6371,
                                        "posX": 87.08,
                                        "posY": 394.5
                                    },
                                    {
                                        "id": 6384,
                                        "posX": 95.08,
                                        "posY": 34.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "3+"
                    },
                    {
                        "id": 882,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 617,
                                "boulderImageId": 234,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6385,
                                        "posX": 258.08,
                                        "posY": 316.5
                                    },
                                    {
                                        "id": 6386,
                                        "posX": 168.08,
                                        "posY": 35.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "3"
                    }
                ]
            },
            {
                "id": 3386,
                "name": "Bijoux",
                "location": {
                    "lat": 45.701937,
                    "lng": 4.60463
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 2,
                "images": [
                    {
                        "id": 236,
                        "url": "/public/uploads/boulder/image/f2808dd53d864fe317cad62c95a1f671d6dd41dc.jpeg"
                    },
                    {
                        "id": 312,
                        "url": "/public/uploads/boulder/image/dce7887cb3d0e5189b0a68efccbca5abbc973963.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1334,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 981,
                                "boulderImageId": 236,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10681,
                                        "posX": 179.14,
                                        "posY": 396.5
                                    },
                                    {
                                        "id": 10682,
                                        "posX": 155.14,
                                        "posY": 250.5
                                    },
                                    {
                                        "id": 10683,
                                        "posX": 106.14,
                                        "posY": 195.5
                                    },
                                    {
                                        "id": 10684,
                                        "posX": 139.14,
                                        "posY": 59.5
                                    },
                                    {
                                        "id": 10685,
                                        "posX": 136.14,
                                        "posY": 44.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5a"
                    },
                    {
                        "id": 1335,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 982,
                                "boulderImageId": 312,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10686,
                                        "posX": 83.14,
                                        "posY": 307.5
                                    },
                                    {
                                        "id": 10687,
                                        "posX": 163.14,
                                        "posY": 244.5
                                    },
                                    {
                                        "id": 10688,
                                        "posX": 166.14,
                                        "posY": 109.5
                                    },
                                    {
                                        "id": 10689,
                                        "posX": 136.14,
                                        "posY": 24.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6b"
                    }
                ]
            },
            {
                "id": 3387,
                "name": "Avant-après",
                "location": {
                    "lat": 45.701912,
                    "lng": 4.604577
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 3,
                "images": [
                    {
                        "id": 237,
                        "url": "/public/uploads/boulder/image/03ec45e699a212f4b6b65e512189824681349ed5.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 886,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 620,
                                "boulderImageId": 237,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6484,
                                        "posX": 278.08,
                                        "posY": 334.5
                                    },
                                    {
                                        "id": 6497,
                                        "posX": 87.08,
                                        "posY": 152.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5a+"
                    },
                    {
                        "id": 892,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 624,
                                "boulderImageId": 237,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6498,
                                        "posX": 256.08,
                                        "posY": 281.5
                                    },
                                    {
                                        "id": 6499,
                                        "posX": 101.08,
                                        "posY": 129.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5c"
                    }
                ]
            },
            {
                "id": 3388,
                "name": "Tasman",
                "location": {
                    "lat": 45.701943,
                    "lng": 4.604492
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 4,
                "images": [
                    {
                        "id": 238,
                        "url": "/public/uploads/boulder/image/d659406157fb956617509466c6134f63d354f705.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 893,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 625,
                                "boulderImageId": 238,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6500,
                                        "posX": 362.33,
                                        "posY": 337.5
                                    },
                                    {
                                        "id": 6505,
                                        "posX": 294.33,
                                        "posY": 276.5
                                    },
                                    {
                                        "id": 6506,
                                        "posX": 234.33,
                                        "posY": 76.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": [
                                    {
                                        "id": 74,
                                        "points": [
                                            {
                                                "id": 6548,
                                                "posX": 197.33,
                                                "posY": 81.5
                                            },
                                            {
                                                "id": 6549,
                                                "posX": 245.33,
                                                "posY": 207.5
                                            },
                                            {
                                                "id": 6550,
                                                "posX": 179.33,
                                                "posY": 307.5
                                            },
                                            {
                                                "id": 6551,
                                                "posX": 95.33,
                                                "posY": 249.5
                                            },
                                            {
                                                "id": 6552,
                                                "posX": 197.33,
                                                "posY": 81.5
                                            }
                                        ]
                                    },
                                ]
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a"
                    },
                    {
                        "id": 894,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 628,
                                "boulderImageId": 238,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6513,
                                        "posX": 470.33,
                                        "posY": 299.5
                                    },
                                    {
                                        "id": 6514,
                                        "posX": 516.33,
                                        "posY": 244.5
                                    },
                                    {
                                        "id": 6515,
                                        "posX": 461.33,
                                        "posY": 168.5
                                    },
                                    {
                                        "id": 6516,
                                        "posX": 281.33,
                                        "posY": 99.5
                                    },
                                    {
                                        "id": 6517,
                                        "posX": 253.33,
                                        "posY": 66.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6c"
                    }
                ]
            },
            {
                "id": 3389,
                "name": "Fissure facile",
                "location": {
                    "lat": 45.701915,
                    "lng": 4.604343
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 5,
                "images": [
                    {
                        "id": 302,
                        "url": "/public/uploads/boulder/image/b20b02f08065bfb3c9ad12a32ed4cfd6f633b803.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 895,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 956,
                                "boulderImageId": 302,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10310,
                                        "posX": 290.08,
                                        "posY": 385.5
                                    },
                                    {
                                        "id": 10313,
                                        "posX": 264.08,
                                        "posY": 71.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "3+"
                    },
                    {
                        "id": 897,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 957,
                                "boulderImageId": 302,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10314,
                                        "posX": 377.08,
                                        "posY": 374.5
                                    },
                                    {
                                        "id": 10319,
                                        "posX": 377.08,
                                        "posY": 216.5
                                    },
                                    {
                                        "id": 10320,
                                        "posX": 336.08,
                                        "posY": 59.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "3+"
                    },
                    {
                        "id": 898,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 958,
                                "boulderImageId": 302,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10321,
                                        "posX": 526.08,
                                        "posY": 348.5
                                    },
                                    {
                                        "id": 10326,
                                        "posX": 514.08,
                                        "posY": 152.5
                                    },
                                    {
                                        "id": 10327,
                                        "posX": 468.08,
                                        "posY": 46.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "4+"
                    }
                ]
            },
            {
                "id": 3390,
                "name": "L'oeuf du silence",
                "location": {
                    "lat": 45.701739,
                    "lng": 4.604187
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 6,
                "images": [
                    {
                        "id": 239,
                        "url": "/public/uploads/boulder/image/3252933f0e3601076433dc8a930bda71194c2ba3.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 899,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 629,
                                "boulderImageId": 239,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6633,
                                        "posX": 134.33,
                                        "posY": 398.5
                                    },
                                    {
                                        "id": 6646,
                                        "posX": 88.33,
                                        "posY": 261.5
                                    },
                                    {
                                        "id": 6647,
                                        "posX": 172.33,
                                        "posY": 190.5
                                    },
                                    {
                                        "id": 6648,
                                        "posX": 210.33,
                                        "posY": 86.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5a"
                    },
                    {
                        "id": 902,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 630,
                                "boulderImageId": 239,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6649,
                                        "posX": 356.33,
                                        "posY": 404.5
                                    },
                                    {
                                        "id": 6656,
                                        "posX": 317.33,
                                        "posY": 306.5
                                    },
                                    {
                                        "id": 6657,
                                        "posX": 361.33,
                                        "posY": 207.5
                                    },
                                    {
                                        "id": 6658,
                                        "posX": 330.33,
                                        "posY": 77.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "7a"
                    },
                    {
                        "id": 903,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 631,
                                "boulderImageId": 239,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6659,
                                        "posX": 541.33,
                                        "posY": 299.5
                                    },
                                    {
                                        "id": 6666,
                                        "posX": 559.33,
                                        "posY": 105.5
                                    },
                                    {
                                        "id": 6667,
                                        "posX": 550.33,
                                        "posY": 26.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "4"
                    }
                ]
            },
            {
                "id": 3391,
                "name": "Tu peux te brosser",
                "location": {
                    "lat": 45.702102,
                    "lng": 4.604389
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 7,
                "images": [
                    {
                        "id": 240,
                        "url": "/public/uploads/boulder/image/b4bb727d870180f7c304fd8ac906b815b2d1fad8.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 907,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 632,
                                "boulderImageId": 240,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6668,
                                        "posX": 65.33,
                                        "posY": 388.5
                                    },
                                    {
                                        "id": 6722,
                                        "posX": 67.33,
                                        "posY": 327.5
                                    },
                                    {
                                        "id": 6723,
                                        "posX": 97.33,
                                        "posY": 288.5
                                    },
                                    {
                                        "id": 6724,
                                        "posX": 103.33,
                                        "posY": 230.5
                                    },
                                    {
                                        "id": 6725,
                                        "posX": 141.33,
                                        "posY": 176.5
                                    },
                                    {
                                        "id": 6726,
                                        "posX": 145.33,
                                        "posY": 111.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "3+"
                    },
                    {
                        "id": 915,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 637,
                                "boulderImageId": 240,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6727,
                                        "posX": 171.33,
                                        "posY": 425.5
                                    },
                                    {
                                        "id": 6728,
                                        "posX": 184.33,
                                        "posY": 240.5
                                    },
                                    {
                                        "id": 6729,
                                        "posX": 236.33,
                                        "posY": 160.5
                                    },
                                    {
                                        "id": 6730,
                                        "posX": 215.33,
                                        "posY": 14.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "4+"
                    },
                    {
                        "id": 916,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 638,
                                "boulderImageId": 240,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6731,
                                        "posX": 346.33,
                                        "posY": 398.5
                                    },
                                    {
                                        "id": 6734,
                                        "posX": 335.33,
                                        "posY": 118.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "4"
                    }
                ]
            },
            {
                "id": 3392,
                "name": "Monolithe",
                "location": {
                    "lat": 45.702468,
                    "lng": 4.604351
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 8,
                "images": [
                    {
                        "id": 241,
                        "url": "/public/uploads/boulder/image/5b5cf57aeac67ecb40fae7533ab2919e1d8b029c.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 917,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 639,
                                "boulderImageId": 241,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 6735,
                                        "posX": 114.08,
                                        "posY": 299.5
                                    },
                                    {
                                        "id": 6746,
                                        "posX": 154.08,
                                        "posY": 226.5
                                    },
                                    {
                                        "id": 6747,
                                        "posX": 166.08,
                                        "posY": 147.5
                                    },
                                    {
                                        "id": 6748,
                                        "posX": 207.08,
                                        "posY": 106.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5b+"
                    }
                ]
            },
            {
                "id": 3393,
                "name": "Titoeuf",
                "location": {
                    "lat": 45.701997,
                    "lng": 4.604222
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 9,
                "images": [
                    {
                        "id": 303,
                        "url": "/public/uploads/boulder/image/0c62102f46d4380d12a3d52d3a477b15fef61343.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 904,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 959,
                                "boulderImageId": 303,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10328,
                                        "posX": 228.08,
                                        "posY": 239.5
                                    },
                                    {
                                        "id": 10333,
                                        "posX": 299.08,
                                        "posY": 158.5
                                    },
                                    {
                                        "id": 10334,
                                        "posX": 315.08,
                                        "posY": 71.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6c"
                    },
                    {
                        "id": 905,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 960,
                                "boulderImageId": 303,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 10335,
                                        "posX": 405.08,
                                        "posY": 296.5
                                    },
                                    {
                                        "id": 10338,
                                        "posX": 421.08,
                                        "posY": 149.5
                                    },
                                    {
                                        "id": 10339,
                                        "posX": 362.08,
                                        "posY": 63.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5c"
                    }
                ]
            }
        ],
        "wayPoints": []
    },
    {
        "id": 169,
        "name": "Falaise",
        "description": "",
        "boulders": [
            {
                "id": 3395,
                "name": "La falaise",
                "location": {
                    "lat": 45.70098925928383,
                    "lng": 4.607480664655923
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 1,
                "images": [],
                "tracks": []
            }
        ],
        "wayPoints": []
    },
    {
        "id": 170,
        "name": "Seconde chance",
        "description": "",
        "boulders": [
            {
                "id": 3396,
                "name": "Le grand huit",
                "location": {
                    "lat": 45.70007316781325,
                    "lng": 4.609111447736978
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 1,
                "images": [
                    {
                        "id": 292,
                        "url": "/public/uploads/boulder/image/c7bfa6a3efbd5a725589c0dca1cf7242adf2680d.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1295,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 909,
                                "boulderImageId": 292,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9677,
                                        "posX": 124.19,
                                        "posY": 333.5
                                    },
                                    {
                                        "id": 9678,
                                        "posX": 154.19,
                                        "posY": 172.5
                                    },
                                    {
                                        "id": 9679,
                                        "posX": 132.19,
                                        "posY": 77.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6c"
                    }
                ]
            },
            {
                "id": 3397,
                "name": "L'utopie",
                "location": {
                    "lat": 45.69995702350658,
                    "lng": 4.609095354482888
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 2,
                "images": [
                    {
                        "id": 290,
                        "url": "/public/uploads/boulder/image/6fcde6ac91d5de299afbea2c571d927947d79457.jpeg"
                    },
                    {
                        "id": 291,
                        "url": "/public/uploads/boulder/image/b75715621824833d13d9c8732676302f133ecb28.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1291,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 904,
                                "boulderImageId": 291,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9652,
                                        "posX": 157.19,
                                        "posY": 283.5
                                    },
                                    {
                                        "id": 9661,
                                        "posX": 129.19,
                                        "posY": 136.5
                                    },
                                    {
                                        "id": 9662,
                                        "posX": 143.19,
                                        "posY": 41.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a"
                    },
                    {
                        "id": 1294,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 905,
                                "boulderImageId": 290,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9663,
                                        "posX": 81.19,
                                        "posY": 358.5
                                    },
                                    {
                                        "id": 9668,
                                        "posX": 175.19,
                                        "posY": 243.5
                                    },
                                    {
                                        "id": 9669,
                                        "posX": 164.19,
                                        "posY": 74.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6b+"
                    }
                ]
            },
            {
                "id": 3398,
                "name": "Jolly jumper",
                "location": {
                    "lat": 45.69999823603013,
                    "lng": 4.608902235433816
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 3,
                "images": [
                    {
                        "id": 289,
                        "url": "/public/uploads/boulder/image/1b9bfc8b75cee91768a003fde708e36cbff933d0.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1273,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 890,
                                "boulderImageId": 289,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9614,
                                        "posX": 518.08,
                                        "posY": 360.5
                                    },
                                    {
                                        "id": 9647,
                                        "posX": 509.08,
                                        "posY": 44.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6a"
                    },
                    {
                        "id": 1289,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 902,
                                "boulderImageId": 289,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9648,
                                        "posX": 374.08,
                                        "posY": 362.5
                                    },
                                    {
                                        "id": 9649,
                                        "posX": 382.08,
                                        "posY": 39.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "7b"
                    },
                    {
                        "id": 1290,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 903,
                                "boulderImageId": 289,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9650,
                                        "posX": 173.08,
                                        "posY": 364.5
                                    },
                                    {
                                        "id": 9651,
                                        "posX": 259.08,
                                        "posY": 67.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "7b"
                    }
                ]
            },
            {
                "id": 3399,
                "name": "Indiana",
                "location": {
                    "lat": 45.69999823603013,
                    "lng": 4.608757396147012
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 4,
                "images": [
                    {
                        "id": 288,
                        "url": "/public/uploads/boulder/image/d811d43f546beaeef68f7ababacec2fe6cfee3f0.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1272,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 889,
                                "boulderImageId": 288,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9607,
                                        "posX": 337.08,
                                        "posY": 362.5
                                    },
                                    {
                                        "id": 9612,
                                        "posX": 328.08,
                                        "posY": 196.5
                                    },
                                    {
                                        "id": 9613,
                                        "posX": 379.08,
                                        "posY": 67.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5a"
                    }
                ]
            },
            {
                "id": 3400,
                "name": "Le livre ouvert",
                "location": {
                    "lat": 45.69987459836838,
                    "lng": 4.608671565458535
                },
                "isHighBall": true,
                "isMustSee": false,
                "orderIndex": 5,
                "images": [
                    {
                        "id": 286,
                        "url": "/public/uploads/boulder/image/a41534a4d7b331cd8dfcea66d3f165581e4b13b5.jpeg"
                    },
                    {
                        "id": 287,
                        "url": "/public/uploads/boulder/image/5c1fb6e6c329b3b5ec13b8dd537eda2fd9cc9e60.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1232,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 859,
                                "boulderImageId": 287,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9497,
                                        "posX": 104.19,
                                        "posY": 319.5
                                    },
                                    {
                                        "id": 9517,
                                        "posX": 48.19,
                                        "posY": 244.5
                                    },
                                    {
                                        "id": 9518,
                                        "posX": 12.19,
                                        "posY": 214.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6c"
                    },
                    {
                        "id": 1238,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 863,
                                "boulderImageId": 287,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9519,
                                        "posX": 134.19,
                                        "posY": 348.5
                                    },
                                    {
                                        "id": 9520,
                                        "posX": 123.19,
                                        "posY": 27.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "6c"
                    },
                    {
                        "id": 1239,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 864,
                                "boulderImageId": 287,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9521,
                                        "posX": 174.19,
                                        "posY": 376.5
                                    },
                                    {
                                        "id": 9543,
                                        "posX": 177.19,
                                        "posY": 136.5
                                    },
                                    {
                                        "id": 9544,
                                        "posX": 161.19,
                                        "posY": 34.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "5c"
                    },
                    {
                        "id": 1245,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 868,
                                "boulderImageId": 287,
                                "boulderImageDimensions": {
                                    "width": 300,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9545,
                                        "posX": 264.19,
                                        "posY": 364.5
                                    },
                                    {
                                        "id": 9546,
                                        "posX": 248.19,
                                        "posY": 151.5
                                    },
                                    {
                                        "id": 9547,
                                        "posX": 193.19,
                                        "posY": 41.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "6a"
                    },
                    {
                        "id": 1246,
                        "creatorId": 3,
                        "name": "Passage 5",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 869,
                                "boulderImageId": 286,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9548,
                                        "posX": 121.08,
                                        "posY": 430.5
                                    },
                                    {
                                        "id": 9591,
                                        "posX": 116.08,
                                        "posY": 130.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 5,
                        "grade": "4"
                    },
                    {
                        "id": 1268,
                        "creatorId": 3,
                        "name": "Passage 6",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 885,
                                "boulderImageId": 286,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9592,
                                        "posX": 218.08,
                                        "posY": 414.5
                                    },
                                    {
                                        "id": 9593,
                                        "posX": 212.08,
                                        "posY": 112.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 6,
                        "grade": "5a"
                    },
                    {
                        "id": 1269,
                        "creatorId": 3,
                        "name": "Passage 7",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 886,
                                "boulderImageId": 286,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9594,
                                        "posX": 322.08,
                                        "posY": 400.5
                                    },
                                    {
                                        "id": 9595,
                                        "posX": 317.08,
                                        "posY": 80.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 7,
                        "grade": "5a+"
                    },
                    {
                        "id": 1270,
                        "creatorId": 3,
                        "name": "Passage 8",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 887,
                                "boulderImageId": 286,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9596,
                                        "posX": 413.08,
                                        "posY": 416.5
                                    },
                                    {
                                        "id": 9601,
                                        "posX": 436.08,
                                        "posY": 196.5
                                    },
                                    {
                                        "id": 9602,
                                        "posX": 408.08,
                                        "posY": 30.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 8,
                        "grade": "6b"
                    },
                    {
                        "id": 1271,
                        "creatorId": 3,
                        "name": "Passage 9",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 888,
                                "boulderImageId": 286,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9603,
                                        "posX": 483.08,
                                        "posY": 422.5
                                    },
                                    {
                                        "id": 9606,
                                        "posX": 468.08,
                                        "posY": 37.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 9,
                        "grade": "7a"
                    }
                ]
            },
            {
                "id": 3401,
                "name": "J'ai la scarlatine",
                "location": {
                    "lat": 45.699788426503076,
                    "lng": 4.60880567590928
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 6,
                "images": [
                    {
                        "id": 285,
                        "url": "/public/uploads/boulder/image/c888e8699aa3db4e8a578c8f73bea0c70a44dc33.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1214,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": true,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 851,
                                "boulderImageId": 285,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9426,
                                        "posX": 175.08,
                                        "posY": 379.5
                                    },
                                    {
                                        "id": 9435,
                                        "posX": 98.08,
                                        "posY": 191.5
                                    },
                                    {
                                        "id": 9436,
                                        "posX": 104.08,
                                        "posY": 71.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6b"
                    },
                    {
                        "id": 1217,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 852,
                                "boulderImageId": 285,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9453,
                                        "posX": 239.08,
                                        "posY": 382.5
                                    },
                                    {
                                        "id": 9454,
                                        "posX": 177.08,
                                        "posY": 201.5
                                    },
                                    {
                                        "id": 9455,
                                        "posX": 158.08,
                                        "posY": 62.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5b"
                    },
                    {
                        "id": 1222,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 853,
                                "boulderImageId": 285,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9456,
                                        "posX": 347.08,
                                        "posY": 359.5
                                    },
                                    {
                                        "id": 9465,
                                        "posX": 281.08,
                                        "posY": 184.5
                                    },
                                    {
                                        "id": 9466,
                                        "posX": 257.08,
                                        "posY": 77.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "5c"
                    },
                    {
                        "id": 1225,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 854,
                                "boulderImageId": 285,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9467,
                                        "posX": 432.08,
                                        "posY": 342.5
                                    },
                                    {
                                        "id": 9491,
                                        "posX": 349.08,
                                        "posY": 155.5
                                    },
                                    {
                                        "id": 9492,
                                        "posX": 325.08,
                                        "posY": 42.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "5b"
                    },
                    {
                        "id": 1231,
                        "creatorId": 3,
                        "name": "Passage 5",
                        "isTraverse": true,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 858,
                                "boulderImageId": 285,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9493,
                                        "posX": 513.08,
                                        "posY": 230.5
                                    },
                                    {
                                        "id": 9494,
                                        "posX": 185.08,
                                        "posY": 282.5
                                    },
                                    {
                                        "id": 9495,
                                        "posX": 67.08,
                                        "posY": 265.5
                                    },
                                    {
                                        "id": 9496,
                                        "posX": 39.08,
                                        "posY": 224.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 5,
                        "grade": "6b+"
                    }
                ]
            },
            {
                "id": 3402,
                "name": "Le brigand vert",
                "location": {
                    "lat": 45.6996423086888,
                    "lng": 4.608628650114297
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 7,
                "images": [
                    {
                        "id": 283,
                        "url": "/public/uploads/boulder/image/3a4397f1bb6df6eefd449c3013a8bbcd1108cc64.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1191,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 833,
                                "boulderImageId": 283,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9330,
                                        "posX": 149.08,
                                        "posY": 332.5
                                    },
                                    {
                                        "id": 9352,
                                        "posX": 118.08,
                                        "posY": 258.5
                                    },
                                    {
                                        "id": 9353,
                                        "posX": 125.08,
                                        "posY": 187.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "6b"
                    },
                    {
                        "id": 1197,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 837,
                                "boulderImageId": 283,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9354,
                                        "posX": 220.08,
                                        "posY": 351.5
                                    },
                                    {
                                        "id": 9355,
                                        "posX": 176.08,
                                        "posY": 243.5
                                    },
                                    {
                                        "id": 9356,
                                        "posX": 180.08,
                                        "posY": 148.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "7c"
                    },
                    {
                        "id": 1198,
                        "creatorId": 3,
                        "name": "Passage 3",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 838,
                                "boulderImageId": 283,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9373,
                                        "posX": 289.08,
                                        "posY": 339.5
                                    },
                                    {
                                        "id": 9374,
                                        "posX": 253.08,
                                        "posY": 232.5
                                    },
                                    {
                                        "id": 9375,
                                        "posX": 247.08,
                                        "posY": 111.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 3,
                        "grade": "6c"
                    },
                    {
                        "id": 1203,
                        "creatorId": 3,
                        "name": "Passage 4",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 839,
                                "boulderImageId": 283,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9376,
                                        "posX": 346.08,
                                        "posY": 325.5
                                    },
                                    {
                                        "id": 9398,
                                        "posX": 314.08,
                                        "posY": 206.5
                                    },
                                    {
                                        "id": 9399,
                                        "posX": 314.08,
                                        "posY": 90.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 4,
                        "grade": "6b"
                    },
                    {
                        "id": 1209,
                        "creatorId": 3,
                        "name": "Passage 5",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 843,
                                "boulderImageId": 283,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9400,
                                        "posX": 438.08,
                                        "posY": 320.5
                                    },
                                    {
                                        "id": 9401,
                                        "posX": 386.08,
                                        "posY": 187.5
                                    },
                                    {
                                        "id": 9402,
                                        "posX": 387.08,
                                        "posY": 65.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 5,
                        "grade": "6b"
                    }
                ]
            },
            {
                "id": 3403,
                "name": "L'autre",
                "location": {
                    "lat": 45.699882091567765,
                    "lng": 4.60830142061448
                },
                "isHighBall": false,
                "isMustSee": false,
                "orderIndex": 8,
                "images": [
                    {
                        "id": 284,
                        "url": "/public/uploads/boulder/image/c9b67636ab0b6068895ebdec42c10671a7d3979b.jpeg"
                    }
                ],
                "tracks": [
                    {
                        "id": 1210,
                        "creatorId": 3,
                        "name": "Passage 1",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 849,
                                "boulderImageId": 284,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9416,
                                        "posX": 291.08,
                                        "posY": 354.5
                                    },
                                    {
                                        "id": 9417,
                                        "posX": 258.08,
                                        "posY": 209.5
                                    },
                                    {
                                        "id": 9418,
                                        "posX": 265.08,
                                        "posY": 99.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 1,
                        "grade": "5b"
                    },
                    {
                        "id": 1213,
                        "creatorId": 3,
                        "name": "Passage 2",
                        "isTraverse": false,
                        "isSittingStart": false,
                        "description": "",
                        "techniqueIds": [],
                        "lines": [
                            {
                                "id": 850,
                                "boulderImageId": 284,
                                "boulderImageDimensions": {
                                    "width": 674,
                                    "height": 450
                                },
                                "linePoints": [
                                    {
                                        "id": 9419,
                                        "posX": 440.08,
                                        "posY": 372.5
                                    },
                                    {
                                        "id": 9424,
                                        "posX": 436.08,
                                        "posY": 224.5
                                    },
                                    {
                                        "id": 9425,
                                        "posX": 414.08,
                                        "posY": 128.5
                                    }
                                ],
                                "handDeparturePoints": [],
                                "feetDeparturePoints": [],
                                "anchorPoints": [],
                                "forbiddenAreas": []
                            }
                        ],
                        "orderIndex": 2,
                        "grade": "5c"
                    }
                ]
            }
        ],
        "wayPoints": []
    }
]

export const fakeTopo: Topo = {
    altitude: 775,
    approachDescription: "Depuis le parking, prendre le sentier qui monte dans la continuité de la route. Après 12-15min de marche, vous arriverez à une esplanade d'herbe surmontant une petite falaise (où il est possible de faire de l'initiation). Un panneau indique le site d'escalade à l'entrée de l'esplanade.\nDepuis l'esplanade, prendre le sentier qui part derrière le panneau pour monter vers les premiers blocs.",
    approachTime: 15,
    cleaningDate: undefined,
    closestCity: "Yzéron",
    creatorId: 35,
    dangerDescription: "Il y a beaucoup de pentes",
    description: "Le site d’Yzéron est situé sur le massif de Py froid à environ 800m d’altitude. Il est le plus grand site de bloc de la région Lyonnaise avec une grande diversité de profil (dévers, dalle, réta...). L’esplanade sépare la plus grande partie du site en amont, et une falaise idéale pour l’initiation, située en contrebas. La forêt protège une bonne partie du site contre les aléas météorologiques ce qui, combiné à l’altitude, permet la pratique de la grimpe toute l’année.",
    forbiddenReason: undefined,
    hasBins: false,
    hasDanger: true,
    hasOtherGears: false,
    hasPicnicArea: false,
    hasShelter: false,
    hasToilets: false,
    hasWaterSpot: false,
    id: 20,
    adaptedToChildren: true,
    isForbiddenSite: false,
    location: {lat: 45.701356, lng: 4.607264},
    mainImage: {
        id: 4,
        url: "/public/uploads/topo/main-image/dad449499de38f1bdee5872de1a354d52fff6183.jpeg",
    },
    name: "Yzéron",
    otherGears: undefined,
    otherRemarks: undefined,
    parkings: [],
    rockType: "Gneiss",
    sectors: sectors,
    securityInstructions: undefined,
    status: TopoStatus.Draft,
    topoType: 'Boulder',
}